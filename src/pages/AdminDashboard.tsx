import { CONFIG } from "@/config";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Upload, CheckCircle, Clock, AlertCircle, Eye, User, FileImage } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner"; // For notifications

const statusConfig = {
  pending: { label: "Pending", icon: Clock, color: "bg-warning/10 text-warning" },
  assigned: { label: "Assigned", icon: Clock, color: "bg-info/10 text-info" },
  "in-progress": { label: "In Progress", icon: AlertCircle, color: "bg-accent/10 text-accent" },
  reviewing: { label: "Reviewing", icon: Eye, color: "bg-orange-500/10 text-orange-500" },
  complete: { label: "Complete", icon: CheckCircle, color: "bg-success/10 text-success" },
};

// Types
type Job = {
  id: string;
  file_path: string;
  edited_file_path: string | null;
  instructions: string;
  status: string;
  tier: string;
  created_at: string;
  assigned_admin?: string | null;
  user_email?: string;
};

type Admin = {
  id: string;
  name: string | null;
  email: string;
};

const AdminDashboard = () => {
  const [role, setRole] = useState<"user" | "admin" | "superadmin" | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);
  
  // Superadmin Management State
  const [activeTab, setActiveTab] = useState<"orders" | "admins">("orders");
  const [newAdminEmail, setNewAdminEmail] = useState("");

  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const initializeAdmin = async () => {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/login");
        return;
      }
      
      const jwtToken = session.access_token;
      setToken(jwtToken);

      try {
        // Fetch Role
        const profileRes = await fetch(`${CONFIG.API_BASE_URL}/api/users/profile`, {
          headers: { "Authorization": `Bearer ${jwtToken}` }
        });
        const profileData = await profileRes.json();
        
        if (profileData.user.role === "user") {
          toast.error("Access denied. You are not an admin.");
          navigate("/dashboard");
          return;
        }

        setRole(profileData.user.role);

        // Fetch Initial Data based on Role
        if (profileData.user.role === "superadmin") {
          fetchSuperAdminData(jwtToken);
        } else {
          fetchAdminData(jwtToken);
        }
      } catch (err) {
        toast.error("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };
    initializeAdmin();
  }, [navigate]);

  const fetchSuperAdminData = async (jwt: string) => {
    try {
      const [resUploads, resAdmins] = await Promise.all([
        fetch(`${CONFIG.API_BASE_URL}/api/admin/all-uploads`, { headers: { "Authorization": `Bearer ${jwt}` } }),
        fetch(`${CONFIG.API_BASE_URL}/api/admin/admins`, { headers: { "Authorization": `Bearer ${jwt}` } })
      ]);
      const uploads = await resUploads.json();
      const adminList = await resAdmins.json();
      setJobs(uploads);
      setAdmins(adminList);
    } catch (e) {
      toast.error("Failed to load superadmin data");
    }
  };

  const fetchAdminData = async (jwt: string) => {
    try {
      const res = await fetch(`${CONFIG.API_BASE_URL}/api/admin/my-tasks`, { headers: { "Authorization": `Bearer ${jwt}` } });
      const myTasks = await res.json();
      setJobs(myTasks);
    } catch (e) {
      toast.error("Failed to load your tasks");
    }
  };

  // Superadmin Action: Promote User to Admin
  const handlePromoteAdmin = async () => {
    if (!newAdminEmail) return;
    try {
      const res = await fetch(`${CONFIG.API_BASE_URL}/api/admin/change-role`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ email: newAdminEmail, role: "admin" })
      });
      if (res.ok) {
        toast.success(`Promoted ${newAdminEmail} to Admin!`);
        setNewAdminEmail("");
        fetchSuperAdminData(token);
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to promote user");
      }
    } catch (e) {
      toast.error("Error connecting to server");
    }
  };

  // Superadmin Action: Assign Job
  const handleAssignJob = async (jobId: string, adminId: string) => {
    try {
      const res = await fetch(`${CONFIG.API_BASE_URL}/api/admin/assign-upload/${jobId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ adminId })
      });
      if (res.ok) {
        toast.success("Job assigned successfully");
        fetchSuperAdminData(token);
      }
    } catch (e) {
      toast.error("Error assigning job");
    }
  };

  // Superadmin Action: Approve Completed Photo
  const handleApproveJob = async (jobId: string) => {
    try {
      const res = await fetch(`${CONFIG.API_BASE_URL}/api/admin/approve-upload/${jobId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        toast.success("Job approved and sent to client!");
        fetchSuperAdminData(token);
      }
    } catch (e) {
      toast.error("Error approving job");
    }
  };

  // Admin Action: Upload Edited File
  const handleUploadEdit = async (e: React.ChangeEvent<HTMLInputElement>, jobId: string) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    // Upload to Supabase Storage 'uploads' bucket under 'edited/' prefix
    const filePath = `edited/${Date.now()}_${file.name}`;
    const toastId = toast.loading("Uploading edited photo...");
    
    try {
      const { data: uploadData, error } = await supabase.storage
        .from("uploads")
        .upload(filePath, file);

      if (error) throw error;

      // Update backend DB
      const res = await fetch(`${CONFIG.API_BASE_URL}/api/admin/submit-edit/${jobId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ editedFilePath: uploadData.path })
      });

      if (res.ok) {
        toast.success("Edit submitted to review!", { id: toastId });
        fetchAdminData(token);
      } else {
        throw new Error("Backend failed to save");
      }
    } catch (err) {
      toast.error("Failed to upload file", { id: toastId });
      console.error(err);
    }
  };

  // Helper: Get Supabase storage URL helper
  const getFileUrl = (path: string) => {
    return supabase.storage.from("uploads").getPublicUrl(path).data.publicUrl;
  };

  if (loading || !role) {
    return <div className="min-h-screen flex items-center justify-center bg-background"><p>Verifying permissions...</p></div>;
  }

  const isSuper = role === "superadmin";

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold">
              {isSuper ? "Superadmin Center" : "Editor Workspace"}
            </h1>
            <p className="text-muted-foreground text-sm">
              {isSuper ? "Manage all orders and distribute tasks to your editing team" : "Review your assigned tasks, download photos, and upload final edits"}
            </p>
          </div>
          {isSuper && (
            <div className="flex gap-1 bg-muted rounded-full p-1 w-fit mt-4 sm:mt-0">
              <button
                onClick={() => setActiveTab("orders")}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${activeTab === "orders" ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
              >
                Orders
              </button>
              <button
                onClick={() => setActiveTab("admins")}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${activeTab === "admins" ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
              >
                Team
              </button>
            </div>
          )}
        </div>

        {/* Stats Grid */}
        {activeTab === "orders" && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Pending", count: jobs.filter(j => j.status === "pending").length, color: "text-warning" },
              { label: "Assigned", count: jobs.filter(j => j.status === "assigned").length, color: "text-info" },
              { label: "Reviewing", count: jobs.filter(j => j.status === "reviewing").length, color: "text-orange-500" },
              { label: "Complete", count: jobs.filter(j => j.status === "complete").length, color: "text-success" },
            ].map((stat, i) => (
              <div key={i} className="glass-card p-5 text-center">
                <div className={`text-3xl font-display font-bold ${stat.color}`}>{stat.count}</div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Orders View */}
        {activeTab === "orders" && (
          <div className="space-y-4">
            {jobs.length === 0 && (
              <div className="text-center py-12 text-muted-foreground glass-card">
                No active orders found.
              </div>
            )}
            
            {jobs.map((job) => {
              const statusKey = job.status as keyof typeof statusConfig;
              const status = statusConfig[statusKey] || statusConfig.pending;
              const StatusIcon = status.icon;
              const isExpanded = selectedJob === job.id;

              return (
                <div key={job.id} className="glass-card overflow-hidden">
                  <div className="p-5 flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-display font-semibold text-sm">Order #{job.id}</span>
                        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full ${status.color}`}>
                          <StatusIcon className="h-3 w-3" /> {status.label}
                        </span>
                        <Badge variant="outline" className="rounded-full text-xs">{job.tier}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {isSuper && <span>{job.user_email} · </span>}
                        Submitted: {new Date(job.created_at).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2 items-center">
                      <Button size="sm" variant="ghost" className="rounded-full" onClick={() => setSelectedJob(isExpanded ? null : job.id)}>
                        <Eye className="h-3.5 w-3.5 mr-1" /> {isExpanded ? "Hide Details" : "View"}
                      </Button>
                      
                      {/* Superadmin actions */}
                      {isSuper && job.status === "pending" && (
                        <select 
                          className="text-sm border rounded-full px-3 py-1.5 focus:outline-none focus:border-primary bg-background"
                          onChange={(e) => {
                            if (e.target.value) handleAssignJob(job.id, e.target.value);
                          }}
                          value={job.assigned_admin || ""}
                        >
                          <option value="">Assign to Admin...</option>
                          {admins.map(a => <option key={a.id} value={a.id}>{a.email}</option>)}
                        </select>
                      )}

                      {/* Superadmin Review Action */}
                      {isSuper && job.status === "reviewing" && (
                        <Button size="sm" className="bg-success hover:bg-success/80 text-white rounded-full border-0" onClick={() => handleApproveJob(job.id)}>
                          <CheckCircle className="h-3.5 w-3.5 mr-1" /> Approve Delivery
                        </Button>
                      )}

                      {/* Admin Actions */}
                      {!isSuper && (job.status === "assigned" || job.status === "in-progress") && (
                        <div className="relative">
                           <input 
                              type="file" 
                              className="hidden" 
                              id={`upload-${job.id}`}
                              accept="image/*"
                              onChange={(e) => handleUploadEdit(e, job.id)}
                            />
                            <label htmlFor={`upload-${job.id}`}>
                              <span className="inline-flex cursor-pointer items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2 gradient-primary rounded-full border-0 hover:opacity-90 text-primary-foreground">
                                <Upload className="h-3.5 w-3.5 mr-2" /> Upload Final Edit
                              </span>
                            </label>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {isExpanded && (
                    <div className="px-5 pb-5 pt-0 border-t border-border mt-2 pt-4 animate-fade-in bg-muted/20">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="text-sm font-medium mb-3 flex items-center gap-2"><FileImage className="h-4 w-4"/> Client Raw Photo</h4>
                          <div className="border rounded-xl overflow-hidden bg-background p-2">
                             <img src={getFileUrl(job.file_path)} alt="Raw Document" className="w-full h-auto rounded-lg max-h-64 object-contain" />
                             <a 
                               href={getFileUrl(job.file_path)} 
                               target="_blank" rel="noreferrer"
                               className="block mt-2 text-center text-xs font-semibold text-primary hover:underline"
                              >
                                Download Original File
                              </a>
                          </div>
                          
                          <h4 className="text-sm font-medium mb-2 mt-4">Instructions:</h4>
                          <p className="text-sm text-muted-foreground bg-background border rounded-lg p-3 min-h-[4rem]">
                            {job.instructions || "No custom instructions provided."}
                          </p>
                        </div>

                        <div>
                          {job.edited_file_path && (
                            <>
                              <h4 className="text-sm font-medium mb-3 flex items-center gap-2 text-primary"><CheckCircle className="h-4 w-4"/> Edited Final Photo</h4>
                              <div className="border border-primary/20 rounded-xl overflow-hidden bg-primary/5 p-2">
                                <img src={getFileUrl(job.edited_file_path)} alt="Edited Document" className="w-full h-auto rounded-lg max-h-64 object-contain" />
                                <a 
                                  href={getFileUrl(job.edited_file_path)} 
                                  target="_blank" rel="noreferrer"
                                  className="block mt-2 text-center text-xs font-semibold text-primary hover:underline"
                                  >
                                    Download Final File
                                  </a>
                              </div>
                            </>
                          )}
                          {!job.edited_file_path && (
                            <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl text-center p-8 bg-background">
                              <Eye className="h-8 w-8 text-muted-foreground mb-2 opacity-50"/>
                              <p className="text-sm text-muted-foreground">Edited file has not been uploaded yet.</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Superadmin: Team View */}
        {isSuper && activeTab === "admins" && (
           <div className="max-w-2xl animate-fade-in">
              <div className="glass-card p-8 mb-6">
                <h2 className="font-display text-xl font-bold mb-4">Invite Team Member</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  To add a new editor, the user must first create an account on the client facing signup page. 
                  Once they do, enter their email here to promote them to Admin.
                </p>
                <div className="flex gap-3">
                  <Input 
                    placeholder="editor@yourteam.com" 
                    value={newAdminEmail}
                    onChange={(e) => setNewAdminEmail(e.target.value)}
                    className="rounded-lg bg-background"
                  />
                  <Button onClick={handlePromoteAdmin} className="gradient-primary rounded-lg border-0 shrink-0">
                    <User className="h-4 w-4 mr-2"/> Promote to Editor
                  </Button>
                </div>
              </div>

              <div className="glass-card p-6">
                 <h2 className="font-display text-xl font-bold mb-4">Current Editor Team</h2>
                 {admins.length === 0 ? (
                   <p className="text-sm text-muted-foreground">No admins found.</p>
                 ) : (
                   <div className="space-y-3">
                     {admins.map(admin => (
                       <div key={admin.id} className="flex items-center justify-between p-3 border rounded-lg bg-background">
                         <div className="flex items-center gap-3">
                            <div className="bg-primary/10 p-2 rounded-full">
                              <User className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <p className="font-semibold text-sm">{admin.email}</p>
                              <Badge variant="outline" className="text-[10px] uppercase text-primary border-primary/30">Editor</Badge>
                            </div>
                         </div>
                       </div>
                     ))}
                   </div>
                 )}
              </div>
           </div>
        )}

      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
