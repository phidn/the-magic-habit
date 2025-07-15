import { Badge } from '@mazic/ui'
import { Card } from '@mazic/ui'

export const HeroFeatures = () => {
  const features = [
    {
      title: 'Habit Tracking',
      description: 'Track your daily habits with ease',
      image: '/features/habit-tracking.png',
      color: 'from-[#F596D3] to-[#D247BF]',
    },
    {
      title: 'Progress Visualization',
      description: 'See your progress with beautiful heatmaps',
      image: '/features/heatmap.png',
      color: 'from-[#61DAFB] to-[#03a3d7]',
    },
    {
      title: 'Multi-Criteria Skills',
      description: 'Track complex skills with multiple criteria',
      image: '/features/skills.png',
      color: 'from-[#10b981] to-[#059669]',
    },
    {
      title: 'Daily Check-ins',
      description: 'Quick and easy daily habit completion',
      image: '/features/checkin.png',
      color: 'from-[#f59e0b] to-[#d97706]',
    },
  ]

  return (
    <section className="container py-24 sm:py-32" id="features">
      <div className="text-center space-y-8 mb-16">
        <Badge variant="outline" className="text-sm py-2">
          <span className="mr-2 text-primary">
            <Badge>Features</Badge>
          </span>
          <span>See what makes special</span>
        </Badge>

        <h2 className="text-3xl lg:text-4xl font-bold">
          Powerful Features for{' '}
          <span className="bg-gradient-to-r from-[#F596D3] to-[#D247BF] text-transparent bg-clip-text">
            Habit Building
          </span>
        </h2>

        <p className="max-w-screen-md mx-auto text-xl text-muted-foreground">
          Discover the tools that make building lasting habits effortless and engaging
        </p>
      </div>

      {/* Feature showcase with slice layout */}
      <div className="relative max-w-6xl mx-auto">
        {/* Background gradient glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 blur-3xl rounded-full"></div>

        {/* Feature images in slice layout */}
        <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card
              key={feature.title}
              className={`group relative overflow-hidden transition-all duration-500 hover:scale-105 hover:rotate-1 ${
                index % 2 === 0 ? 'md:mt-8' : 'md:-mt-4'
              }`}
              style={{
                transform: `perspective(1000px) rotateY(${index * 2 - 3}deg) rotateX(${Math.sin(index) * 3}deg)`,
                transformStyle: 'preserve-3d',
              }}
            >
              {/* Feature image placeholder */}
              <div className="aspect-[3/4] relative overflow-hidden bg-gradient-to-br from-muted to-muted/50">
                {/* Gradient overlay */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-20 group-hover:opacity-30 transition-opacity`}
                ></div>

                {/* Mock app interface */}
                <div className="absolute inset-4 bg-background/95 rounded-lg shadow-xl">
                  <div className="p-4 space-y-3">
                    {/* Header */}
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>

                    {/* Content based on feature type */}
                    {index === 0 && (
                      <div className="space-y-2">
                        <div className="h-2 bg-primary/20 rounded"></div>
                        <div className="grid grid-cols-3 gap-1">
                          {[...Array(21)].map((_, i) => (
                            <div
                              key={i}
                              className={`aspect-square rounded-sm ${
                                Math.random() > 0.3 ? 'bg-primary/60' : 'bg-muted'
                              }`}
                            ></div>
                          ))}
                        </div>
                      </div>
                    )}

                    {index === 1 && (
                      <div className="space-y-2">
                        <div className="h-2 bg-blue-500/20 rounded"></div>
                        <div className="grid grid-cols-7 gap-0.5">
                          {[...Array(35)].map((_, i) => (
                            <div
                              key={i}
                              className={`aspect-square rounded-sm ${
                                Math.random() > 0.4 ? 'bg-blue-500/60' : 'bg-muted'
                              }`}
                            ></div>
                          ))}
                        </div>
                      </div>
                    )}

                    {index === 2 && (
                      <div className="space-y-2">
                        <div className="h-2 bg-green-500/20 rounded"></div>
                        {[...Array(4)].map((_, i) => (
                          <div key={i} className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <div className="flex-1 h-1 bg-muted rounded"></div>
                            <div className="w-6 h-1 bg-green-500/60 rounded"></div>
                          </div>
                        ))}
                      </div>
                    )}

                    {index === 3 && (
                      <div className="space-y-2">
                        <div className="h-2 bg-orange-500/20 rounded"></div>
                        {[...Array(3)].map((_, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between p-2 bg-muted/50 rounded"
                          >
                            <div className="w-8 h-1 bg-muted rounded"></div>
                            <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Feature label */}
                <div className="absolute bottom-2 left-2 right-2">
                  <div className="bg-background/90 backdrop-blur-sm rounded-lg p-2 text-center">
                    <h3 className="font-semibold text-sm">{feature.title}</h3>
                    <p className="text-xs text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Floating elements for extra visual interest */}
        <div className="absolute -top-4 left-1/4 w-8 h-8 bg-primary/20 rounded-full blur-sm animate-pulse"></div>
        <div className="absolute top-1/3 -right-4 w-6 h-6 bg-blue-500/20 rounded-full blur-sm animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/6 w-4 h-4 bg-green-500/20 rounded-full blur-sm animate-pulse delay-2000"></div>
      </div>
    </section>
  )
}
