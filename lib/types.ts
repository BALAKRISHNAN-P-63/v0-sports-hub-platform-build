export interface Profile {
  id: string
  email: string
  full_name?: string
  sport?: string
  position?: string
  age?: number
  location?: string
  bio?: string
  profile_image_url?: string
  created_at: string
  updated_at: string
}

export interface MediaUpload {
  id: string
  user_id: string
  file_name: string
  file_url: string
  file_type: "video" | "image"
  file_size?: number
  upload_date: string
  description?: string
  tags?: string[]
}

export interface Assessment {
  id: string
  user_id: string
  media_id: string
  assessment_type: string
  results: any
  score?: number
  recommendations?: string[]
  created_at: string
}

export interface Challenge {
  id: string
  title: string
  description: string
  sport: string
  difficulty_level: "beginner" | "intermediate" | "advanced"
  requirements: string[]
  reward_points: number
  created_at: string
  expires_at?: string
}

export interface UserChallenge {
  id: string
  user_id: string
  challenge_id: string
  status: "active" | "completed" | "failed"
  submission_media_id?: string
  completed_at?: string
  points_earned: number
  created_at: string
  challenge?: Challenge
}
