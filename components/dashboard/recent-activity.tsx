import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/server"
import { formatDistanceToNow } from "date-fns"
import { Video, Target } from "lucide-react"

interface RecentActivityProps {
  userId: string
}

export async function RecentActivity({ userId }: RecentActivityProps) {
  const supabase = await createClient()

  // Fetch recent media uploads
  const { data: recentMedia } = await supabase
    .from("media_uploads")
    .select("*")
    .eq("user_id", userId)
    .order("upload_date", { ascending: false })
    .limit(5)

  // Fetch recent assessments
  const { data: recentAssessments } = await supabase
    .from("assessments")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(3)

  const activities = [
    ...(recentMedia?.map((media) => ({
      type: "upload",
      title: `Uploaded ${media.file_name}`,
      description: media.description || `${media.file_type} file`,
      timestamp: media.upload_date,
      icon: Video,
    })) || []),
    ...(recentAssessments?.map((assessment) => ({
      type: "assessment",
      title: `AI Assessment Completed`,
      description: `${assessment.assessment_type} analysis - Score: ${assessment.score || "N/A"}`,
      timestamp: assessment.created_at,
      icon: Target,
    })) || []),
  ]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 6)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Your latest uploads and assessments</CardDescription>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No recent activity. Start by uploading your first video!
          </p>
        ) : (
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <activity.icon className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{activity.title}</p>
                  <p className="text-sm text-muted-foreground">{activity.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
