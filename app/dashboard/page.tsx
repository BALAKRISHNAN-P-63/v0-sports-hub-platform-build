import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { UpcomingChallenges } from "@/components/dashboard/upcoming-challenges"

export default async function DashboardPage() {
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
          <div>
            <h1 className="text-3xl font-bold text-foreground">Welcome back, {profile?.full_name || user.email}!</h1>
            <p className="text-muted-foreground mt-2">Here's what's happening with your athletic journey.</p>
          </div>

          <DashboardStats userId={user.id} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <RecentActivity userId={user.id} />
            <UpcomingChallenges userId={user.id} />
          </div>
        </div>
      </main>
    </div>
  )
}
