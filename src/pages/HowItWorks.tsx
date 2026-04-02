import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { UserPlus, Upload, CreditCard, Wand2, Download, ArrowRight } from "lucide-react";

const steps = [
  { icon: UserPlus, title: "Sign Up & Log In", desc: "Create your free account in seconds. No credit card required to get started." },
  { icon: Upload, title: "Upload & Instruct", desc: "Upload your photos (JPG, PNG, RAW) and provide specific editing instructions for each image." },
  { icon: CreditCard, title: "Pay Securely", desc: "Choose your service tier and pay securely via Stripe. Per-photo or batch pricing available." },
  { icon: Wand2, title: "Experts Enhance", desc: "Our skilled editors get to work, enhancing your photos with precision and artistry." },
  { icon: Download, title: "Download Results", desc: "Get notified when your enhanced photos are ready. Download from your dashboard anytime." },
];

const HowItWorks = () => {
  return (
    <div className="min-h-screen bg-background text-foreground relative selection:bg-primary selection:text-primary-foreground">
      <div className="relative z-10">
        <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16 animate-slide-up">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold mb-4">How It Works</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Getting your photos professionally enhanced is simple. Follow these five easy steps.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {steps.map((step, i) => (
            <div key={i} className={`flex gap-6 mb-8 last:mb-0 animate-slide-up stagger-${Math.min(i + 1, 5)}`}>
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 gradient-primary rounded-2xl flex items-center justify-center flex-shrink-0">
                  <step.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                {i < steps.length - 1 && <div className="w-0.5 h-full bg-border mt-2" />}
              </div>
              <div className="pb-8">
                <div className="text-xs font-medium text-primary mb-1">Step {i + 1}</div>
                <h3 className="font-display text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a href="/login">
            <Button size="lg" className="gradient-primary rounded-full px-10 border-0 hover:opacity-90 text-base">
              Get Started Now <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </a>
        </div>
      </main>
      <Footer />
      </div>
    </div>
  );
};

export default HowItWorks;
