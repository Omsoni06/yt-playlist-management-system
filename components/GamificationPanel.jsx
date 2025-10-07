"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Star, Flame, Target, Award, Zap } from "lucide-react";

export default function GamificationPanel({ user, achievements = [] }) {
  const pointsToNextLevel = (user.level || 1) * 100 - (user.totalPoints || 0);
  const levelProgress = (user.totalPoints || 0) % 100;

  const badges = [
    {
      id: "first_course",
      title: "First Steps",
      description: "Complete your first course",
      icon: Trophy,
      earned: user.coursesCompleted >= 1,
      color: "text-yellow-500",
    },
    {
      id: "streak_7",
      title: "Week Warrior",
      description: "7 day study streak",
      icon: Flame,
      earned: user.studyStreak >= 7,
      color: "text-orange-500",
    },
    {
      id: "note_master",
      title: "Note Master",
      description: "Create 50 notes",
      icon: Star,
      earned: user.notesCreated >= 50,
      color: "text-blue-500",
    },
    {
      id: "complete_10",
      title: "Perfectionist",
      description: "Complete 10 courses",
      icon: Award,
      earned: user.coursesCompleted >= 10,
      color: "text-purple-500",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Level and Points Card */}
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Level {user.level || 1}
            </span>
            <Badge variant="secondary" className="text-lg px-3">
              {user.totalPoints || 0} XP
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Progress to Level {(user.level || 1) + 1}
              </span>
              <span className="font-semibold">{levelProgress}%</span>
            </div>
            <Progress value={levelProgress} className="h-3" />
            <p className="text-xs text-muted-foreground text-center">
              {pointsToNextLevel} XP until next level
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4 border-t">
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Flame className="h-5 w-5 text-orange-500" />
              </div>
              <p className="text-2xl font-bold">{user.studyStreak || 0}</p>
              <p className="text-xs text-muted-foreground">Day Streak</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Trophy className="h-5 w-5 text-yellow-500" />
              </div>
              <p className="text-2xl font-bold">{user.coursesCompleted || 0}</p>
              <p className="text-xs text-muted-foreground">Completed</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Star className="h-5 w-5 text-blue-500" />
              </div>
              <p className="text-2xl font-bold">{user.notesCreated || 0}</p>
              <p className="text-xs text-muted-foreground">Notes</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className={`p-4 rounded-lg border-2 transition-all ${
                  badge.earned
                    ? "border-primary bg-primary/5"
                    : "border-muted bg-muted/50 opacity-50"
                }`}
              >
                <div className="flex flex-col items-center text-center space-y-2">
                  <div
                    className={`p-3 rounded-full ${
                      badge.earned ? "bg-primary/10" : "bg-muted"
                    }`}
                  >
                    <badge.icon
                      className={`h-6 w-6 ${
                        badge.earned ? badge.color : "text-muted-foreground"
                      }`}
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{badge.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {badge.description}
                    </p>
                  </div>
                  {badge.earned && (
                    <Badge variant="secondary" className="text-xs">
                      ✓ Earned
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Daily Goal */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Daily Goal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Videos to watch today
              </span>
              <span className="font-semibold">
                {user.dailyGoal || 3} videos
              </span>
            </div>
            <Progress value={33} className="h-2" />
            <p className="text-xs text-muted-foreground">
              Keep your streak alive! 🔥
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
