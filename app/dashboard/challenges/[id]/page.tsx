import { redirect, notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { ChallengeDetails } from "@/components/dashboard/challenge-details"

interface ChallengePageProps {
  params: Promise<{ id: string }>
}

export default async function ChallengePage({ params }: ChallengePageProps) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  // Fetch challenge details
  const { data: challenge, error: challengeError } = await supabase.from("challenges").select("*").eq("id", id).single()

  if (challengeError || !challenge) {
    notFound()
  }

  // Check if user has joined this challenge
  const { data: userChallenge } = await supabase
    .from("user_challenges")
    .select("*")
    .eq("user_id", user.id)
    .eq("challenge_id", id)
    .single()

  // Fetch user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader user={user} profile={profile} />

      <main className="container py-8">
        <ChallengeDetails challenge={challenge} userChallenge={userChallenge} userId={user.id} />
      </main>
    </div>
  )
}
