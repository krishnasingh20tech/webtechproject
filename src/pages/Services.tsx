import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Sparkles, Eraser, Moon, Home, Palette, Crop, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import dashboardBg from "@/assests/dashboard_bg.png";

const services = [
  {
    icon: Sparkles,
    title: "Image Enhancement",
    desc: "Professional color correction, exposure adjustment, and sharpening to make every photo look its absolute best.",
    examples: ["Real estate interiors brightened", "Product photos color-corrected", "Landscape photos enhanced"],
    basic: "$2/photo",
    premium: "$5/photo",
  },
  {
    icon: Eraser,
    title: "Object & Blemish Removal",
    desc: "Remove unwanted objects, power lines, skin blemishes, or distracting elements from your photos seamlessly.",
    examples: ["Remove photobombers", "Clean up skin imperfections", "Eliminate unwanted items"],
    basic: "$2/photo",
    premium: "$5/photo",
  },
  {
    icon: Moon,
    title: "Day-to-Night Conversion",
    desc: "Transform daytime property photos into stunning twilight or dusk shots that attract more buyers.",
    examples: ["Twilight exterior conversions", "Dramatic sky replacements", "Ambient lighting added"],
    basic: "—",
    premium: "$5/photo",
  },
  {
    icon: Home,
    title: "Virtual Staging",
    desc: "Furnish empty rooms digitally with modern, stylish furniture to help buyers visualize the space.",
    examples: ["Empty rooms fully staged", "Style-matched furniture", "Multiple room designs"],
    basic: "—",
    premium: "$5/photo",
  },
  {
    icon: Palette,
    title: "Background Replacement",
    desc: "Swap backgrounds for product shots, portraits, or any image that needs a fresh scene.",
    examples: ["White background for products", "Studio backdrop replacement", "Custom scene placement"],
    basic: "—",
    premium: "$5/photo",
  },
  {
    icon: Crop,
    title: "Perspective Correction",
    desc: "Fix lens distortion, straighten vertical lines, and correct perspective for architectural photography.",
    examples: ["Vertical line correction", "Lens distortion removal", "Horizon straightening"],
    basic: "$2/photo",
    premium: "$5/photo",
  },
];

const Services = () => {
  const navigate = useNavigate();

  const handleStartOrder = () => {
    const token = localStorage.getItem("token"); // or whatever you store after login

    if (token) {
      navigate("/dashboard/upload"); 
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative selection:bg-white selection:text-black">
      {/* Ambient background glow & studio image */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <img src={dashboardBg} alt="Background Studio" className="w-full h-full object-cover opacity-60 transform scale-105" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/70 to-black"></div>
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-white/10 blur-[120px] rounded-full mix-blend-screen opacity-20" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-white/10 blur-[150px] rounded-full mix-blend-screen opacity-20" />
      </div>

      <div className="relative z-10">
        <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16 animate-slide-up">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold mb-4">Our Services</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Professional photo editing services tailored to your needs. From simple corrections to complex transformations.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, i) => (
            <div key={i} className={`glass-card p-6 hover:scale-[1.02] transition-all animate-slide-up stagger-${Math.min(i + 1, 6)}`}>
              <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center mb-4">
                <service.icon className="h-5 w-5 text-primary-foreground" />
              </div>
              <h3 className="font-display text-xl font-bold mb-2">{service.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{service.desc}</p>
              <ul className="space-y-1.5 mb-4">
                {service.examples.map((ex, j) => (
                  <li key={j} className="text-sm flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-primary flex-shrink-0" /> {ex}
                  </li>
                ))}
              </ul>
              <div className="flex gap-4 text-sm pt-4 border-t border-border">
                <div><span className="text-muted-foreground">Basic:</span> <span className="font-semibold">{service.basic}</span></div>
                <div><span className="text-muted-foreground">Premium:</span> <span className="font-semibold">{service.premium}</span></div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <Button size="lg" onClick={handleStartOrder} className="group">
            Start Your Order
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </main>
      <Footer />
      </div>
    </div>
  );
};

export default Services;
