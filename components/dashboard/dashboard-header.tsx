"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { User, Settings, LogOut, Upload, Trophy, Menu } from "lucide-react"
import type { Profile } from "@/lib/types"
import { useState } from "react"

interface DashboardHeaderProps {
  user: any
  profile: Profile | null
}

export function DashboardHeader({ user, profile }: DashboardHeaderProps) {
  const router = useRouter()
  const supabase = createClient()
  const [isOpen, setIsOpen] = useState(false)

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">S</span>
          </div>
          <span className="text-xl font-bold text-foreground">SportsHub</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
            Dashboard
          </Link>
          <Link
            href="/dashboard/challenges"
            className="text-muted-foreground hover:text-foreground transition-colors font-medium"
          >
            Challenges
          </Link>
          <Link
            href="/dashboard/media"
            className="text-muted-foreground hover:text-foreground transition-colors font-medium"
          >
            My Media
          </Link>
          <Link
            href="/dashboard/profile"
            className="text-muted-foreground hover:text-foreground transition-colors font-medium"
          >
            Profile
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex flex-col space-y-6 mt-6">
                <Link
                  href="/dashboard"
                  className="text-lg font-medium hover:text-primary transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  href="/dashboard/challenges"
                  className="text-lg font-medium hover:text-primary transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Challenges
                </Link>
                <Link
                  href="/dashboard/media"
                  className="text-lg font-medium hover:text-primary transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  My Media
                </Link>
                <Link
                  href="/dashboard/profile"
                  className="text-lg font-medium hover:text-primary transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Profile
                </Link>
                <Link
                  href="/dashboard/settings"
                  className="text-lg font-medium hover:text-primary transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Settings
                </Link>
                <div className="flex flex-col space-y-3 pt-6 border-t">
                  <Button variant="outline" size="sm" asChild onClick={() => setIsOpen(false)}>
                    <Link href="/dashboard/upload">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload
                    </Link>
                  </Button>
                  <Button variant="destructive" size="sm" onClick={handleSignOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={profile?.profile_image_url || ""} alt={profile?.full_name || ""} />
                  <AvatarFallback>
                    {profile?.full_name
                      ? profile.full_name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                      : user.email?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{profile?.full_name || "Athlete"}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard/profile">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/challenges">
                  <Trophy className="mr-2 h-4 w-4" />
                  Challenges
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
