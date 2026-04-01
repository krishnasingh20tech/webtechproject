import { CONFIG } from "@/config";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Upload,
  Download,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  FileImage,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import dashboardBg from "@/assests/dashboard_bg.png";

// Removed mockOrders

const statusConfig = {
  pending: {
    label: "Pending",
    icon: Clock,
    color: "bg-warning/10 text-warning",
  },
  "in-progress": {
    label: "In Progress",
    icon: AlertCircle,
    color: "bg-accent/10 text-accent",
  },
  complete: {
    label: "Complete",
    icon: CheckCircle,
    color: "bg-success/10 text-success",
  },
};

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<"orders" | "upload" | "profile">(
    "orders",
  );
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [filesSelected, setFilesSelected] = useState(false);
  const [fileCount, setFileCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();

  // Backend Integration State (Fetching current user from Supabase)
  const [userEmail, setUserEmail] = useState("Guest");
  const [freeUploadsRemaining, setFreeUploadsRemaining] = useState(5);
  const [totalUploads, setTotalUploads] = useState(0);
  const [calculatedPrice, setCalculatedPrice] = useState(0);
  const [serviceTier, setServiceTier] = useState<"Foundation" | "Signature">("Foundation");
  const [token, setToken] = useState("");
  const [instructions, setInstructions] = useState("");
  const [orders, setOrders] = useState<any[]>([]);

  // Helper: Get Supabase storage URL
  const getFileUrl = (path: string) => {
    return supabase.storage.from("uploads").getPublicUrl(path).data.publicUrl;
  };

  // Fetch quota on load and handle Stripe success redirect
  useEffect(() => {
    const checkAuthAndFetchQuota = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        // Either redirect to login or handle unauthenticated state here.
        console.warn("User not logged into Supabase. JWT logic will fail.");
        return;
      }

      const jwtToken = session.access_token;
      setToken(jwtToken);
      setUserEmail(session.user.email || "No Email");

      // Check if redirected from Stripe success
      const query = new URLSearchParams(window.location.search);
      if (query.get("payment") === "success") {
        setActiveTab("orders");
        // Clear the query params without reloading the page
        window.history.replaceState({}, document.title, window.location.pathname);
        setTimeout(() => alert("Payment successful! Your order is now processing."), 500);
      } else if (query.get("payment") === "cancelled") {
        alert("Payment was cancelled.");
        window.history.replaceState({}, document.title, window.location.pathname);
      }

      try {
        const profileRes = await fetch(`${CONFIG.API_BASE_URL}/api/users/profile`, {
          headers: { Authorization: `Bearer ${jwtToken}` },
        });
        const uploadsRes = await fetch(`${CONFIG.API_BASE_URL}/api/users/my-uploads`, {
          headers: { Authorization: `Bearer ${jwtToken}` },
        });

        if (profileRes.ok) {
          const data = await profileRes.json();
          if (data.user) {
            setFreeUploadsRemaining(data.freeUploadsRemaining);
            setTotalUploads(data.totalUploads);
          }
        }
        if (uploadsRes.ok) {
          const uploadsData = await uploadsRes.json();
          setOrders(uploadsData);
        }
      } catch (err) {
        console.error("Error fetching quota:", err);
      }
    };

    checkAuthAndFetchQuota();
  }, [navigate]);

  useEffect(() => {
    if (!filesSelected) return;
    const count = fileCount;
    const remainingQuota = freeUploadsRemaining;

    if (remainingQuota >= count) {
      setCalculatedPrice(0); // Fully free
    } else {
      const paidPhotosCount = count - remainingQuota;
      const rateMultiplier = serviceTier === "Foundation" ? 2 : 5;
      setCalculatedPrice(paidPhotosCount * rateMultiplier);
    }
  }, [fileCount, freeUploadsRemaining, serviceTier, filesSelected]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFilesSelected(true);
      setFileCount(e.target.files.length);
    }
  };

  const simulateUpload = async () => {
    setUploading(true);
    setUploadProgress(0);

    // Simulate File Read/Progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) return 90; // Wait for backend at 90%
        return prev + 10;
      });
    }, 200);

    try {
      if (!token) throw new Error("Not authenticated to upload");

      const files = fileInputRef.current?.files;
      if (!files || files.length === 0) return;

      const filePaths: string[] = [];

      // 1. Upload each file to Supabase Storage Bucket first
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const filePath = `${userEmail}/${Date.now()}_${file.name}`;

        const { data: uploadData, error } = await supabase.storage
          .from("uploads")
          .upload(filePath, file);

        if (error) {
          console.error("Storage upload error:", error);
          throw error;
        }
        if (uploadData) filePaths.push(uploadData.path);
      }

      // 2. Call backend securely
      if (calculatedPrice > 0) {
        const res = await fetch(`${CONFIG.API_BASE_URL}/api/payment/create-checkout-session`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ amount: calculatedPrice, filePaths, tier: serviceTier, instructions }),
        });
        const data = await res.json();
        
        if (res.ok && data.url) {
          clearInterval(interval);
          setUploadProgress(100);
          window.location.href = data.url; // Redirect to Stripe Checkout
          return;
        } else {
          throw new Error("Failed to create Stripe checkout session");
        }
      } else {
        const res = await fetch(`${CONFIG.API_BASE_URL}/api/uploads`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ filePaths, tier: serviceTier, instructions }),
        });
        const data = await res.json();

        if (res.ok) {
          clearInterval(interval);
          setUploadProgress(100);

          // Update local quota state
          setTotalUploads(data.totalUploads);
          setFreeUploadsRemaining(Math.max(0, 5 - data.totalUploads));

          // Refresh uploads
          fetch(`${CONFIG.API_BASE_URL}/api/users/my-uploads`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then(res => res.json())
          .then(uploadsData => setOrders(uploadsData));

          setTimeout(() => {
            setUploading(false);
            setFilesSelected(false);
            setFileCount(0);
            if (fileInputRef.current) fileInputRef.current.value = "";
          }, 1000);
        } else {
          throw new Error(data.error || "Upload failed");
        }
      }
    } catch (err) {
      console.error(err);
      clearInterval(interval);
      setUploading(false);
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
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 border-b border-white/10 pb-8 gap-6 animate-slide-up">
            <div>
              <p className="text-xs tracking-[0.2em] text-white/40 uppercase font-light mb-3">Client Portal</p>
              <h1 className="text-4xl md:text-5xl font-display font-normal text-white">Dashboard</h1>
            </div>
            <Button
              className="bg-white text-black hover:bg-zinc-200 rounded-none px-8 py-6 text-xs uppercase tracking-widest font-medium transition-colors"
              onClick={() => setActiveTab("upload")}
            >
              <Upload className="h-4 w-4 mr-2" /> New Order
            </Button>
          </div>

          {/* Editorial Tabs */}
          <div className="flex gap-8 mb-12 border-b border-white/5 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            {(["orders", "upload", "profile"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-xs uppercase tracking-[0.15em] transition-all relative ${
                  activeTab === tab
                    ? "text-white font-medium shadow-none"
                    : "text-white/40 hover:text-white/80 shadow-none border-0"
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-white"></span>
                )}
              </button>
            ))}
          </div>

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <div className="space-y-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            {orders.length === 0 && (
              <div className="text-center py-20 border border-white/5 bg-white/5 backdrop-blur-sm relative overflow-hidden">
                <p className="text-white/40 font-light mb-6 tracking-wide">No orders yet.</p>
                <Button variant="outline" onClick={() => setActiveTab("upload")} className="rounded-none border-white/20 text-white bg-transparent hover:bg-white hover:text-black uppercase tracking-widest text-xs px-8 py-6 transition-all duration-500">
                  Commence First Order
                </Button>
              </div>
            )}
            {orders.map((order) => {
              const statusKey = order.status === "assigned" || order.status === "reviewing" ? "in-progress" : order.status;
              const status = statusConfig[statusKey as keyof typeof statusConfig] || statusConfig.pending;
              const StatusIcon = status.icon;
              return (
                <div
                  key={order.id}
                  className="border border-white/10 bg-black/40 backdrop-blur-md p-6 flex flex-col sm:flex-row sm:items-center gap-6 hover:bg-white/5 transition-colors group"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-4 mb-2">
                      <span className="font-display text-xl text-white">
                        Order #{order.id}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-none border ${
                          statusKey === "complete" ? 'border-green-500/30 text-green-400 bg-green-500/10' : 
                          statusKey === "in-progress" ? 'border-amber-500/30 text-amber-400 bg-amber-500/10' : 
                          'border-white/20 text-white/70 bg-white/5'
                        }`}
                      >
                        <StatusIcon className="h-3 w-3" /> {status.label}
                      </span>
                      <Badge variant="outline" className="rounded-none text-xs border-white/20 bg-transparent text-white/60">
                        {order.tier}
                      </Badge>
                    </div>
                    <p className="text-sm text-white/40 font-light tracking-wide">
                      Submitted: {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-3 mt-4 sm:mt-0">
                    {order.status === "complete" && order.edited_file_path && (
                      <a href={getFileUrl(order.edited_file_path)} target="_blank" rel="noreferrer">
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-none border-white/20 bg-transparent text-white hover:bg-white hover:text-black uppercase tracking-widest text-[10px] px-6 py-5 transition-all"
                        >
                          <Download className="h-3.5 w-3.5 mr-2" /> Download
                        </Button>
                      </a>
                    )}
                    {order.status !== "complete" && (
                      <Badge variant="outline" className="rounded-none border-white/10 text-white/40 px-6 py-2 uppercase tracking-widest text-[10px]">
                        Processing
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Upload Tab */}
        {activeTab === "upload" && (
          <div className="max-w-3xl animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="border border-white/10 bg-black/40 backdrop-blur-md p-10">
              <h2 className="font-display text-2xl mb-8 text-white">
                Upload Materials
              </h2>

              <div className="border border-white/10 bg-white/5 hover:bg-white/10 transition-colors duration-500 p-12 text-center mb-10 group cursor-pointer relative overflow-hidden" onClick={() => !filesSelected && !uploading && fileInputRef.current?.click()}>
                <div className="absolute inset-0 bg-gradient-to-t from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                
                <div className="relative z-10 pointer-events-none">
                  <div className="w-16 h-16 border border-white/20 bg-black/50 backdrop-blur-md rounded-none flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
                    <FileImage className="h-6 w-6 text-white/70" />
                  </div>
                  <p className="text-lg font-display mb-2 text-white">Select files for retouching</p>
                  <p className="text-xs text-white/40 tracking-widest uppercase mb-8">High-res JPG, PNG, or RAW up to 50MB</p>
                  
                  <input
                    type="file"
                    className="hidden"
                    ref={fileInputRef}
                    multiple
                    onChange={handleFileSelect}
                    accept="image/jpeg, image/png, image/webp, image/jpg"
                  />

                  {!filesSelected && !uploading && (
                    <Button
                      variant="outline"
                      className="rounded-none border-white/20 bg-black/50 text-white uppercase tracking-widest text-[10px] px-8 py-5 pointer-events-auto shadow-none group-hover:bg-white group-hover:text-black transition-all"
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                    >
                      Browse Files
                    </Button>
                  )}
                </div>

                {filesSelected && !uploading && (
                  <div className="mt-8 flex flex-col items-center gap-6 animate-fade-in relative z-20 pointer-events-auto" onClick={(e) => e.stopPropagation()}>
                    <div className="bg-black/80 border border-white/10 px-6 py-5 rounded-none w-full max-w-sm text-left">
                      <p className="text-xs uppercase tracking-widest text-white/40 mb-4 block">Order Summary</p>
                      <div className="flex justify-between text-sm text-white/70 mb-2">
                        <span>Photos selected:</span>
                        <span className="font-semibold text-white">
                          {fileCount}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm text-white/70 mb-4">
                        <span>Free quota used:</span>
                        <span className="font-semibold text-white">
                          {Math.min(fileCount, freeUploadsRemaining)} (of{" "}
                          {freeUploadsRemaining} remaining)
                        </span>
                      </div>

                      <div className="border-t border-white/10 pt-4 mt-4 flex justify-between items-center text-sm font-medium">
                        <span className="text-white/70">Total Investment:</span>
                        {calculatedPrice === 0 ? (
                          <span className="text-white font-display text-xl tracking-wider">
                            COMPLIMENTARY
                          </span>
                        ) : (
                          <span className="text-white font-display text-xl">
                            ${calculatedPrice.toFixed(2)}
                          </span>
                        )}
                      </div>

                      {calculatedPrice > 0 && (
                        <p className="text-[10px] uppercase tracking-widest text-white/30 mt-4 leading-relaxed font-light">
                          *Free tier exhausted. Standard Rate: ${serviceTier === "Foundation" ? '2' : '5'} per photo.
                        </p>
                      )}
                    </div>

                    <div className="flex gap-4">
                      <Button
                        variant="outline"
                        className="rounded-none border-white/20 bg-transparent text-white hover:bg-white/10 uppercase tracking-widest text-[10px] px-8 py-6"
                        onClick={(e) => {
                          e.stopPropagation();
                          setFilesSelected(false);
                          setFileCount(0);
                          if (fileInputRef.current)
                            fileInputRef.current.value = "";
                        }}
                      >
                        Clear
                      </Button>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          simulateUpload();
                        }}
                        className="rounded-none bg-white text-black hover:bg-zinc-200 uppercase tracking-widest text-[10px] px-8 py-6 transition-colors shadow-none"
                      >
                        {calculatedPrice > 0 ? (
                          <>Pay ${calculatedPrice} & Upload</>
                        ) : (
                          <>Submit Files</>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {uploading && (
                <div className="mb-10 animate-fade-in">
                  <div className="flex justify-between text-xs uppercase tracking-widest text-white/60 mb-3">
                    <span>Transmitting data...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-1 bg-white/10 [&>div]:bg-white rounded-none" />
                </div>
              )}

              <div className="space-y-8 animate-fade-in">
                <div>
                  <label className="text-xs uppercase tracking-widest text-white/50 mb-3 block">
                    Creative Brief
                  </label>
                  <Textarea
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    placeholder="Detail your requirements (e.g., color grade references, specific blemish removal, architectural corrections...)"
                    rows={4}
                    className="rounded-none bg-black/50 border-white/10 text-white placeholder:text-white/20 focus-visible:ring-1 focus-visible:ring-white/30 resize-none font-light p-4"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-widest text-white/50 mb-3 block">
                    Service Standard
                  </label>
                  <div className="grid grid-cols-2 gap-px bg-white/10 border border-white/10">
                    <button 
                      onClick={() => setServiceTier("Foundation")}
                      className={`p-6 text-left relative transition-colors ${serviceTier === "Foundation" ? "bg-white text-black" : "bg-black text-white hover:bg-zinc-900"}`}
                    >
                      <p className={`text-[10px] tracking-widest uppercase mb-2 ${serviceTier === "Foundation" ? "opacity-60" : "text-white/50"}`}>Foundation</p>
                      <p className="font-display text-xl mb-1">$2<span className={`text-sm font-sans tracking-normal ${serviceTier === "Foundation" ? "opacity-60" : "text-white/50"}`}>/photo</span></p>
                      <p className={`text-xs ${serviceTier === "Foundation" ? "opacity-70" : "text-white/50"}`}>
                        48-hour delivery
                      </p>
                    </button>
                    <button 
                      onClick={() => setServiceTier("Signature")}
                      className={`p-6 text-left relative transition-colors ${serviceTier === "Signature" ? "bg-white text-black" : "bg-black text-white hover:bg-zinc-900"}`}
                    >
                      <p className={`text-[10px] tracking-widest uppercase mb-2 ${serviceTier === "Signature" ? "opacity-60" : "text-white/50"}`}>Signature</p>
                      <p className="font-display text-xl mb-1">$5<span className={`text-sm font-sans tracking-normal ${serviceTier === "Signature" ? "opacity-60" : "text-white/50"}`}>/photo</span></p>
                      <p className={`text-xs ${serviceTier === "Signature" ? "opacity-70" : "text-white/50"}`}>
                        24-hour priority
                      </p>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="max-w-2xl animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="border border-white/10 bg-black/40 backdrop-blur-md p-10">
              <div className="flex items-center gap-6 mb-10 pb-10 border-b border-white/5">
                <div className="w-20 h-20 bg-white shadow-none rounded-none flex items-center justify-center">
                  <User className="h-8 w-8 text-black" />
                </div>
                <div>
                  <h2 className="font-display text-3xl text-white mb-1">
                    {userEmail.split("@")[0] || "Guest"}
                  </h2>
                  <p className="text-sm text-white/50 font-light tracking-wide">{userEmail}</p>
                </div>
              </div>
              <div className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs uppercase tracking-widest text-white/50 mb-3 block">
                      Full Name
                    </label>
                    <Input defaultValue="John Doe" className="rounded-none bg-black/50 border-white/10 text-white focus-visible:ring-1 focus-visible:ring-white/30 h-12 px-4" />
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-widest text-white/50 mb-3 block">
                      Email address
                    </label>
                    <Input
                      defaultValue={userEmail}
                      className="rounded-none bg-white/5 border-transparent text-white/40 h-12 px-4 focus-visible:ring-0"
                      disabled
                    />
                  </div>
                </div>
                <div className="pt-2">
                  <label className="text-xs uppercase tracking-widest text-white/50 mb-3 block">
                    Company / Studio (Optional)
                  </label>
                  <Input
                    placeholder="e.g. Acme Productions"
                    className="rounded-none bg-black/50 border-white/10 text-white focus-visible:ring-1 focus-visible:ring-white/30 h-12 px-4 placeholder:text-white/20"
                  />
                </div>
                <div className="pt-6">
                  <Button className="bg-white text-black hover:bg-zinc-200 rounded-none px-8 py-6 text-[10px] uppercase tracking-widest font-medium transition-colors shadow-none">
                    Update Profile
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
