"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { formatDistanceToNow } from "date-fns"
import { Brain, Play, RotateCcw, TrendingUp, Target, AlertTriangle, CheckCircle, Clock, Zap } from "lucide-react"
import type { MediaUpload, Assessment } from "@/lib/types"

interface VideoAnalysisProps {
  media: MediaUpload
  assessments: Assessment[]
  userId: string
}

// Mock AI analysis results for demonstration
const mockAnalysisResults = {
  posture: {
    score: 85,
    keyPoints: [
      { name: "Head Position", score: 90, status: "good" },
      { name: "Shoulder Alignment", score: 82, status: "good" },
      { name: "Hip Position", score: 78, status: "needs_improvement" },
      { name: "Knee Tracking", score: 88, status: "good" },
      { name: "Foot Placement", score: 85, status: "good" },
    ],
    recommendations: [
      "Focus on keeping your hips level throughout the movement",
      "Engage your core more to maintain better posture",
      "Consider hip mobility exercises to improve alignment",
    ],
  },
  technique: {
    score: 78,
    keyPoints: [
      { name: "Movement Timing", score: 85, status: "good" },
      { name: "Range of Motion", score: 72, status: "needs_improvement" },
      { name: "Balance", score: 80, status: "good" },
      { name: "Coordination", score: 75, status: "needs_improvement" },
    ],
    recommendations: [
      "Work on increasing your range of motion through dynamic stretching",
      "Practice balance exercises to improve stability",
      "Focus on slower, controlled movements to improve coordination",
    ],
  },
  performance: {
    score: 82,
    metrics: [
      { name: "Speed", value: "4.2 m/s", trend: "up" },
      { name: "Power", value: "850 W", trend: "stable" },
      { name: "Efficiency", value: "78%", trend: "up" },
      { name: "Consistency", value: "85%", trend: "down" },
    ],
    insights: [
      "Your speed has improved by 8% compared to previous sessions",
      "Power output remains consistent, showing good strength maintenance",
      "Efficiency gains suggest better technique development",
      "Focus on consistency to maximize performance potential",
    ],
  },
}

