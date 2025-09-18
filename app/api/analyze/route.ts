import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

// Mock AI analysis function - in a real implementation, this would call MediaPipe or other AI services
async function performAIAnalysis(videoUrl: string, analysisType: string) {
  // Simulate AI processing time
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // Mock analysis results based on type
  const baseResults = {
    posture: {
      score: Math.floor(Math.random() * 20) + 75, // 75-95
      keyPoints: [
        { name: "Head Position", score: Math.floor(Math.random() * 20) + 80, status: "good" },
        { name: "Shoulder Alignment", score: Math.floor(Math.random() * 30) + 70, status: "good" },
        { name: "Hip Position", score: Math.floor(Math.random() * 25) + 65, status: "needs_improvement" },
        { name: "Knee Tracking", score: Math.floor(Math.random() * 20) + 80, status: "good" },
        { name: "Foot Placement", score: Math.floor(Math.random() * 25) + 75, status: "good" },
      ],
      recommendations: [
        "Focus on keeping your hips level throughout the movement",
        "Engage your core more to maintain better posture",
        "Consider hip mobility exercises to improve alignment",
      ],
    },
    technique: {
      score: Math.floor(Math.random() * 25) + 70, // 70-95
      keyPoints: [
        { name: "Movement Timing", score: Math.floor(Math.random() * 20) + 80, status: "good" },
        { name: "Range of Motion", score: Math.floor(Math.random() * 30) + 65, status: "needs_improvement" },
        { name: "Balance", score: Math.floor(Math.random() * 25) + 75, status: "good" },
        { name: "Coordination", score: Math.floor(Math.random() * 30) + 70, status: "needs_improvement" },
      ],
      recommendations: [
        "Work on increasing your range of motion through dynamic stretching",
        "Practice balance exercises to improve stability",
        "Focus on slower, controlled movements to improve coordination",
      ],
    },
    performance: {
      score: Math.floor(Math.random() * 20) + 75, // 75-95
      metrics: [
        { name: "Speed", value: `${(Math.random() * 2 + 3).toFixed(1)} m/s`, trend: "up" },
        { name: "Power", value: `${Math.floor(Math.random() * 200 + 750)} W`, trend: "stable" },
        { name: "Efficiency", value: `${Math.floor(Math.random() * 20 + 70)}%`, trend: "up" },
        { name: "Consistency", value: `${Math.floor(Math.random() * 20 + 75)}%`, trend: "down" },
      ],
      insights: [
        "Your speed has improved compared to previous sessions",
        "Power output remains consistent, showing good strength maintenance",
        "Efficiency gains suggest better technique development",
        "Focus on consistency to maximize performance potential",
      ],
    },
  }

  const overallScore = Math.floor(
    (baseResults.posture.score + baseResults.technique.score + baseResults.performance.score) / 3,
  )

  return {
    results: baseResults,
    score: overallScore,
    recommendations: [
      "Focus on hip alignment and core engagement",
      "Increase range of motion through targeted stretching",
      "Practice balance and coordination exercises",
      "Maintain consistent training schedule for better results",
    ],
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { mediaId, analysisType = "comprehensive" } = await request.json()

    if (!mediaId) {
      return NextResponse.json({ error: "Media ID is required" }, { status: 400 })
    }

    // Fetch media file
    const { data: media, error: mediaError } = await supabase
      .from("media_uploads")
      .select("*")
      .eq("id", mediaId)
      .eq("user_id", user.id)
      .single()

    if (mediaError || !media) {
      return NextResponse.json({ error: "Media file not found" }, { status: 404 })
    }

    // Only analyze videos
    if (media.file_type !== "video") {
      return NextResponse.json({ error: "Only video files can be analyzed" }, { status: 400 })
    }

    // Perform AI analysis
    const analysisResult = await performAIAnalysis(media.file_url, analysisType)

    // Save assessment to database
    const { data: assessment, error: assessmentError } = await supabase
      .from("assessments")
      .insert({
        user_id: user.id,
        media_id: mediaId,
        assessment_type: analysisType,
        results: analysisResult.results,
        score: analysisResult.score,
        recommendations: analysisResult.recommendations,
      })
      .select()
      .single()

    if (assessmentError) {
      console.error("Assessment save error:", assessmentError)
      return NextResponse.json({ error: "Failed to save assessment" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      assessment,
    })
  } catch (error) {
    console.error("Analysis error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
