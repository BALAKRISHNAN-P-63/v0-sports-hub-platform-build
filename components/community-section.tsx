import { Button } from "@/components/ui/button"
import Link from "next/link"

export function CommunitySection() {
  return (
    <section id="community" className="py-20 bg-muted/30">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance mb-6">
              Join a Community of Champions
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8 text-pretty">
              Connect with thousands of rural athletes who share your passion and determination. Share your journey,
              learn from others, and build lasting friendships that extend beyond sports.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-primary"></div>
                <span className="text-foreground">Weekly virtual training sessions</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-primary"></div>
                <span className="text-foreground">Peer-to-peer mentorship programs</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-primary"></div>
                <span className="text-foreground">Regional meetups and competitions</span>
              </div>
            </div>

            <Button size="lg" variant="outline" asChild>
              <Link href="/auth/sign-up">Join the Community</Link>
            </Button>
          </div>

          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <img src="/rural-athlete-training-basketball.jpg" alt="Rural athlete training" className="rounded-lg shadow-lg" />
              <img src="/young-soccer-player-practicing.jpg" alt="Soccer training" className="rounded-lg shadow-lg mt-8" />
              <img src="/track-and-field-athlete-running.jpg" alt="Track athlete" className="rounded-lg shadow-lg -mt-8" />
              <img src="/tennis-player-serving.jpg" alt="Tennis training" className="rounded-lg shadow-lg" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
