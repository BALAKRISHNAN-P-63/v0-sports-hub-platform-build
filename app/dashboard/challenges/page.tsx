import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { ChallengesList } from "@/components/dashboard/challenges-list"
import { MyChallenges } from "@/components/dashboard/my-challenges"

export default async function ChallengesPage() {
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
            <h1 className="text-3xl font-bold text-foreground">Challenges</h1>
            <p className="text-muted-foreground mt-2">
              Test your skills, compete with others, and earn points through athletic challenges.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <ChallengesList userId={user.id} />
            </div>
            <div>
              <MyChallenges userId={user.id} />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
