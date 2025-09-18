import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/server"
import { formatDistanceToNow } from "date-fns"
import { Trophy, Clock, Target } from "lucide-react"

interface MyChallengesProps {
  userId: string
}

export async function MyChallenges({ userId }: MyChallengesProps) {
  const supabase = await createClient()

  // Fetch user's challenges with challenge details
  const { data: userChallenges } = await supabase
    .from("user_challenges")
    .select(`
      *,
      challenge:challenges(*)
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(5)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "active":
        return "bg-blue-100 text-blue-800"
      case "failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return Trophy
      case "active":
        return Clock
      case "failed":
        return Target
      default:
        return Clock
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Challenges</CardTitle>
        <CardDescription>Your active and completed challenges</CardDescription>
      </CardHeader>
      <CardContent>
        {!userChallenges || userChallenges.length === 0 ? (
          <div className="text-center py-8">
            <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-medium mb-2">No Challenges Yet</h3>
            <p className="text-sm text-muted-foreground">Join your first challenge to get started!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {userChallenges.map((userChallenge) => {
              const challenge = userChallenge.challenge
              const StatusIcon = getStatusIcon(userChallenge.status)

              return (
                <div key={userChallenge.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground">{challenge?.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{challenge?.sport}</p>
                    </div>
                    <Badge className={getStatusColor(userChallenge.status)} variant="secondary">
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {userChallenge.status}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Joined {formatDistanceToNow(new Date(userChallenge.created_at), { addSuffix: true })}</span>
                    {userChallenge.points_earned > 0 && (
                      <div className="flex items-center space-x-1 text-primary">
                        <Trophy className="h-3 w-3" />
                        <span className="font-medium">{userChallenge.points_earned} pts</span>
                      </div>
                    )}
                  </div>

                  {userChallenge.status === "completed" && userChallenge.completed_at && (
                    <div className="text-sm text-green-600">
                      Completed {formatDistanceToNow(new Date(userChallenge.completed_at), { addSuffix: true })}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
