"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Edit, Trash2, ChevronDown, ChevronUp } from "lucide-react";

export default function NoteCard({ note, onEdit, onDelete, onSeekTo }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const previewLength = 150;
  const shouldTruncate = note.content.length > previewLength;

  return (
    <Card className="hover:shadow-md transition-all duration-200 border-l-4 border-l-primary/50">
      <CardContent className="p-4 space-y-3">
        {/* Header with Timestamp and Actions */}
        <div className="flex items-start justify-between gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSeekTo(note.timestamp)}
            className="gap-2 h-auto p-2 hover:bg-primary/10 rounded-lg"
          >
            <Clock className="h-4 w-4 text-primary" />
            <span className="text-primary font-mono font-semibold">
              {note.timestamp}
            </span>
          </Button>

          <div className="flex gap-1">
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8"
              onClick={() => onEdit(note)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
              onClick={() => onDelete(note._id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Note Content with Expand/Collapse */}
        <div className="space-y-2">
          <p
            className={`text-sm leading-relaxed whitespace-pre-wrap ${
              !isExpanded && shouldTruncate ? "line-clamp-3" : ""
            }`}
          >
            {note.content}
          </p>

          {/* Expand/Collapse Button */}
          {shouldTruncate && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="gap-2 text-xs h-auto py-1 px-2 text-muted-foreground hover:text-foreground"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="h-3 w-3" />
                  Show less
                </>
              ) : (
                <>
                  <ChevronDown className="h-3 w-3" />
                  Read more
                </>
              )}
            </Button>
          )}
        </div>

        {/* Tags */}
        {note.tags && note.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-2 border-t">
            {note.tags.map((tag, idx) => (
              <Badge key={idx} variant="secondary" className="text-xs">
                #{tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Metadata */}
        {note.videoTitle && (
          <p className="text-xs text-muted-foreground truncate pt-1">
            📹 {note.videoTitle}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
