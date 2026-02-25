import type { NextApiRequest, NextApiResponse } from "next";
import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs/promises";
import path from "path";
import { supabase } from "@/integrations/supabase/client";

const execAsync = promisify(exec);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Simple check for dev environment or specific header for "Owner" session
  // In a production environment, this would require extreme authentication.
  
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { action, payload } = req.body;

  try {
    switch (action) {
      case "execute_sql":
        const { data: sqlData, error: sqlError } = await supabase.rpc("exec_sql", { sql_query: payload.query });
        if (sqlError) throw sqlError;
        return res.status(200).json({ success: true, data: sqlData });

      case "write_file":
        const fullPath = path.join(process.cwd(), payload.path);
        await fs.mkdir(path.dirname(fullPath), { recursive: true });
        await fs.writeFile(fullPath, payload.content, "utf8");
        return res.status(200).json({ success: true, message: `File written: ${payload.path}` });

      case "read_file":
        const readPath = path.join(process.cwd(), payload.path);
        const content = await fs.readFile(readPath, "utf8");
        return res.status(200).json({ success: true, content });

      case "run_command":
        const { stdout, stderr } = await execAsync(payload.command);
        return res.status(200).json({ success: true, stdout, stderr });

      default:
        return res.status(400).json({ error: "Unknown action" });
    }
  } catch (error: any) {
    console.error("NANO Kernel Error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
}