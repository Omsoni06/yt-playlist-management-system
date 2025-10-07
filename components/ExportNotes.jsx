"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, FileText, File } from "lucide-react";

export default function ExportNotes({ notes, courseName }) {
  const exportAsMarkdown = () => {
    let markdown = `# ${courseName}\n\n`;
    markdown += `Total Notes: ${notes.length}\n\n`;

    notes.forEach((note, index) => {
      markdown += `## Note ${index + 1}\n\n`;
      markdown += `**Video:** ${note.videoTitle}\n`;
      markdown += `**Timestamp:** ${note.timestamp}\n\n`;
      markdown += `${note.content}\n\n`;
      if (note.tags && note.tags.length > 0) {
        markdown += `**Tags:** ${note.tags.join(", ")}\n\n`;
      }
      markdown += "---\n\n";
    });

    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${courseName.replace(/[^a-z0-9]/gi, "_")}_notes.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportAsText = () => {
    let text = `${courseName}\n`;
    text += `Total Notes: ${notes.length}\n\n`;
    text += "=".repeat(50) + "\n\n";

    notes.forEach((note, index) => {
      text += `Note ${index + 1}\n`;
      text += `Video: ${note.videoTitle}\n`;
      text += `Timestamp: ${note.timestamp}\n\n`;
      text += `${note.content}\n\n`;
      if (note.tags && note.tags.length > 0) {
        text += `Tags: ${note.tags.join(", ")}\n\n`;
      }
      text += "-".repeat(50) + "\n\n";
    });

    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${courseName.replace(/[^a-z0-9]/gi, "_")}_notes.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportAsJSON = () => {
    const data = {
      courseName,
      exportDate: new Date().toISOString(),
      totalNotes: notes.length,
      notes: notes.map((note) => ({
        videoTitle: note.videoTitle,
        timestamp: note.timestamp,
        content: note.content,
        tags: note.tags,
        createdAt: note.createdAt,
      })),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${courseName.replace(/[^a-z0-9]/gi, "_")}_notes.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (notes.length === 0) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Download className="h-4 w-4" />
          Export Notes
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={exportAsMarkdown}>
          <FileText className="mr-2 h-4 w-4" />
          Export as Markdown
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportAsText}>
          <File className="mr-2 h-4 w-4" />
          Export as Text
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportAsJSON}>
          <File className="mr-2 h-4 w-4" />
          Export as JSON
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
