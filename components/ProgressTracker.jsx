"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, TrendingUp } from "lucide-react";

export default function ProgressTracker({ course, progress }) {
  if (!progress) return null;

  const completionPercentage = progress.completionPercentage || 0;
  const timeSpentHours = Math.round(progress.totalTimeSpent / 3600);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Course Progress</span>
          {progress.isCompleted && (
            <Badge className="bg-green-500">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Completed
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Overall Progress</span>
            <span className="font-medium">{completionPercentage}%</span>
          </div>
          <Progress value={completionPercentage} className="h-3" />
          <p className="text-sm text-muted-foreground">
            {progress.completedVideos} of {progress.totalVideos} videos
            completed
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <CheckCircle2 className="h-4 w-4" />
              <span className="text-sm">Completed</span>
            </div>
            <p className="text-2xl font-bold">{progress.completedVideos}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span className="text-sm">Time Spent</span>
            </div>
            <p className="text-2xl font-bold">{timeSpentHours}h</p>
          </div>
        </div>

        {!progress.isCompleted && progress.completedVideos > 0 && (
          <div className="p-4 bg-muted rounded-lg space-y-1">
            <div className="flex items-center gap-2 text-sm font-medium">
              <TrendingUp className="h-4 w-4" />
              Keep Going!
            </div>
            <p className="text-sm text-muted-foreground">
              Only {progress.totalVideos - progress.completedVideos} videos left
              to complete this course
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
