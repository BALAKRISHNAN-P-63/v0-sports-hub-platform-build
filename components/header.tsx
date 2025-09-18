"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { useState } from "react"

export function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">S</span>
          </div>
          <span className="text-xl font-bold text-foreground">SportsHub</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
            Features
          </Link>
          <Link href="#community" className="text-muted-foreground hover:text-foreground transition-colors">
            Community
          </Link>
          <Link href="#about" className="text-muted-foreground hover:text-foreground transition-colors">
            About
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
                  href="#features"
                  className="text-lg font-medium hover:text-primary transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Features
                </Link>
                <Link
                  href="#community"
                  className="text-lg font-medium hover:text-primary transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Community
                </Link>
                <Link
                  href="#about"
                  className="text-lg font-medium hover:text-primary transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  About
                </Link>
                <div className="flex flex-col space-y-3 pt-6 border-t">
                  <Button variant="ghost" asChild onClick={() => setIsOpen(false)}>
                    <Link href="/auth/login">Sign In</Link>
                  </Button>
                  <Button asChild onClick={() => setIsOpen(false)}>
                    <Link href="/auth/sign-up">Get Started</Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <Button variant="ghost" asChild>
            <Link href="/auth/login">Sign In</Link>
          </Button>
          <Button asChild>
            <Link href="/auth/sign-up">Get Started</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