export function VideoAnalysis({ media, assessments, userId }: VideoAnalysisProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [currentAnalysis, setCurrentAnalysis] = useState<Assessment | null>(
    assessments.length > 0 ? assessments[0] : null,
  )
  const router = useRouter()
  const supabase = createClient()

  const startAnalysis = async () => {
    setIsAnalyzing(true)
    setAnalysisProgress(0)

    // Simulate AI analysis progress
    const progressInterval = setInterval(() => {
      setAnalysisProgress((prev) => {
        if (prev >= 95) {
          clearInterval(progressInterval)
          return 95
        }
        return prev + Math.random() * 15
      })
    }, 500)

    try {
      // Simulate analysis time
      await new Promise((resolve) => setTimeout(resolve, 5000))

      // Save analysis results to database
      const { data, error } = await supabase
        .from("assessments")
        .insert({
          user_id: userId,
          media_id: media.id,
          assessment_type: "comprehensive",
          results: mockAnalysisResults,
          score: 82,
          recommendations: [
            "Focus on hip alignment and core engagement",
            "Increase range of motion through targeted stretching",
            "Practice balance and coordination exercises",
            "Maintain consistent training schedule for better results",
          ],
        })
        .select()
        .single()

      if (error) throw error

      setCurrentAnalysis(data)
      setAnalysisProgress(100)
      router.refresh()
    } catch (error) {
      console.error("Analysis error:", error)
    } finally {
      setIsAnalyzing(false)
      setTimeout(() => setAnalysisProgress(0), 2000)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-green-600"
    if (score >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreBadgeColor = (score: number) => {
    if (score >= 85) return "bg-green-100 text-green-800"
    if (score >= 70) return "bg-yellow-100 text-yellow-800"
    return "bg-red-100 text-red-800"
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "good":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "needs_improvement":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Back Button */}
      <Button variant="outline" onClick={() => router.back()}>
        ← Back to Media
      </Button>

      {/* Video Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-2xl">{media.file_name}</CardTitle>
              <CardDescription className="mt-2">
                {media.description || "AI-powered video analysis for athletic performance improvement"}
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">Video Analysis</Badge>
              {currentAnalysis && (
                <Badge className={getScoreBadgeColor(currentAnalysis.score || 0)} variant="secondary">
                  Score: {currentAnalysis.score || 0}/100
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Video Player */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-0">
              <div className="aspect-video bg-black rounded-lg flex items-center justify-center">
                <div className="text-center text-white">
                  <Play className="h-16 w-16 mx-auto mb-4 opacity-70" />
                  <p className="text-lg">Video Player</p>
                  <p className="text-sm opacity-70">Click to play {media.file_name}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Analysis Results */}
          {currentAnalysis ? (
            <Tabs defaultValue="posture" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="posture">Posture</TabsTrigger>
                <TabsTrigger value="technique">Technique</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
              </TabsList>

              <TabsContent value="posture" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Target className="h-5 w-5" />
                      <span>Posture Analysis</span>
                      <Badge className={getScoreBadgeColor(mockAnalysisResults.posture.score)} variant="secondary">
                        {mockAnalysisResults.posture.score}/100
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {mockAnalysisResults.posture.keyPoints.map((point, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(point.status)}
                          <span className="font-medium">{point.name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Progress value={point.score} className="w-20" />
                          <span className={`text-sm font-medium ${getScoreColor(point.score)}`}>{point.score}%</span>
                        </div>
                      </div>
                    ))}

                    <div className="mt-6">
                      <h4 className="font-medium mb-3">Recommendations</h4>
                      <ul className="space-y-2">
                        {mockAnalysisResults.posture.recommendations.map((rec, index) => (
                          <li key={index} className="flex items-start space-x-2 text-sm">
                            <div className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0 mt-2" />
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="technique" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Zap className="h-5 w-5" />
                      <span>Technique Analysis</span>
                      <Badge className={getScoreBadgeColor(mockAnalysisResults.technique.score)} variant="secondary">
                        {mockAnalysisResults.technique.score}/100
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {mockAnalysisResults.technique.keyPoints.map((point, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(point.status)}
                          <span className="font-medium">{point.name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Progress value={point.score} className="w-20" />
                          <span className={`text-sm font-medium ${getScoreColor(point.score)}`}>{point.score}%</span>
                        </div>
                      </div>
                    ))}

                    <div className="mt-6">
                      <h4 className="font-medium mb-3">Recommendations</h4>
                      <ul className="space-y-2">
                        {mockAnalysisResults.technique.recommendations.map((rec, index) => (
                          <li key={index} className="flex items-start space-x-2 text-sm">
                            <div className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0 mt-2" />
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="performance" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <TrendingUp className="h-5 w-5" />
                      <span>Performance Metrics</span>
                      <Badge className={getScoreBadgeColor(mockAnalysisResults.performance.score)} variant="secondary">
                        {mockAnalysisResults.performance.score}/100
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      {mockAnalysisResults.performance.metrics.map((metric, index) => (
                        <div key={index} className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium">{metric.name}</span>
                            <TrendingUp
                              className={`h-4 w-4 ${
                                metric.trend === "up"
                                  ? "text-green-600"
                                  : metric.trend === "down"
                                    ? "text-red-600"
                                    : "text-gray-600"
                              }`}
                            />
                          </div>
                          <div className="text-lg font-bold">{metric.value}</div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6">
                      <h4 className="font-medium mb-3">Performance Insights</h4>
                      <ul className="space-y-2">
                        {mockAnalysisResults.performance.insights.map((insight, index) => (
                          <li key={index} className="flex items-start space-x-2 text-sm">
                            <div className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0 mt-2" />
                            <span>{insight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Brain className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-medium mb-2">Ready for AI Analysis</h3>
                <p className="text-muted-foreground mb-6">
                  Get detailed insights about your technique, posture, and performance using advanced AI analysis.
                </p>
                <Button onClick={startAnalysis} disabled={isAnalyzing} size="lg">
                  <Brain className="h-5 w-5 mr-2" />
                  {isAnalyzing ? "Analyzing..." : "Start Analysis"}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Analysis Progress */}
          {isAnalyzing && (
            <Card>
              <CardContent className="py-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">AI Analysis in Progress</span>
                    <span className="text-sm text-muted-foreground">{Math.round(analysisProgress)}%</span>
                  </div>
                  <Progress value={analysisProgress} className="w-full" />
                  <p className="text-sm text-muted-foreground">
                    Analyzing video for posture, technique, and performance metrics...
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Analysis History & Actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Analysis Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={startAnalysis}
                disabled={isAnalyzing}
                className="w-full"
                variant={currentAnalysis ? "outline" : "default"}
              >
                <Brain className="h-4 w-4 mr-2" />
                {currentAnalysis ? "Re-analyze" : "Start Analysis"}
              </Button>

              {currentAnalysis && (
                <Button variant="outline" className="w-full bg-transparent">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Compare with Previous
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Analysis History */}
          <Card>
            <CardHeader>
              <CardTitle>Analysis History</CardTitle>
              <CardDescription>Previous AI assessments for this video</CardDescription>
            </CardHeader>
            <CardContent>
              {assessments.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No previous analyses</p>
              ) : (
                <div className="space-y-3">
                  {assessments.slice(0, 5).map((assessment, index) => (
                    <div
                      key={assessment.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        currentAnalysis?.id === assessment.id ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                      }`}
                      onClick={() => setCurrentAnalysis(assessment)}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{assessment.assessment_type}</span>
                        <Badge className={getScoreBadgeColor(assessment.score || 0)} variant="secondary">
                          {assessment.score || 0}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(assessment.created_at), { addSuffix: true })}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* File Info */}
          <Card>
            <CardHeader>
              <CardTitle>File Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">File Type</span>
                <span className="font-medium">{media.file_type}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Upload Date</span>
                <span className="font-medium">
                  {formatDistanceToNow(new Date(media.upload_date), { addSuffix: true })}
                </span>
              </div>
              {media.tags && media.tags.length > 0 && (
                <div>
                  <span className="text-muted-foreground block mb-2">Tags</span>
                  <div className="flex flex-wrap gap-1">
                    {media.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
