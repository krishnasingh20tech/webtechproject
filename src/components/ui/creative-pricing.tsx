import { Button } from "@/components/ui/button";
import { Check, Pencil, Star, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface PricingTier {
    name: string;
    icon: React.ReactNode;
    price: number;
    description: string;
    features: string[];
    popular?: boolean;
    color: string;
}

function CreativePricing({
    title = "Professional Photo Enhancement",
    description = "Transform your images with our expert retouching services",
    tiers,
}: {
    title?: string;
    description?: string;
    tiers: PricingTier[];
}) {
    return (
        <div className="w-full max-w-6xl mx-auto px-4">
            <div className="text-center space-y-6 mb-16">
                <div className="relative">
                    <h2 className="text-4xl md:text-5xl font-bold text-foreground">
                        {title}
                    </h2>
                    <div
                        className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-44 h-3 bg-primary/20 
                        rounded-full blur-sm"
                    />
                </div>
                <p className="text-xl text-muted-foreground leading-relaxed">
                    {description}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {tiers.map((tier, index) => (
                    <div
                        key={tier.name}
                        className={cn(
                            "relative group",
                            "transition-all duration-300",
                            index === 0 && "rotate-[-1deg]",
                            index === 1 && "rotate-[1deg]",
                            index === 2 && "rotate-[-2deg]"
                        )}
                    >
                        <div
                            className={cn(
                                "absolute inset-0 bg-card",
                                "border border-border",
                                "rounded-lg shadow-[4px_4px_0px_0px]",
                                "transition-all duration-300",
                                "group-hover:shadow-[8px_8px_0px_0px]",
                                "group-hover:translate-x-[-4px]",
                                "group-hover:translate-y-[-4px]"
                            )}
                        />

                        <div className="relative p-6">
                            {tier.popular && (
                                <div
                                    className="absolute -top-2 -right-2 bg-primary text-card-foreground 
                                    px-3 py-1 rounded-full text-sm font-medium border border-border"
                                >
                                    Popular!
                                </div>
                            )}

                            <div className="mb-6">
                                <div
                                    className={cn(
                                        "w-12 h-12 rounded-full mb-4",
                                        "flex items-center justify-center",
                                        "border border-border",
                                        `text-${tier.color}-500` 
                                    )}
                                >
                                    {tier.icon}
                                </div>
                                <h3 className="text-2xl font-bold text-foreground">
                                    {tier.name}
                                </h3>
                                <p className="text-muted-foreground">
                                    {tier.description}
                                </p>
                            </div>

                            {/* Price */}
                            <div className="mb-6">
                                <span className="text-4xl font-bold text-foreground">
                                    ${tier.price}
                                </span>
                                <span className="text-muted-foreground">
                                    /image
                                </span>
                            </div>

                            <div className="space-y-3 mb-6">
                                {tier.features.map((feature) => (
                                    <div
                                        key={feature}
                                        className="flex items-center gap-3"
                                    >
                                        <div
                                            className="w-5 h-5 rounded-full border border-border 
                                            bg-card flex items-center justify-center"
                                        >
                                            <Check className="w-3 h-3 text-primary" />
                                        </div>
                                        <span className="text-foreground">
                                            {feature}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <Button
                                className={cn(
                                    "w-full h-12 text-lg relative",
                                    "border border-border",
                                    "transition-all duration-300",
                                    "shadow-[4px_4px_0px_0px]",
                                    "hover:shadow-[6px_6px_0px_0px]",
                                    "hover:translate-x-[-2px] hover:translate-y-[-2px]",
                                    tier.popular
                                        ? [
                                              "bg-primary text-card-foreground",
                                              "hover:bg-primary/90",
                                              "active:bg-primary",
                                          ]
                                        : [
                                              "bg-secondary text-secondary-foreground",
                                              "hover:bg-secondary/80",
                                              "active:bg-secondary",
                                          ]
                                )}
                            >
                                Get Started
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}


export { CreativePricing, PricingTier }
