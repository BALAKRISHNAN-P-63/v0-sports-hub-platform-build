import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-muted/50 border-t">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">S</span>
              </div>
              <span className="text-xl font-bold text-foreground">SportsHub</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Empowering rural athletes with AI-powered training and opportunities to connect with coaches worldwide.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Platform</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-muted-foreground hover:text-foreground transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/demo" className="text-muted-foreground hover:text-foreground transition-colors">
                  Demo
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Community</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/athletes" className="text-muted-foreground hover:text-foreground transition-colors">
                  Athletes
                </Link>
              </li>
              <li>
                <Link href="/coaches" className="text-muted-foreground hover:text-foreground transition-colors">
                  Coaches
                </Link>
              </li>
              <li>
                <Link href="/success-stories" className="text-muted-foreground hover:text-foreground transition-colors">
                  Success Stories
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/help" className="text-muted-foreground hover:text-foreground transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-12 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 SportsHub. All rights reserved. Built for rural athletes, by athletes.</p>
        </div>
      </div>
    </footer>
  )
}
