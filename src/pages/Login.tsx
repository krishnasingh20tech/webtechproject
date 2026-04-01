import { CONFIG } from "@/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Camera } from "lucide-react";
import { supabase } from "@/lib/supabase";

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name },
        },
      });

      if (error) {
        alert(error.message);
        setLoading(false);
        return;
      }

      alert("Check your email to confirm signup.");
      setLoading(false);
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        alert(error.message);
        setLoading(false);
        return;
      }

      // Get session token
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const token = session?.access_token;

      // Fetch user role from backend
      const res = await fetch(`${CONFIG.API_BASE_URL}/api/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const profile = await res.json();
      console.log("PROFILE RESPONSE:", profile);
      console.log("ROLE:", profile?.user?.role);

      // Redirect based on role
      if (profile.user.role === "superadmin" || profile.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    }

    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin + "/dashboard",
      },
    });
  };

  return (
    <div className="min-h-screen flex">
      
      {/* Desktop Left Section */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-slate-900 to-slate-800 text-white p-16 flex-col justify-between">
        <div className="flex items-center gap-3 text-xl font-semibold">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Camera className="h-5 w-5 text-white" />
          </div>
          ImageRevive Pro
        </div>

        <div>
          <h1 className="text-4xl font-bold leading-tight mb-6">
            Transform Your Photos Into Masterpieces
          </h1>
          <p className="text-slate-300 text-lg">
            Professional photo enhancement for real estate,
            portraits and commercial projects.
          </p>
        </div>

        <p className="text-sm text-slate-400">
          24–48 hour delivery · Secure uploads · Expert editors
        </p>
      </div>

      {/* Auth Section */}
      <div className="flex w-full lg:w-1/2 items-center justify-center bg-muted/40 px-4 py-8 lg:py-0">
        <div className="w-full max-w-md bg-card lg:shadow-xl rounded-xl lg:rounded-2xl p-6 sm:p-8 lg:border">

          {/* Logo for mobile */}
          <div className="lg:hidden flex items-center justify-center gap-2 mb-6">
            <Camera className="h-6 w-6 text-primary" />
            <span className="font-semibold">ImageRevive Pro</span>
          </div>

          <div className="text-center mb-6">
            <h1 className="text-xl sm:text-2xl font-bold">
              {isSignUp ? "Create Account" : "Welcome Back"}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              {isSignUp
                ? "Start enhancing your photos today"
                : "Log in to your dashboard"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {isSignUp && (
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Full Name
                </label>
                <Input
                  placeholder="John Doe"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            )}

            <div>
              <label className="text-sm font-medium mb-1 block">Email</label>
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">
                Password
              </label>
              <Input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full rounded-full h-11 text-sm font-medium"
            >
              {loading
                ? "Processing..."
                : isSignUp
                ? "Create Account"
                : "Log In"}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-card px-3 text-muted-foreground">
                or
              </span>
            </div>
          </div>

          {/* Google Button */}
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-2 border rounded-full h-11 text-sm font-medium hover:bg-muted transition"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-4 h-4"
            />
            Continue with Google
          </button>

          <p className="text-center text-sm text-muted-foreground mt-6">
            {isSignUp
              ? "Already have an account?"
              : "Don't have an account?"}{" "}
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-primary font-medium hover:underline"
            >
              {isSignUp ? "Log In" : "Sign Up"}
            </button>
          </p>

        </div>
      </div>
    </div>
  );
};

export default Login;