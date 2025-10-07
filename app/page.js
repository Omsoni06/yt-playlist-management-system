"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  BookOpen,
  Play,
  Brain,
  TrendingUp,
  CheckCircle,
  Sparkles,
  ArrowRight,
  Youtube,
  Zap,
  Target,
} from "lucide-react";

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Navbar */}
      <nav className="border-b border-white/10 bg-black/20 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-2">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <span className="font-bold text-2xl text-white">CourseFlow</span>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                onClick={() => router.push("/login")}
                className="text-white hover:bg-white/10"
              >
                Login
              </Button>
              <Button
                onClick={() => router.push("/register")}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-300 text-sm">
            <Sparkles className="h-4 w-4" />
            <span>AI-Powered Learning Platform</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
            Transform YouTube
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
              Into Structured Courses
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Import any YouTube playlist, track your progress, take timestamped
            notes, and let AI generate summaries & quizzes. Learning made
            simple.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button
              size="lg"
              onClick={() => router.push("/register")}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-lg px-8 py-6 gap-2"
            >
              Start Learning Free
              <ArrowRight className="h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => router.push("/login")}
              className="border-white/20 text-white hover:bg-white/10 text-lg px-8 py-6"
            >
              Sign In
            </Button>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap items-center justify-center gap-8 pt-8 text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <span>100% Free</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <span>AI-Powered</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <span>Unlimited Playlists</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Everything You Need to Learn Better
          </h2>
          <p className="text-xl text-slate-300">
            Powerful features designed for serious learners
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Feature 1 */}
          <Card className="bg-white/5 border-white/10 backdrop-blur hover:bg-white/10 transition-all">
            <CardContent className="p-6">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-3 w-fit mb-4">
                <Youtube className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Import Any Playlist
              </h3>
              <p className="text-slate-300">
                Paste any YouTube playlist URL and instantly organize it into a
                structured course
              </p>
            </CardContent>
          </Card>

          {/* Feature 2 */}
          <Card className="bg-white/5 border-white/10 backdrop-blur hover:bg-white/10 transition-all">
            <CardContent className="p-6">
              <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg p-3 w-fit mb-4">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                AI Summaries
              </h3>
              <p className="text-slate-300">
                Get instant AI-powered summaries of video content using Google
                Gemini
              </p>
            </CardContent>
          </Card>

          {/* Feature 3 */}
          <Card className="bg-white/5 border-white/10 backdrop-blur hover:bg-white/10 transition-all">
            <CardContent className="p-6">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg p-3 w-fit mb-4">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Track Progress
              </h3>
              <p className="text-slate-300">
                Automatic progress tracking with resume playback from where you
                left off
              </p>
            </CardContent>
          </Card>

          {/* Feature 4 */}
          <Card className="bg-white/5 border-white/10 backdrop-blur hover:bg-white/10 transition-all">
            <CardContent className="p-6">
              <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-lg p-3 w-fit mb-4">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Timestamped Notes
              </h3>
              <p className="text-slate-300">
                Take notes linked to specific video timestamps for easy
                reference
              </p>
            </CardContent>
          </Card>

          {/* Feature 5 */}
          <Card className="bg-white/5 border-white/10 backdrop-blur hover:bg-white/10 transition-all">
            <CardContent className="p-6">
              <div className="bg-gradient-to-r from-yellow-500 to-orange-600 rounded-lg p-3 w-fit mb-4">
                <Target className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Quiz Generation
              </h3>
              <p className="text-slate-300">
                AI generates quizzes from your notes to test your understanding
              </p>
            </CardContent>
          </Card>

          {/* Feature 6 */}
          <Card className="bg-white/5 border-white/10 backdrop-blur hover:bg-white/10 transition-all">
            <CardContent className="p-6">
              <div className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg p-3 w-fit mb-4">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Flashcards
              </h3>
              <p className="text-slate-300">
                Automatically convert your notes into flashcards for better
                retention
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Get Started in 3 Simple Steps
          </h2>
        </div>

        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8">
          <div className="text-center space-y-4">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-full h-16 w-16 flex items-center justify-center mx-auto text-white text-2xl font-bold">
              1
            </div>
            <h3 className="text-xl font-semibold text-white">
              Import Playlist
            </h3>
            <p className="text-slate-300">
              Copy any YouTube playlist URL and paste it in CourseFlow
            </p>
          </div>

          <div className="text-center space-y-4">
            <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-full h-16 w-16 flex items-center justify-center mx-auto text-white text-2xl font-bold">
              2
            </div>
            <h3 className="text-xl font-semibold text-white">Watch & Learn</h3>
            <p className="text-slate-300">
              Watch videos, take notes, and track your progress automatically
            </p>
          </div>

          <div className="text-center space-y-4">
            <div className="bg-gradient-to-r from-pink-500 to-red-600 rounded-full h-16 w-16 flex items-center justify-center mx-auto text-white text-2xl font-bold">
              3
            </div>
            <h3 className="text-xl font-semibold text-white">Master Skills</h3>
            <p className="text-slate-300">
              Use AI summaries, quizzes, and flashcards to master the content
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Transform Your Learning?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of learners who are already using CourseFlow
          </p>
          <Button
            size="lg"
            onClick={() => router.push("/register")}
            className="bg-white text-blue-600 hover:bg-slate-100 text-lg px-8 py-6 gap-2"
          >
            Get Started Free
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-2">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-white">CourseFlow</span>
            </div>
            <p className="text-slate-400 text-sm">
              © 2025 CourseFlow. Built with ❤️ for learners.
            </p>
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-400 hover:text-white"
              >
                Privacy
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-400 hover:text-white"
              >
                Terms
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
