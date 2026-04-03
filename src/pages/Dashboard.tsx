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
  ImagePlus,
  CreditCard,
  Package,
  Eye,
  LogOut,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";

const statusConfig = {
  pending: {
    label: "Pending",
    icon: Clock,
    color: "bg-warning/10 text-warning border-warning/20",
  },
  assigned: {
    label: "Assigned",
    icon: Clock,
    color: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  },
  "in-progress": {
    label: "In Progress",
    icon: AlertCircle,
    color: "bg-accent/10 text-accent border-accent/20",
  },
  reviewing: {
    label: "Reviewing",
    icon: Eye,
    color: "bg-orange-500/10 text-orange-600 border-orange-500/20",
  },
  complete: {
    label: "Complete",
    icon: CheckCircle,
    color: "bg-success/10 text-success border-success/20",
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

  // Backend Integration State
  const [userEmail, setUserEmail] = useState("Guest");
  const [userName, setUserName] = useState("");
  const [freeUploadsRemaining, setFreeUploadsRemaining] = useState(5);
  const [totalUploads, setTotalUploads] = useState(0);
  const [calculatedPrice, setCalculatedPrice] = useState(0);
  const [serviceTier, setServiceTier] = useState<"Basic" | "Premium">("Basic");
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
        console.warn("User not logged into Supabase.");
        navigate("/login");
        return;
      }

      const jwtToken = session.access_token;
      setToken(jwtToken);
      setUserEmail(session.user.email || "No Email");
      setUserName(session.user.user_metadata?.full_name || session.user.email?.split("@")[0] || "User");

      // Check if redirected from Stripe success
      const query = new URLSearchParams(window.location.search);
      if (query.get("payment") === "success") {
        setActiveTab("orders");
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
      setCalculatedPrice(0);
    } else {
      const paidPhotosCount = count - remainingQuota;
      const rateMultiplier = serviceTier === "Basic" ? 2 : 5;
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

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) return 90;
        return prev + 10;
      });
    }, 200);

    try {
      if (!token) throw new Error("Not authenticated to upload");

      const files = fileInputRef.current?.files;
      if (!files || files.length === 0) return;

      const filePaths: string[] = [];

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
          window.location.href = data.url;
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

          setTotalUploads(data.totalUploads);
          setFreeUploadsRemaining(Math.max(0, 5 - data.totalUploads));

          fetch(`${CONFIG.API_BASE_URL}/api/users/my-uploads`, {
            headers: { Authorization: `Bearer ${token}` },
          })
            .then(res => res.json())
            .then(uploadsData => setOrders(uploadsData));

          setTimeout(() => {
            setUploading(false);
            setFilesSelected(false);
            setFileCount(0);
            setInstructions("");
            if (fileInputRef.current) fileInputRef.current.value = "";
            setActiveTab("orders");
          }, 1000);
        } else {
          throw new Error(data.error || "Upload failed");
        }
      }
    } catch (err: any) {
      console.error(err);
      alert("Upload failed: " + (err?.message || "Unknown error"));
      clearInterval(interval);
      setUploading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-6 border-b border-border">
          <div>
            <p className="text-xs tracking-widest text-muted-foreground uppercase font-medium mb-1">Client Portal</p>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground">Dashboard</h1>
          </div>
          <div className="flex items-center gap-3 mt-4 sm:mt-0">
            <Button
              className="gradient-primary rounded-full border-0"
              onClick={() => setActiveTab("upload")}
            >
              <Upload className="h-4 w-4 mr-2" /> New Order
            </Button>
            <Button variant="ghost" size="sm" className="rounded-full text-muted-foreground" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-1" /> Logout
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-muted rounded-full p-1 w-fit mb-8">
          {(["orders", "upload", "profile"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all capitalize ${activeTab === tab
                ? "bg-background shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <div className="animate-fade-in">
            {/* Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="glass-card p-5 text-center rounded-xl">
                <Package className="h-5 w-5 text-primary mx-auto mb-2" />
                <div className="text-2xl font-display font-bold text-foreground">{orders.length}</div>
                <p className="text-sm text-muted-foreground">Total Orders</p>
              </div>
              <div className="glass-card p-5 text-center rounded-xl">
                <CreditCard className="h-5 w-5 text-success mx-auto mb-2" />
                <div className="text-2xl font-display font-bold text-success">{freeUploadsRemaining}</div>
                <p className="text-sm text-muted-foreground">Free Credits</p>
              </div>
              <div className="glass-card p-5 text-center rounded-xl">
                <ImagePlus className="h-5 w-5 text-warning mx-auto mb-2" />
                <div className="text-2xl font-display font-bold text-foreground">{totalUploads}</div>
                <p className="text-sm text-muted-foreground">Photos Uploaded</p>
              </div>
              <div className="glass-card p-5 text-center rounded-xl">
                <CheckCircle className="h-5 w-5 text-primary mx-auto mb-2" />
                <div className="text-2xl font-display font-bold text-foreground">
                  {orders.filter(o => o.status === "complete").length}
                </div>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </div>

            {/* Order List */}
            <div className="space-y-4">
              {orders.length === 0 && (
                <div className="text-center py-16 glass-card rounded-xl">
                  <FileImage className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-40" />
                  <p className="text-muted-foreground mb-4">No orders yet. Start by uploading your photos!</p>
                  <Button
                    onClick={() => setActiveTab("upload")}
                    className="gradient-primary rounded-full border-0"
                  >
                    <Upload className="h-4 w-4 mr-2" /> Upload Photos
                  </Button>
                </div>
              )}
              {orders.map((order) => {
                const statusKey = order.status === "assigned" || order.status === "reviewing" ? order.status : order.status;
                const status = statusConfig[statusKey as keyof typeof statusConfig] || statusConfig.pending;
                const StatusIcon = status.icon;
                return (
                  <div
                    key={order.id}
                    className="glass-card rounded-xl p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:shadow-lg transition-shadow"
                  >
                    {/* Thumbnail */}
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0 border border-border">
                      <img
                        src={getFileUrl(order.file_path)}
                        alt="Upload"
                        className="w-full h-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-display font-semibold text-sm text-foreground">
                          Order #{order.id?.toString().slice(0, 8)}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full border ${status.color}`}
                        >
                          <StatusIcon className="h-3 w-3" /> {status.label}
                        </span>
                        <Badge variant="outline" className="rounded-full text-xs">{order.tier}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Submitted: {new Date(order.created_at).toLocaleDateString()}
                        {order.instructions && <span className="ml-2">· {order.instructions.slice(0, 50)}{order.instructions.length > 50 ? '...' : ''}</span>}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {order.status === "complete" && order.edited_file_path && (
                        <a href={getFileUrl(order.edited_file_path)} target="_blank" rel="noreferrer">
                          <Button size="sm" className="gradient-primary rounded-full border-0">
                            <Download className="h-3.5 w-3.5 mr-1" /> Download
                          </Button>
                        </a>
                      )}
                      {order.status !== "complete" && (
                        <Badge variant="outline" className="rounded-full text-xs px-4 py-1.5">
                          Processing
                        </Badge>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Upload Tab */}
        {activeTab === "upload" && (
          <div className="max-w-3xl animate-fade-in">
            <div className="glass-card rounded-xl p-8">
              <h2 className="font-display text-2xl font-bold mb-6 text-foreground">
                Upload Photos
              </h2>

              {/* File Drop Zone */}
              <div
                className="border-2 border-dashed border-border rounded-xl bg-muted/30 hover:bg-muted/60 transition-colors p-10 text-center mb-8 cursor-pointer group"
                onClick={() => !filesSelected && !uploading && fileInputRef.current?.click()}
              >
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <FileImage className="h-6 w-6 text-primary" />
                </div>
                <p className="text-lg font-semibold text-foreground mb-1">Select files for retouching</p>
                <p className="text-sm text-muted-foreground mb-6">High-res JPG, PNG, or RAW — up to 50MB each</p>

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
                    className="rounded-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                  >
                    Browse Files
                  </Button>
                )}

                {filesSelected && !uploading && (
                  <div className="mt-6 flex flex-col items-center gap-4" onClick={(e) => e.stopPropagation()}>
                    <div className="bg-background border border-border rounded-xl p-5 w-full max-w-sm text-left">
                      <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4 font-medium">Order Summary</p>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Photos selected:</span>
                        <span className="font-semibold text-foreground">{fileCount}</span>
                      </div>
                      <div className="flex justify-between text-sm mb-4">
                        <span className="text-muted-foreground">Free credits used:</span>
                        <span className="font-semibold text-foreground">
                          {Math.min(fileCount, freeUploadsRemaining)} (of {freeUploadsRemaining} left)
                        </span>
                      </div>
                      <div className="border-t border-border pt-4 flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Total:</span>
                        {calculatedPrice === 0 ? (
                          <span className="font-display text-xl font-bold text-success">FREE</span>
                        ) : (
                          <span className="font-display text-xl font-bold text-foreground">${calculatedPrice.toFixed(2)}</span>
                        )}
                      </div>
                      {calculatedPrice > 0 && (
                        <p className="text-xs text-muted-foreground mt-3">
                          Free tier exhausted. Rate: ${serviceTier === "Basic" ? '2' : '5'}/photo
                        </p>
                      )}
                    </div>

                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        className="rounded-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          setFilesSelected(false);
                          setFileCount(0);
                          if (fileInputRef.current) fileInputRef.current.value = "";
                        }}
                      >
                        Clear
                      </Button>
                      <Button
                        className="gradient-primary rounded-full border-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          simulateUpload();
                        }}
                      >
                        {calculatedPrice > 0 ? <>Pay ${calculatedPrice} & Upload</> : <>Submit Files</>}
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Upload Progress */}
              {uploading && (
                <div className="mb-8 animate-fade-in">
                  <div className="flex justify-between text-sm text-muted-foreground mb-2">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-2 rounded-full" />
                </div>
              )}

              {/* Instructions */}
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-2 block text-foreground">
                    Editing Instructions
                  </label>
                  <Textarea
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    placeholder="Describe your requirements (e.g., color grade, blemish removal, architectural corrections...)"
                    rows={4}
                    className="rounded-xl bg-background border-border"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block text-foreground">
                    Service Tier
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setServiceTier("Basic")}
                      className={`p-5 rounded-xl border-2 text-left transition-all ${serviceTier === "Basic"
                        ? "border-primary bg-primary/5"
                        : "border-border bg-background hover:border-primary/40"
                        }`}
                    >
                      <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Foundation</p>
                      <p className="font-display text-xl font-bold text-foreground">
                        $2<span className="text-sm font-normal text-muted-foreground">/photo</span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">48-hour delivery</p>
                    </button>
                    <button
                      onClick={() => setServiceTier("Premium")}
                      className={`p-5 rounded-xl border-2 text-left transition-all ${serviceTier === "Premium"
                        ? "border-primary bg-primary/5"
                        : "border-border bg-background hover:border-primary/40"
                        }`}
                    >
                      <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Signature</p>
                      <p className="font-display text-xl font-bold text-foreground">
                        $5<span className="text-sm font-normal text-muted-foreground">/photo</span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">24-hour priority</p>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="max-w-2xl animate-fade-in">
            <div className="glass-card rounded-xl p-8">
              <div className="flex items-center gap-5 mb-8 pb-8 border-b border-border">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <h2 className="font-display text-2xl font-bold text-foreground">{userName}</h2>
                  <p className="text-sm text-muted-foreground">{userEmail}</p>
                </div>
              </div>
              <div className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Full Name</label>
                    <Input defaultValue={userName} className="rounded-lg" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Email</label>
                    <Input defaultValue={userEmail} disabled className="rounded-lg bg-muted/50" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Company (Optional)</label>
                  <Input placeholder="e.g. Acme Productions" className="rounded-lg" />
                </div>
                <div className="pt-4">
                  <Button className="gradient-primary rounded-full border-0">Update Profile</Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
