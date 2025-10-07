"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Play, CheckCircle2, Clock, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";

export default function VideoList({ course, progress, onVideoSelect }) {
  const router = useRouter();
  const [updatingVideo, setUpdatingVideo] = useState(null);
  const [playingVideoId, setPlayingVideoId] = useState(null);

  const getVideoProgress = (videoId) => {
    return progress?.videoProgress?.find((v) => v.videoId === videoId);
  };

  const handleToggleComplete = async (videoId, currentStatus, e) => {
    e.stopPropagation();
    setUpdatingVideo(videoId);
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
      router.refresh();
    } catch (error) {
      console.error("Progress update error:", error);
    } finally {
      setUpdatingVideo(null);
    }
  };

  const handleVideoClick = (video) => {
    setPlayingVideoId(video.videoId);
    if (onVideoSelect) {
      onVideoSelect(video);
    }
  };

  return (
    <div className="space-y-6">
      {/* Video Player */}
      {playingVideoId && (
        <Card className="sticky top-4 z-10">
          <CardContent className="p-0">
            <div
              className="relative w-full"
              style={{ paddingBottom: "56.25%" }}
            >
              <iframe
                className="absolute top-0 left-0 w-full h-full rounded-t-lg"
                src={`https://www.youtube.com/embed/${playingVideoId}?autoplay=1`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <div className="p-4 flex items-center justify-between border-t">
              <p className="text-sm font-medium">
                {course.videos.find((v) => v.videoId === playingVideoId)?.title}
              </p>
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  window.open(
                    `https://www.youtube.com/watch?v=${playingVideoId}`,
                    "_blank"
                  )
                }
                className="gap-2"
              >
                <ExternalLink className="h-3 w-3" />
                Open in YouTube
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Video List */}
      <div className="space-y-3">
        <h3 className="font-semibold text-lg">Course Videos</h3>
        {course.videos.map((video, index) => {
          const videoProgress = getVideoProgress(video.videoId);
          const isCompleted = videoProgress?.completed || false;
          const isPlaying = playingVideoId === video.videoId;

          return (
            <Card
              key={video.videoId}
              className={`cursor-pointer transition-all ${
                isPlaying
                  ? "border-primary ring-2 ring-primary/20"
                  : isCompleted
                  ? "bg-muted/50 hover:bg-muted"
                  : "hover:border-primary"
              }`}
              onClick={() => handleVideoClick(video)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <Checkbox
                      checked={isCompleted}
                      onCheckedChange={(checked) =>
                        handleToggleComplete(video.videoId, isCompleted, event)
                      }
                      disabled={updatingVideo === video.videoId}
                      className="mt-1"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>

                  <div className="relative flex-shrink-0 group">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-32 h-20 object-cover rounded"
                    />
                    {isCompleted && (
                      <div className="absolute inset-0 bg-black/50 rounded flex items-center justify-center">
                        <CheckCircle2 className="h-8 w-8 text-green-500" />
                      </div>
                    )}
                    {!isPlaying && (
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 rounded flex items-center justify-center transition-all">
                        <div className="bg-primary text-primary-foreground rounded-full p-2">
                          <Play className="h-5 w-5 fill-current" />
                        </div>
                      </div>
                    )}
                    {isPlaying && (
                      <div className="absolute inset-0 bg-primary/80 rounded flex items-center justify-center">
                        <p className="text-white text-xs font-bold">PLAYING</p>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h4
                          className={`font-medium line-clamp-2 ${
                            isPlaying ? "text-primary" : ""
                          }`}
                        >
                          {video.title}
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Video {index + 1} of {course.videos.length}
                        </p>
                      </div>
                      <Badge variant="outline" className="flex-shrink-0 gap-1">
                        <Clock className="h-3 w-3" />
                        {video.duration.replace("PT", "").toLowerCase()}
                      </Badge>
                    </div>
                  </div>

                  <Button
                    size="icon"
                    variant={isPlaying ? "default" : "ghost"}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleVideoClick(video);
                    }}
                  >
                    <Play className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
