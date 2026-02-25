import { supabase } from "@/integrations/supabase/client";

export const generateServerHandle = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 18; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const serverService = {
  async getMyServers() {
    const { data: memberships, error: memError } = await supabase
      .from("server_members")
      .select(`
        role,
        servers (*)
      `);

    if (memError) throw memError;
    return memberships.map(m => ({
      ...m.servers,
      userRole: m.role
    }));
  },

  async createServer(name: string, userId: string) {
    const handle = generateServerHandle();
    
    // 1. Create the server
    const { data: server, error: serverError } = await supabase
      .from("servers")
      .insert({
        name,
        server_handle: handle,
        owner_id: userId,
        invite_code: generateServerHandle() // Use same logic for 18-digit invite codes
      })
      .select()
      .single();

    if (serverError) throw serverError;

    // 2. Add creator as portal_admin
    const { error: memberError } = await supabase
      .from("server_members")
      .insert({
        server_id: server.id,
        profile_id: userId,
        role: "portal_admin"
      });

    if (memberError) throw memberError;

    // 3. Set as current server
    await supabase
      .from("profiles")
      .update({ current_server_id: server.id })
      .eq("id", userId);

    return server;
  },

  async joinServer(inviteCode: string, userId: string) {
    // 1. Find server by invite code
    const { data: server, error: fetchError } = await supabase
      .from("servers")
      .select("*")
      .eq("invite_code", inviteCode)
      .single();

    if (fetchError || !server) throw new Error("Invalid invite code");

    // 2. Add member
    const { error: joinError } = await supabase
      .from("server_members")
      .insert({
        server_id: server.id,
        profile_id: userId,
        role: "coordinator"
      });

    if (joinError) {
      if (joinError.code === "23505") throw new Error("Already a member of this server");
      throw joinError;
    }

    // 3. Set as current server
    await supabase
      .from("profiles")
      .update({ current_server_id: server.id })
      .eq("id", userId);

    return server;
  }
};