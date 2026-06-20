import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard,
  MapPin,
  Calendar,
  Car,
  Video,
  Settings,
  LogOut,
  Bell,
  Menu,
  X,
  Search,
  Plus,
  Trash2,
  Edit,
  Check,
  AlertTriangle,
  Info,
  Clock,
  Sparkles,
  Building,
  CheckCircle2,
  Lock,
  User,
  Power,
  ArrowRight
} from "lucide-react";
import { loadSession, saveSession, logout } from "@/lib/smartpark-store";
import { toast } from "sonner";

// Initial mock data
const initialActivities = [
  { id: 1, type: "entry", text: "Vehicle MH 12 AB 4521 (Car) entered", time: "2 mins ago", icon: Car, color: "text-success bg-success/10" },
  { id: 2, type: "booking", text: "New Booking BK-1045 created by Ramesh K.", time: "8 mins ago", icon: Calendar, color: "text-primary bg-primary/10" },
  { id: 3, type: "exit", text: "Vehicle DL 03 CC 9811 (SUV) exited", time: "15 mins ago", icon: Car, color: "text-destructive bg-destructive/10" },
  { id: 4, type: "maintenance", text: "Slot B-04 placed under maintenance", time: "1 hour ago", icon: AlertTriangle, color: "text-warning bg-warning/10" },
  { id: 5, type: "entry", text: "Vehicle KA 51 MB 1209 (Bike) entered", time: "2 hours ago", icon: Car, color: "text-success bg-success/10" },
];

const initialSlots = [
  { id: "A-01", zone: "Zone A", type: "Car", status: "Occupied" },
  { id: "A-02", zone: "Zone A", type: "Car", status: "Available" },
  { id: "A-03", zone: "Zone A", type: "SUV", status: "Reserved" },
  { id: "A-04", zone: "Zone A", type: "Car", status: "Available" },
  { id: "A-05", zone: "Zone A", type: "Truck", status: "Occupied" },
  { id: "B-01", zone: "Zone B", type: "Bike", status: "Available" },
  { id: "B-02", zone: "Zone B", type: "Bike", status: "Occupied" },
  { id: "B-03", zone: "Zone B", type: "Car", status: "Maintenance" },
  { id: "B-04", zone: "Zone B", type: "Car", status: "Available" },
  { id: "C-01", zone: "Zone C", type: "SUV", status: "Occupied" },
  { id: "C-02", zone: "Zone C", type: "SUV", status: "Reserved" },
  { id: "C-03", zone: "Zone C", type: "Bike", status: "Available" },
  { id: "D-01", zone: "Zone D", type: "Truck", status: "Occupied" },
  { id: "D-02", zone: "Zone D", type: "Car", status: "Available" },
  { id: "D-03", zone: "Zone D", type: "Car", status: "Available" },
];

const initialBookings = [
  { id: "BK-1045", customer: "Ramesh Kumar", vehicle: "MH 12 AB 4521", slot: "A-01", time: "11:30 AM - 02:30 PM", status: "Active" },
  { id: "BK-1042", customer: "Priya Sharma", vehicle: "MH 12 XY 9000", slot: "A-03", time: "12:00 PM - 04:00 PM", status: "Active" },
  { id: "BK-1037", customer: "Amit Patel", vehicle: "DL 03 CC 9811", slot: "C-02", time: "09:30 AM - 01:30 PM", status: "Completed" },
  { id: "BK-1029", customer: "Sneha Reddy", vehicle: "KA 51 MB 1209", slot: "B-02", time: "08:00 AM - 10:00 AM", status: "Completed" },
  { id: "BK-1015", customer: "Vikram Malhotra", vehicle: "HR 26 AZ 4455", slot: "D-01", time: "04:00 PM - 08:00 PM", status: "Cancelled" },
];

const initialVehicles = [
  { plate: "MH 12 AB 4521", owner: "Ramesh Kumar", type: "Car", entry: "11:32 AM", slot: "A-01", status: "Parked" },
  { plate: "MH 12 XY 9000", owner: "Priya Sharma", type: "Car", entry: "12:05 PM", slot: "A-03", status: "Parked" },
  { plate: "KA 51 MB 1209", owner: "Sneha Reddy", type: "Bike", entry: "08:12 AM", slot: "B-02", status: "Parked" },
  { plate: "GJ 01 XX 7788", owner: "Unknown (Visitor)", type: "SUV", entry: "10:45 AM", slot: "C-01", status: "Parked" },
  { plate: "MH 14 ZZ 1234", owner: "Unknown (Visitor)", type: "Truck", entry: "09:00 AM", slot: "D-01", status: "Parked" },
];

const initialNotifications = [
  { id: 1, text: "Parking capacity is reaching critical limit (90% occupied)", type: "danger", time: "5 mins ago", read: false },
  { id: 2, text: "New booking BK-1045 registered for Slot A-01", type: "info", time: "12 mins ago", read: false },
  { id: 3, text: "Slot B-03 marked under Maintenance", type: "warning", time: "45 mins ago", read: true },
  { id: 4, text: "Vehicle DL 03 CC 9811 exited successfully", type: "success", time: "1 hour ago", read: true },
];

