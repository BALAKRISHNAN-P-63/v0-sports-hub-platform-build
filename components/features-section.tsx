import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, Trophy, Users, Video, Target, Zap } from "lucide-react"

const features = [
  {
    icon: Brain,
    title: "AI Video Analysis",
    description:
      "Advanced AI analyzes your technique, posture, and performance to provide personalized feedback and improvement recommendations.",
  },
  {
    icon: Trophy,
    title: "Sports Challenges",
    description:
      "Participate in skill-based challenges, compete with peers, and earn recognition for your achievements.",
  },
  {
    icon: Users,
    title: "Connect with Coaches",
    description: "Get discovered by professional coaches and scouts looking for talented athletes in rural areas.",
  },
  {
    icon: Video,
    title: "Performance Tracking",
    description: "Upload videos, track your progress over time, and build a comprehensive athletic portfolio.",
  },
  {
    icon: Target,
    title: "Personalized Training",
    description: "Receive customized training plans based on your sport, skill level, and improvement goals.",
  },
  {
    icon: Zap,
    title: "Instant Feedback",
    description: "Get real-time analysis and feedback on your technique to accelerate your improvement.",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-muted/30">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
            Everything You Need to Excel
          </h2>
          <p className="mt-4 text-lg text-muted-foreground text-pretty">
            Comprehensive tools designed specifically for rural athletes to showcase talent and improve performance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
