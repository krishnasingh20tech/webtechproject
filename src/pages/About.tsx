import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Users, Globe, Award, Heart } from "lucide-react";

const stats = [
  { value: "50K+", label: "Photos Enhanced" },
  { value: "2,500+", label: "Happy Clients" },
  { value: "98%", label: "Satisfaction Rate" },
  { value: "24hrs", label: "Avg Turnaround" },
];

const About = () => {
  return (
    <div className="min-h-screen bg-background text-foreground relative selection:bg-primary selection:text-primary-foreground">
      <div className="relative z-10">
        <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-3xl mx-auto text-center mb-16 animate-slide-up">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold mb-6">About Orbitely</h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            We're a global team of professional retouchers and photo editors dedicated to helping photographers, businesses, and individuals bring out the best in their images.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, i) => (
            <div key={i} className={`glass-card p-6 text-center animate-slide-up stagger-${i + 1}`}>
              <div className="text-3xl font-display font-bold gradient-text mb-1">{stat.value}</div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div className="animate-slide-up">
            <h2 className="text-3xl font-display font-bold mb-4">Our Mission</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              At Orbitely, we believe every photo tells a story. Our mission is to help you tell that story in the most compelling way possible, with professional-grade enhancements that elevate your visual content.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Whether you're a real estate agent looking to showcase properties, a photographer refining portraits, or a business needing polished product images—we have the expertise to deliver exceptional results.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Globe, title: "Global Team", desc: "Editors across multiple time zones for faster delivery" },
              { icon: Award, title: "Quality Guarantee", desc: "100% satisfaction or your money back" },
              { icon: Users, title: "Dedicated Support", desc: "Personal account manager for business clients" },
              { icon: Heart, title: "Passion-Driven", desc: "We love what we do and it shows in every edit" },
            ].map((item, i) => (
              <div key={i} className="glass-card p-5">
                <item.icon className="h-5 w-5 text-primary mb-2" />
                <h3 className="font-display font-semibold text-sm mb-1">{item.title}</h3>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
      </div>
    </div>
  );
};

export default About;
