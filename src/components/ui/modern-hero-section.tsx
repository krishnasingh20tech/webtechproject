import React from 'react';
import { cn } from '@/lib/utils'; // Assumes a 'cn' utility for classnames
import { InteractiveImageAccordion } from './interactive-image-accordion';

// Define props for component
interface HeroCollageProps extends React.HTMLAttributes<HTMLDivElement> {
  title: React.ReactNode;
  subtitle: string;
  stats: { value: string; label: string }[];
  images: string[];
}

const HeroCollage = React.forwardRef<HTMLDivElement, HeroCollageProps>(
  ({ className, title, subtitle, stats, ...props }, ref) => {
    return (
      <section
        ref={ref}
        className={cn(
          'relative w-full bg-background font-sans pt-8 pb-20 sm:pt-12 sm:pb-32 overflow-hidden flex items-center',
          className
        )}
        {...props}
      >
        <div className="container mx-auto px-4">
          {/* Interactive Image Accordion */}
          <InteractiveImageAccordion />

          {/* Stats Section */}
          <div className="relative z-10 mt-16">
            <div className="flex flex-col items-center justify-center gap-8 sm:flex-row sm:gap-16">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <p className="text-4xl font-bold tracking-tight text-primary">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }
);

HeroCollage.displayName = 'HeroCollage';

export { HeroCollage };
