"use client"

import type React from "react"
import { cn } from "@/lib/utils"

interface Feature {
  title: string
  description: string
}

const features: Feature[] = [
  {
    title: "Velocity",
    description: "Uncompromising quality delivered within strict 24-48 hour windows. Fast turnaround without sacrificing excellence.",
  },
  {
    title: "Discretion",
    description: "Absolute privacy. Your unreleased campaigns are secure with us. Complete confidentiality for all your projects.",
  },
  {
    title: "Artisans",
    description: "A curated team of the industry's finest retouchers, not algorithms. Human expertise meets artistic perfection.",
  },
  {
    title: "Exacting",
    description: "Rigorous quality control ensures perfection upon delivery. Every detail meticulously reviewed and perfected.",
  },
]

export default function FeatureShaderCards() {
  return (
    <section className="py-20 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-light text-foreground mb-6">Why Choose Orbitely</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Professional photo enhancement services that deliver exceptional quality with unmatched speed and discretion
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            // Create gradient backgrounds for each card
            const gradients = [
              "from-primary/20 to-primary/10",
              "from-secondary/20 to-secondary/10", 
              "from-muted/30 to-muted/20",
              "from-card/20 to-card/10"
            ];
            
            const borderColors = [
              "border-primary/30",
              "border-secondary/30",
              "border-muted/40", 
              "border-border/40"
            ];

            return (
              <div key={index} className="relative h-80 group">
                {/* Animated gradient background */}
                <div className={cn(
                  "absolute inset-0 rounded-3xl overflow-hidden",
                  "bg-gradient-to-br",
                  gradients[index % gradients.length]
                )}>
                  {/* Animated overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-background/50" />
                  
                  {/* Subtle animated pattern */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />
                  </div>
                  
                  {/* Bottom-to-top hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/0 via-primary/0 to-primary/0 group-hover:from-primary/20 group-hover:via-primary/10 group-hover:to-primary/0 transition-all duration-700 ease-out" />
                </div>

                {/* Content */}
                <div className={cn(
                  "relative z-10 p-8 rounded-3xl h-full flex flex-col",
                  "bg-background/80 backdrop-blur-sm",
                  "border border-white/20",
                  borderColors[index % borderColors.length],
                  "transition-all duration-300",
                  "group-hover:bg-background/90",
                  "group-hover:shadow-2xl",
                  "group-hover:scale-105"
                )}>
                  <h3 className="text-2xl font-bold mb-6 text-foreground group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>

                  <p className="leading-relaxed flex-grow text-muted-foreground font-medium">
                    {feature.description}
                  </p>

                  <div className="mt-6 flex items-center text-sm font-bold text-primary group-hover:text-primary/80 transition-colors">
                    <span className="mr-2">Learn more</span>
                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
