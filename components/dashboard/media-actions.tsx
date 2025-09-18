"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { MoreHorizontal, Download, Trash2, Eye, Brain } from "lucide-react"
import type { MediaUpload } from "@/lib/types"

interface MediaActionsProps {
  media: MediaUpload
}

export function MediaActions({ media }: MediaActionsProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const { error } = await supabase.from("media_uploads").delete().eq("id", media.id)

      if (error) throw error

      setIsDeleteDialogOpen(false)
      router.refresh()
    } catch (error) {
      console.error("Error deleting media:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleDownload = () => {
    // In a real implementation, you would handle the download
    window.open(media.file_url, "_blank")
  }

  const handleAnalyze = () => {
    // Navigate to AI analysis page
    router.push(`/dashboard/analyze/${media.id}`)
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => window.open(media.file_url, "_blank")}>
            <Eye className="mr-2 h-4 w-4" />
            View
          </DropdownMenuItem>
          {media.file_type === "video" && (
            <DropdownMenuItem onClick={handleAnalyze}>
              <Brain className="mr-2 h-4 w-4" />
              AI Analysis
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            Download
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setIsDeleteDialogOpen(true)}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Media File</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{media.file_name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
