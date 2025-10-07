"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Play,
  CheckCircle2,
  Clock,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  BookOpen,
  List,
  StickyNote,
  ChevronRight,
  Heart,
  Save,
  X,
  Search,
  Sparkles,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import NoteCard from "@/components/NoteCard";

export default function CoursePage() {
  const params = useParams();
  const router = useRouter();
  const playerRef = useRef(null);
  const youtubePlayerRef = useRef(null);
  const currentTimeRef = useRef(0);

  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [hasResumed, setHasResumed] = useState(false);

  const [course, setCourse] = useState(null);
  const [progress, setProgress] = useState(null);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);

  // Note Dialog State
  const [isNoteDialogOpen, setIsNoteDialogOpen] = useState(false);
  const [noteContent, setNoteContent] = useState("");
  const [noteTags, setNoteTags] = useState("");
  const [editingNote, setEditingNote] = useState(null);
  const [isSavingNote, setIsSavingNote] = useState(false);

  // AI Summary State
  const [aiSummary, setAiSummary] = useState(null);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  const [activeTab, setActiveTab] = useState("playlist");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchCourseData();
  }, [params.id]);

  // Load YouTube IFrame API
  useEffect(() => {
    // Load YouTube IFrame API script
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    // Set up YouTube API ready callback
    window.onYouTubeIframeAPIReady = () => {
      console.log("✅ YouTube API Ready");
    };
  }, []);

  // Initialize YouTube Player when video changes
  useEffect(() => {
    if (!currentVideo || !window.YT) return;

    const initPlayer = () => {
      if (youtubePlayerRef.current) {
        youtubePlayerRef.current.destroy();
      }

      const resumeTime = currentTimeRef.current || 0;

      youtubePlayerRef.current = new window.YT.Player("youtube-player", {
        videoId: currentVideo.videoId,
        playerVars: {
          autoplay: 1,
          start: resumeTime > 5 ? Math.floor(resumeTime) : 0,
          enablejsapi: 1,
          origin: window.location.origin,
        },
        events: {
          onReady: onPlayerReady,
          onStateChange: onPlayerStateChange,
        },
      });
    };

    if (window.YT && window.YT.Player) {
      setTimeout(initPlayer, 100);
    } else {
      window.onYouTubeIframeAPIReady = initPlayer;
    }

    return () => {
      if (youtubePlayerRef.current) {
        try {
          youtubePlayerRef.current.destroy();
        } catch (e) {
          console.log("Player cleanup error:", e);
        }
      }
    };
  }, [currentVideo]);

  const onPlayerReady = (event) => {
    console.log("▶️ Player ready");
    setIsPlayerReady(true);

    // Start tracking video time
    const trackTime = setInterval(() => {
      if (youtubePlayerRef.current && youtubePlayerRef.current.getCurrentTime) {
        const time = youtubePlayerRef.current.getCurrentTime();
        currentTimeRef.current = time;
        setCurrentTime(time);
      }
    }, 1000);

    // Store interval ID for cleanup
    youtubePlayerRef.current.trackTimeInterval = trackTime;
  };

  const onPlayerStateChange = (event) => {
    // YT.PlayerState.PLAYING = 1
    if (event.data === 1) {
      console.log("▶️ Video playing");
    }
  };

  // Auto-select video with resume functionality
  useEffect(() => {
    if (course?.videos?.length > 0 && progress && !currentVideo) {
      let videoToPlay;

      if (progress.lastWatchedVideoId) {
        const lastWatchedVideo = course.videos.find(
          (v) => v.videoId === progress.lastWatchedVideoId
        );

        if (lastWatchedVideo) {
          console.log(
            "📺 Resuming last watched video:",
            lastWatchedVideo.title
          );
          videoToPlay = lastWatchedVideo;

          const resumeTime = progress.lastWatchedTimestamp || 0;
          if (resumeTime > 5) {
            currentTimeRef.current = resumeTime;
            setCurrentTime(resumeTime);
            setHasResumed(false);
          }
        }
      }

      if (!videoToPlay) {
        videoToPlay = course.videos.find((v) => {
          const videoProgress = progress?.videoProgress?.find(
            (vp) => vp.videoId === v.videoId
          );
          return !videoProgress?.completed;
        });
      }

      setCurrentVideo(videoToPlay || course.videos[0]);
    }
  }, [course, progress, currentVideo]);

  // Auto-save progress every 10 seconds
  useEffect(() => {
    if (!currentVideo) return;

    const saveInterval = setInterval(() => {
      if (currentTimeRef.current > 0) {
        console.log(
          "💾 Auto-saving position:",
          Math.floor(currentTimeRef.current)
        );
        saveWatchPosition(currentVideo.videoId, currentTimeRef.current);
      }
    }, 10000);

    return () => clearInterval(saveInterval);
  }, [currentVideo]);

  // Save position when leaving page
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (currentVideo && currentTimeRef.current > 5) {
        saveWatchPosition(currentVideo.videoId, currentTimeRef.current);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      if (currentVideo && currentTimeRef.current > 5) {
        saveWatchPosition(currentVideo.videoId, currentTimeRef.current);
      }
    };
  }, [currentVideo]);

  const fetchCourseData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/courses/${params.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (data.success) {
        setCourse(data.course);
        setProgress(data.progress);
        setNotes(data.notes);
      }
    } catch (error) {
      console.error("Fetch course error:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const saveWatchPosition = async (videoId, time) => {
    if (!course || time === 0) return;

    try {
      const token = localStorage.getItem("token");
      await fetch("/api/progress/update-position", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          courseId: course._id,
          videoId: videoId,
          currentTime: time,
        }),
      });
      console.log("💾 Saved position:", Math.floor(time), "seconds");
    } catch (error) {
      console.error("Failed to save position:", error);
    }
  };

  const handleVideoSelect = (video) => {
    if (currentVideo && currentTimeRef.current > 0) {
      saveWatchPosition(currentVideo.videoId, currentTimeRef.current);
    }

    const videoProgress = progress?.videoProgress?.find(
      (vp) => vp.videoId === video.videoId
    );
    const savedPosition = videoProgress?.lastPosition || 0;

    if (savedPosition > 5) {
      currentTimeRef.current = savedPosition;
      setCurrentTime(savedPosition);
      setHasResumed(false);
    } else {
      currentTimeRef.current = 0;
      setCurrentTime(0);
      setHasResumed(true);
    }

    setCurrentVideo(video);
    setActiveTab("playlist");
    setShowSummary(false);
  };

  const handleToggleComplete = async (videoId, currentStatus) => {
    try {
      const token = localStorage.getItem("token");
      await fetch("/api/progress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          courseId: course._id,
          videoId,
          completed: !currentStatus,
        }),
      });
      await fetchCourseData();
    } catch (error) {
      console.error("Progress update error:", error);
    }
  };

  const handleOpenNoteDialog = () => {
    setIsNoteDialogOpen(true);
    setNoteContent("");
    setNoteTags("");
    setEditingNote(null);
  };

  const handleSaveNote = async () => {
    if (!noteContent.trim()) {
      toast.error("Please write something in the note");
      return;
    }

    setIsSavingNote(true);

    try {
      const token = localStorage.getItem("token");
      const url = editingNote ? `/api/notes/${editingNote._id}` : "/api/notes";
      const method = editingNote ? "PATCH" : "POST";

      await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          courseId: course._id,
          videoId: currentVideo.videoId,
          videoTitle: currentVideo.title,
          content: noteContent,
          timestamp: formatTime(currentTimeRef.current),
          tags: noteTags
            .split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag),
        }),
      });

      await fetchCourseData();
      setIsNoteDialogOpen(false);
      setNoteContent("");
      setNoteTags("");
      setEditingNote(null);
    } catch (error) {
      console.error("Save note error:", error);
      toast.error("Failed to save note");
    } finally {
      setIsSavingNote(false);
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (!confirm("Delete this note?")) return;

    try {
      const token = localStorage.getItem("token");
      await fetch(`/api/notes/${noteId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchCourseData();
    } catch (error) {
      console.error("Delete note error:", error);
    }
  };

  const handleEditNote = (note) => {
    setEditingNote(note);
    setNoteContent(note.content);
    setNoteTags(note.tags?.join(", ") || "");
    setIsNoteDialogOpen(true);
  };

  const handleSeekToTimestamp = (timestamp) => {
    const parts = timestamp.split(":");
    const seconds =
      parts.length === 2 ? parseInt(parts[0]) * 60 + parseInt(parts[1]) : 0;

    if (youtubePlayerRef.current && youtubePlayerRef.current.seekTo) {
      youtubePlayerRef.current.seekTo(seconds, true);
      youtubePlayerRef.current.playVideo();
    }
  };

  const generateSummary = async () => {
    setLoadingSummary(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/ai/summary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          videoTitle: currentVideo.title,
          videoDescription: currentVideo.description || course.description,
          videoId: currentVideo.videoId,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setAiSummary(data.summary);
        setShowSummary(true);
      } else {
        toast.error(
          "Failed to generate summary: " + (data.error || "Unknown error")
        );
      }
    } catch (error) {
      console.error("Summary error:", error);
      toast.error("Failed to generate summary. Please try again.");
    } finally {
      setLoadingSummary(false);
    }
  };

  const toggleFavorite = async () => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`/api/courses/${params.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isFavorite: !course.isFavorite }),
      });
      setCourse({ ...course, isFavorite: !course.isFavorite });
    } catch (error) {
      console.error("Toggle favorite error:", error);
    }
  };

  const getVideoProgress = (videoId) => {
    return progress?.videoProgress?.find((v) => v.videoId === videoId);
  };

  const videoNotes = notes.filter(
    (note) => note.videoId === currentVideo?.videoId
  );
  const completionPercentage = progress?.completionPercentage || 0;

  const filteredNotes = notes.filter(
    (note) =>
      searchQuery === "" ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.tags?.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading course...</p>
        </div>
      </div>
    );
  }

  if (!course || !currentVideo) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Course not found</p>
        <Button onClick={() => router.push("/courses")} className="mt-4">
          Back to Courses
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Floating Add Note Button */}
      <Button
        onClick={handleOpenNoteDialog}
        size="lg"
        className="fixed bottom-8 right-8 z-50 shadow-2xl h-16 w-16 rounded-full p-0"
      >
        <Plus className="h-6 w-6" />
      </Button>

      {/* Note Dialog */}
      <Dialog open={isNoteDialogOpen} onOpenChange={setIsNoteDialogOpen}>
        <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <StickyNote className="h-5 w-5 text-primary" />
              {editingNote ? "Edit Note" : "Create New Note"}
            </DialogTitle>
            <DialogDescription className="line-clamp-1">
              {currentVideo.title}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Video Timestamp</span>
              </div>
              <Badge
                variant="default"
                className="font-mono text-base px-3 py-1"
              >
                {formatTime(currentTime)}
              </Badge>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Your Note</label>
              <Textarea
                placeholder="Write your thoughts, key takeaways, questions, or anything important..."
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                rows={8}
                className="resize-none"
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Tags (Optional)</label>
              <Input
                placeholder="important, concept, review, question"
                value={noteTags}
                onChange={(e) => setNoteTags(e.target.value)}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleSaveNote}
                disabled={isSavingNote || !noteContent.trim()}
                className="flex-1 gap-2"
              >
                <Save className="h-4 w-4" />
                {isSavingNote
                  ? "Saving..."
                  : editingNote
                  ? "Update Note"
                  : "Save Note"}
              </Button>
              <Button
                onClick={() => {
                  setIsNoteDialogOpen(false);
                  setEditingNote(null);
                  setNoteContent("");
                  setNoteTags("");
                }}
                variant="outline"
                disabled={isSavingNote}
                className="gap-2"
              >
                <X className="h-4 w-4" />
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Rest of the component remains the same until the video player section... */}

      {/* Header - keeping your existing header code */}
      <div className="border-b bg-background sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push("/courses")}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="flex-1 min-w-0">
                <h1 className="font-semibold truncate">{course.title}</h1>
                <p className="text-xs text-muted-foreground truncate">
                  {course.channelTitle}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center gap-3 mr-4">
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Progress</p>
                  <p className="text-sm font-semibold">
                    {completionPercentage}%
                  </p>
                </div>
                <Progress value={completionPercentage} className="w-32 h-2" />
              </div>

              <Button variant="ghost" size="icon" onClick={toggleFavorite}>
                <Heart
                  className={`h-4 w-4 ${
                    course.isFavorite ? "fill-red-500 text-red-500" : ""
                  }`}
                />
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(course.playlistUrl, "_blank")}
                className="hidden md:flex gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                YouTube
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-4">
        <div className="grid lg:grid-cols-3 gap-4">
          {/* Left: Video Player */}
          <div className="lg:col-span-2 space-y-4">
            {/* Video Player with YouTube API */}
            <Card className="overflow-hidden">
              <div
                className="relative w-full bg-black"
                style={{ paddingBottom: "56.25%" }}
              >
                <div
                  id="youtube-player"
                  className="absolute top-0 left-0 w-full h-full"
                ></div>

                {/* Resume Indicator */}
                {currentTime > 5 && !hasResumed && (
                  <div className="absolute bottom-4 left-4 right-4 bg-black/80 text-white p-3 rounded-lg flex items-center gap-2 z-10">
                    <Play className="h-4 w-4" />
                    <span className="text-sm">
                      Resuming from {formatTime(currentTime)}
                    </span>
                  </div>
                )}
              </div>

              <CardContent className="p-4 space-y-3">
                {currentTime > 0 && (
                  <div className="text-xs text-muted-foreground flex items-center gap-2">
                    <Clock className="h-3 w-3" />
                    <span>Current time: {formatTime(currentTime)}</span>
                  </div>
                )}

                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h2 className="font-semibold text-lg">
                      {currentVideo.title}
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Video{" "}
                      {course.videos.findIndex(
                        (v) => v.videoId === currentVideo.videoId
                      ) + 1}{" "}
                      of {course.videos.length}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      Completed
                    </span>
                    <Checkbox
                      checked={
                        getVideoProgress(currentVideo.videoId)?.completed ||
                        false
                      }
                      onCheckedChange={(checked) =>
                        handleToggleComplete(currentVideo.videoId, !checked)
                      }
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-2 border-t">
                  <Button
                    onClick={handleOpenNoteDialog}
                    size="default"
                    className="flex-1 gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Quick Note
                  </Button>

                  <Button
                    onClick={generateSummary}
                    disabled={loadingSummary}
                    variant="outline"
                    size="default"
                    className="gap-2"
                  >
                    {loadingSummary ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                        <span className="hidden sm:inline">Generating...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        <span className="hidden sm:inline">AI Summary</span>
                      </>
                    )}
                  </Button>

                  {videoNotes.length > 0 && (
                    <Button
                      onClick={() => setActiveTab("notes")}
                      variant="outline"
                      size="default"
                      className="gap-2"
                    >
                      <StickyNote className="h-4 w-4" />
                      <span className="hidden sm:inline">
                        {videoNotes.length}
                      </span>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* AI Summary Card */}
            {showSummary && aiSummary && (
              <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-primary" />
                      AI-Generated Summary
                    </h3>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setShowSummary(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="p-4 bg-background rounded-lg border">
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                      <div className="whitespace-pre-wrap text-sm leading-relaxed">
                        {aiSummary}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2 border-t">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        navigator.clipboard.writeText(aiSummary);
                        toast.success("Summary copied to clipboard!");
                      }}
                      className="gap-2"
                    >
                      Copy
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={generateSummary}
                      disabled={loadingSummary}
                      className="gap-2"
                    >
                      Regenerate
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Video Notes Section */}
            {videoNotes.length > 0 && activeTab === "notes" && (
              <Card>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold flex items-center gap-2">
                      <StickyNote className="h-4 w-4" />
                      Notes for this video
                    </h3>
                    <Badge variant="secondary">{videoNotes.length}</Badge>
                  </div>

                  <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                    {videoNotes.map((note) => (
                      <NoteCard
                        key={note._id}
                        note={note}
                        onEdit={handleEditNote}
                        onDelete={handleDeleteNote}
                        onSeekTo={handleSeekToTimestamp}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right sidebar - keeping your existing playlist code */}
          <div className="space-y-4">
            <div className="flex gap-2 p-1 bg-muted rounded-lg">
              <Button
                variant={activeTab === "playlist" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("playlist")}
                className="flex-1 gap-2"
              >
                <List className="h-4 w-4" />
                Playlist
              </Button>
              <Button
                variant={activeTab === "allNotes" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("allNotes")}
                className="flex-1 gap-2"
              >
                <BookOpen className="h-4 w-4" />
                Notes ({notes.length})
              </Button>
            </div>

            {activeTab === "playlist" && (
              <Card className="max-h-[calc(100vh-200px)] overflow-hidden flex flex-col">
                <CardContent className="p-0 h-full overflow-y-auto">
                  <div className="divide-y">
                    {course.videos.map((video, index) => {
                      const videoProgress = getVideoProgress(video.videoId);
                      const isCompleted = videoProgress?.completed || false;
                      const isCurrent = currentVideo?.videoId === video.videoId;
                      const isLastWatched =
                        progress?.lastWatchedVideoId === video.videoId;
                      const lastPosition = videoProgress?.lastPosition || 0;
                      const videoNotesCount = notes.filter(
                        (n) => n.videoId === video.videoId
                      ).length;

                      return (
                        <div
                          key={video.videoId}
                          onClick={() => handleVideoSelect(video)}
                          className={`p-3 cursor-pointer transition-colors ${
                            isCurrent
                              ? "bg-primary/10 border-l-4 border-l-primary"
                              : isCompleted
                              ? "bg-muted/50 hover:bg-muted"
                              : "hover:bg-muted/50"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 pt-1">
                              {isCompleted ? (
                                <CheckCircle2 className="h-5 w-5 text-green-500" />
                              ) : isCurrent ? (
                                <Play className="h-5 w-5 text-primary fill-primary" />
                              ) : isLastWatched && lastPosition > 5 ? (
                                <Clock className="h-5 w-5 text-orange-500" />
                              ) : (
                                <div className="h-5 w-5 rounded-full border-2 flex items-center justify-center text-xs text-muted-foreground">
                                  {index + 1}
                                </div>
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <p
                                className={`text-sm font-medium line-clamp-2 ${
                                  isCurrent ? "text-primary" : ""
                                }`}
                              >
                                {video.title}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-muted-foreground">
                                  {video.duration.replace("PT", "")}
                                </span>

                                {isLastWatched &&
                                  lastPosition > 5 &&
                                  !isCompleted && (
                                    <Badge
                                      variant="secondary"
                                      className="text-xs h-5 gap-1"
                                    >
                                      <Clock className="h-3 w-3" />
                                      {formatTime(lastPosition)}
                                    </Badge>
                                  )}

                                {videoNotesCount > 0 && (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs h-5"
                                  >
                                    📝 {videoNotesCount}
                                  </Badge>
                                )}
                              </div>
                            </div>

                            {isCurrent && (
                              <ChevronRight className="h-4 w-4 text-primary flex-shrink-0" />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "allNotes" && (
              <Card className="max-h-[calc(100vh-200px)] overflow-hidden flex flex-col">
                <div className="p-4 border-b">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search notes..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <CardContent className="p-4 flex-1 overflow-y-auto">
                  {filteredNotes.length > 0 ? (
                    <div className="space-y-3">
                      {filteredNotes.map((note) => (
                        <NoteCard
                          key={note._id}
                          note={{
                            ...note,
                            videoTitle: course.videos.find(
                              (v) => v.videoId === note.videoId
                            )?.title,
                          }}
                          onEdit={(n) => {
                            const video = course.videos.find(
                              (v) => v.videoId === n.videoId
                            );
                            if (video) setCurrentVideo(video);
                            handleEditNote(n);
                          }}
                          onDelete={handleDeleteNote}
                          onSeekTo={(timestamp) => {
                            const video = course.videos.find(
                              (v) => v.videoId === note.videoId
                            );
                            if (video) {
                              setCurrentVideo(video);
                              setTimeout(
                                () => handleSeekToTimestamp(timestamp),
                                500
                              );
                            }
                          }}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <StickyNote className="h-12 w-12 mx-auto mb-3 opacity-20" />
                      <p className="text-sm">
                        {searchQuery ? "No notes found" : "No notes yet"}
                      </p>
                      <p className="text-xs mt-1">
                        {searchQuery
                          ? "Try a different search term"
                          : "Click the + button to add notes!"}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
