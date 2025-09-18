import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Play } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-20 md:py-32">
      <div className="container relative">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl md:text-7xl text-balance">
            Empower Your Game with{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">AI</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground text-pretty">
            Connect with coaches, analyze your performance with AI-powered video analysis, and unlock opportunities that
            transform rural athletes into champions.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="text-lg px-8 py-6" asChild>
              <Link href="/auth/sign-up">
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>

            <Button size="lg" variant="outline" className="text-lg px-8 py-6 bg-transparent">
              <Play className="mr-2 h-5 w-5" />
              Watch Demo
            </Button>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary">10K+</div>
              <div className="text-muted-foreground">Athletes Connected</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">500+</div>
              <div className="text-muted-foreground">Coaches & Scouts</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">95%</div>
              <div className="text-muted-foreground">Improvement Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <img src="/abstract-sports-pattern-background.jpg" alt="" className="h-full w-full object-cover opacity-5" />
      </div>
    </section>
  )
}
