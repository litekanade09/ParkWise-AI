import { createFileRoute } from "@tanstack/react-router";
import { Calendar, Car, Clock, MapPin, Search, Sparkles, Info } from "lucide-react";
import { useEffect, useState } from "react";
import { loadSession, saveSession, type Booking } from "@/lib/smartpark-store";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/book")({
  component: BookParking,
});

function BookParking() {
  const [selected, setSelected] = useState<string | null>(null);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [selectedVehId, setSelectedVehId] = useState<string>("");
  const [dbLots, setDbLots] = useState<any[]>([]);
  const [loadingLots, setLoadingLots] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // AI Occupancy Analytics States
  const [analytics, setAnalytics] = useState<any>(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState<boolean>(false);
  const [analyticsError, setAnalyticsError] = useState<string | null>(null);

  useEffect(() => {
    if (!selected) {
      setAnalytics(null);
      setAnalyticsError(null);
      return;
    }

    const fetchAnalytics = async () => {
      setLoadingAnalytics(true);
      setAnalyticsError(null);
      try {
        const s = loadSession();
        const headers: any = {};
        if (s.profile?.token) {
          headers["Authorization"] = `Bearer ${s.profile.token}`;
        }
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/analytics/${selected}`, { headers });
        const json = await res.json();
        if (json.success) {
          setAnalytics(json.data);
        } else {
          setAnalyticsError("No AI data available yet");
        }
      } catch (err) {
        console.error("Error fetching analytics:", err);
        setAnalyticsError("No AI data available yet");
      } finally {
        setLoadingAnalytics(false);
      }
    };

    fetchAnalytics();
  }, [selected]);

  const fetchLots = async (query = "") => {
    setLoadingLots(true);
    try {
      const s = loadSession();
      const headers: any = {};
      if (s.profile?.token) {
        headers["Authorization"] = `Bearer ${s.profile.token}`;
      }
      const url = query.trim()
        ? `${import.meta.env.VITE_API_URL}/api/parking-lots/search?q=${encodeURIComponent(query)}`
        : `${import.meta.env.VITE_API_URL}/api/parking-lots`;
      const res = await fetch(url, { headers });
      const json = await res.json();
      if (json.success) {
        setDbLots(json.data);
      } else {
        setDbLots([]);
      }
    } catch (err) {
      console.error("Error loading parking lots:", err);
      setDbLots([]);
    } finally {
      setLoadingLots(false);
    }
  };

  useEffect(() => {
    const s = loadSession();
    setVehicles(s.vehicles || []);
    if (s.vehicles && s.vehicles.length > 0) {
      setSelectedVehId(s.vehicles[0].id);
    }
    fetchLots();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchLots(searchQuery);
  };

  const selectedVehicle = vehicles.find((v) => v.id === selectedVehId) || vehicles[0];
  const selectedVehicleType = selectedVehicle ? selectedVehicle.type : "Car";

  const getPriceForType = (lot: any, type: string) => {
    switch (type) {
      case "Bike":
        return lot.bikePrice !== undefined ? lot.bikePrice : 10;
      case "Car":
      case "Electric Vehicle":
        return lot.carPrice !== undefined ? lot.carPrice : 20;
      case "SUV":
        return lot.suvPrice !== undefined ? lot.suvPrice : 30;
      case "Truck":
        return lot.truckPrice !== undefined ? lot.truckPrice : 50;
      default:
        return lot.carPrice !== undefined ? lot.carPrice : 20;
    }
  };

  const getSlotsForType = (lot: any, type: string) => {
    switch (type) {
      case "Bike":
        return lot.bikeSlots || 0;
      case "Car":
      case "Electric Vehicle":
        return lot.carSlots || 0;
      case "SUV":
        return lot.suvSlots || 0;
      case "Truck":
        return lot.truckSlots || 0;
      default:
        return lot.carSlots || 0;
    }
  };

  async function book(lotName: string, lotDbId: string, price: number) {
    const s = loadSession();
    const userId = s.profile?.id || "6a2a6989ce280a2f405ff00b";

    if (vehicles.length === 0) {
      toast.error("Please add a vehicle first in the My Vehicles section.");
      return;
    }

    const targetVehId = selectedVehId || vehicles[0].id;
    const selectedVeh = vehicles.find((v) => v.id === targetVehId) || vehicles[0];
    const vehicleType = selectedVeh ? selectedVeh.type : "Car";
    const targetSlotType = (vehicleType === "Electric Vehicle") ? "Car" : vehicleType;

    try {
      const token = s.profile?.token;
      const headers: any = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      // 1. Fetch or create a slot in the database for this parking lot
      const slotQueryRes = await fetch(`${import.meta.env.VITE_API_URL}/api/slots?parkingLotId=${lotDbId}&status=empty&slotType=${targetSlotType}`, { headers });
      const slotQueryJson = await slotQueryRes.json();
      let slotId = "";
      let slotName = "";

      if (slotQueryJson.success && slotQueryJson.data.length > 0) {
        slotId = slotQueryJson.data[0]._id;
        slotName = slotQueryJson.data[0].slotId;
      } else {
        // Validate capacity before creating a slot on the fly
        const targetLot = dbLots.find((l) => l._id === lotDbId);
        if (!targetLot) {
          toast.error("Target parking lot data is missing.");
          return;
        }

        const maxCapacity = getSlotsForType(targetLot, targetSlotType);
        
        // Fetch all slots of this type currently registered in database
        const allSlotsRes = await fetch(`${import.meta.env.VITE_API_URL}/api/slots?parkingLotId=${lotDbId}&slotType=${targetSlotType}`, { headers });
        const allSlotsJson = await allSlotsRes.json();
        const currentSlotCount = allSlotsJson.success ? allSlotsJson.data.length : 0;

        if (currentSlotCount >= maxCapacity) {
          toast.error("No available slots currently. All slots for your vehicle type are occupied or reserved.");
          return;
        }

        // Create an empty slot on the fly
        const zoneMap: Record<string, string> = {
          "Bike": "Zone 1",
          "Car": "Zone 2",
          "SUV": "Zone 3",
          "Truck": "Zone 4",
        };
        const targetZone = zoneMap[targetSlotType] || "Zone 2";
        const prefixMap: Record<string, string> = {
          "Bike": "B",
          "Car": "C",
          "SUV": "S",
          "Truck": "T",
        };
        const prefix = prefixMap[targetSlotType] || "C";
        slotName = `${prefix}${Math.floor(1 + Math.random() * 99)}`;

        const newSlotRes = await fetch(`${import.meta.env.VITE_API_URL}/api/slots`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            parkingLotId: lotDbId,
            slotId: slotName,
            zone: targetZone,
            slotType: targetSlotType,
            status: "empty",
          }),
        });

        const newSlotJson = await newSlotRes.json();
        if (!newSlotJson.success) {
          throw new Error(newSlotJson.message || "Failed to initialize slot in database");
        }
        slotId = newSlotJson.data._id;
        slotName = newSlotJson.data.slotId;
      }

      // 2. Create the Booking on Backend
      const now = new Date();
      const exit = new Date(Date.now() + 3 * 3600 * 1000); // 3 hours duration

      const bookRes = await fetch(`${import.meta.env.VITE_API_URL}/api/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          userId,
          vehicleId: targetVehId,
          parkingLotId: lotDbId,
          slotId: slotId,
          entryTime: now.toISOString(),
          exitTime: exit.toISOString(),
          price: price,
        }),
      });

      const bookJson = await bookRes.json();
      if (!bookJson.success) {
        throw new Error(bookJson.message || "Failed to register booking in database");
      }

      // 3. Save to Local Session to display visually
      const newBooking: Booking = {
        id: bookJson.data._id,
        lot: lotName,
        slot: slotName, 
        date: now.toISOString().slice(0, 10),
        time: now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
        status: "Upcoming",
        price: price,
      };

      saveSession({ ...s, bookings: [newBooking, ...s.bookings] });
      toast.success(`Your ParkWise AI booking has been created successfully! ${lotName} · Booking ID: ${bookJson.data._id}`);
      
      // Refresh the search list
      fetchLots(searchQuery);
    } catch (err: any) {
      toast.error(err.message || "Could not register booking in database");
      console.error(err);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Book Parking</h1>
        <p className="text-muted-foreground mt-1">Find the perfect parking spot near you.</p>
      </div>

      {/* Search */}
      <form onSubmit={handleSearchSubmit} className="bg-card border border-border rounded-2xl p-5 shadow-soft">
        <div className="grid md:grid-cols-5 gap-3">
          <FieldIcon
            icon={MapPin}
            placeholder="Enter location, area or city (e.g. Virar Market, Mumbai)"
            className="md:col-span-2 text-foreground"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <FieldIcon icon={Calendar} type="date" defaultValue={new Date().toISOString().slice(0, 10)} />
          <FieldIcon icon={Clock} type="time" defaultValue="15:00" />
          
          <select
            value={selectedVehId}
            onChange={(e) => setSelectedVehId(e.target.value)}
            className="px-4 py-3 rounded-xl border border-border bg-background focus:border-primary outline-none text-sm text-foreground"
          >
            {vehicles.length === 0 ? (
              <option value="">No vehicles registered</option>
            ) : (
              vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.number} ({v.type})
                </option>
              ))
            )}
          </select>
        </div>
        <button type="submit" className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold shadow-soft hover:shadow-glow transition cursor-pointer">
          <Search className="h-4 w-4" /> Find Parking
        </button>
      </form>

      {/* Results grid */}
      {loadingLots ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-64 bg-card border border-border rounded-3xl p-5 space-y-4">
              <div className="aspect-video bg-muted rounded-xl"></div>
              <div className="h-4 bg-muted rounded w-2/3"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : dbLots.length === 0 ? (
        <div className="bg-card border border-border border-dashed rounded-2xl p-16 text-center">
          <MapPin className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 font-semibold text-foreground">No parking lots found</h3>
          <p className="text-sm text-muted-foreground mt-1">Try searching for other areas or cities.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dbLots.map((l) => {
            const displayPrice = getPriceForType(l, selectedVehicleType);
            const availableSlots = getSlotsForType(l, selectedVehicleType);

            return (
              <div
                key={l._id}
                onClick={() => setSelected(l._id)}
                className={`group cursor-pointer rounded-2xl bg-card border p-5 transition hover-lift ${
                  selected === l._id ? "border-primary ring-2 ring-primary/30" : "border-border"
                }`}
              >
                <div className="aspect-video rounded-xl bg-secondary mb-4 relative overflow-hidden p-3">
                  <span className="absolute top-3 right-3 px-2 py-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold">★ 4.8</span>
                  <div className="grid grid-cols-8 gap-1 absolute inset-3 opacity-30">
                    {Array.from({ length: 32 }).map((_, i) => (
                      <div key={i} className="rounded-sm bg-success/80" />
                    ))}
                  </div>
                </div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-foreground text-base line-clamp-1">{l.parkingName}</h3>
                    <p className="text-xs text-muted-foreground font-semibold flex items-center gap-1 mt-0.5"><MapPin className="h-3 w-3" /> {l.area} · {l.city}</p>
                    <p className="text-[10px] text-muted-foreground mt-1 line-clamp-1">{l.parkingAddress}</p>
                    <span className="inline-block mt-2 px-2 py-0.5 bg-muted text-muted-foreground text-[9px] font-bold rounded">
                      {l.parkingType}
                    </span>
                  </div>
                  <p className="text-lg font-bold text-foreground flex-shrink-0">
                    ₹{displayPrice}
                    <span className="text-[10px] font-normal text-muted-foreground">/hr</span>
                  </p>
                </div>
                
                {/* AI Live Availability Sub-Card */}
                {selected === l._id && (
                  <div className="mt-4 pt-4 border-t border-border space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    <p className="text-xs font-bold text-primary flex items-center gap-1">
                      <Sparkles className="h-3.5 w-3.5 text-primary animate-pulse" />
                      AI Live Availability
                    </p>
                    {loadingAnalytics ? (
                      <div className="flex items-center gap-1.5 py-2 text-[10px] text-muted-foreground font-semibold">
                        <div className="h-3.5 w-3.5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                        Parsing AI analytics...
                      </div>
                    ) : analyticsError ? (
                      <div className="flex items-center gap-1.5 bg-warning/5 border border-warning/15 p-2 rounded-xl text-[10px] text-warning font-semibold">
                        <Info className="h-3.5 w-3.5 flex-shrink-0" />
                        <span>{analyticsError}</span>
                      </div>
                    ) : analytics ? (
                      <div className="grid grid-cols-2 gap-2 text-[10px] bg-secondary/5 p-2.5 rounded-xl border border-border/40 font-semibold text-foreground">
                        <div className="flex justify-between px-1">
                          <span className="text-muted-foreground">Available (AI):</span>
                          <span className="text-success font-black">{analytics.emptySlots}</span>
                        </div>
                        <div className="flex justify-between px-1">
                          <span className="text-muted-foreground">Occupied (AI):</span>
                          <span className="text-destructive font-black">{analytics.occupiedSlots}</span>
                        </div>
                        <div className="flex justify-between px-1 col-span-2 border-t border-border/30 pt-1 mt-1">
                          <span className="text-muted-foreground">AI Occupancy Rate:</span>
                          <span className="text-primary font-black">
                            {analytics.totalSlots > 0 ? ((analytics.occupiedSlots / analytics.totalSlots) * 100).toFixed(1) : 0}%
                          </span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-[10px] text-muted-foreground">No live data available yet</p>
                    )}
                  </div>
                )}

                <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                  <span className="text-xs font-bold text-success">
                    {availableSlots === 0 ? (
                      <span className="text-destructive font-bold flex items-center gap-1">
                        <Info className="h-3.5 w-3.5 flex-shrink-0 animate-pulse" />
                        No available slots currently
                      </span>
                    ) : (
                      `${availableSlots} slots available (Capacity: ${l.totalCapacity})`
                    )}
                  </span>
                  <button
                    disabled={availableSlots === 0}
                    onClick={(e) => { e.stopPropagation(); book(l.parkingName, l._id, displayPrice); }}
                    className={`px-4 py-2 rounded-lg font-semibold text-xs transition ${
                      availableSlots === 0
                        ? "bg-muted text-muted-foreground cursor-not-allowed opacity-60"
                        : "bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground cursor-pointer"
                    }`}
                  >
                    {availableSlots === 0 ? "Full" : "Book Now"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function FieldIcon({ icon: Icon, className = "", ...rest }: React.InputHTMLAttributes<HTMLInputElement> & { icon: React.ComponentType<{ className?: string }> }) {
  return (
    <div className={`relative ${className}`}>
      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <input {...rest} className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none transition text-sm text-foreground" />
    </div>
  );
}
