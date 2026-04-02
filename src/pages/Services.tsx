import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Sparkles, Eraser, Moon, Home, Palette, Crop, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import c1 from "@/assests/servphoto/c1.jpg";
import c2 from "@/assests/servphoto/c2.avif";
import c3 from "@/assests/servphoto/c3.jpg";
import c4 from "@/assests/servphoto/c4.jpeg";
import c5 from "@/assests/servphoto/c5.jpeg";
import c6 from "@/assests/servphoto/c6.jpeg";

const services = [
  {
    icon: Sparkles,
    title: "Image Enhancement",
    desc: "Professional color correction, exposure adjustment, and sharpening to make every photo look its absolute best.",
    examples: ["Real estate interiors brightened", "Product photos color-corrected", "Landscape photos enhanced"],
    basic: "$2/photo",
    premium: "$5/photo",
    image: c1,
  },
  {
    icon: Eraser,
    title: "Object & Blemish Removal",
    desc: "Remove unwanted objects, power lines, skin blemishes, or distracting elements from your photos seamlessly.",
    examples: ["Remove photobombers", "Clean up skin imperfections", "Eliminate unwanted items"],
    basic: "$2/photo",
    premium: "$5/photo",
    image: c2,
  },
  {
    icon: Moon,
    title: "Day-to-Night Conversion",
    desc: "Transform daytime property photos into stunning twilight or dusk shots that attract more buyers.",
    examples: ["Twilight exterior conversions", "Dramatic sky replacements", "Ambient lighting added"],
    basic: "—",
    premium: "$5/photo",
    image: c3,
  },
  {
    icon: Home,
    title: "Virtual Staging",
    desc: "Furnish empty rooms digitally with modern, stylish furniture to help buyers visualize the space.",
    examples: ["Empty rooms fully staged", "Style-matched furniture", "Multiple room designs"],
    basic: "—",
    premium: "$5/photo",
    image: c4,
  },
  {
    icon: Palette,
    title: "Background Replacement",
    desc: "Swap backgrounds for product shots, portraits, or any image that needs a fresh scene.",
    examples: ["White background for products", "Studio backdrop replacement", "Custom scene placement"],
    basic: "—",
    premium: "$5/photo",
    image: c5,
  },
  {
    icon: Crop,
    title: "Perspective Correction",
    desc: "Fix lens distortion, straighten vertical lines, and correct perspective for architectural photography.",
    examples: ["Vertical line correction", "Lens distortion removal", "Horizon straightening"],
    basic: "$2/photo",
    premium: "$5/photo",
    image: c6,
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
    <div className="min-h-screen bg-background text-foreground relative selection:bg-primary selection:text-primary-foreground">
      <Header />

      <main>

        {/* Services Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 animate-slide-up">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold mb-4">Our Services</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Professional photo editing services tailored to your needs. From simple corrections to complex transformations.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, i) => (
                <div key={i} className={`glass-card overflow-hidden hover:scale-[1.02] transition-all animate-slide-up stagger-${Math.min(i + 1, 6)}`}>
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={service.image} 
                      alt={service.title}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
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
                </div>
              ))}
            </div>

            <div className="text-center mt-16">
              <Button size="lg" onClick={handleStartOrder} className="group">
                Start Your Order
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Services;
