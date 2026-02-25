import { supabase } from "@/integrations/supabase/client";

export const generateServerId = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 18; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export interface ServerResponse {
  servers: any[];
  totalCount: number;
}

export const serverService = {
  async getMyServers(page = 1, pageSize = 6): Promise<ServerResponse> {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    // We select from server_members and join the servers table with count
    const { data, error, count } = await supabase
      .from("server_members")
      .select(`
        role,
        servers:server_id (*)
      `, { count: "exact" })
      .range(from, to);

    if (error) {
      console.error("Error fetching servers:", error);
      // If we still get a recursion error (unlikely now), we fall back to a flat fetch
      if (error.message?.includes("recursion")) {
        const { data: flatMembers, error: memberError } = await supabase
          .from("server_members")
          .select("role, server_id");
          
        if (memberError) throw memberError;
        
        const serverIds = (flatMembers || []).map(m => m.server_id);
        const { data: flatServers, error: serverError } = await supabase
          .from("servers")
          .select("*")
          .in("id", serverIds);
          
        if (serverError) throw serverError;
        
        return (flatMembers || []).map(m => ({
          ...(flatServers?.find(s => s.id === m.server_id) || {}),
          userRole: m.role
        })).filter(s => s.id);
      }
      throw error;
    }

    // Map to a cleaner format, ensuring servers exists (in case of RLS filtering)
    const servers = (data || [])
      .filter(item => item.servers)
      .map(item => ({
        ...(item.servers as any),
        userRole: item.role
      }));

    return {
      servers,
      totalCount: count || 0
    };
  },

  async createServer(name: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const serverId = generateServerId();
    
    // 1. Create the server
    const { data: server, error: serverError } = await supabase
      .from("servers")
      .insert({
        name,
        server_handle: serverId,
        owner_id: user.id,
        invite_code: generateServerId() // Use same logic for 18-digit invite codes
      })
      .select()
      .single();

    if (serverError) throw serverError;

    // 2. Add creator as portal_admin
    const { error: memberError } = await supabase
      .from("server_members")
      .insert({
        server_id: server.id,
        profile_id: user.id,
        role: "portal_admin"
      });

    if (memberError) throw memberError;

    // 3. Set as current server
    await supabase
      .from("profiles")
      .update({ current_server_id: server.id })
      .eq("id", user.id);

    return server;
  },

  async joinServer(inviteCode: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

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
        profile_id: user.id,
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
      .eq("id", user.id);

    return server;
  },

  async selectServer(serverId: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const { error } = await supabase
      .from("profiles")
      .update({ current_server_id: serverId })
      .eq("id", user.id);

    if (error) throw error;
    return true;
  }
};