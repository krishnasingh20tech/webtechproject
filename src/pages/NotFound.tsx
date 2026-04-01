import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex items-center justify-center py-32">
        <div className="text-center animate-slide-up">
          <h1 className="text-7xl font-display font-bold gradient-text mb-4">404</h1>
          <p className="text-xl text-muted-foreground mb-8">Page not found</p>
          <a href="/"><Button className="gradient-primary rounded-full px-8 border-0">Return Home</Button></a>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NotFound;
