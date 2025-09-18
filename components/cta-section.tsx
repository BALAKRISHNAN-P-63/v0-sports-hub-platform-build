import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-r from-primary to-secondary">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl text-balance mb-6">
            Ready to Transform Your Athletic Journey?
          </h2>
          <p className="text-xl text-white/90 leading-relaxed mb-10 text-pretty">
            Join thousands of rural athletes who are already using AI-powered analysis to improve their game and connect
            with opportunities.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6" asChild>
              <Link href="/auth/sign-up">
                Start Free Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 border-white text-white hover:bg-white hover:text-primary bg-transparent"
            >
              Schedule Demo
            </Button>
          </div>

          <p className="mt-6 text-sm text-white/70">No credit card required • Free forever plan available</p>
        </div>
      </div>
    </section>
  )
}
