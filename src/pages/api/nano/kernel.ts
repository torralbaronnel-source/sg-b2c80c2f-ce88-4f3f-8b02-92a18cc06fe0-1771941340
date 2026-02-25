import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from "@/integrations/supabase/client";
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Method not allowed' });

  const { action, payload } = req.body;

  try {
    switch (action) {
      case 'execute_sql': {
        const { data, error } = await supabase.rpc('execute_sql', { sql_query: payload.query });
        if (error) throw error;
        return res.status(200).json({ success: true, data });
      }

      case 'write_file': {
        const fullPath = path.join(process.cwd(), payload.path);
        const dir = path.dirname(fullPath);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(fullPath, payload.content, 'utf8');
        return res.status(200).json({ success: true, message: `File ${payload.path} written successfully` });
      }

      case 'read_file': {
        const fullPath = path.join(process.cwd(), payload.path);
        if (!fs.existsSync(fullPath)) throw new Error('File not found');
        const content = fs.readFileSync(fullPath, 'utf8');
        return res.status(200).json({ success: true, content });
      }

      case 'run_command': {
        const { stdout, stderr } = await execAsync(payload.command);
        return res.status(200).json({ success: true, stdout, stderr });
      }

      default:
        throw new Error(`Unknown kernel action: ${action}`);
    }
  } catch (error: any) {
    console.error("Kernel Bridge Error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
}