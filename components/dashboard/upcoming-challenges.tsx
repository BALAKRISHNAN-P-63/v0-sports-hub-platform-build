import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/server"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"

interface UpcomingChallengesProps {
  userId: string
}

export async function UpcomingChallenges({ userId }: UpcomingChallengesProps) {
  const supabase = await createClient()

  // Fetch upcoming challenges that user hasn't joined
  const { data: challenges } = await supabase
    .from("challenges")
    .select("*")
    .gt("expires_at", new Date().toISOString())
    .order("expires_at", { ascending: true })
    .limit(3)

  // Check which challenges user has already joined
  const { data: userChallenges } = await supabase.from("user_challenges").select("challenge_id").eq("user_id", userId)

  const joinedChallengeIds = new Set(userChallenges?.map((uc) => uc.challenge_id) || [])
  const availableChallenges = challenges?.filter((challenge) => !joinedChallengeIds.has(challenge.id)) || []

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case "beginner":
        return "bg-green-100 text-green-800"
      case "intermediate":
        return "bg-yellow-100 text-yellow-800"
      case "advanced":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Challenges</CardTitle>
        <CardDescription>New challenges to test your skills</CardDescription>
      </CardHeader>
      <CardContent>
        {availableChallenges.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">No new challenges available right now.</p>
            <Button asChild>
              <Link href="/dashboard/challenges">View All Challenges</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {availableChallenges.map((challenge) => (
              <div key={challenge.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">{challenge.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{challenge.description}</p>
                  </div>
                  <Badge className={getDifficultyColor(challenge.difficulty_level)} variant="secondary">
                    {challenge.difficulty_level}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span>{challenge.sport}</span>
                    <span>•</span>
                    <span>{challenge.reward_points} points</span>
                    {challenge.expires_at && (
                      <>
                        <span>•</span>
                        <span>Expires {formatDistanceToNow(new Date(challenge.expires_at), { addSuffix: true })}</span>
                      </>
                    )}
                  </div>
                  <Button size="sm" asChild>
                    <Link href={`/dashboard/challenges/${challenge.id}`}>Join</Link>
                  </Button>
                </div>
              </div>
            ))}

            <div className="text-center pt-4">
              <Button variant="outline" asChild>
                <Link href="/dashboard/challenges">View All Challenges</Link>
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
