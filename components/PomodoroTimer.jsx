"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, RotateCcw, Coffee, Brain } from "lucide-react";

export default function PomodoroTimer() {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sessions, setSessions] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    let interval = null;

    if (isActive && (minutes > 0 || seconds > 0)) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            // Timer complete
            playSound();
            if (isBreak) {
              setIsBreak(false);
              setMinutes(25);
              setSessions(sessions + 1);
            } else {
              setIsBreak(true);
              setMinutes(sessions % 4 === 3 ? 15 : 5); // Long break every 4 sessions
            }
            setIsActive(false);
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, minutes, seconds, isBreak, sessions]);

  const playSound = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  const toggle = () => {
    setIsActive(!isActive);
  };

  const reset = () => {
    setIsActive(false);
    setIsBreak(false);
    setMinutes(25);
    setSeconds(0);
  };

  const startBreak = () => {
    setIsActive(false);
    setIsBreak(true);
    setMinutes(5);
    setSeconds(0);
  };

  return (
    <Card className="border-2">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold flex items-center gap-2">
              {isBreak ? (
                <>
                  <Coffee className="h-5 w-5 text-orange-500" />
                  Break Time
                </>
              ) : (
                <>
                  <Brain className="h-5 w-5 text-blue-500" />
                  Study Time
                </>
              )}
            </h3>
            <Badge variant="secondary">Session {sessions + 1}</Badge>
          </div>

          {/* Timer Display */}
          <div
            className={`text-center p-8 rounded-lg ${
              isBreak ? "bg-orange-500/10" : "bg-blue-500/10"
            }`}
          >
            <div className="text-6xl font-bold font-mono">
              {String(minutes).padStart(2, "0")}:
              {String(seconds).padStart(2, "0")}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {isBreak ? "Take a break and relax" : "Focus on your learning"}
            </p>
          </div>

          {/* Controls */}
          <div className="flex gap-2">
            <Button
              onClick={toggle}
              className="flex-1 gap-2"
              variant={isActive ? "outline" : "default"}
            >
              {isActive ? (
                <>
                  <Pause className="h-4 w-4" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  Start
                </>
              )}
            </Button>
            <Button onClick={reset} variant="outline" size="icon">
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>

          {!isBreak && !isActive && (
            <Button
              onClick={startBreak}
              variant="outline"
              className="w-full gap-2"
            >
              <Coffee className="h-4 w-4" />
              Start Break
            </Button>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div className="text-center">
              <p className="text-2xl font-bold">{sessions}</p>
              <p className="text-xs text-muted-foreground">Sessions Today</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{sessions * 25}</p>
              <p className="text-xs text-muted-foreground">Minutes Focused</p>
            </div>
          </div>
        </div>

        {/* Hidden audio element */}
        <audio ref={audioRef} src="/notification.mp3" preload="auto" />
      </CardContent>
    </Card>
  );
}
