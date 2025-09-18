"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Upload, X, Video, ImageIcon, FileText, AlertCircle } from "lucide-react"

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

interface FileUploadFormProps {
  userId: string
}

export function FileUploadForm({ userId }: FileUploadFormProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [formData, setFormData] = useState({
    description: "",
    sport: "",
    tags: [] as string[],
    tagInput: "",
  })
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)

  const router = useRouter()
  const supabase = createClient()

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }, [])

  const handleFileSelect = (file: File) => {
    // Validate file type
    const allowedTypes = ["video/mp4", "video/mov", "video/avi", "image/jpeg", "image/png", "image/gif"]
    if (!allowedTypes.includes(file.type)) {
      setError("Please select a valid video (MP4, MOV, AVI) or image (JPEG, PNG, GIF) file.")
      return
    }

    // Validate file size (50MB max)
    const maxSize = 50 * 1024 * 1024 // 50MB
    if (file.size > maxSize) {
      setError("File size must be less than 50MB.")
      return
    }

    setSelectedFile(file)
    setError(null)
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0])
    }
  }

  const addTag = () => {
    const tag = formData.tagInput.trim()
    if (tag && !formData.tags.includes(tag) && formData.tags.length < 5) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tag],
        tagInput: "",
      }))
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addTag()
    }
  }

  const uploadFile = async () => {
    if (!selectedFile) return null

    const fileExt = selectedFile.name.split(".").pop()
    const fileName = `${userId}/${Date.now()}.${fileExt}`

    // Upload to Supabase Storage (simulated - you would need to set up Supabase Storage)
    // For now, we'll create a mock URL
    const fileUrl = `https://example.com/uploads/${fileName}`

    return { fileName: selectedFile.name, fileUrl, fileSize: selectedFile.size }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedFile) {
      setError("Please select a file to upload.")
      return
    }

    setIsUploading(true)
    setError(null)
    setUploadProgress(0)

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      // Upload file
      const uploadResult = await uploadFile()
      if (!uploadResult) throw new Error("Failed to upload file")

      // Save to database
      const { error: dbError } = await supabase.from("media_uploads").insert({
        user_id: userId,
        file_name: uploadResult.fileName,
        file_url: uploadResult.fileUrl,
        file_type: selectedFile.type.startsWith("video") ? "video" : "image",
        file_size: uploadResult.fileSize,
        description: formData.description || null,
        tags: formData.tags.length > 0 ? formData.tags : null,
      })

      if (dbError) throw dbError

      setUploadProgress(100)

      // Reset form
      setTimeout(() => {
        setSelectedFile(null)
        setFormData({ description: "", sport: "", tags: [], tagInput: "" })
        setUploadProgress(0)
        router.push("/dashboard/media")
      }, 1000)
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to upload file")
      setUploadProgress(0)
    } finally {
      setIsUploading(false)
    }
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("video")) return Video
    if (file.type.startsWith("image")) return ImageIcon
    return FileText
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Media File</CardTitle>
        <CardDescription>
          Upload videos for AI analysis or images for your athletic portfolio. Supported formats: MP4, MOV, AVI, JPEG,
          PNG, GIF.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* File Upload Area */}
          <div className="space-y-2">
            <Label>File Upload</Label>
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive
                  ? "border-primary bg-primary/5"
                  : selectedFile
                    ? "border-green-300 bg-green-50"
                    : "border-muted-foreground/25 hover:border-muted-foreground/50"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {selectedFile ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-center">
                    {(() => {
                      const FileIcon = getFileIcon(selectedFile)
                      return <FileIcon className="h-12 w-12 text-green-600" />
                    })()}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{selectedFile.name}</p>
                    <p className="text-sm text-muted-foreground">{formatFileSize(selectedFile.size)}</p>
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={() => setSelectedFile(null)}>
                    <X className="h-4 w-4 mr-2" />
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <Upload className="h-12 w-12 text-muted-foreground mx-auto" />
                  <div>
                    <p className="text-lg font-medium">Drop your file here, or click to browse</p>
                    <p className="text-sm text-muted-foreground">
                      Videos: MP4, MOV, AVI • Images: JPEG, PNG, GIF • Max 50MB
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="video/*,image/*"
                    onChange={handleFileInputChange}
                    className="hidden"
                    id="file-upload"
                  />
                  <Button type="button" variant="outline" asChild>
                    <label htmlFor="file-upload" className="cursor-pointer">
                      Choose File
                    </label>
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Upload Progress */}
          {isUploading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Describe what this video/image shows, your goals, or any context..."
              rows={3}
            />
          </div>

          {/* Sport Category */}
          <div className="space-y-2">
            <Label htmlFor="sport">Sport Category (Optional)</Label>
            <Select value={formData.sport} onValueChange={(value) => handleInputChange("sport", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select sport category" />
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

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags">Tags (Optional)</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="tags"
                value={formData.tagInput}
                onChange={(e) => handleInputChange("tagInput", e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Add tags (press Enter)"
                disabled={formData.tags.length >= 5}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addTag}
                disabled={!formData.tagInput.trim() || formData.tags.length >= 5}
              >
                Add
              </Button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)} className="ml-1 hover:text-destructive">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
            <p className="text-sm text-muted-foreground">
              Add up to 5 tags to help categorize your media (e.g., "training", "competition", "technique")
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center space-x-2 p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Submit Button */}
          <Button type="submit" disabled={!selectedFile || isUploading} className="w-full" size="lg">
            {isUploading ? (
              <>
                <Upload className="h-4 w-4 mr-2 animate-spin" />
                Uploading... {uploadProgress}%
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Upload File
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
