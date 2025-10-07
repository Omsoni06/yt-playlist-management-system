"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  BookOpen,
  Clock,
  Heart,
  Trash2,
  PlayCircle,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CourseCard({
  course,
  progress,
  onDelete,
  onToggleFavorite,
}) {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);

  const completionPercentage = progress?.completionPercentage || 0;
  const completedVideos = progress?.completedVideos || 0;

  return (
    <Card
      className="overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => router.push(`/courses/${course._id}`)}
    >
      {/* Thumbnail with Gradient Overlay */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600">
        {course.thumbnail ? (
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BookOpen className="h-20 w-20 text-white opacity-50" />
          </div>
        )}

        {/* Overlay */}
        <div
          className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="flex items-center justify-center h-full">
            <Button
              size="lg"
              className="gap-2 shadow-xl"
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/courses/${course._id}`);
              }}
            >
              <PlayCircle className="h-5 w-5" />
              Continue Learning
            </Button>
          </div>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {completionPercentage === 100 && (
            <Badge className="bg-green-500 hover:bg-green-600 gap-1">
              <CheckCircle2 className="h-3 w-3" />
              Completed
            </Badge>
          )}
          {completionPercentage > 0 && completionPercentage < 100 && (
            <Badge className="bg-blue-500 hover:bg-blue-600 gap-1">
              <TrendingUp className="h-3 w-3" />
              In Progress
            </Badge>
          )}
        </div>

        {/* Favorite Icon */}
        <Button
          size="icon"
          variant="ghost"
          className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm hover:bg-white/40"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(course._id);
          }}
        >
          <Heart
            className={`h-4 w-4 ${
              course.isFavorite ? "fill-red-500 text-red-500" : "text-white"
            }`}
          />
        </Button>
      </div>

      <CardContent className="p-4 space-y-3">
        {/* Title */}
        <h3 className="font-semibold line-clamp-2 text-lg group-hover:text-primary transition-colors">
          {course.title}
        </h3>

        {/* Channel */}
        <p className="text-sm text-muted-foreground flex items-center gap-2">
          <BookOpen className="h-4 w-4" />
          {course.channelTitle}
        </p>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-semibold">{completionPercentage}%</span>
          </div>
          <Progress value={completionPercentage} className="h-2" />
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <PlayCircle className="h-4 w-4" />
            <span>{course.videoCount} videos</span>
          </div>
          <div className="flex items-center gap-1">
            <CheckCircle2 className="h-4 w-4" />
            <span>{completedVideos} done</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2 border-t">
          <Button
            className="flex-1 gap-2"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/courses/${course._id}`);
            }}
          >
            <PlayCircle className="h-4 w-4" />
            Continue
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(course._id);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
