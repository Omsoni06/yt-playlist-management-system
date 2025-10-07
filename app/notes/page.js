"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, StickyNote } from "lucide-react";
import NoteCard from "@/components/NoteCard";
import { useRouter } from "next/navigation";

export default function AllNotesPage() {
  const router = useRouter();
  const [notes, setNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllNotes();
  }, []);

  const fetchAllNotes = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/notes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setNotes(data.notes);
      }
    } catch (error) {
      console.error("Fetch notes error:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredNotes = notes.filter(
    (note) =>
      searchQuery === "" ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.videoTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.tags?.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <StickyNote className="h-8 w-8 text-primary" />
            All Notes
          </h1>
          <p className="text-muted-foreground mt-2">
            Search and manage all your learning notes
          </p>
        </div>

        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search notes by content, video title, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {filteredNotes.length} note{filteredNotes.length !== 1 ? "s" : ""}{" "}
            found
          </p>
        </div>

        {filteredNotes.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredNotes.map((note) => (
              <NoteCard
                key={note._id}
                note={note}
                onEdit={() => {}}
                onDelete={() => {}}
                onSeekTo={() => {}}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <StickyNote className="h-16 w-16 mx-auto text-muted-foreground opacity-20 mb-4" />
            <p className="text-muted-foreground">
              {searchQuery
                ? "No notes found matching your search"
                : "No notes yet"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
