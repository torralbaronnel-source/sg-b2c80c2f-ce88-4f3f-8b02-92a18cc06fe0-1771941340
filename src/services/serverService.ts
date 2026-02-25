import { supabase } from "@/integrations/supabase/client";

export const generateServerId = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 18; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export interface ServerBlueprint {
  modules: {
    crm: boolean;
    finance: boolean;
    communication: boolean;
    whatsapp: boolean;
    events: boolean;
  };
  rules: {
    autoArchive: boolean;
    requireContract: boolean;
    enableRealtime: boolean;
    strictBudgeting: boolean;
  };
  aiNotes?: string;
}

export interface ServerResponse {
  servers: any[];
  totalCount: number;
}

export const serverService = {
  async getMyServers(page = 1, pageSize = 6): Promise<ServerResponse> {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    try {
      const { data: memberData, error: memberError, count } = await supabase
        .from("server_members")
        .select("server_id, role", { count: "exact" })
        .range(from, to);

      if (memberError) return { servers: [], totalCount: 0 };
      if (!memberData || memberData.length === 0) return { servers: [], totalCount: 0 };

      const serverIds = memberData.map(m => m.server_id);
      const { data: serverData, error: serverError } = await supabase
        .from("servers")
        .select("*")
        .in("id", serverIds);

      if (serverError) return { servers: [], totalCount: 0 };

      const servers = memberData.map(member => {
        const details = serverData.find(s => s.id === member.server_id);
        if (!details) return null;
        return { ...details, userRole: member.role };
      }).filter((s): s is any => s !== null);

      return { servers, totalCount: count || 0 };
    } catch (err) {
      return { servers: [], totalCount: 0 };
    }
  },

  async deployComplexServer(payload: {
    name: string;
    industry: string;
    blueprint: ServerBlueprint;
  }) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const serverId = generateServerId();
    
    // 1. Insert server with blueprint
    const { data: server, error: serverError } = await supabase
      .from("servers")
      .insert({
        name: payload.name,
        server_handle: serverId,
        owner_id: user.id,
        industry: payload.industry,
        blueprint: payload.blueprint as any,
        invite_code: generateServerId()
      })
      .select()
      .single();

    if (serverError) throw serverError;

    // 2. Add owner as portal_admin
    const { error: memberError } = await supabase
      .from("server_members")
      .insert({
        server_id: server.id,
        profile_id: user.id,
        role: "portal_admin"
      });

    if (memberError) throw memberError;

    // 3. Update profile
    await supabase
      .from("profiles")
      .update({ current_server_id: server.id })
      .eq("id", user.id);

    return server;
  },

  async joinServer(inviteCode: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const { data: server, error: fetchError } = await supabase
      .from("servers")
      .select("*")
      .eq("invite_code", inviteCode)
      .single();

    if (fetchError || !server) throw new Error("Invalid invite code");

    const { error: joinError } = await supabase
      .from("server_members")
      .insert({
        server_id: server.id,
        profile_id: user.id,
        role: "coordinator"
      });

    if (joinError && joinError.code !== "23505") throw joinError;

    await supabase
      .from("profiles")
      .update({ current_server_id: server.id })
      .eq("id", user.id);

    return server;
  },

  async selectServer(serverId: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");
    const { error } = await supabase.from("profiles").update({ current_server_id: serverId }).eq("id", user.id);
    if (error) throw error;
    return true;
  },

  async updateServerBlueprint(serverId: string, blueprint: ServerBlueprint) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const { error } = await supabase
      .from("servers")
      .update({ blueprint: blueprint as any })
      .eq("id", serverId)
      .eq("owner_id", user.id);

    if (error) throw error;
    return true;
  }
};