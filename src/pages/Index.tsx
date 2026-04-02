import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import { Button } from "@/components/ui/button";
import { HeroCollage } from "@/components/ui/modern-hero-section";
import ScrollMorphHero from "@/components/ui/scroll-morph-hero";
import FeatureShaderCards from "@/components/ui/feature-shader-cards";
import FeatureCarousel from "@/components/ui/feature-carousel";
import { CreativePricing, PricingTier } from "@/components/ui/creative-pricing";
import { TestimonialsColumn } from "@/components/ui/testimonials-columns";
import {
  CardCurtainReveal,
  CardCurtainRevealBody,
  CardCurtainRevealFooter,
  CardCurtainRevealDescription,
  CardCurtainRevealTitle,
  CardCurtain,
} from "@/components/ui/card-curtain-reveal";
import {
  Star,
  Clock,
  Shield,
  Zap,
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import Stepper, { Step } from "@/components/Stepper";
import whybg from "@/assests/whybg.jpg";
import aboutbg from "@/assests/aboutbg.jpg";
import herobg from "@/assests/heroobg.jpg";
import pic1 from "@/assests/pics/amazing-aerial-shot-singapore-cityscape-with-lots-skyscrapers.jpg";
import pic2 from "@/assests/pics/modern-luxury-home-with-beautiful-landscape.jpg";
import pic3 from "@/assests/pics/modern-luxury-home-with-contemporary-architecture-wood-accents.jpg";
import pic4 from "@/assests/pics/modern-suburban-family-home-with-manicured-lawn.jpg";
import pic5 from "@/assests/pics/mumbai-skyline-skyscrapers-construction.jpg";
import pic6 from "@/assests/pics/road-city.jpg";
import pic7 from "@/assests/pics/view-city-with-buildings-trees.jpg";

const showcases = [
  {
    before:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
    after:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
    label: "Interior Enhancement",
  },
  {
    before:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80",
    after:
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&q=80",
    label: "Virtual Staging",
  },
  {
    before:
      "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800&q=80",
    after:
      "https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=800&q=80",
    label: "Day to Dusk",
  },
];

const testimonials = [
  {
    name: "Sarah Mitchell",
    role: "Real Estate Agent",
    text: "The quality is simply unmatched. Every image returned to us is flawlessly executed, preserving the true essence of our brand.",
    rating: 5,
    avatar: pic1,
  },
  {
    name: "James Chen",
    role: "Property Developer",
    text: "A vital extension to my workflow. Their precision in color grading and retouching has elevated my entire portfolio.",
    rating: 5,
    avatar: pic2,
  },
  {
    name: "Emily Park",
    role: "Real Estate Broker",
    text: "Absolute professionalism. They handle massive campaigns with an editorial eye that makes our properties shine globally.",
    rating: 5,
    avatar: pic3,
  },
];

const Index = () => {
  const [currentShowcase, setCurrentShowcase] = useState(0);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const pricingTiers: PricingTier[] = [
    {
      name: "Basic",
      icon: <Pencil className="w-6 h-6" />,
      price: 2,
      description: "Perfect for occasional photo editing needs",
      color: "blue",
      features: [
        "Commercial Color Grade",
        "Perspective Correction", 
        "Basic Cleansing",
      ],
    },
    {
      name: "Professional",
      icon: <Star className="w-6 h-6" />,
      price: 5,
      description: "Ideal for regular photo enhancement projects",
      color: "primary",
      features: [
        "High-end Beauty Retouching",
        "Advanced Object Removal",
        "Complex Background Swap",
        "Priority 24h Queue",
      ],
      popular: true,
    },
    {
      name: "Enterprise",
      icon: <Sparkles className="w-6 h-6" />,
      price: 10,
      description: "For high-volume professional work",
      color: "purple",
      features: [
        "All Professional Features",
        "Dedicated Account Manager",
        "Custom Color Profiles",
        "API Access",
        "Unlimited Revisions",
      ],
    },
  ];

  // Stats for hero section
  const heroStats = [
    { value: '50K+', label: 'Photos Enhanced' },
    { value: '2,500+', label: 'Happy Clients' },
    { value: '98%', label: 'Satisfaction Rate' },
  ];

  // Images for hero collage - real estate themed
  const heroImages = [
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
    'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80',
    'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800&q=80',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
    'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&q=80',
    'https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=800&q=80',
    'https://images.unsplash.com/photo-1600585154527-7055b6c62c3b?w=800&q=80',
  ];

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      <Header />

      <main>
        {/* Modern Hero Section */}
        <HeroCollage
          title="Flawless Imagery. Elevated Standard."
          subtitle="Exacting standards for commercial, editorial, and real estate photography. Delivered with precision and uncompromising quality."
          stats={heroStats}
          images={heroImages}
        />

        {/* Our Vision Section */}
        <section className="h-[800px] relative">
          <ScrollMorphHero />
        </section>

        {/* Service Highlights - Feature Cards */}
        <FeatureShaderCards />

        {/* Feature Carousel - Our Services */}
        <section className="py-20 px-4 bg-background">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-light text-foreground mb-6">Our Services</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Professional photo enhancement services that deliver exceptional quality with unmatched speed and discretion
              </p>
            </div>
            <FeatureCarousel />
          </div>
        </section>

        {/* Creative Pricing Section */}
        <CreativePricing tiers={pricingTiers} />

        {/* Testimonials Section */}
        <section className="bg-background py-20 relative">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center justify-center max-w-[540px] mx-auto mb-10">
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter text-foreground">
                What our users say
              </h2>
              <p className="text-center mt-5 text-muted-foreground">
                See what our customers have to say about us.
              </p>
            </div>

            <div className="flex justify-center gap-6 mt-10 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-[740px] overflow-hidden">
              <TestimonialsColumn testimonials={[
                {
                  text: "Orbitely transformed our real estate photos completely. The virtual staging looks incredibly realistic and helped us sell properties 40% faster.",
                  image: pic1,
                  name: "Sarah Mitchell",
                  role: "Real Estate Agent",
                },
                {
                  text: "The day to dusk conversion is exceptional. Our property listings now look stunning with beautiful evening sky backgrounds.",
                  image: pic2,
                  name: "James Chen",
                  role: "Property Developer",
                },
                {
                  text: "Working with Orbitely's team has been a game-changer. The virtual staging helps buyers visualize empty spaces instantly.",
                  image: pic3,
                  name: "Emily Rodriguez",
                  role: "Real Estate Broker",
                },
              ]} duration={15} />
              <TestimonialsColumn testimonials={[
                {
                  text: "Fast turnaround without compromising quality. The 24-hour delivery saved us during a tight deadline for listing a new property.",
                  image: pic4,
                  name: "Michael Torres",
                  role: "Property Manager",
                },
                {
                  text: "The architectural correction service is phenomenal. Our property listings look professional and inviting with perfect verticals.",
                  image: pic5,
                  name: "David Park",
                  role: "Real Estate Investor",
                },
                {
                  text: "Their attention to detail is unmatched. Every photo comes back looking magazine-ready and sells properties faster.",
                  image: pic6,
                  name: "Lisa Anderson",
                  role: "Luxury Realtor",
                },
              ]} className="hidden md:block" duration={19} />
              <TestimonialsColumn testimonials={[
                {
                  text: "The background removal service is incredibly precise. Clean edges and perfect results for all our furniture staging needs.",
                  image: pic7,
                  name: "Robert Kim",
                  role: "Home Stager",
                },
                {
                  text: "Outstanding service quality. The team understood exactly what we needed for our high-end property listings.",
                  image: pic1,
                  name: "Anna Schmidt",
                  role: "Real Estate Marketing",
                },
                {
                  text: "Professional, fast, and reliable. Orbitely has become our go-to for all real estate photo enhancement needs.",
                  image: pic2,
                  name: "Jennifer Wu",
                  role: "Broker Associate",
                },
              ]} className="hidden lg:block" duration={17} />
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
};

export default Index;
