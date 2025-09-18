import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/server"
import { Trophy, Video, Target, Calendar } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface ProfileStatsProps {
  userId: string
}

export async function ProfileStats({ userId }: ProfileStatsProps) {
  const supabase = await createClient()

  // Fetch user statistics
  const [mediaCount, challengesCount, assessmentsCount, profile] = await Promise.all([
    supabase.from("media_uploads").select("id", { count: "exact" }).eq("user_id", userId),
    supabase.from("user_challenges").select("id", { count: "exact" }).eq("user_id", userId).eq("status", "completed"),
    supabase.from("assessments").select("id", { count: "exact" }).eq("user_id", userId),
    supabase.from("profiles").select("created_at").eq("id", userId).single(),
  ])

  const stats = [
    {
      title: "Videos Uploaded",
      value: mediaCount.count || 0,
      icon: Video,
      color: "text-blue-600",
    },
    {
      title: "Challenges Completed",
      value: challengesCount.count || 0,
      icon: Trophy,
      color: "text-yellow-600",
    },
    {
      title: "AI Assessments",
      value: assessmentsCount.count || 0,
      icon: Target,
      color: "text-green-600",
    },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile Statistics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {stats.map((stat, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg bg-gray-100 ${stat.color}`}>
                  <stat.icon className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium">{stat.title}</span>
              </div>
              <span className="text-lg font-bold">{stat.value}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account Info</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center space-x-3">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Member since</p>
              <p className="text-sm text-muted-foreground">
                {profile?.created_at
                  ? formatDistanceToNow(new Date(profile.created_at), { addSuffix: true })
                  : "Recently"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
