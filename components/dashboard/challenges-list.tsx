import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/server"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"
import { Trophy, Clock, Users } from "lucide-react"

interface ChallengesListProps {
  userId: string
}

export async function ChallengesList({ userId }: ChallengesListProps) {
  const supabase = await createClient()

  // Fetch all active challenges
  const { data: challenges } = await supabase
    .from("challenges")
    .select("*")
    .gt("expires_at", new Date().toISOString())
    .order("created_at", { ascending: false })

  // Check which challenges user has already joined
  const { data: userChallenges } = await supabase.from("user_challenges").select("challenge_id").eq("user_id", userId)

  const joinedChallengeIds = new Set(userChallenges?.map((uc) => uc.challenge_id) || [])

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Available Challenges</h2>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>{challenges?.length || 0} active challenges</span>
        </div>
      </div>

      {!challenges || challenges.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Active Challenges</h3>
            <p className="text-muted-foreground">Check back soon for new challenges to test your skills!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {challenges.map((challenge) => {
            const isJoined = joinedChallengeIds.has(challenge.id)

            return (
              <Card key={challenge.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl">{challenge.title}</CardTitle>
                      <CardDescription className="mt-2 text-base leading-relaxed">
                        {challenge.description}
                      </CardDescription>
                    </div>
                    <Badge className={getDifficultyColor(challenge.difficulty_level)} variant="secondary">
                      {challenge.difficulty_level}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-4 text-muted-foreground">
                        <span className="font-medium text-foreground">{challenge.sport}</span>
                        <span>•</span>
                        <div className="flex items-center space-x-1">
                          <Trophy className="h-4 w-4" />
                          <span>{challenge.reward_points} points</span>
                        </div>
                        {challenge.expires_at && (
                          <>
                            <span>•</span>
                            <div className="flex items-center space-x-1">
                              <Clock className="h-4 w-4" />
                              <span>
                                Expires {formatDistanceToNow(new Date(challenge.expires_at), { addSuffix: true })}
                              </span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {challenge.requirements && challenge.requirements.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium mb-2">Requirements:</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {challenge.requirements.map((req, index) => (
                            <li key={index} className="flex items-center space-x-2">
                              <div className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                              <span>{req}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2">
                      <div className="text-sm text-muted-foreground">
                        {isJoined ? (
                          <span className="text-green-600 font-medium">✓ Already joined</span>
                        ) : (
                          <span>Ready to take on this challenge?</span>
                        )}
                      </div>
                      <Button asChild disabled={isJoined}>
                        <Link href={`/dashboard/challenges/${challenge.id}`}>
                          {isJoined ? "View Progress" : "Join Challenge"}
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
