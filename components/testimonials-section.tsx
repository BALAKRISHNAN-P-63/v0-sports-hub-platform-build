import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const testimonials = [
  {
    name: "Marcus Johnson",
    sport: "Basketball",
    location: "Rural Texas",
    quote:
      "SportsHub's AI analysis helped me perfect my shooting form. I went from 60% to 85% free throw accuracy in just 3 months!",
    avatar: "/young-basketball-player.jpg",
  },
  {
    name: "Sarah Chen",
    sport: "Track & Field",
    location: "Small Town Oregon",
    quote:
      "The platform connected me with a college scout who offered me a full scholarship. This changed my life completely.",
    avatar: "/young-female-runner.jpg",
  },
  {
    name: "Diego Martinez",
    sport: "Soccer",
    location: "Rural California",
    quote: "The challenges kept me motivated during lockdown. Now I'm playing for my state's youth team!",
    avatar: "/young-soccer-player.jpg",
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-20">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
            Success Stories from Rural Athletes
          </h2>
          <p className="mt-4 text-lg text-muted-foreground text-pretty">
            Real athletes, real results. See how SportsHub is transforming lives across rural communities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-0 shadow-sm">
              <CardContent className="p-6">
                <blockquote className="text-lg leading-relaxed mb-6">"{testimonial.quote}"</blockquote>

                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={testimonial.avatar || "/placeholder.svg"} alt={testimonial.name} />
                    <AvatarFallback>
                      {testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-foreground">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.sport} • {testimonial.location}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
