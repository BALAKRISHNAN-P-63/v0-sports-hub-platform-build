import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/server"
import { formatDistanceToNow } from "date-fns"
import { Video, ImageIcon, Play, Download, Trash2 } from "lucide-react"

interface MediaGalleryProps {
  userId: string
}

export async function MediaGallery({ userId }: MediaGalleryProps) {
  const supabase = await createClient()

  // Fetch user's media uploads
  const { data: mediaFiles } = await supabase
    .from("media_uploads")
    .select("*")
    .eq("user_id", userId)
    .order("upload_date", { ascending: false })

  const getFileIcon = (fileType: string) => {
    return fileType === "video" ? Video : ImageIcon
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="space-y-6">
      {!mediaFiles || mediaFiles.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Video className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Media Files</h3>
            <p className="text-muted-foreground mb-4">
              Upload your first video or image to start getting AI-powered analysis.
            </p>
            <Button asChild>
              <a href="/dashboard/upload">Upload Your First File</a>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mediaFiles.map((media) => {
            const FileIcon = getFileIcon(media.file_type)

            return (
              <Card key={media.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="aspect-video bg-muted flex items-center justify-center relative">
                  {media.file_type === "video" ? (
                    <div className="flex items-center justify-center w-full h-full bg-black/5">
                      <Play className="h-12 w-12 text-muted-foreground" />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center w-full h-full">
                      <ImageIcon className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                  <Badge className="absolute top-2 right-2" variant="secondary">
                    {media.file_type}
                  </Badge>
                </div>

                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-medium text-foreground truncate">{media.file_name}</h3>
                      {media.description && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{media.description}</p>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{formatDistanceToNow(new Date(media.upload_date), { addSuffix: true })}</span>
                      {media.file_size && <span>{formatFileSize(media.file_size)}</span>}
                    </div>

                    {media.tags && media.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {media.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {media.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{media.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2">
                      <Button variant="outline" size="sm">
                        <FileIcon className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
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
