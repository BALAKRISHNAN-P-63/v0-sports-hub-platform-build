import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { createClient } from "@/lib/supabase/server"
import { Brain, TrendingUp, Target } from "lucide-react"

interface AIInsightsCardProps {
  userId: string
}

export async function AIInsightsCard({ userId }: AIInsightsCardProps) {
  const supabase = await createClient()

  // Fetch recent assessments
  const { data: recentAssessments } = await supabase
    .from("assessments")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(5)

  if (!recentAssessments || recentAssessments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5" />
            <span>AI Insights</span>
          </CardTitle>
          <CardDescription>Get AI-powered analysis of your performance</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Upload a video to get your first AI analysis</p>
        </CardContent>
      </Card>
    )
  }

  // Calculate average score
  const averageScore = Math.round(
    recentAssessments.reduce((sum, assessment) => sum + (assessment.score || 0), 0) / recentAssessments.length,
  )

  // Get latest assessment
  const latestAssessment = recentAssessments[0]

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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Brain className="h-5 w-5" />
          <span>AI Insights</span>
        </CardTitle>
        <CardDescription>Your latest performance analysis</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Average Score</p>
            <p className={`text-2xl font-bold ${getScoreColor(averageScore)}`}>{averageScore}/100</p>
          </div>
          <Badge className={getScoreBadgeColor(averageScore)} variant="secondary">
            {recentAssessments.length} analyses
          </Badge>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Overall Progress</span>
            <span className={getScoreColor(averageScore)}>{averageScore}%</span>
          </div>
          <Progress value={averageScore} className="w-full" />
        </div>

        {latestAssessment.recommendations && latestAssessment.recommendations.length > 0 && (
          <div>
            <p className="text-sm font-medium mb-2">Latest Recommendations</p>
            <ul className="space-y-1">
              {latestAssessment.recommendations.slice(0, 2).map((rec, index) => (
                <li key={index} className="flex items-start space-x-2 text-sm text-muted-foreground">
                  <Target className="h-3 w-3 flex-shrink-0 mt-0.5" />
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Trend</span>
          <div className="flex items-center space-x-1">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <span className="text-green-600">Improving</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
