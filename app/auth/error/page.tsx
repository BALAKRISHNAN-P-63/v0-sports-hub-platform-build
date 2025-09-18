import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { AlertCircle } from "lucide-react"

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>
}) {
  const params = await searchParams

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2">
            <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">S</span>
            </div>
            <span className="text-2xl font-bold text-foreground">SportsHub</span>
          </Link>
        </div>

        <Card className="border-0 shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <CardTitle className="text-2xl">Authentication Error</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            {params?.error ? (
              <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
                Error: {params.error}
              </div>
            ) : (
              <p className="text-muted-foreground">An authentication error occurred. Please try again.</p>
            )}

            <div className="space-y-3">
              <Button asChild className="w-full">
                <Link href="/auth/login">Try Again</Link>
              </Button>
              <Button variant="outline" asChild className="w-full bg-transparent">
                <Link href="/">Back to Home</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
