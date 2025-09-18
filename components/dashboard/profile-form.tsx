"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Camera, Save } from "lucide-react"
import type { Profile } from "@/lib/types"

const sports = [
  "Basketball",
  "Soccer",
  "Track and Field",
  "Tennis",
  "Baseball",
  "Volleyball",
  "Swimming",
  "Wrestling",
  "Cross Country",
  "Other",
]

const positions = {
  Basketball: ["Point Guard", "Shooting Guard", "Small Forward", "Power Forward", "Center"],
  Soccer: ["Goalkeeper", "Defender", "Midfielder", "Forward", "Winger"],
  "Track and Field": ["Sprinter", "Distance Runner", "Jumper", "Thrower", "Hurdler"],
  Tennis: ["Singles Player", "Doubles Player"],
  Baseball: ["Pitcher", "Catcher", "Infielder", "Outfielder"],
  Volleyball: ["Setter", "Outside Hitter", "Middle Blocker", "Libero", "Opposite"],
  Swimming: ["Freestyle", "Backstroke", "Breaststroke", "Butterfly", "Individual Medley"],
  Wrestling: ["Lightweight", "Middleweight", "Heavyweight"],
  "Cross Country": ["Distance Runner"],
  Other: ["Athlete"],
}

interface ProfileFormProps {
  user: any
  profile: Profile | null
}

export function ProfileForm({ user, profile }: ProfileFormProps) {
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || "",
    sport: profile?.sport || "",
    position: profile?.position || "",
    age: profile?.age?.toString() || "",
    location: profile?.location || "",
    bio: profile?.bio || "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // Reset position when sport changes
    if (field === "sport") {
      setFormData((prev) => ({ ...prev, position: "" }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    try {
      const { error } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          email: user.email,
          full_name: formData.full_name,
          sport: formData.sport,
          position: formData.position,
          age: formData.age ? Number.parseInt(formData.age) : null,
          location: formData.location,
          bio: formData.bio,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)

      if (error) throw error

      setMessage({ type: "success", text: "Profile updated successfully!" })
      router.refresh()
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Failed to update profile",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>Update your profile information and athletic details.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Picture Section */}
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={profile?.profile_image_url || ""} alt={formData.full_name} />
              <AvatarFallback className="text-lg">
                {formData.full_name
                  ? formData.full_name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                  : user.email?.[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <Button type="button" variant="outline" size="sm">
                <Camera className="h-4 w-4 mr-2" />
                Change Photo
              </Button>
              <p className="text-sm text-muted-foreground mt-1">JPG, PNG or GIF. Max size 2MB.</p>
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => handleInputChange("full_name", e.target.value)}
                placeholder="Your full name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                min="13"
                max="30"
                value={formData.age}
                onChange={(e) => handleInputChange("age", e.target.value)}
                placeholder="Your age"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
              placeholder="City, State"
            />
          </div>

          {/* Athletic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sport">Primary Sport</Label>
              <Select value={formData.sport} onValueChange={(value) => handleInputChange("sport", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your sport" />
                </SelectTrigger>
                <SelectContent>
                  {sports.map((sport) => (
                    <SelectItem key={sport} value={sport}>
                      {sport}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="position">Position/Specialty</Label>
              <Select
                value={formData.position}
                onValueChange={(value) => handleInputChange("position", value)}
                disabled={!formData.sport}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select position" />
                </SelectTrigger>
                <SelectContent>
                  {formData.sport &&
                    positions[formData.sport as keyof typeof positions]?.map((position) => (
                      <SelectItem key={position} value={position}>
                        {position}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => handleInputChange("bio", e.target.value)}
              placeholder="Tell us about your athletic journey, goals, and achievements..."
              rows={4}
            />
          </div>

          {message && (
            <div
              className={`p-3 text-sm rounded-md ${
                message.type === "success"
                  ? "text-green-800 bg-green-100 border border-green-200"
                  : "text-red-800 bg-red-100 border border-red-200"
              }`}
            >
              {message.text}
            </div>
          )}

          <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
