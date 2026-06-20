import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Lock, Mail, ArrowRight, Eye, EyeOff } from "lucide-react";
import { loadSession, saveSession } from "@/lib/smartpark-store";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Login — ParkWise AI" }] }),
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const json = await res.json();
      if (!json.success) {
        throw new Error(json.message || "Failed to log in");
      }

      const { user, token } = json.data;

      // Check if manager already has a lot registered
      let userLotId = "";
      if (user.role === "parking_manager") {
        const lotRes = await fetch(`http://localhost:5000/api/parking-lots?createdBy=${user._id}`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const lotJson = await lotRes.json();
        if (lotJson.success && lotJson.data.length > 0) {
          userLotId = lotJson.data[0]._id;
        }
      }

      // Fetch user's vehicles from backend
      let userVehicles: any[] = [];
      if (user.role === "vehicle_owner") {
        const vehRes = await fetch(`http://localhost:5000/api/vehicles`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const vehJson = await vehRes.json();
        if (vehJson.success) {
          userVehicles = vehJson.data.map((v: any) => ({
            id: v._id,
            number: v.vehicleNumber,
            type: v.vehicleType,
            color: v.vehicleColor,
            model: v.vehicleModel,
          }));
        }
      }

      // Fetch user's bookings from backend
      let userBookings: any[] = [];
      const bookingsRes = await fetch("http://localhost:5000/api/bookings", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const bookingsJson = await bookingsRes.json();
      if (bookingsJson.success) {
        userBookings = bookingsJson.data.map((b: any) => ({
          id: b._id,
          lot: b.parkingLotId?.parkingName || "Assigned Lot",
          slot: b.slotId?.slotId || "Assigned Slot",
          date: b.entryTime ? b.entryTime.slice(0, 10) : "",
          time: b.entryTime ? new Date(b.entryTime).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) : "",
          status: b.bookingStatus === "active" ? "Active" : b.bookingStatus === "completed" ? "Completed" : b.bookingStatus === "cancelled" ? "Cancelled" : "Upcoming",
          price: b.price || 40,
        }));
      }

      // Save to localStorage session
      const s = loadSession();
      saveSession({
        profile: {
          id: user._id,
          fullName: user.name || "",
          email: user.email,
          phone: user.phone || "",
          address: user.address || "",
          postal: user.postalCode || "",
          role: user.role,
          token: token,
          parkingLotId: userLotId,
          profileCompleted: user.profileCompleted || false,
        },
        vehicles: userVehicles,
        bookings: userBookings,
      });

      toast.success("Welcome to ParkWise AI! Logged in successfully!");
      setTimeout(() => {
        if (user.profileCompleted) {
          navigate({ to: "/dashboard" });
        } else {
          if (user.role === "parking_manager") {
            navigate({ to: "/register/manager" });
          } else {
            navigate({ to: "/register/proprietor" });
          }
        }
      }, 1000);
    } catch (err: any) {
      toast.error(err.message || "Invalid credentials. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto w-full max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2 mb-6">
          <span className="font-bold text-2xl tracking-tight text-foreground">
            ParkWise <span className="text-primary">AI</span>
          </span>
        </Link>
        <h2 className="text-3xl font-extrabold text-foreground tracking-tight">Welcome to ParkWise AI</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Sign in to ParkWise AI to access your account
        </p>
      </div>

      <div className="mt-8 sm:mx-auto w-full max-w-md">
        <div className="bg-card py-8 px-4 border border-border shadow-soft rounded-3xl sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
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
                  placeholder="name@example.com"
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
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow-soft hover:shadow-glow hover:brightness-105 active:scale-[0.98] transition cursor-pointer"
              >
                {loading ? "Logging in..." : "Login"} <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </form>

          <div className="mt-6 border-t border-border pt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/signup" className="font-bold text-foreground hover:underline">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
}
