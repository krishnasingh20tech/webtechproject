import { useState, useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import OrbitelyLogo from "@/components/Orbitely.png";

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);

  const navigate = useNavigate();
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);

    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      listener.subscription.unsubscribe();
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const initial = user?.email?.charAt(0)?.toUpperCase() || "U";

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? "py-2" : "py-3"
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div
          className={`flex items-center justify-between h-14 sm:h-16 pill-nav px-4 sm:px-6 transition-all duration-300 ${
            scrolled ? "shadow-lg" : ""
          }`}
        >
          <a href="/" className="flex items-center gap-2">
            <img 
              src={OrbitelyLogo} 
              alt="Orbitely" 
              className="w-8 h-8 rounded-lg"
            />
            <span className="text-lg font-bold font-display">
              Orbitely
            </span>
          </a>

          <nav className="hidden md:flex items-center gap-1">
            <a href="/" className="text-sm font-medium hover:bg-muted/60 rounded-full px-4 py-2">Home</a>
            <a href="/services" className="text-sm font-medium hover:bg-muted/60 rounded-full px-4 py-2">Services</a>
            <a href="/how-it-works" className="text-sm font-medium hover:bg-muted/60 rounded-full px-4 py-2">How It Works</a>
            <a href="/about" className="text-sm font-medium hover:bg-muted/60 rounded-full px-4 py-2">About</a>
            <a href="/blog" className="text-sm font-medium hover:bg-muted/60 rounded-full px-4 py-2">Blog</a>
            <a href="/contact" className="text-sm font-medium hover:bg-muted/60 rounded-full px-4 py-2">Contact</a>
          </nav>

          <div className="flex items-center gap-2">
            {!user && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="hidden md:inline-flex rounded-full"
                  onClick={() => navigate("/login")}
                >
                  Log In
                </Button>

                <Button
                  size="sm"
                  className="hidden md:inline-flex gradient-primary rounded-full px-6 border-0"
                  onClick={() => navigate("/login")}
                >
                  Get Started
                </Button>
              </>
            )}

            {user && (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="w-9 h-9 rounded-full bg-muted flex items-center justify-center font-semibold"
                >
                  {initial}
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-card border rounded-lg shadow-lg p-2">
                    <p className="text-sm px-3 py-2 text-muted-foreground">
                      Hi, {user.user_metadata?.full_name || "User"}
                    </p>

                    <button
                      onClick={() => {
                        setProfileOpen(false);
                        navigate("/dashboard");
                      }}
                      className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-muted"
                    >
                      Dashboard
                    </button>

                    <button
                      onClick={logout}
                      className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-muted text-red-500"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}

            <button
              className="md:hidden p-2"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            mobileOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="py-4 px-4 mt-2 glass-card">
            <nav className="flex flex-col gap-2">
              <a href="/" className="text-sm px-4 py-2 rounded-lg hover:bg-muted/60">Home</a>
              <a href="/services" className="text-sm px-4 py-2 rounded-lg hover:bg-muted/60">Services</a>
              <a href="/how-it-works" className="text-sm px-4 py-2 rounded-lg hover:bg-muted/60">How It Works</a>
              <a href="/about" className="text-sm px-4 py-2 rounded-lg hover:bg-muted/60">About</a>
              <a href="/blog" className="text-sm px-4 py-2 rounded-lg hover:bg-muted/60">Blog</a>
              <a href="/contact" className="text-sm px-4 py-2 rounded-lg hover:bg-muted/60">Contact</a>

              {!user && (
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    className="w-full rounded-full"
                    onClick={() => navigate("/login")}
                  >
                    Log In
                  </Button>

                  <Button
                    className="w-full gradient-primary rounded-full border-0"
                    onClick={() => navigate("/login")}
                  >
                    Get Started
                  </Button>
                </div>
              )}

              {user && (
                <div className="flex flex-col gap-2 pt-2">
                  <Button
                    className="w-full rounded-full"
                    onClick={() => navigate("/dashboard")}
                  >
                    Dashboard
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full rounded-full"
                    onClick={logout}
                  >
                    Logout
                  </Button>
                </div>
              )}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;