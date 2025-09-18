import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { MediaGallery } from "@/components/dashboard/media-gallery"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Upload } from "lucide-react"

export default async function MediaPage() {
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
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">My Media</h1>
              <p className="text-muted-foreground mt-2">
                Manage your uploaded videos and images for AI analysis and challenges.
              </p>
            </div>
            <Button asChild>
              <Link href="/dashboard/upload">
                <Upload className="h-4 w-4 mr-2" />
                Upload Media
              </Link>
            </Button>
          </div>

          <MediaGallery userId={user.id} />
        </div>
      </main>
    </div>
  )
}
