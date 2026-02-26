import { supabase } from "@/integrations/supabase/client";

export interface BugReport {
  id?: string;
  user_id?: string;
  error_message: string;
  stack_trace?: string;
  component_stack?: string;
  url?: string;
  user_agent?: string;
  status?: "new" | "investigating" | "resolved" | "closed";
  priority?: "low" | "medium" | "high" | "critical";
  created_at?: string;
  browser_info?: string; // We'll map user_agent to this in UI
}

export const bugService = {
  async logError(report: Omit<BugReport, "id" | "created_at">) {
    try {
      const { data, error } = await supabase
        .from("bug_reports")
        .insert([{
          ...report,
          user_agent: typeof window !== "undefined" ? window.navigator.userAgent : "SSR",
          url: typeof window !== "undefined" ? window.location.href : "Unknown"
        }]);

      if (error) throw error;
      return data;
    } catch (err) {
      console.error("Failed to log bug report:", err);
      return null;
    }
  },

  async getBugReports(): Promise<BugReport[]> {
    const { data, error } = await supabase
      .from("bug_reports")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (error) throw error;
    return (data as any[])?.map(report => ({
      ...report,
      status: report.status as BugReport["status"],
      priority: report.priority as BugReport["priority"]
    })) || [];
  },

  async resolveBug(id: string): Promise<void> {
    const { error } = await supabase
      .from("bug_reports")
      .update({ status: "resolved" })
      .eq("id", id);
    
    if (error) throw error;
  }
};