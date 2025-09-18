import { redirect, notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { VideoAnalysis } from "@/components/dashboard/video-analysis"

interface AnalyzePageProps {
  params: Promise<{ id: string }>
}

export default async function AnalyzePage({ params }: AnalyzePageProps) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  // Fetch media file
  const { data: media, error: mediaError } = await supabase
    .from("media_uploads")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single()

  if (mediaError || !media) {
    notFound()
  }

  // Only allow video analysis
  if (media.file_type !== "video") {
    redirect("/dashboard/media")
  }

  // Fetch existing assessments for this media
  const { data: assessments } = await supabase
    .from("assessments")
    .select("*")
    .eq("media_id", id)
    .order("created_at", { ascending: false })

  // Fetch user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader user={user} profile={profile} />

      <main className="container py-8">
        <VideoAnalysis media={media} assessments={assessments || []} userId={user.id} />
      </main>
    </div>
  )
}
