import OrbitelyLogo from "@/components/Orbitely.png";
import { Instagram, Linkedin, Github, Mail, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <a href="/" className="flex items-center gap-3 mb-6">
              <img 
                src={OrbitelyLogo} 
                alt="Orbitely" 
                className="w-10 h-10 rounded-xl bg-primary-foreground/10 p-1"
              />
              <span className="text-xl font-bold font-display">Orbitely</span>
            </a>
            <p className="text-sm text-primary-foreground/80 leading-relaxed mb-6">
              Professional photo enhancement by expert editors. Transform your images with precision and artistry.
            </p>
            {/* Social Icons */}
            <div className="flex gap-3">
              {[Instagram, Linkedin, Github].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-all duration-300 hover:scale-110"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Services Column */}
          <div>
            <h3 className="font-semibold text-lg mb-6">Services</h3>
            <ul className="space-y-3 text-sm text-primary-foreground/80">
              {[
                { name: "Photo Enhancement", href: "/services" },
                { name: "Background Removal", href: "/services" },
                { name: "Color Correction", href: "/services" },
                { name: "Retouching", href: "/services" },
                { name: "Virtual Staging", href: "/services" },
              ].map((item) => (
                <li key={item.name}>
                  <a 
                    href={item.href} 
                    className="hover:text-primary-foreground hover:translate-x-1 inline-block transition-all duration-200"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="font-semibold text-lg mb-6">Company</h3>
            <ul className="space-y-3 text-sm text-primary-foreground/80">
              {[
                { name: "About Us", href: "/about" },
                { name: "How It Works", href: "/how-it-works" },
                { name: "Contact", href: "/contact" },
                { name: "Blog", href: "/blog" },
                { name: "Careers", href: "/careers" },
              ].map((item) => (
                <li key={item.name}>
                  <a 
                    href={item.href} 
                    className="hover:text-primary-foreground hover:translate-x-1 inline-block transition-all duration-200"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="font-semibold text-lg mb-6">Contact</h3>
            <ul className="space-y-4 text-sm text-primary-foreground/80">
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <a href="mailto:hello@orbitely.com" className="hover:text-primary-foreground transition-colors">
                  hello@orbitely.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <a href="tel:7753072447" className="hover:text-primary-foreground transition-colors">
                  7753072447
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="my-10 border-t border-primary-foreground/20" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-primary-foreground/60">
            © 2025 Orbitely. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-primary-foreground/60">
            <a href="/privacy" className="hover:text-primary-foreground transition-colors">Privacy Policy</a>
            <a href="/terms" className="hover:text-primary-foreground transition-colors">Terms of Service</a>
            <a href="/contact" className="hover:text-primary-foreground transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
