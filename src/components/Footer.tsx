import { Camera } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border mt-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-2 md:col-span-1">
            <a href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                <Camera className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold font-display">ImageRevive Pro</span>
            </a>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Professional photo enhancement by expert editors. Transform your images with precision and artistry.
            </p>
          </div>
          <div>
            <h3 className="font-display font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/services" className="hover:text-primary transition-colors">Image Enhancement</a></li>
              <li><a href="/services" className="hover:text-primary transition-colors">Object Removal</a></li>
              <li><a href="/services" className="hover:text-primary transition-colors">Virtual Staging</a></li>
              <li><a href="/services" className="hover:text-primary transition-colors">Day-to-Night</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-display font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/about" className="hover:text-primary transition-colors">About Us</a></li>
              <li><a href="/how-it-works" className="hover:text-primary transition-colors">How It Works</a></li>
              <li><a href="/blog" className="hover:text-primary transition-colors">Blog</a></li>
              <li><a href="/contact" className="hover:text-primary transition-colors">Contact</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-display font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="/terms" className="hover:text-primary transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>© 2025 ImageRevive Pro. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