export function ManagerDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Loaded Profile Data
  const [profile, setProfile] = useState<any>(null);
  const [token, setToken] = useState<string>("");

  // States for lists
  const [slots, setSlots] = useState<any[]>(initialSlots);
  const [bookings, setBookings] = useState<any[]>(initialBookings);
  const [vehicles, setVehicles] = useState<any[]>(initialVehicles);
  const [activities, setActivities] = useState<any[]>(initialActivities);
  const [notifications, setNotifications] = useState<any[]>(initialNotifications);

  // Add Slot Modal State
  const [isAddSlotOpen, setIsAddSlotOpen] = useState(false);
  const [newSlotId, setNewSlotId] = useState("");
  const [newSlotZone, setNewSlotZone] = useState("Zone A");
  const [newSlotType, setNewSlotType] = useState("Car");
  const [newSlotStatus, setNewSlotStatus] = useState("Available");

  // Filter States
  const [slotsFilterStatus, setSlotsFilterStatus] = useState("All");
  const [slotsSearch, setSlotsSearch] = useState("");

  const [bookingsFilter, setBookingsFilter] = useState("All");
  const [bookingsSearch, setBookingsSearch] = useState("");

  const [vehiclesSearch, setVehiclesSearch] = useState("");

  // Simulated CCTV Telemetry
  const [cctvTime, setCctvTime] = useState("");

  // AI Occupancy Analytics States
  const [analytics, setAnalytics] = useState<any>(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState<boolean>(true);
  const [analyticsError, setAnalyticsError] = useState<string | null>(null);

  const fetchAnalyticsData = async (parkingLotId: string, userToken = token) => {
    if (!userToken) return;
    setLoadingAnalytics(true);
    setAnalyticsError(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/analytics/${parkingLotId}`, {
        headers: { "Authorization": `Bearer ${userToken}` }
      });
      const json = await res.json();
      if (json.success) {
        setAnalytics(json.data);
      } else {
        setAnalyticsError("No AI data available yet");
      }
    } catch (err) {
      console.error("Error loading manager analytics:", err);
      setAnalyticsError("No AI data available yet");
    } finally {
      setLoadingAnalytics(false);
    }
  };

  const fetchBackendData = async (parkingLotId: string, userToken = token) => {
    if (!userToken) return;
    try {
      // Fetch slots
      const slotsRes = await fetch(`${import.meta.env.VITE_API_URL}/api/slots?parkingLotId=${parkingLotId}`, {
        headers: { "Authorization": `Bearer ${userToken}` }
      });
      const slotsJson = await slotsRes.json();
      if (slotsJson.success && slotsJson.data.length > 0) {
        setSlots(
          slotsJson.data.map((item: any) => ({
            id: item.slotId,
            zone: item.zone,
            type: item.slotType,
            status: item.status === "empty" ? "Available" : item.status === "reserved" ? "Reserved" : item.status === "occupied" ? "Occupied" : "Maintenance",
            dbId: item._id,
          }))
        );
      } else if (slotsJson.success) {
        setSlots([]);
      }

      // Fetch bookings
      const bookingsRes = await fetch(`${import.meta.env.VITE_API_URL}/api/bookings?parkingLotId=${parkingLotId}`, {
        headers: { "Authorization": `Bearer ${userToken}` }
      });
      const bookingsJson = await bookingsRes.json();
      if (bookingsJson.success && bookingsJson.data.length > 0) {
        setBookings(
          bookingsJson.data.map((b: any) => ({
            id: b._id,
            customer: b.userId?.name || "Unknown Customer",
            vehicle: b.vehicleId?.vehicleNumber || "Unknown",
            vehicleType: b.vehicleId?.vehicleType || "Car",
            slot: b.slotId?.slotId || "A-01",
            time: "12:00 PM - 04:00 PM",
            status: b.bookingStatus === "active" ? "Active" : b.bookingStatus === "completed" ? "Completed" : "Cancelled",
          }))
        );

        // Populate dynamic vehicles table from active bookings
        setVehicles(
          bookingsJson.data
            .filter((b: any) => b.bookingStatus === "active")
            .map((b: any) => ({
              plate: b.vehicleId?.vehicleNumber || "Unknown",
              owner: b.userId?.name || "Visitor",
              type: b.vehicleId?.vehicleType || "Car",
              entry: b.entryTime ? new Date(b.entryTime).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) : "12:00 PM",
              slot: b.slotId?.slotId || "A-01",
              status: "Parked",
            }))
        );
      } else if (bookingsJson.success) {
        setBookings([]);
        setVehicles([]);
      }
    } catch (err) {
      console.error("Error fetching backend data:", err);
    }
  };

  useEffect(() => {
    const loadManagerData = async () => {
      const s = loadSession();
      if (s.profile) {
        setProfile(s.profile);
        const userToken = s.profile.token || "";
        setToken(userToken);
        let lotId = s.profile.parkingLotId;

        if (!lotId && s.profile.id && userToken) {
          try {
            const lotRes = await fetch(`${import.meta.env.VITE_API_URL}/api/parking-lots?createdBy=${s.profile.id}`, {
              headers: { "Authorization": `Bearer ${userToken}` }
            });
            const lotJson = await lotRes.json();
            if (lotJson.success && lotJson.data.length > 0) {
              lotId = lotJson.data[0]._id;
              const updatedProfile = { ...s.profile, parkingLotId: lotId };
              setProfile(updatedProfile);
              saveSession({ ...s, profile: updatedProfile });
            }
          } catch (err) {
            console.error("Error loading manager lot:", err);
          }
        }

        if (lotId && userToken) {
          fetchBackendData(lotId, userToken);
          fetchAnalyticsData(lotId, userToken);
        } else {
          // If no lot registered, clear mock arrays to avoid confusing user
          setSlots([]);
          setBookings([]);
          setLoadingAnalytics(false);
          setAnalyticsError("No AI data available yet");
        }
      }
    };

    loadManagerData();
  }, []);

  // Update clock for CCTV telemetry
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCctvTime(now.toLocaleString("en-US", { hour12: false }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleTabChange = (tab: string) => {
    setLoading(true);
    setActiveTab(tab);
    setMobileOpen(false);
    setTimeout(() => setLoading(false), 500);
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate({ to: "/" });
  };

  // Add Slot Action
  const handleAddSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSlotId.trim()) {
      toast.error("Please enter a valid Slot ID");
      return;
    }
    if (slots.some((s) => s.id.toLowerCase() === newSlotId.trim().toLowerCase())) {
      toast.error("Slot ID already exists");
      return;
    }

    const lotId = profile?.parkingLotId || "6a2a69a8ce280a2f405ff012";
    const mappedStatus =
      newSlotStatus === "Available"
        ? "empty"
        : newSlotStatus === "Reserved"
        ? "reserved"
        : newSlotStatus === "Occupied"
        ? "occupied"
        : "maintenance";

    try {
      const userToken = token || loadSession().profile?.token;
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/slots`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userToken}`
        },
        body: JSON.stringify({
          parkingLotId: lotId,
          slotId: newSlotId.trim().toUpperCase(),
          zone: newSlotZone,
          slotType: newSlotType,
          status: mappedStatus,
        }),
      });

      const json = await res.json();
      if (!json.success) {
        throw new Error(json.message || "Failed to create slot");
      }

      const newSlot = {
        id: json.data.slotId,
        zone: json.data.zone,
        type: json.data.slotType,
        status: newSlotStatus,
        dbId: json.data._id,
      };

      setSlots([newSlot, ...slots]);
      setIsAddSlotOpen(false);
      setNewSlotId("");
      
      // Log Activity
      setActivities([
        {
          id: Date.now(),
          type: "maintenance",
          text: `New Slot ${newSlot.id} (${newSlot.type}) added in ${newSlot.zone}`,
          time: "Just now",
          icon: Plus,
          color: "text-primary bg-primary/10",
        },
        ...activities,
      ]);
      toast.success(`Slot ${newSlot.id} added successfully`);
    } catch (err: any) {
      toast.error(err.message || "An error occurred");
      console.error(err);
    }
  };

  // Toggle Slot Status Action
  const toggleSlotStatus = async (slotId: string, currentStatus: string) => {
    const targetSlot = slots.find((s) => s.id === slotId);
    if (!targetSlot || !targetSlot.dbId) {
      toast.error("Cannot resolve slot database reference");
      return;
    }

    const nextStatus = currentStatus === "Available" ? "Maintenance" : "Available";
    const mappedStatus = nextStatus === "Available" ? "empty" : "maintenance";

    try {
      const userToken = token || loadSession().profile?.token;
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/slots/${targetSlot.dbId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userToken}`
        },
        body: JSON.stringify({
          status: mappedStatus,
        }),
      });

      const json = await res.json();
      if (!json.success) {
        throw new Error(json.message || "Failed to toggle slot status");
      }

      setSlots(slots.map((s) => (s.id === slotId ? { ...s, status: nextStatus } : s)));
      setActivities([
        {
          id: Date.now(),
          type: "maintenance",
          text: `Slot ${slotId} status changed to ${nextStatus}`,
          time: "Just now",
          icon: AlertTriangle,
          color: nextStatus === "Maintenance" ? "text-warning bg-warning/10" : "text-success bg-success/10",
        },
        ...activities,
      ]);
      toast.success(`Slot ${slotId} is now ${nextStatus}`);
    } catch (err: any) {
      toast.error(err.message || "An error occurred");
      console.error(err);
    }
  };

  // Delete/Remove Slot
  const handleDeleteSlot = async (slotId: string) => {
    const targetSlot = slots.find((s) => s.id === slotId);
    if (!targetSlot || !targetSlot.dbId) {
      toast.error("Cannot resolve slot database reference");
      return;
    }

    try {
      const userToken = token || loadSession().profile?.token;
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/slots/${targetSlot.dbId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${userToken}`
        }
      });

      const json = await res.json();
      if (!json.success) {
        throw new Error(json.message || "Failed to delete slot");
      }

      setSlots(slots.filter((s) => s.id !== slotId));
      toast.info(`Slot ${slotId} removed`);
    } catch (err: any) {
      toast.error(err.message || "An error occurred");
      console.error(err);
    }
  };

  // Cancel Booking
  const handleCancelBooking = async (id: string) => {
    try {
      const userToken = token || loadSession().profile?.token;
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/bookings/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userToken}`
        },
        body: JSON.stringify({
          bookingStatus: "cancelled",
        }),
      });

      const json = await res.json();
      if (!json.success) {
        throw new Error(json.message || "Failed to cancel booking");
      }

      setBookings(bookings.map((b) => (b.id === id ? { ...b, status: "Cancelled" } : b)));
      
      // Refresh slots status on cancellation
      if (profile?.parkingLotId) {
        fetchBackendData(profile.parkingLotId);
      }
      
      toast.info(`Booking has been cancelled`);
    } catch (err: any) {
      toast.error(err.message || "An error occurred");
      console.error(err);
    }
  };

  // Mark all notifications as read
  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
    toast.success("All notifications marked as read");
  };

  // Settings Save Handler
  const handleSaveSettings = async (e: React.FormEvent, type: string, data: any) => {
    e.preventDefault();
    const lotId = profile?.parkingLotId;
    if (!lotId) {
      toast.error("No parking lot reference found to update settings");
      return;
    }

    try {
      const userToken = token || loadSession().profile?.token;
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/parking-lots/${lotId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userToken}`
        },
        body: JSON.stringify(data),
      });

      const json = await res.json();
      if (!json.success) {
        throw new Error(json.message || "Failed to save settings");
      }

      const updatedProfile = { ...profile, ...data };
      setProfile(updatedProfile);
      const s = loadSession();
      saveSession({ ...s, profile: updatedProfile });
      toast.success(`${type} updated successfully`);
    } catch (err: any) {
      toast.error(err.message || "An error occurred");
      console.error(err);
    }
  };

  // Derived Stats
  const totalCapacity = profile?.totalCapacity || slots.length;
  const occupiedCount = slots.filter((s) => s.status === "Occupied").length;
  const reservedCount = slots.filter((s) => s.status === "Reserved").length;
  const maintenanceCount = slots.filter((s) => s.status === "Maintenance").length;
  const availableCount = Math.max(0, totalCapacity - occupiedCount - reservedCount - maintenanceCount);

  // Render Skeletons
  const renderSkeletons = () => (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 bg-border rounded-lg w-1/4"></div>
      <div className="grid sm:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-card border border-border rounded-2xl p-6 space-y-3">
            <div className="h-4 bg-border rounded w-1/2"></div>
            <div className="h-8 bg-border rounded w-3/4"></div>
          </div>
        ))}
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-96 bg-card border border-border rounded-3xl"></div>
        <div className="h-96 bg-card border border-border rounded-3xl"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex text-foreground">
      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-72 bg-secondary text-white flex flex-col transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="px-6 h-16 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg tracking-tight">
              ParkWise <span className="text-primary">AI</span>
            </span>
          </div>
          <button className="lg:hidden p-1 hover:bg-white/10 rounded-lg transition" onClick={() => setMobileOpen(false)}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1.5">
          <SidebarLink active={activeTab === "overview"} onClick={() => handleTabChange("overview")} icon={LayoutDashboard} label="Overview" />
          <SidebarLink active={activeTab === "slots"} onClick={() => handleTabChange("slots")} icon={MapPin} label="Parking Slots" />
          <SidebarLink active={activeTab === "bookings"} onClick={() => handleTabChange("bookings")} icon={Calendar} label="Bookings" />
          <SidebarLink active={activeTab === "vehicles"} onClick={() => handleTabChange("vehicles")} icon={Car} label="Vehicles" />
          <SidebarLink active={activeTab === "cctv"} onClick={() => handleTabChange("cctv")} icon={Video} label="CCTV Monitoring" />
          <SidebarLink active={activeTab === "settings"} onClick={() => handleTabChange("settings")} icon={Settings} label="Settings" />
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="bg-white/5 p-4 rounded-2xl mb-4 text-xs">
            <div className="flex items-center gap-2 text-primary font-bold mb-1">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Manager Portal</span>
            </div>
            <p className="text-white/60 line-clamp-1">{profile?.parkingName || "Central Terminal Lot"}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-white/70 hover:bg-destructive hover:text-white transition duration-200"
          >
            <LogOut className="h-5 w-5" /> Logout
          </button>
        </div>
      </aside>

      {mobileOpen && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm" onClick={() => setMobileOpen(false)} />}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b border-border h-16 flex items-center px-4 lg:px-8 justify-between gap-4">
          <div className="flex items-center gap-3">
            <button className="lg:hidden p-2 hover:bg-muted rounded-xl transition" onClick={() => setMobileOpen(true)}>
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Facility Manager</p>
              <h1 className="text-base font-bold text-foreground line-clamp-1 flex items-center gap-1.5">
                <Building className="h-4 w-4 text-primary" />
                {profile?.parkingName || "ParkWise Central"}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Notifications panel toggle */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowProfileMenu(false);
                }}
                className={`relative h-10 w-10 rounded-xl border grid place-items-center hover:bg-muted transition ${
                  showNotifications ? "bg-muted border-primary" : "bg-card border-border"
                }`}
              >
                <Bell className="h-5 w-5" />
                {notifications.some((n) => !n.read) && (
                  <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive animate-pulse" />
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-card border border-border rounded-2xl shadow-card p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="flex items-center justify-between border-b border-border pb-2 mb-2">
                    <h3 className="font-bold text-sm">Notifications</h3>
                    <button onClick={markAllRead} className="text-xs text-primary font-semibold hover:underline">
                      Mark all read
                    </button>
                  </div>
                  <div className="max-h-64 overflow-y-auto space-y-2 py-1 pr-1">
                    {notifications.length === 0 ? (
                      <div className="text-center py-6 text-sm text-muted-foreground">No notifications.</div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          className={`p-2.5 rounded-xl border text-xs transition-all ${
                            n.read ? "bg-background/40 border-border" : "bg-primary/5 border-primary/20"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-1">
                            <span className="font-medium text-foreground">{n.text}</span>
                            {!n.read && <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0 mt-1" />}
                          </div>
                          <span className="text-[10px] text-muted-foreground mt-1 block">{n.time}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowProfileMenu(!showProfileMenu);
                  setShowNotifications(false);
                }}
                className="flex items-center gap-3 pl-3 border-l border-border hover:opacity-85 transition cursor-pointer"
              >
                <div className="h-9 w-9 rounded-xl bg-primary text-primary-foreground font-extrabold text-sm grid place-items-center shadow-soft">
                  {(profile?.fullName || "M").charAt(0).toUpperCase()}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs text-muted-foreground leading-none mb-1">Active Account</p>
                  <p className="text-sm font-bold leading-tight line-clamp-1">{profile?.fullName || "Manager"}</p>
                </div>
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-2xl shadow-card p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="pb-2 border-b border-border mb-2 px-2">
                    <p className="text-xs text-muted-foreground">Logged in as</p>
                    <p className="text-sm font-semibold truncate">{profile?.email || "manager@parkwise.ai"}</p>
                  </div>
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      setActiveTab("settings");
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-muted font-medium transition flex items-center gap-2"
                  >
                    <Settings className="h-4 w-4" /> Settings Panel
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs text-destructive hover:bg-destructive/10 font-semibold transition flex items-center gap-2 mt-1"
                  >
                    <LogOut className="h-4 w-4" /> Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic Pages Render */}
        <main className="flex-1 p-4 lg:p-8">
          {loading ? (
            renderSkeletons()
          ) : (
            <>
              {activeTab === "overview" && (
                !profile?.parkingLotId ? (
                  <div className="bg-card border border-border border-dashed rounded-3xl p-16 text-center max-w-2xl mx-auto my-12 shadow-soft animate-in fade-in duration-300">
                    <div className="mx-auto h-16 w-16 bg-primary/10 rounded-2xl grid place-items-center mb-6">
                      <Building className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground">Register your Parking Lot</h3>
                    <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
                      You haven't registered any parking space under this ParkWise AI account. Set up your parking lot name, location, slot capacities, and prices to start accepting bookings.
                    </p>
                    <button
                      onClick={() => navigate({ to: "/register/manager" })}
                      className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold shadow-soft hover:shadow-glow transition cursor-pointer"
                    >
                      Set Up Parking Lot <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h2 className="text-2xl font-bold tracking-tight">Overview Dashboard</h2>
                        <p className="text-sm text-muted-foreground">Real-time status overview of your smart parking zone.</p>
                      </div>
                      <div className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-2xl shadow-soft text-xs text-muted-foreground font-semibold">
                        <Clock className="h-4 w-4 text-primary" /> Live Updates Feed
                      </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      <StatsCard label="Total Parking Slots" value={totalCapacity} subtext="Global capacity limit" color="border-border text-foreground" icon={Building} />
                      <StatsCard label="Occupied Slots" value={occupiedCount} subtext={totalCapacity > 0 ? `${Math.round((occupiedCount / totalCapacity) * 100)}% Occupancy` : "0% Occupancy"} color="border-destructive/20 text-destructive" icon={Car} />
                      <StatsCard label="Available Slots" value={availableCount} subtext="Open for parking bookings" color="border-success/20 text-success" icon={Check} />
                      <StatsCard label="Reserved Slots" value={reservedCount} subtext="Booked via proprietor app" color="border-primary/20 text-warning" icon={Calendar} />
                    </div>

                    {/* Parking Zones Breakdown */}
                    <div>
                      <h3 className="text-sm font-bold text-foreground border-b border-border pb-2 mb-3 uppercase tracking-wider">Parking Zones breakdown</h3>
                      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <ZoneCard
                          title="Zone 1 - Bikes"
                          capacity={profile?.bikeSlots || 0}
                          occupied={slots.filter((s) => s.type === "Bike" && s.status === "Occupied").length}
                          reserved={slots.filter((s) => s.type === "Bike" && s.status === "Reserved").length}
                          maintenance={slots.filter((s) => s.type === "Bike" && s.status === "Maintenance").length}
                        />
                        <ZoneCard
                          title="Zone 2 - Cars"
                          capacity={profile?.carSlots || 0}
                          occupied={slots.filter((s) => s.type === "Car" && s.status === "Occupied").length}
                          reserved={slots.filter((s) => s.type === "Car" && s.status === "Reserved").length}
                          maintenance={slots.filter((s) => s.type === "Car" && s.status === "Maintenance").length}
                        />
                        <ZoneCard
                          title="Zone 3 - SUVs"
                          capacity={profile?.suvSlots || 0}
                          occupied={slots.filter((s) => s.type === "SUV" && s.status === "Occupied").length}
                          reserved={slots.filter((s) => s.type === "SUV" && s.status === "Reserved").length}
                          maintenance={slots.filter((s) => s.type === "SUV" && s.status === "Maintenance").length}
                        />
                        <ZoneCard
                          title="Zone 4 - Trucks"
                          capacity={profile?.truckSlots || 0}
                          occupied={slots.filter((s) => s.type === "Truck" && s.status === "Occupied").length}
                          reserved={slots.filter((s) => s.type === "Truck" && s.status === "Reserved").length}
                          maintenance={slots.filter((s) => s.type === "Truck" && s.status === "Maintenance").length}
                        />
                      </div>
                    </div>

                    {/* AI Occupancy Overview */}
                    <div className="bg-card border border-border rounded-3xl p-6 shadow-soft space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border pb-4 gap-2">
                        <div>
                          <h3 className="font-bold text-lg flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-primary animate-pulse" />
                            AI Occupancy Overview
                          </h3>
                          <p className="text-xs text-muted-foreground font-medium">Statistics parsed from YOLO computer vision processing</p>
                        </div>
                        {analytics?.lastUpdated && (
                          <div className="text-[10px] text-muted-foreground font-semibold flex items-center gap-1 bg-muted px-2.5 py-1.5 rounded-lg border border-border">
                            <Clock className="h-3.5 w-3.5 text-primary" />
                            Last Updated: {new Date(analytics.lastUpdated).toLocaleString("en-US", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true
                            })}
                          </div>
                        )}
                      </div>

                      {loadingAnalytics ? (
                        <div className="flex items-center justify-center py-8">
                          <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                          <span className="text-xs text-muted-foreground ml-2">Parsing AI analytics...</span>
                        </div>
                      ) : analyticsError ? (
                        <div className="flex items-center gap-2 text-warning bg-warning/10 border border-warning/20 p-4 rounded-xl text-xs font-semibold">
                          <Info className="h-4 w-4 flex-shrink-0" />
                          <span>{analyticsError}</span>
                        </div>
                      ) : analytics ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="p-4 rounded-2xl bg-secondary/5 border border-border/60">
                            <p className="text-xs text-muted-foreground font-semibold">Available (AI)</p>
                            <p className="text-2xl font-black text-success mt-1">{analytics.emptySlots}</p>
                          </div>
                          <div className="p-4 rounded-2xl bg-secondary/5 border border-border/60">
                            <p className="text-xs text-muted-foreground font-semibold">Occupied (AI)</p>
                            <p className="text-2xl font-black text-destructive mt-1">{analytics.occupiedSlots}</p>
                          </div>
                          <div className="p-4 rounded-2xl bg-secondary/5 border border-border/60">
                            <p className="text-xs text-muted-foreground font-semibold">Total Slots (AI)</p>
                            <p className="text-2xl font-black text-foreground mt-1">{analytics.totalSlots}</p>
                          </div>
                          <div className="p-4 rounded-2xl bg-secondary/5 border border-border/60">
                            <p className="text-xs text-muted-foreground font-semibold">AI Occupancy Rate</p>
                            <p className="text-2xl font-black text-primary mt-1">
                              {analytics.totalSlots > 0 ? ((analytics.occupiedSlots / analytics.totalSlots) * 100).toFixed(1) : 0}%
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="text-xs text-muted-foreground py-4">No AI data available yet</div>
                      )}
                    </div>

                    {/* Occupancy and Activities */}
                    <div className="grid lg:grid-cols-3 gap-6">
                      {/* Parking Grid Visualization */}
                      <div className="lg:col-span-2 bg-card border border-border rounded-3xl p-6 shadow-soft flex flex-col">
                        <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
                          <div>
                            <h3 className="font-bold text-lg">Occupancy Grid Map</h3>
                            <p className="text-xs text-muted-foreground">Graphical slots layout representation</p>
                          </div>
                          <div className="flex flex-wrap gap-2 text-[10px] font-bold">
                            <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded bg-success" /> Avail</span>
                            <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded bg-destructive" /> Occupied</span>
                            <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded bg-warning" /> Reserved</span>
                            <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded bg-muted-foreground" /> Maint.</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-5 gap-3 flex-1">
                          {slots.map((s) => {
                            let bg = "bg-success hover:bg-success/80";
                            if (s.status === "Occupied") bg = "bg-destructive text-white hover:bg-destructive/80";
                            else if (s.status === "Reserved") bg = "bg-primary text-primary-foreground hover:bg-primary/80";
                            else if (s.status === "Maintenance") bg = "bg-muted-foreground/30 text-muted-foreground hover:bg-muted-foreground/40";

                            return (
                              <div
                                key={s.id}
                                onClick={() => {
                                  toast.info(`Slot ${s.id} Details: Type: ${s.type} | Status: ${s.status}`);
                                }}
                                className={`p-3 rounded-xl flex flex-col justify-between items-start cursor-pointer transition-all duration-200 hover:scale-[1.03] shadow-sm select-none ${bg}`}
                              >
                                <div className="flex justify-between w-full">
                                  <span className="font-bold text-xs">{s.id}</span>
                                  <span className="text-[8px] font-bold uppercase opacity-80">{s.type}</span>
                                </div>
                                <span className="text-[9px] font-semibold tracking-wider uppercase opacity-75">{s.status}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Recent Activities Timeline */}
                      <div className="bg-card border border-border rounded-3xl p-6 shadow-soft flex flex-col">
                        <div className="border-b border-border pb-4 mb-4">
                          <h3 className="font-bold text-lg">Recent Operations Activity</h3>
                          <p className="text-xs text-muted-foreground">Live event stream from entry/exit booths</p>
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                          {activities.map((act) => (
                            <div key={act.id} className="flex gap-3 items-start text-xs border-b border-border/40 pb-3 last:border-0 last:pb-0">
                              <div className={`h-8 w-8 rounded-lg flex-shrink-0 grid place-items-center ${act.color}`}>
                                <act.icon className="h-4 w-4" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-foreground line-clamp-2">{act.text}</p>
                                <span className="text-[10px] text-muted-foreground flex items-center gap-1 mt-1">
                                  <Clock className="h-3 w-3" /> {act.time}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              )}

              {activeTab === "slots" && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-bold tracking-tight">Parking Slots Layout</h2>
                      <p className="text-sm text-muted-foreground">Manage capacity slots, status, zoning, and maintenance blocks.</p>
                    </div>
                    <button
                      onClick={() => setIsAddSlotOpen(true)}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-primary text-primary-foreground font-semibold rounded-xl text-xs hover:shadow-glow transition cursor-pointer"
                    >
                      <Plus className="h-4 w-4" /> Add Slot
                    </button>
                  </div>

                  {/* Toolbar */}
                  <div className="bg-card border border-border p-4 rounded-2xl shadow-soft flex flex-col sm:flex-row items-stretch sm:items-center gap-4 justify-between">
                    <div className="relative flex-1 max-w-md">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        placeholder="Search slot ID or type..."
                        value={slotsSearch}
                        onChange={(e) => setSlotsSearch(e.target.value)}
                        className="pl-10 pr-4 py-2.5 w-full border border-border bg-background text-sm rounded-xl outline-none focus:border-primary transition"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-muted-foreground">Filter Status:</span>
                      <select
                        value={slotsFilterStatus}
                        onChange={(e) => setSlotsFilterStatus(e.target.value)}
                        className="border border-border bg-background px-3 py-2 rounded-xl text-xs font-medium outline-none text-foreground"
                      >
                        {["All", "Available", "Occupied", "Reserved", "Maintenance"].map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Table Layout */}
                  <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-soft">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-muted/50 border-b border-border text-muted-foreground font-semibold uppercase tracking-wider">
                            <th className="p-4">Slot ID</th>
                            <th className="p-4">Zone</th>
                            <th className="p-4">Type Allowed</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/60">
                          {slots
                            .filter((s) => {
                              const matchesSearch = s.id.toLowerCase().includes(slotsSearch.toLowerCase()) || s.type.toLowerCase().includes(slotsSearch.toLowerCase());
                              const matchesStatus = slotsFilterStatus === "All" || s.status === slotsFilterStatus;
                              return matchesSearch && matchesStatus;
                            })
                            .map((s) => (
                              <tr key={s.id} className="hover:bg-muted/30 transition-colors">
                                <td className="p-4 font-bold text-foreground">{s.id}</td>
                                <td className="p-4 text-muted-foreground">{s.zone}</td>
                                <td className="p-4">
                                  <span className="px-2.5 py-1 bg-secondary text-white rounded-lg font-medium">
                                    {s.type}
                                  </span>
                                </td>
                                <td className="p-4">
                                  <span
                                    className={`px-2.5 py-1 rounded-full font-semibold ${
                                      s.status === "Available"
                                        ? "bg-success/10 text-success"
                                        : s.status === "Occupied"
                                        ? "bg-destructive/10 text-destructive"
                                        : s.status === "Reserved"
                                        ? "bg-primary/20 text-warning"
                                        : "bg-muted-foreground/15 text-muted-foreground"
                                    }`}
                                  >
                                    {s.status}
                                  </span>
                                </td>
                                <td className="p-4 text-right space-x-2">
                                  <button
                                    onClick={() => toggleSlotStatus(s.id, s.status)}
                                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 border rounded-lg font-semibold transition cursor-pointer text-[10px] ${
                                      s.status === "Maintenance"
                                        ? "bg-success/10 border-success/30 text-success hover:bg-success/20"
                                        : "bg-warning/10 border-warning/30 text-warning hover:bg-warning/20"
                                    }`}
                                  >
                                    <Power className="h-3 w-3" />
                                    {s.status === "Maintenance" ? "Enable" : "Disable"}
                                  </button>
                                  <button
                                    onClick={() => handleDeleteSlot(s.id)}
                                    disabled={s.status === "Occupied"}
                                    className="p-1.5 bg-destructive/10 text-destructive rounded-lg hover:bg-destructive/20 disabled:opacity-50 transition cursor-pointer"
                                    title={s.status === "Occupied" ? "Cannot remove occupied slot" : "Remove Slot"}
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "bookings" && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight">Active Bookings</h2>
                    <p className="text-sm text-muted-foreground">Manage upcoming reservations, check-ins, and ticket cancellations.</p>
                  </div>

                  {/* Filters and search */}
                  <div className="bg-card border border-border p-4 rounded-2xl shadow-soft flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                    <div className="flex gap-2">
                      {["All", "Active", "Completed", "Cancelled"].map((btn) => (
                        <button
                          key={btn}
                          onClick={() => setBookingsFilter(btn)}
                          className={`px-4 py-2 text-xs font-semibold rounded-xl border transition ${
                            bookingsFilter === btn
                              ? "bg-secondary text-white border-secondary"
                              : "bg-background border-border hover:border-muted-foreground/35"
                          }`}
                        >
                          {btn}
                        </button>
                      ))}
                    </div>
                    <div className="relative w-full sm:w-64">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        placeholder="Search customer, vehicle..."
                        value={bookingsSearch}
                        onChange={(e) => setBookingsSearch(e.target.value)}
                        className="pl-10 pr-4 py-2.5 w-full border border-border bg-background text-xs rounded-xl outline-none"
                      />
                    </div>
                  </div>

                  {/* Bookings Table */}
                  <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-soft">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-muted/50 border-b border-border text-muted-foreground font-semibold uppercase tracking-wider">
                            <th className="p-4">Booking ID</th>
                            <th className="p-4">Customer Name</th>
                            <th className="p-4">Vehicle Number</th>
                            <th className="p-4">Slot</th>
                            <th className="p-4">Reserved Interval</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/60">
                          {bookings
                            .filter((b) => {
                              const matchesSearch = b.customer.toLowerCase().includes(bookingsSearch.toLowerCase()) || b.vehicle.toLowerCase().includes(bookingsSearch.toLowerCase());
                              const matchesStatus = bookingsFilter === "All" || b.status === bookingsFilter;
                              return matchesSearch && matchesStatus;
                            })
                            .map((b) => (
                              <tr key={b.id} className="hover:bg-muted/30 transition-colors">
                                <td className="p-4 font-bold text-foreground">{b.id}</td>
                                <td className="p-4 font-semibold">{b.customer}</td>
                                <td className="p-4 text-muted-foreground">
                                  <span className="font-semibold text-foreground uppercase">{b.vehicle}</span>
                                  <span className="ml-1.5 px-2 py-0.5 bg-secondary/10 text-secondary rounded text-[9px] font-bold uppercase tracking-wider">
                                    {b.vehicleType}
                                  </span>
                                </td>
                                <td className="p-4 font-bold text-primary-foreground bg-primary/10 px-2 py-0.5 rounded text-center inline-block mt-3.5 ml-4">
                                  {b.slot}
                                </td>
                                <td className="p-4 text-muted-foreground">{b.time}</td>
                                <td className="p-4">
                                  <span
                                    className={`px-2.5 py-1 rounded-full font-semibold ${
                                      b.status === "Active"
                                        ? "bg-success/10 text-success"
                                        : b.status === "Completed"
                                        ? "bg-secondary text-white"
                                        : "bg-destructive/10 text-destructive"
                                    }`}
                                  >
                                    {b.status}
                                  </span>
                                </td>
                                <td className="p-4 text-right">
                                  {b.status === "Active" && (
                                    <button
                                      onClick={() => handleCancelBooking(b.id)}
                                      className="px-3 py-1.5 bg-destructive/10 text-destructive hover:bg-destructive/20 font-semibold rounded-lg transition text-[10px]"
                                    >
                                      Cancel
                                    </button>
                                  )}
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "vehicles" && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight">Active Vehicles Parked</h2>
                    <p className="text-sm text-muted-foreground">Monitor vehicles currently parked inside the lot based on entry gates telemetry.</p>
                  </div>

                  {/* Toolbar */}
                  <div className="bg-card border border-border p-4 rounded-2xl shadow-soft">
                    <div className="relative max-w-md">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        placeholder="Search vehicle number plate..."
                        value={vehiclesSearch}
                        onChange={(e) => setVehiclesSearch(e.target.value)}
                        className="pl-10 pr-4 py-2.5 w-full border border-border bg-background text-xs rounded-xl outline-none"
                      />
                    </div>
                  </div>

                  {/* Vehicle Table */}
                  <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-soft">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-muted/50 border-b border-border text-muted-foreground font-semibold uppercase tracking-wider">
                            <th className="p-4">Vehicle Number</th>
                            <th className="p-4">Owner / Visitor</th>
                            <th className="p-4">Type</th>
                            <th className="p-4">Booth Entry Time</th>
                            <th className="p-4">Allocated Slot</th>
                            <th className="p-4">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/60">
                          {vehicles
                            .filter((v) => v.plate.toLowerCase().includes(vehiclesSearch.toLowerCase()))
                            .map((v) => (
                              <tr key={v.plate} className="hover:bg-muted/30 transition-colors">
                                <td className="p-4 font-bold text-foreground uppercase">{v.plate}</td>
                                <td className="p-4 text-muted-foreground font-medium">{v.owner}</td>
                                <td className="p-4">
                                  <span className="px-2.5 py-1 bg-secondary text-white rounded-lg font-medium">
                                    {v.type}
                                  </span>
                                </td>
                                <td className="p-4 text-muted-foreground">{v.entry}</td>
                                <td className="p-4 font-bold text-foreground">{v.slot}</td>
                                <td className="p-4">
                                  <span className="px-2.5 py-1 rounded-full font-semibold bg-success/15 text-success">
                                    {v.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "cctv" && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight">CCTV Camera Monitoring</h2>
                    <p className="text-sm text-muted-foreground">Live operations feeds from entry gates, parking lanes, and exits.</p>
                  </div>

                  {/* Camera feeds grid */}
                  <div className="grid sm:grid-cols-2 gap-6">
                    <CctvCamera name="CAM-01: Main Entrance Gate" vehicleCount={3} slotCount={availableCount} cctvTime={cctvTime} status="Online" />
                    <CctvCamera name="CAM-02: Zone A Lane 4" vehicleCount={12} slotCount={1} cctvTime={cctvTime} status="Online" />
                    <CctvCamera name="CAM-03: EV Station Lane" vehicleCount={2} slotCount={3} cctvTime={cctvTime} status="Online" />
                    <CctvCamera name="CAM-04: Exit Booth 1" vehicleCount={1} slotCount={0} cctvTime={cctvTime} status="Online" />
                  </div>
                </div>
              )}

              {activeTab === "settings" && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight">System Settings</h2>
                    <p className="text-sm text-muted-foreground">Adjust parking limits, capacity, rates, and facilities config.</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Parking Profile Info */}
                    <SettingsSection title="Parking Information" icon={Building}>
                      <form
                        onSubmit={(e) => {
                          const fd = new FormData(e.currentTarget);
                          handleSaveSettings(e, "Parking Information", {
                            parkingName: fd.get("name"),
                            parkingAddress: fd.get("address"),
                            area: fd.get("area"),
                            city: fd.get("city"),
                          });
                        }}
                        className="space-y-4"
                      >
                        <div>
                          <label className="text-xs font-semibold uppercase text-muted-foreground">Parking Facility Name</label>
                          <input
                            name="name"
                            defaultValue={profile?.parkingName}
                            className="mt-2 w-full px-4 py-2.5 border border-border bg-background rounded-xl text-xs outline-none text-foreground"
                            required
                          />
                        </div>
                        <div>
                          <label className="text-xs font-semibold uppercase text-muted-foreground">Facility Address</label>
                          <input
                            name="address"
                            defaultValue={profile?.parkingAddress}
                            className="mt-2 w-full px-4 py-2.5 border border-border bg-background rounded-xl text-xs outline-none text-foreground"
                            required
                          />
                        </div>
                        <div>
                          <label className="text-xs font-semibold uppercase text-muted-foreground">Area / Locality</label>
                          <input
                            name="area"
                            defaultValue={profile?.area}
                            className="mt-2 w-full px-4 py-2.5 border border-border bg-background rounded-xl text-xs outline-none text-foreground"
                            required
                          />
                        </div>
                        <div>
                          <label className="text-xs font-semibold uppercase text-muted-foreground">City</label>
                          <input
                            name="city"
                            defaultValue={profile?.city}
                            className="mt-2 w-full px-4 py-2.5 border border-border bg-background rounded-xl text-xs outline-none text-foreground"
                            required
                          />
                        </div>
                        <button type="submit" className="w-full py-2.5 bg-primary text-primary-foreground font-semibold rounded-xl text-xs hover:shadow-glow transition">
                          Save Changes
                        </button>
                      </form>
                    </SettingsSection>

                    {/* Capacity Limits */}
                    <SettingsSection title="Capacity Constraints" icon={Car}>
                      <form
                        onSubmit={(e) => {
                          const fd = new FormData(e.currentTarget);
                          handleSaveSettings(e, "Parking Capacity Limits", {
                            totalCapacity: parseInt(String(fd.get("total") ?? "100")),
                            bikeSlots: parseInt(String(fd.get("bikes") ?? "0")),
                            carSlots: parseInt(String(fd.get("cars") ?? "0")),
                            suvSlots: parseInt(String(fd.get("suvs") ?? "0")),
                            truckSlots: parseInt(String(fd.get("trucks") ?? "0")),
                          });
                        }}
                        className="space-y-4"
                      >
                        <div className="grid grid-cols-5 gap-2">
                          <div>
                            <label className="text-[9px] font-bold uppercase text-muted-foreground">Total</label>
                            <input
                              name="total"
                              type="number"
                              defaultValue={profile?.totalCapacity}
                              className="mt-2 w-full px-2 py-2 border border-border bg-background rounded-xl text-xs outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] font-bold uppercase text-muted-foreground">Bikes</label>
                            <input
                              name="bikes"
                              type="number"
                              defaultValue={profile?.bikeSlots}
                              className="mt-2 w-full px-2 py-2 border border-border bg-background rounded-xl text-xs outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] font-bold uppercase text-muted-foreground">Cars</label>
                            <input
                              name="cars"
                              type="number"
                              defaultValue={profile?.carSlots}
                              className="mt-2 w-full px-2 py-2 border border-border bg-background rounded-xl text-xs outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] font-bold uppercase text-muted-foreground">SUVs</label>
                            <input
                              name="suvs"
                              type="number"
                              defaultValue={profile?.suvSlots}
                              className="mt-2 w-full px-2 py-2 border border-border bg-background rounded-xl text-xs outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] font-bold uppercase text-muted-foreground">Trucks</label>
                            <input
                              name="trucks"
                              type="number"
                              defaultValue={profile?.truckSlots}
                              className="mt-2 w-full px-2 py-2 border border-border bg-background rounded-xl text-xs outline-none"
                            />
                          </div>
                        </div>
                        <button type="submit" className="w-full py-2.5 bg-primary text-primary-foreground font-semibold rounded-xl text-xs hover:shadow-glow transition">
                          Save Capacity Settings
                        </button>
                      </form>
                    </SettingsSection>

                    {/* Tariff Rates Pricing config */}
                    <SettingsSection title="Hourly Price configuration" icon={Clock}>
                      <form
                        onSubmit={(e) => {
                          const fd = new FormData(e.currentTarget);
                          handleSaveSettings(e, "Price Tariff", {
                            bikePrice: parseInt(String(fd.get("bike") ?? "20")),
                            carPrice: parseInt(String(fd.get("car") ?? "40")),
                            suvPrice: parseInt(String(fd.get("suv") ?? "60")),
                            truckPrice: parseInt(String(fd.get("truck") ?? "80")),
                          });
                        }}
                        className="space-y-4"
                      >
                        <div className="grid grid-cols-4 gap-2">
                          <div>
                            <label className="text-[9px] font-bold uppercase text-muted-foreground">Bike Rate (₹)</label>
                            <input
                              name="bike"
                              type="number"
                              defaultValue={profile?.bikePrice}
                              className="mt-2 w-full px-2 py-2 border border-border bg-background rounded-xl text-xs outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] font-bold uppercase text-muted-foreground">Car Rate (₹)</label>
                            <input
                              name="car"
                              type="number"
                              defaultValue={profile?.carPrice}
                              className="mt-2 w-full px-2 py-2 border border-border bg-background rounded-xl text-xs outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] font-bold uppercase text-muted-foreground">SUV Rate (₹)</label>
                            <input
                              name="suv"
                              type="number"
                              defaultValue={profile?.suvPrice}
                              className="mt-2 w-full px-2 py-2 border border-border bg-background rounded-xl text-xs outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] font-bold uppercase text-muted-foreground">Truck Rate (₹)</label>
                            <input
                              name="truck"
                              type="number"
                              defaultValue={profile?.truckPrice}
                              className="mt-2 w-full px-2 py-2 border border-border bg-background rounded-xl text-xs outline-none"
                            />
                          </div>
                        </div>
                        <button type="submit" className="w-full py-2.5 bg-primary text-primary-foreground font-semibold rounded-xl text-xs hover:shadow-glow transition">
                          Update Rates
                        </button>
                      </form>
                    </SettingsSection>

                    {/* Facilities Config checklist */}
                    <SettingsSection title="Facilities Provided" icon={CheckCircle2}>
                      <div className="grid grid-cols-2 gap-2 text-xs py-2">
                        {facilitiesOptions.map((fac) => {
                          const active = profile?.facilities?.includes(fac.id);
                          return (
                            <div key={fac.id} className="flex items-center gap-2 border border-border p-3 rounded-xl bg-background">
                              <div className={`h-4 w-4 rounded-full border grid place-items-center ${active ? "bg-primary border-primary text-primary-foreground" : "border-border bg-card"}`}>
                                {active && <Check className="h-2.5 w-2.5 stroke-[3]" />}
                              </div>
                              <span className="font-semibold text-muted-foreground">{fac.label}</span>
                            </div>
                          );
                        })}
                      </div>
                    </SettingsSection>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Add Slot Modal UI */}
      {isAddSlotOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <form
            onSubmit={handleAddSlot}
            className="bg-card border border-border max-w-md w-full rounded-3xl p-6 space-y-4 shadow-card animate-in zoom-in-95 duration-200 text-left"
          >
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-bold text-lg text-foreground">Add New Parking Slot</h3>
              <button type="button" onClick={() => setIsAddSlotOpen(false)} className="p-1 hover:bg-muted rounded-lg transition">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase text-muted-foreground">Slot ID / Number</label>
              <input
                type="text"
                value={newSlotId}
                onChange={(e) => setNewSlotId(e.target.value)}
                placeholder="e.g. A-12, B-05"
                className="mt-2 w-full px-4 py-2.5 border border-border bg-background rounded-xl text-xs outline-none"
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase text-muted-foreground">Zone Location</label>
              <select
                value={newSlotZone}
                onChange={(e) => setNewSlotZone(e.target.value)}
                className="mt-2 w-full px-4 py-2.5 border border-border bg-background rounded-xl text-xs outline-none"
              >
                {["Zone A", "Zone B", "Zone C", "Zone D"].map((z) => (
                  <option key={z} value={z}>
                    {z}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase text-muted-foreground">Vehicle Type allowed</label>
              <select
                value={newSlotType}
                onChange={(e) => setNewSlotType(e.target.value)}
                className="mt-2 w-full px-4 py-2.5 border border-border bg-background rounded-xl text-xs outline-none"
              >
                {["Car", "Bike", "SUV", "Truck"].map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase text-muted-foreground">Initial Status</label>
              <select
                value={newSlotStatus}
                onChange={(e) => setNewSlotStatus(e.target.value)}
                className="mt-2 w-full px-4 py-2.5 border border-border bg-background rounded-xl text-xs outline-none"
              >
                {["Available", "Occupied", "Reserved", "Maintenance"].map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-3 justify-end pt-3 border-t border-border">
              <button
                type="button"
                onClick={() => setIsAddSlotOpen(false)}
                className="px-4 py-2.5 border border-border rounded-xl text-xs font-semibold hover:bg-muted transition"
              >
                Cancel
              </button>
              <button type="submit" className="px-4 py-2.5 bg-primary text-primary-foreground font-semibold rounded-xl text-xs hover:shadow-glow transition">
                Save Slot
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

// Sidebar Link Wrapper Component
function SidebarLink({ active, icon: Icon, label, onClick }: { active: boolean; icon: any; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
        active
          ? "bg-primary text-primary-foreground font-bold shadow-soft"
          : "text-white/70 hover:bg-white/5 hover:text-white"
      }`}
    >
      <Icon className="h-5 w-5" />
      {label}
    </button>
  );
}

// Stats Card Component
function StatsCard({ label, value, subtext, color, icon: Icon }: { label: string; value: string | number; subtext: string; color: string; icon: any }) {
  return (
    <div className={`bg-card border border-border rounded-3xl p-6 shadow-soft hover:shadow-card hover-lift transition-all relative overflow-hidden`}>
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider">{label}</span>
          <p className="text-3xl font-extrabold tracking-tight">{value}</p>
        </div>
        <div className={`h-10 w-10 rounded-xl bg-muted grid place-items-center`}>
          <Icon className="h-5 w-5 text-muted-foreground" />
        </div>
      </div>
      <p className="text-xs text-muted-foreground mt-4 font-semibold">{subtext}</p>
    </div>
  );
}

// CCTV Camera Component with overlay effects
function CctvCamera({
  name,
  vehicleCount,
  slotCount,
  cctvTime,
  status,
}: {
  name: string;
  vehicleCount: number;
  slotCount: number;
  cctvTime: string;
  status: string;
}) {
  return (
    <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-soft flex flex-col">
      {/* CCTV Screen Screen */}
      <div className="relative aspect-video bg-black flex flex-col justify-between p-3 select-none overflow-hidden group">
        {/* Simulated CCTV Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,6px_100%] pointer-events-none opacity-40" />

        {/* HUD UI Header */}
        <div className="flex justify-between items-start z-10 text-[9px] font-bold font-mono text-green-500 uppercase tracking-widest bg-black/40 px-2 py-1 rounded">
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 bg-destructive rounded-full animate-ping" /> {name}
          </span>
          <span>1080P @ 30FPS</span>
        </div>

        {/* Graphical Representation of Parking Lot Bounding boxes */}
        <div className="absolute inset-0 flex items-center justify-center p-6 gap-4 pointer-events-none opacity-30">
          <div className="border border-green-500/40 w-1/4 h-2/3 flex flex-col justify-end p-1">
            <span className="text-[7px] text-green-500 font-mono">SLOT-A1 [FREE]</span>
          </div>
          <div className="border border-destructive/40 bg-destructive/5 w-1/4 h-2/3 flex flex-col justify-end p-1 relative">
            <div className="absolute inset-2 border border-dashed border-red-500/50 flex items-center justify-center">
              <span className="text-[6px] text-red-500 font-mono">CAR DETECTED</span>
            </div>
            <span className="text-[7px] text-red-500 font-mono">SLOT-A2 [OCCUPIED]</span>
          </div>
          <div className="border border-green-500/40 w-1/4 h-2/3 flex flex-col justify-end p-1">
            <span className="text-[7px] text-green-500 font-mono">SLOT-A3 [FREE]</span>
          </div>
        </div>

        {/* HUD UI Footer */}
        <div className="flex justify-between items-end z-10 text-[9px] font-mono text-green-500 bg-black/40 px-2 py-1 rounded mt-auto">
          <span>{cctvTime || "2026-06-11 12:00:00"}</span>
          <span className="text-right">
            OBJECTS: {vehicleCount} | FREE SLOTS: {slotCount}
          </span>
        </div>
      </div>

      {/* Cam Meta */}
      <div className="p-4 border-t border-border flex justify-between items-center bg-card">
        <div>
          <h4 className="font-bold text-xs">{name.split(":")[0]}</h4>
          <p className="text-[10px] text-muted-foreground mt-0.5">{name.split(":")[1]}</p>
        </div>
        <span className="px-2 py-0.5 bg-success/10 text-success rounded text-[9px] font-bold uppercase tracking-wider flex items-center gap-1">
          <span className="h-1.5 w-1.5 bg-success rounded-full" />
          {status}
        </span>
      </div>
    </div>
  );
}

// Settings Card Wrapper Component
function SettingsSection({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) {
  return (
    <div className="bg-card border border-border rounded-3xl p-6 shadow-soft flex flex-col">
      <div className="flex items-center gap-2 pb-3 border-b border-border mb-4">
        <Icon className="h-5 w-5 text-primary" />
        <h3 className="font-bold text-sm text-foreground">{title}</h3>
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}

function ZoneCard({
  title,
  capacity,
  occupied,
  reserved,
  maintenance,
}: {
  title: string;
  capacity: number;
  occupied: number;
  reserved: number;
  maintenance: number;
}) {
  const available = Math.max(0, capacity - occupied - reserved - maintenance);
  return (
    <div className="bg-card border border-border rounded-2xl p-5 shadow-soft space-y-3">
      <h4 className="font-bold text-xs text-primary uppercase tracking-wider">{title}</h4>
      <div className="grid grid-cols-3 gap-2 text-center text-xs">
        <div className="bg-muted/30 p-2 rounded-xl">
          <p className="text-muted-foreground text-[10px] uppercase font-bold">Cap</p>
          <p className="text-sm font-extrabold text-foreground">{capacity}</p>
        </div>
        <div className="bg-destructive/10 p-2 rounded-xl">
          <p className="text-destructive text-[10px] uppercase font-bold">Occ</p>
          <p className="text-sm font-extrabold text-destructive">{occupied + reserved}</p>
        </div>
        <div className="bg-success/15 p-2 rounded-xl">
          <p className="text-success text-[10px] uppercase font-bold">Avail</p>
          <p className="text-sm font-extrabold text-success">{available}</p>
        </div>
      </div>
    </div>
  );
}
