import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

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

    const formData = await request.formData()
    const file = formData.get("file") as File
    const description = formData.get("description") as string
    const tags = formData.get("tags") as string

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ["video/mp4", "video/mov", "video/avi", "image/jpeg", "image/png", "image/gif"]
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 })
    }

    // Validate file size (50MB max)
    const maxSize = 50 * 1024 * 1024 // 50MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: "File too large" }, { status: 400 })
    }

    // Generate unique filename
    const fileExt = file.name.split(".").pop()
    const fileName = `${user.id}/${Date.now()}.${fileExt}`

    // In a real implementation, you would upload to Supabase Storage:
    // const { data: uploadData, error: uploadError } = await supabase.storage
    //   .from('media')
    //   .upload(fileName, file)

    // For now, we'll simulate the upload
    const fileUrl = `https://example.com/uploads/${fileName}`

    // Save metadata to database
    const { data, error: dbError } = await supabase
      .from("media_uploads")
      .insert({
        user_id: user.id,
        file_name: file.name,
        file_url: fileUrl,
        file_type: file.type.startsWith("video") ? "video" : "image",
        file_size: file.size,
        description: description || null,
        tags: tags ? JSON.parse(tags) : null,
      })
      .select()
      .single()

    if (dbError) {
      console.error("Database error:", dbError)
      return NextResponse.json({ error: "Failed to save file metadata" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: {
        id: data.id,
        fileName: data.file_name,
        fileUrl: data.file_url,
        fileType: data.file_type,
      },
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
