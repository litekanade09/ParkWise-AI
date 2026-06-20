import { Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { Bell, Car, CreditCard, History, LayoutDashboard, LifeBuoy, LogOut, MapPin, Menu, Search, User, X } from "lucide-react";
import { useEffect, useState } from "react";
import { loadSession, logout, saveSession, Profile } from "@/lib/smartpark-store";
import { Toaster } from "@/components/ui/sonner";
import { ManagerDashboard } from "@/components/dashboard/ManagerDashboard";
import { toast } from "sonner";

type NavItem = { to: "/dashboard/book" | "/dashboard/vehicles"; label: string; icon: typeof MapPin | typeof Car; exact?: boolean };
const nav: NavItem[] = [
  { to: "/dashboard/book", label: "Book Parking", icon: MapPin },
  { to: "/dashboard/vehicles", label: "My Vehicles", icon: Car },
];

export function DashboardLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const s = loadSession();
      if (!s.profile || !s.profile.token) {
        toast.error("Authentication required. Please log in.");
        navigate({ to: "/login" });
        return;
      }

      try {
        const meRes = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
          headers: { "Authorization": `Bearer ${s.profile.token}` },
        });
        const meJson = await meRes.json();
        if (!meJson.success) {
          throw new Error("Invalid session token");
        }

        if (!meJson.data.profileCompleted) {
          toast.error("Please complete your profile registration first.");
          navigate({ to: meJson.data.role === "parking_manager" ? "/register/manager" : "/register/proprietor" });
          return;
        }

        const updatedProfile = {
          ...s.profile,
          fullName: meJson.data.name || "",
          email: meJson.data.email,
          phone: meJson.data.phone || "",
          profileCompleted: meJson.data.profileCompleted,
        };
        setProfile(updatedProfile);

        let userVehicles = s.vehicles;
        let userBookings = s.bookings;

        if (updatedProfile.role === "vehicle_owner" || updatedProfile.role === "proprietor") {
          const vehRes = await fetch(`${import.meta.env.VITE_API_URL}/api/vehicles`, {
            headers: { "Authorization": `Bearer ${s.profile.token}` },
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

          const bookRes = await fetch(`${import.meta.env.VITE_API_URL}/api/bookings`, {
            headers: { "Authorization": `Bearer ${s.profile.token}` },
          });
          const bookJson = await bookRes.json();
          if (bookJson.success) {
            userBookings = bookJson.data.map((b: any) => ({
              id: b._id,
              lot: b.parkingLotId?.parkingName || "Assigned Lot",
              slot: b.slotId?.slotId || "Assigned Slot",
              date: b.entryTime ? b.entryTime.slice(0, 10) : "",
              time: b.entryTime ? new Date(b.entryTime).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) : "",
              status: b.bookingStatus === "active" ? "Active" : b.bookingStatus === "completed" ? "Completed" : b.bookingStatus === "cancelled" ? "Cancelled" : "Upcoming",
              price: b.price || 40,
            }));
          }
        }

        saveSession({
          profile: updatedProfile,
          vehicles: userVehicles,
          bookings: userBookings,
        });

        setCheckingAuth(false);
      } catch (err) {
        console.error("Auth check failed:", err);
        logout();
        toast.error("Session expired. Please log in again.");
        navigate({ to: "/login" });
      }
    };

    checkAuth();
  }, []);

  function onLogout() {
    logout();
    navigate({ to: "/" });
  }

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm text-muted-foreground font-semibold">Validating ParkWise AI secure session...</p>
        </div>
      </div>
    );
  }

  if (profile?.role === "manager" || profile?.role === "parking_manager") {
    return <ManagerDashboard />;
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-72 bg-secondary text-white flex flex-col transition-transform ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="px-6 h-16 flex items-center justify-between border-b border-white/10">
          <Link to="/" className="flex items-center gap-2">
            <span className="font-bold">ParkWise <span className="text-primary">AI</span></span>
          </Link>
          <button className="lg:hidden" onClick={() => setMobileOpen(false)}><X className="h-5 w-5" /></button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
          {nav.map((item) => {
            const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  active ? "bg-primary text-primary-foreground shadow-soft" : "text-white/70 hover:bg-white/5 hover:text-white"
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/70 hover:bg-white/5 hover:text-white transition"
          >
            <LogOut className="h-5 w-5" /> Logout
          </button>
        </div>
      </aside>

      {mobileOpen && <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={() => setMobileOpen(false)} />}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b border-border h-16 flex items-center px-4 lg:px-8 gap-4">
          <button className="lg:hidden" onClick={() => setMobileOpen(true)}><Menu className="h-5 w-5" /></button>
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                placeholder="Search parking, bookings..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-border bg-card focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none text-sm"
              />
            </div>
          </div>
          <button className="relative h-10 w-10 rounded-xl bg-card border border-border grid place-items-center hover:bg-muted">
            <Bell className="h-4 w-4" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive" />
          </button>
          <div className="flex items-center gap-3 pl-3 border-l border-border">
            <div className="h-9 w-9 rounded-xl bg-primary grid place-items-center text-primary-foreground font-bold text-sm">
              {profile?.fullName.charAt(0).toUpperCase() ?? "U"}
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold leading-tight">{profile?.fullName}</p>
              <p className="text-xs text-muted-foreground">{profile?.email}</p>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
      <Toaster />
    </div>
  );
}
