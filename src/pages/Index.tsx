import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import { Button } from "@/components/ui/button";
import {
  Star,
  Clock,
  Shield,
  Zap,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import Stepper, { Step } from "@/components/Stepper";
import whybg from "@/assests/whybg.jpg";
import aboutbg from "@/assests/aboutbg.jpg";
import herobg from "@/assests/heroobg.jpg";

const showcases = [
  {
    before:
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
    after:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
    label: "Interior Enhancement",
  },
  {
    before:
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&q=80",
    after:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=80",
    label: "Editorial Retouching",
  },
  {
    before:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
    after:
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80",
    label: "Commercial Imagery",
  },
];

const testimonials = [
  {
    name: "Sarah Mitchell",
    role: "Creative Director",
    text: "The quality is simply unmatched. Every image returned to us is flawlessly executed, preserving the true essence of our brand.",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
  },
  {
    name: "James Chen",
    role: "Photographer",
    text: "A vital extension to my workflow. Their precision in color grading and retouching has elevated my entire portfolio.",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
  },
  {
    name: "Emily Park",
    role: "Art Buyer",
    text: "Absolute professionalism. They handle massive campaigns with an editorial eye that makes our products shine globally.",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80",
  },
];

const Index = () => {
  const [currentShowcase, setCurrentShowcase] = useState(0);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      <Header />

      <main>
        {/* Luxury Hero */}
        <section className="min-h-screen relative flex items-center justify-center pt-20">
          <div className="absolute inset-0 z-0">
            <img
              src={herobg}
              alt="Hero Background"
              className="w-full h-full object-cover opacity-30 grayscale mix-blend-luminosity"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/80"></div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 flex flex-col items-center text-center">
            <div className="animate-slide-up max-w-4xl mx-auto space-y-8">
              <p className="text-sm tracking-[0.2em] text-white/60 uppercase font-light">
                The Standard in Image Perfection
              </p>
              <h1 className="text-5xl sm:text-7xl lg:text-[6rem] font-display font-normal leading-[1.1] text-white">
                Flawless Imagery.
                <br />
                <span className="italic text-white/70">Elevated Standard.</span>
              </h1>
              <p className="text-lg text-white/50 leading-relaxed max-w-2xl mx-auto font-light">
                Exacting standards for commercial, editorial, and real estate
                photography. Delivered with precision and uncompromising
                quality.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
                <a href="/login">
                  <Button
                    size="lg"
                    className="bg-white text-black hover:bg-gray-200 rounded-none px-12 py-6 text-sm uppercase tracking-wider font-medium"
                  >
                    Begin Project
                  </Button>
                </a>
                <a
                  href="/services"
                  className="text-sm uppercase tracking-wider font-medium text-white/70 hover:text-white transition-colors underline-offset-8 decoration-1 underline"
                >
                  Explore Services
                </a>
              </div>
            </div>

            {/* Minimalist Showcase Below Hero */}
            <div className="w-full mt-32 grid lg:grid-cols-12 gap-12 items-end pb-32">
              <div className="lg:col-span-5 text-left animate-slide-up space-y-6">
                <h2 className="font-display text-4xl leading-tight">
                  Precision at <br />
                  every pixel.
                </h2>
                <p className="text-white/50 font-light max-w-md">
                  Our before-and-after slider demonstrates the subtlety and
                  power of top-tier professional retouching.
                </p>
                <div className="flex gap-4 pt-4">
                  <button
                    onClick={() =>
                      setCurrentShowcase(
                        (prev) =>
                          (prev - 1 + showcases.length) % showcases.length,
                      )
                    }
                    className="p-3 border border-white/20 rounded-none hover:bg-white hover:text-black transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() =>
                      setCurrentShowcase(
                        (prev) => (prev + 1) % showcases.length,
                      )
                    }
                    className="p-3 border border-white/20 rounded-none hover:bg-white hover:text-black transition-colors"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="lg:col-span-7 animate-fade-in delay-200 p-1 border border-white/10 bg-white/5">
                <BeforeAfterSlider
                  beforeImage={showcases[currentShowcase].before}
                  afterImage={showcases[currentShowcase].after}
                  beforeLabel="Original"
                  afterLabel="Retouched"
                />
                <div className="p-4 text-xs tracking-widest uppercase text-white/50 text-right">
                  {showcases[currentShowcase].label}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What We Offer - Luxury Redesign */}
        <section className="py-40 bg-zinc-950 border-t border-white/5 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-20 items-center">
              <div className="lg:w-1/3 space-y-8">
                <p className="text-sm tracking-[0.2em] text-white/40 uppercase font-light">
                  Services
                </p>
                <h2 className="text-5xl font-display font-normal leading-tight">
                  Masterful
                  <br />
                  Enhancement
                </h2>
                <p className="text-white/50 font-light leading-relaxed">
                  We offer discrete, high-end post-production services. No
                  presets. No automated corners cut. Pure craftsmanship.
                </p>
                <ul className="space-y-6 border-t border-white/10 pt-8">
                  {[
                    "Color Grading",
                    "Complex Retouching",
                    "Virtual Staging",
                    "Architectural Correction",
                  ].map((item, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-4 text-sm tracking-wider uppercase"
                    >
                      <span className="w-1.5 h-1.5 bg-white rounded-none"></span>
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="pt-8">
                  <a href="/services">
                    <Button
                      variant="outline"
                      className="rounded-none border-white/20 text-white hover:bg-white hover:text-black px-8 py-6 uppercase tracking-widest text-xs"
                    >
                      View Service Details
                    </Button>
                  </a>
                </div>
              </div>

              <div className="lg:w-2/3 w-full">
                <Stepper
                  initialStep={1}
                  onStepChange={(step: number) => console.log(step)}
                  onFinalStepCompleted={() =>
                    console.log("All steps completed!")
                  }
                  backButtonText="Previous"
                  nextButtonText="Next"
                  stepCircleContainerClassName="bg-zinc-900 border border-white/10 h-[600px] shadow-2xl rounded-none"
                  contentClassName="py-12 px-10 h-[450px] overflow-y-auto custom-scrollbar"
                  footerClassName="pb-10 px-10 border-t border-white/5"
                  renderStepIndicator={undefined}
                >
                  <Step>
                    <div className="text-left">
                      <span className="text-xs tracking-[0.2em] text-white/40 mb-4 block uppercase">
                        01 / Enhancement
                      </span>
                      <h3 className="text-3xl font-display mb-6">
                        Color & Exposure
                      </h3>
                      <p className="text-white/60 font-light mb-10 leading-relaxed text-lg">
                        We don't just brighten. We balance tones, ensure
                        accurate color rendition, and draw the eye exactly where
                        it needs to go.
                      </p>
                      <div className="grid grid-cols-2 gap-px bg-white/10 border border-white/10">
                        <div className="bg-zinc-900 p-6">
                          <p className="text-sm font-medium uppercase tracking-wider mb-2">
                            Editorial
                          </p>
                          <p className="text-xs text-white/40">
                            Mood and narrative focus
                          </p>
                        </div>
                        <div className="bg-zinc-900 p-6">
                          <p className="text-sm font-medium uppercase tracking-wider mb-2">
                            Commercial
                          </p>
                          <p className="text-xs text-white/40">
                            Absolute color accuracy
                          </p>
                        </div>
                      </div>
                    </div>
                  </Step>
                  <Step>
                    <div className="text-left">
                      <span className="text-xs tracking-[0.2em] text-white/40 mb-4 block uppercase">
                        02 / Retouching
                      </span>
                      <h3 className="text-3xl font-display mb-6">
                        Impeccable Cleanup
                      </h3>
                      <p className="text-white/60 font-light mb-10 leading-relaxed text-lg">
                        Distracting elements fade away effortlessly. Skin
                        texture is retained while imperfections vanish.
                        Invisible, flawless work.
                      </p>
                      <div className="grid grid-cols-2 gap-px bg-white/10 border border-white/10">
                        <div className="bg-zinc-900 p-6">
                          <p className="text-sm font-medium uppercase tracking-wider mb-2">
                            Skin & Beauty
                          </p>
                          <p className="text-xs text-white/40">
                            Pore-level mastery
                          </p>
                        </div>
                        <div className="bg-zinc-900 p-6">
                          <p className="text-sm font-medium uppercase tracking-wider mb-2">
                            Architecture
                          </p>
                          <p className="text-xs text-white/40">
                            Cables & mess removal
                          </p>
                        </div>
                      </div>
                    </div>
                  </Step>
                  <Step>
                    <div className="text-left">
                      <span className="text-xs tracking-[0.2em] text-white/40 mb-4 block uppercase">
                        03 / Advanced
                      </span>
                      <h3 className="text-3xl font-display mb-6">
                        Virtual Staging
                      </h3>
                      <p className="text-white/60 font-light mb-10 leading-relaxed text-lg">
                        High-end furnishings rendered perfectly in empty spaces.
                        Using photorealistic 3D models to sell the dream.
                      </p>
                      <div className="grid grid-cols-2 gap-px bg-white/10 border border-white/10">
                        <div className="bg-zinc-900 p-6">
                          <p className="text-sm font-medium uppercase tracking-wider mb-2">
                            Modern
                          </p>
                          <p className="text-xs text-white/40">
                            Sleek, minimalist lines
                          </p>
                        </div>
                        <div className="bg-zinc-900 p-6">
                          <p className="text-sm font-medium uppercase tracking-wider mb-2">
                            Classic
                          </p>
                          <p className="text-xs text-white/40">
                            Warm, inviting luxury
                          </p>
                        </div>
                      </div>
                    </div>
                  </Step>
                </Stepper>
              </div>
            </div>
          </div>
        </section>

        {/* Service Highlights (Minimalist Grid) */}
        <section className="py-32 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 border border-white/10">
              {[
                {
                  icon: Clock,
                  title: "Velocity",
                  desc: "Uncompromising quality delivered within strict 24-48 hour windows.",
                },
                {
                  icon: Shield,
                  title: "Discretion",
                  desc: "Absolute privacy. Your unreleased campaigns are secure with us.",
                },
                {
                  icon: Star,
                  title: "Artisans",
                  desc: "A curated team of the industry's finest retouchers, not algorithms.",
                },
                {
                  icon: Zap,
                  title: "Exacting",
                  desc: "Rigorous quality control ensures perfection upon delivery.",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-black p-12 text-center group hover:bg-zinc-950 transition-colors"
                >
                  <div className="w-12 h-12 flex items-center justify-center mx-auto mb-8 border border-white/10 group-hover:bg-white transition-colors duration-500 rounded-full">
                    <item.icon className="h-4 w-4 text-white group-hover:text-black transition-colors duration-500" />
                  </div>
                  <h3 className="font-display text-xl mb-4 tracking-wide">
                    {item.title}
                  </h3>
                  <p className="text-sm text-white/40 leading-relaxed font-light">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing preview - Luxury Tiered System */}
        <section className="bg-zinc-950 py-32 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <p className="text-sm tracking-[0.2em] text-white/40 uppercase font-light mb-4">
                Investment
              </p>
              <h2 className="text-4xl md:text-5xl font-display">
                Straightforward Pricing
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="border border-white/10 bg-black p-12 flex flex-col">
                <h3 className="uppercase tracking-widest text-xs text-white/50 mb-4">
                  Foundation
                </h3>
                <div className="text-5xl font-display font-normal mb-8">
                  $2
                  <span className="text-sm text-white/40 font-sans tracking-normal align-middle">
                    {" "}
                    / image
                  </span>
                </div>
                <ul className="space-y-4 text-sm font-light text-white/70 flex-grow mb-12">
                  <li className="flex items-start gap-3">
                    <span className="text-white">_</span> Commercial Color Grade
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-white">_</span> Perspective Correction
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-white">_</span> Basic Cleansing
                  </li>
                </ul>
                <a href="/login">
                  <Button
                    variant="outline"
                    className="w-full rounded-none border-white/20 uppercase tracking-widest text-xs py-6"
                  >
                    Select
                  </Button>
                </a>
              </div>

              <div className="border border-white bg-white text-black p-12 flex flex-col relative">
                <div className="absolute top-0 right-0 bg-black text-white px-4 py-2 text-[10px] uppercase tracking-widest border-b border-l border-white/10">
                  Signature
                </div>
                <h3 className="uppercase tracking-widest text-xs text-black/50 mb-4">
                  Editorial
                </h3>
                <div className="text-5xl font-display font-normal mb-8">
                  $5
                  <span className="text-sm text-black/40 font-sans tracking-normal align-middle">
                    {" "}
                    / image
                  </span>
                </div>
                <ul className="space-y-4 text-sm font-medium text-black/80 flex-grow mb-12">
                  <li className="flex items-start gap-3">
                    <span className="text-black">-</span> High-end Beauty
                    Retouching
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-black">-</span> Advanced Object
                    Removal
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-black">-</span> Complex Background
                    Swap
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-black">-</span> Priority 24h Queue
                  </li>
                </ul>
                <a href="/login">
                  <Button className="w-full rounded-none bg-black text-white hover:bg-neutral-800 uppercase tracking-widest text-xs py-6">
                    Select
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials - Editorial layout */}
        <section className="py-32 relative text-center border-t border-white/5">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <p className="text-sm tracking-[0.2em] text-white/40 uppercase font-light mb-16">
              Endorsements
            </p>

            <div className="relative">
              <div className="text-2xl md:text-4xl font-display leading-tight italic text-white/90 mb-12">
                "{testimonials[currentTestimonial].text}"
              </div>
              <div className="flex flex-col items-center justify-center">
                <p className="tracking-widest uppercase text-sm mb-1">
                  {testimonials[currentTestimonial].name}
                </p>
                <p className="text-xs text-white/40 uppercase tracking-widest">
                  {testimonials[currentTestimonial].role}
                </p>
              </div>

              <div className="flex justify-center gap-4 mt-16">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentTestimonial(i)}
                    className={`h-px transition-all duration-500 ${i === currentTestimonial ? "bg-white w-12" : "bg-white/20 w-4 hover:w-8 hover:bg-white/50"}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Minimalist */}
        <section className="border-y border-white/10 py-32 bg-white text-black text-center">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-4xl md:text-6xl font-display mb-8">
              Elevate your portfolio.
            </h2>
            <p className="text-black/60 text-lg mb-12 font-light">
              Experience the editorial standard of photo retouching.
            </p>
            <a href="/login">
              <Button
                size="lg"
                className="bg-black text-white hover:bg-neutral-800 rounded-none px-12 py-7 text-sm uppercase tracking-wider font-medium"
              >
                Commence Order
              </Button>
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
