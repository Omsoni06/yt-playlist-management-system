"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Plus, Link as LinkIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function AddCoursePage() {
  const router = useRouter();
  const [playlistUrl, setPlaylistUrl] = useState("");
  const [loading, setLoading] = useState(false);

  // Extract playlist ID from URL
  const extractPlaylistId = (url) => {
    try {
      const urlObj = new URL(url);
      return urlObj.searchParams.get("list");
    } catch (error) {
      return null;
    }
  };

  const handleImport = async (e) => {
    e.preventDefault();

    if (!playlistUrl.trim()) {
      toast.error("Please enter a YouTube playlist URL");
      return;
    }

    const playlistId = extractPlaylistId(playlistUrl);
    if (!playlistId) {
      toast.error(
        "Invalid YouTube playlist URL. Please check the URL and try again."
      );
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      // First, import the playlist
      const importResponse = await fetch("/api/youtube/import", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ playlistId }),
      });

      const importData = await importResponse.json();

      if (!importResponse.ok) {
        throw new Error(importData.error || "Failed to import playlist");
      }

      // Then save to database
      const saveResponse = await fetch("/api/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          playlistId: importData.playlistId,
          playlistUrl: playlistUrl,
          title: importData.title,
          description: importData.description,
          channelTitle: importData.channelTitle,
          thumbnail: importData.thumbnail,
          videos: importData.videos,
          videoCount: importData.videos.length,
        }),
      });

      const saveData = await saveResponse.json();

      if (saveData.success) {
        toast.success("✅ Course imported successfully!");
        setTimeout(() => {
          router.push("/courses");
        }, 1000);
      } else {
        throw new Error(saveData.error || "Failed to save course");
      }
    } catch (error) {
      console.error("Import error:", error);
      toast.error(
        error.message || "Failed to import course. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => router.push("/dashboard")}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>

          {/* Main Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Add New Course
              </CardTitle>
              <CardDescription>
                Import a YouTube playlist to start your learning journey
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleImport} className="space-y-6">
                {/* URL Input */}
                <div className="space-y-2">
                  <Label htmlFor="playlistUrl">YouTube Playlist URL</Label>
                  <div className="relative">
                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="playlistUrl"
                      type="url"
                      placeholder="https://www.youtube.com/playlist?list=..."
                      value={playlistUrl}
                      onChange={(e) => setPlaylistUrl(e.target.value)}
                      className="pl-10"
                      disabled={loading}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Paste the full URL of any public YouTube playlist
                  </p>
                </div>

                {/* Example */}
                <div className="rounded-lg bg-muted p-4 space-y-2">
                  <p className="text-sm font-medium">Example URL:</p>
                  <code className="text-xs bg-background px-2 py-1 rounded block break-all">
                    https://www.youtube.com/playlist?list=PLillGF-RfqbbnEGy3ROiLWk7JMCuSyQtX
                  </code>
                </div>

                {/* How to find */}
                <div className="space-y-2">
                  <p className="text-sm font-medium">
                    How to find a playlist URL:
                  </p>
                  <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                    <li>
                      Go to YouTube and find the playlist you want to import
                    </li>
                    <li>Click on the playlist to open it</li>
                    <li>Copy the URL from your browser's address bar</li>
                    <li>Paste it here and click Import</li>
                  </ol>
                </div>

                {/* Submit Button */}
                <div className="flex gap-3">
                  <Button
                    type="submit"
                    disabled={loading || !playlistUrl.trim()}
                    className="flex-1 gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Importing...
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4" />
                        Import Course
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/courses")}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Features Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                What happens after importing?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">✓</span>
                  <span>All videos from the playlist will be imported</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">✓</span>
                  <span>Your progress will be tracked automatically</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">✓</span>
                  <span>You can take notes with timestamps</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">✓</span>
                  <span>AI will generate summaries and quizzes</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">✓</span>
                  <span>Resume watching from where you left off</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
