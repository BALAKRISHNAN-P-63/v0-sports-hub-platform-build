import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Mail } from "lucide-react"

export default function SignUpSuccessPage() {
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
            <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Mail className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Check Your Email</CardTitle>
            <CardDescription>We've sent you a confirmation link to complete your registration</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              Please check your email and click the confirmation link to activate your SportsHub account. Once
              confirmed, you'll be able to access your dashboard and start your athletic journey.
            </p>

            <div className="space-y-3">
              <Button asChild className="w-full">
                <Link href="/auth/login">Return to Sign In</Link>
              </Button>
              <Button variant="outline" asChild className="w-full bg-transparent">
                <Link href="/">Back to Home</Link>
              </Button>
            </div>

            <p className="text-sm text-muted-foreground">
              Didn't receive the email? Check your spam folder or{" "}
              <Link href="/auth/sign-up" className="text-primary hover:underline">
                try signing up again
              </Link>
              .
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
