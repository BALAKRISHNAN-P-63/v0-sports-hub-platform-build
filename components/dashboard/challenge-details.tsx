"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { formatDistanceToNow } from "date-fns"
import { Trophy, Clock, Target, CheckCircle, Upload } from "lucide-react"
import type { Challenge, UserChallenge } from "@/lib/types"

interface ChallengeDetailsProps {
  challenge: Challenge
  userChallenge: UserChallenge | null
  userId: string
}

export function ChallengeDetails({ challenge, userChallenge, userId }: ChallengeDetailsProps) {
  const [isJoining, setIsJoining] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleJoinChallenge = async () => {
    setIsJoining(true)
    try {
      const { error } = await supabase.from("user_challenges").insert({
        user_id: userId,
        challenge_id: challenge.id,
        status: "active",
      })

      if (error) throw error

      router.refresh()
    } catch (error) {
      console.error("Error joining challenge:", error)
    } finally {
      setIsJoining(false)
    }
  }

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

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Back Button */}
      <Button variant="outline" onClick={() => router.back()}>
        ← Back to Challenges
      </Button>

      {/* Challenge Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <CardTitle className="text-3xl">{challenge.title}</CardTitle>
                <Badge className={getDifficultyColor(challenge.difficulty_level)} variant="secondary">
                  {challenge.difficulty_level}
                </Badge>
                {userChallenge && (
                  <Badge className={getStatusColor(userChallenge.status)} variant="secondary">
                    {userChallenge.status}
                  </Badge>
                )}
              </div>
              <CardDescription className="text-lg leading-relaxed">{challenge.description}</CardDescription>
            </div>
          </div>

          <div className="flex items-center space-x-6 text-sm text-muted-foreground mt-4">
            <div className="flex items-center space-x-1">
              <Target className="h-4 w-4" />
              <span>{challenge.sport}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Trophy className="h-4 w-4" />
              <span>{challenge.reward_points} points</span>
            </div>
            {challenge.expires_at && (
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>Expires {formatDistanceToNow(new Date(challenge.expires_at), { addSuffix: true })}</span>
              </div>
            )}
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Challenge Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Requirements */}
          {challenge.requirements && challenge.requirements.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Requirements</CardTitle>
                <CardDescription>What you need to complete this challenge</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {challenge.requirements.map((requirement, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-2" />
                      <span className="text-foreground">{requirement}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Submission Guidelines */}
          <Card>
            <CardHeader>
              <CardTitle>Submission Guidelines</CardTitle>
              <CardDescription>How to submit your challenge entry</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-primary">1</span>
                </div>
                <div>
                  <p className="font-medium">Record your performance</p>
                  <p className="text-sm text-muted-foreground">
                    Capture a clear video of yourself completing the challenge requirements.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-primary">2</span>
                </div>
                <div>
                  <p className="font-medium">Upload your video</p>
                  <p className="text-sm text-muted-foreground">
                    Use the upload button to submit your video for AI analysis and review.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-primary">3</span>
                </div>
                <div>
                  <p className="font-medium">Get your results</p>
                  <p className="text-sm text-muted-foreground">
                    Receive AI-powered feedback and earn points based on your performance.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Panel */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Challenge Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!userChallenge ? (
                <div className="space-y-4">
                  <p className="text-muted-foreground">You haven't joined this challenge yet.</p>
                  <Button onClick={handleJoinChallenge} disabled={isJoining} className="w-full">
                    {isJoining ? "Joining..." : "Join Challenge"}
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="font-medium">Challenge Joined</span>
                  </div>

                  <div className="text-sm text-muted-foreground">
                    <p>Joined {formatDistanceToNow(new Date(userChallenge.created_at), { addSuffix: true })}</p>
                    {userChallenge.status === "completed" && userChallenge.completed_at && (
                      <p>Completed {formatDistanceToNow(new Date(userChallenge.completed_at), { addSuffix: true })}</p>
                    )}
                  </div>

                  {userChallenge.points_earned > 0 && (
                    <div className="flex items-center space-x-2 text-primary">
                      <Trophy className="h-4 w-4" />
                      <span className="font-medium">{userChallenge.points_earned} points earned</span>
                    </div>
                  )}

                  {userChallenge.status === "active" && (
                    <Button asChild className="w-full">
                      <a href="/dashboard/upload">
                        <Upload className="h-4 w-4 mr-2" />
                        Submit Entry
                      </a>
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Challenge Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Challenge Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Difficulty</span>
                <Badge className={getDifficultyColor(challenge.difficulty_level)} variant="secondary">
                  {challenge.difficulty_level}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Reward</span>
                <span className="font-medium">{challenge.reward_points} points</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Sport</span>
                <span className="font-medium">{challenge.sport}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
