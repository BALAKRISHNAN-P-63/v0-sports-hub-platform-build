import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { FileUploadForm } from "@/components/dashboard/file-upload-form"

export default async function UploadPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  // Fetch user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader user={user} profile={profile} />

      <main className="container py-8">
        <div className="max-w-2xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Upload Media</h1>
            <p className="text-muted-foreground mt-2">
              Upload videos and images for AI analysis, challenges, or your athletic portfolio.
            </p>
          </div>

          <FileUploadForm userId={user.id} />
        </div>
      </main>
    </div>
  )
}
