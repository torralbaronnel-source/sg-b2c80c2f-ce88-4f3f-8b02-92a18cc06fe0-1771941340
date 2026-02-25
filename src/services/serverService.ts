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
  /**
   * Fetches servers using a "Flat Fetch" strategy to avoid infinite recursion
   * triggered by complex joins in RLS policies.
   */
  async getMyServers(page = 1, pageSize = 6): Promise<ServerResponse> {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    try {
      // Step 1: Fetch the membership records only (identifies WHICH servers)
      // This uses the absolute_flat_member_select policy which has ZERO recursion.
      const { data: memberData, error: memberError, count } = await supabase
        .from("server_members")
        .select("server_id, role", { count: "exact" })
        .range(from, to);

      if (memberError) {
        console.error("Member fetch error:", memberError.message);
        return { servers: [], totalCount: 0 };
      }

      if (!memberData || memberData.length === 0) {
        return { servers: [], totalCount: 0 };
      }

      // Step 2: Fetch the actual server details for those IDs in a separate, simple query
      const serverIds = memberData.map(m => m.server_id);
      const { data: serverData, error: serverError } = await supabase
        .from("servers")
        .select("*")
        .in("id", serverIds);

      if (serverError) {
        console.error("Server data fetch error:", serverError.message);
        return { servers: [], totalCount: 0 };
      }

      // Merge the data back together in the app layer
      const servers = memberData.map(member => {
        const details = serverData.find(s => s.id === member.server_id);
        if (!details) return null;
        return {
          ...details,
          userRole: member.role
        };
      }).filter((s): s is any => s !== null);

      return {
        servers,
        totalCount: count || 0
      };
    } catch (err) {
      console.error("Critical server fetch error:", err);
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