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

    try {
      // We select from server_members and join the servers table with count
      const { data, error, count } = await supabase
        .from("server_members")
        .select(`
          role,
          servers:server_id (*)
        `, { count: "exact" })
        .range(from, to);

      if (error) {
        console.error("Database query error:", error);
        return { servers: [], totalCount: 0 };
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
    } catch (err) {
      console.error("Unexpected service error:", err);
      return { servers: [], totalCount: 0 };
    }
  },

  async createServer(name: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    console.log("Starting server deployment for user:", user.id);
    const serverId = generateServerId();
    
    // 1. Create the server
    const { data: server, error: serverError } = await supabase
      .from("servers")
      .insert({
        name,
        server_handle: serverId,
        owner_id: user.id,
        invite_code: generateServerId()
      })
      .select()
      .single();

    if (serverError) {
      console.error("Step 1 Failed (Create Server):", serverError);
      throw serverError;
    }

    console.log("Step 1 Success: Server created with ID", server.id);

    // 2. Add creator as portal_admin
    const { error: memberError } = await supabase
      .from("server_members")
      .insert({
        server_id: server.id,
        profile_id: user.id,
        role: "portal_admin"
      });

    if (memberError) {
      console.error("Step 2 Failed (Add Member):", memberError);
      throw memberError;
    }

    console.log("Step 2 Success: Member added");

    // 3. Set as current server
    const { error: profileError } = await supabase
      .from("profiles")
      .update({ current_server_id: server.id })
      .eq("id", user.id);

    if (profileError) {
      console.error("Step 3 Failed (Update Profile):", profileError);
      // We don't throw here as the server is already created
    }

    return server;
  },

  async joinServer(inviteCode: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    console.log("Attempting to join server with code:", inviteCode);

    // 1. Find server by invite code
    const { data: server, error: fetchError } = await supabase
      .from("servers")
      .select("*")
      .eq("invite_code", inviteCode)
      .single();

    if (fetchError || !server) {
      console.error("Join Step 1 Failed (Fetch Server):", fetchError);
      throw new Error("Invalid invite code");
    }

    // 2. Add member
    const { error: joinError } = await supabase
      .from("server_members")
      .insert({
        server_id: server.id,
        profile_id: user.id,
        role: "coordinator"
      });

    if (joinError) {
      console.error("Join Step 2 Failed (Add Member):", joinError);
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