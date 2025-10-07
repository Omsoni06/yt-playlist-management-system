"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Keyboard } from "lucide-react";

export default function KeyboardShortcuts() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === "?" || (e.shiftKey && e.key === "/")) {
        e.preventDefault();
        setIsOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  const shortcuts = [
    { key: "N", action: "Add new note" },
    { key: "Space", action: "Play/Pause video" },
    { key: "→", action: "Next video" },
    { key: "←", action: "Previous video" },
    { key: "M", action: "Mark video complete" },
    { key: "F", action: "Toggle fullscreen" },
    { key: "?", action: "Show shortcuts" },
    { key: "Esc", action: "Close dialogs" },
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 left-4 p-3 bg-muted rounded-full shadow-lg hover:shadow-xl transition-all z-40 group"
        title="Keyboard shortcuts (?)"
      >
        <Keyboard className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Keyboard className="h-5 w-5" />
              Keyboard Shortcuts
            </DialogTitle>
            <DialogDescription>
              Speed up your learning with these shortcuts
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-4">
            {shortcuts.map((shortcut, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <span className="text-sm">{shortcut.action}</span>
                <Badge variant="outline" className="font-mono">
                  {shortcut.key}
                </Badge>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
