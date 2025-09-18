import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/server"
import { Trophy, Video, Target, TrendingUp } from "lucide-react"

interface DashboardStatsProps {
  userId: string
}

export async function DashboardStats({ userId }: DashboardStatsProps) {
  const supabase = await createClient()

  // Fetch user statistics
  const [mediaCount, challengesCount, assessmentsCount] = await Promise.all([
    supabase.from("media_uploads").select("id", { count: "exact" }).eq("user_id", userId),
    supabase.from("user_challenges").select("id", { count: "exact" }).eq("user_id", userId),
    supabase.from("assessments").select("id", { count: "exact" }).eq("user_id", userId),
  ])

  // Calculate improvement score based on recent assessments
  const { data: recentAssessments } = await supabase
    .from("assessments")
    .select("score, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(10)

  let improvementScore = "N/A"
  if (recentAssessments && recentAssessments.length >= 2) {
    const recent = recentAssessments.slice(0, 5)
    const older = recentAssessments.slice(5, 10)

    if (older.length > 0) {
      const recentAvg = recent.reduce((sum, a) => sum + (a.score || 0), 0) / recent.length
      const olderAvg = older.reduce((sum, a) => sum + (a.score || 0), 0) / older.length
      improvementScore = `${Math.round(recentAvg)}%`
    } else {
      const avgScore = recent.reduce((sum, a) => sum + (a.score || 0), 0) / recent.length
      improvementScore = `${Math.round(avgScore)}%`
    }
  }

  const stats = [
    {
      title: "Videos Uploaded",
      value: mediaCount.count || 0,
      icon: Video,
      description: "Total media files",
    },
    {
      title: "Challenges Joined",
      value: challengesCount.count || 0,
      icon: Trophy,
      description: "Active and completed",
    },
    {
      title: "AI Assessments",
      value: assessmentsCount.count || 0,
      icon: Target,
      description: "Performance analyses",
    },
    {
      title: "Performance Score",
      value: improvementScore,
      icon: TrendingUp,
      description: "Based on recent activity",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
