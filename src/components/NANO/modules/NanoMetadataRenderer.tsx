import React from "react";
import { Database, FileCode, AlertCircle, CheckCircle2, Info, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface MetadataProps {
  metadata: {
    type: "sql_result" | "file_content" | "kernel_status" | "info";
    data: any;
    status: "success" | "error" | "info";
  } | undefined;
}

export function NanoMetadataRenderer({ metadata }: MetadataProps) {
  if (!metadata) return null;

  const downloadCSV = (data: any[]) => {
    if (!data || !Array.isArray(data) || data.length === 0) return;
    const columns = Object.keys(data[0]);
    const headers = columns.join(",");
    const rows = data.map(row => 
      columns.map(col => `"${String(row[col]).replace(/"/g, '""')}"`).join(",")
    );
    const csv = [headers, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", `nano_sql_export_${new Date().getTime()}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  if (metadata.type === "sql_result" && Array.isArray(metadata.data)) {
    const columns = metadata.data.length > 0 ? Object.keys(metadata.data[0]) : [];
    return (
      <div className="mt-4 border border-zinc-800 rounded-md overflow-hidden bg-zinc-950/50">
        <div className="bg-zinc-900 px-3 py-2 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">SQL Result Set</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => downloadCSV(metadata.data)} className="h-6 px-2 text-[10px] text-zinc-500 hover:text-white hover:bg-zinc-800 gap-1.5">
              <Download className="w-3 h-3" /> Export CSV
            </Button>
            <Badge variant="outline" className="text-[10px] border-zinc-700 text-zinc-500">
              {metadata.data.length} rows
            </Badge>
          </div>
        </div>
        <ScrollArea className="h-[200px] w-full">
          <table className="w-full text-left border-collapse min-w-full">
            <thead className="bg-zinc-900/80 sticky top-0">
              <tr>
                {columns.map((col) => (
                  <th key={col} className="px-4 py-2 text-[10px] font-mono text-zinc-500 uppercase border-b border-zinc-800">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {metadata.data.map((row, i) => (
                <tr key={i} className="hover:bg-zinc-900/30 transition-colors">
                  {columns.map((col) => (
                    <td key={col} className="px-4 py-2 text-xs font-mono text-zinc-300">{String(row[col])}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </ScrollArea>
      </div>
    );
  }

  if (metadata.type === "file_content") {
    return (
      <div className="mt-4 border border-zinc-800 rounded-md overflow-hidden">
        <div className="bg-zinc-900 px-3 py-2 border-b border-zinc-800 flex items-center gap-2">
          <FileCode className="w-4 h-4 text-blue-400" />
          <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">File Content</span>
        </div>
        <pre className="p-4 text-xs font-mono text-zinc-300 bg-zinc-950 overflow-x-auto">{metadata.data}</pre>
      </div>
    );
  }

  return (
    <div className={`mt-4 p-3 rounded-md border flex items-center gap-3 ${
      metadata.status === "success" ? "bg-green-500/5 border-green-500/20 text-green-400" : 
      metadata.status === "error" ? "bg-red-500/5 border-red-500/20 text-red-400" : "bg-blue-500/5 border-blue-500/20 text-blue-400"
    }`}>
      {metadata.status === "success" ? <CheckCircle2 className="w-4 h-4" /> : 
       metadata.status === "error" ? <AlertCircle className="w-4 h-4" /> : <Info className="w-4 h-4" />}
      <span className="text-xs font-mono uppercase tracking-wider">
        {metadata.status.toUpperCase()}: {typeof metadata.data === 'string' ? metadata.data : JSON.stringify(metadata.data)}
      </span>
    </div>
  );
}