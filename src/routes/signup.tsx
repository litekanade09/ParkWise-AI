import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Lock, ArrowRight, ArrowLeft, Eye, EyeOff, Car, Building2 } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { saveSession } from "@/lib/smartpark-store";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Sign Up — ParkWise AI" }] }),
  component: Signup,
});

function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<"vehicle_owner" | "parking_manager">("vehicle_owner");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password || !confirmPassword) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          role,
        }),
      });

      const json = await res.json();
      if (!json.success) {
        throw new Error(json.message || "Failed to sign up");
      }

      const { user, token } = json.data;

      // Save token and profile to local session immediately (Auto-login)
      saveSession({
        profile: {
          id: user._id,
          fullName: "",
          email: user.email,
          phone: "",
          address: "",
          postal: "",
          role: user.role,
          token: token,
          profileCompleted: false,
        },
        vehicles: [],
        bookings: [],
      });

      toast.success("ParkWise AI account created successfully! Redirecting to registration form...");
      setTimeout(() => {
        if (user.role === "parking_manager") {
          navigate({ to: "/register/manager" });
        } else {
          navigate({ to: "/register/proprietor" });
        }
      }, 1500);
    } catch (err: any) {
      toast.error(err.message || "Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-10 sm:px-6 lg:px-8">
      <div className="sm:mx-auto w-full max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2 mb-4">
          <span className="h-10 w-10 rounded-xl bg-primary grid place-items-center text-primary-foreground font-bold shadow-soft">
            P
          </span>
          <span className="font-bold text-2xl tracking-tight text-foreground">
            ParkWise <span className="text-primary">AI</span>
          </span>
        </Link>
        <h2 className="text-3xl font-extrabold text-foreground tracking-tight">Create your ParkWise AI Account</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Join us and simplify your parking experience today
        </p>
      </div>

      <div className="mt-6 sm:mx-auto w-full max-w-2xl px-4">
        <div className="bg-card border border-border shadow-soft rounded-3xl p-6 sm:p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Role selection cards */}
            <div>
              <label className="block text-xs font-semibold uppercase text-muted-foreground tracking-wide mb-3">
                I want to join as a:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setRole("vehicle_owner")}
                  className={`text-left p-4 rounded-2xl border transition-all flex items-center gap-4 cursor-pointer ${
                    role === "vehicle_owner"
                      ? "bg-primary/5 border-primary ring-2 ring-primary/20"
                      : "bg-background border-border hover:border-muted-foreground/30"
                  }`}
                >
                  <div className={`h-12 w-12 rounded-xl grid place-items-center ${
                    role === "vehicle_owner" ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground"
                  }`}>
                    <Car className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground text-sm">Vehicle Proprietor</h4>
                    <p className="text-xs text-muted-foreground">Book and manage parking spots</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setRole("parking_manager")}
                  className={`text-left p-4 rounded-2xl border transition-all flex items-center gap-4 cursor-pointer ${
                    role === "parking_manager"
                      ? "bg-primary/5 border-primary ring-2 ring-primary/20"
                      : "bg-background border-border hover:border-muted-foreground/30"
                  }`}
                >
                  <div className={`h-12 w-12 rounded-xl grid place-items-center ${
                    role === "parking_manager" ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground"
                  }`}>
                    <Building2 className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground text-sm">Parking Manager</h4>
                    <p className="text-xs text-muted-foreground">Register lots and manage slots</p>
                  </div>
                </button>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase text-muted-foreground tracking-wide">
                  Email Address
                </label>
                <div className="mt-2 relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none text-sm transition"
                    placeholder="prajwal@gmail.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-muted-foreground tracking-wide">
                  Password
                </label>
                <div className="mt-2 relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 rounded-xl border border-border bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none text-sm transition"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-muted-foreground tracking-wide">
                  Confirm Password
                </label>
                <div className="mt-2 relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 rounded-xl border border-border bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none text-sm transition"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <Link
                to="/login"
                className="flex-1 inline-flex justify-center items-center gap-2 py-3 px-4 rounded-xl border border-border font-semibold text-sm hover:bg-muted text-foreground transition"
              >
                <ArrowLeft className="h-4 w-4" /> Back To Login
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 inline-flex justify-center items-center gap-2 py-3 px-4 rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow-soft hover:shadow-glow hover:brightness-105 active:scale-[0.98] transition cursor-pointer"
              >
                {loading ? "Registering..." : "Register"} <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
      <Toaster />
    </div>
  );
}
