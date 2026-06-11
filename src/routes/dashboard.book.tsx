import { createFileRoute } from "@tanstack/react-router";
import { Calendar, Car, Clock, MapPin, Search } from "lucide-react";
import { useState } from "react";
import { loadSession, saveSession, type Booking } from "@/lib/smartpark-store";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/book")({
  component: BookParking,
});

const lots = [
  { name: "City Centre Mall", distance: "0.4 km", price: 40, avail: 12, total: 80, rating: 4.8 },
  { name: "Marina Square", distance: "1.2 km", price: 30, avail: 24, total: 60, rating: 4.6 },
  { name: "Tech Park Tower", distance: "2.1 km", price: 50, avail: 4, total: 100, rating: 4.9 },
  { name: "Airport Terminal 2", distance: "8.4 km", price: 80, avail: 38, total: 200, rating: 4.7 },
  { name: "Downtown Plaza", distance: "1.8 km", price: 35, avail: 18, total: 75, rating: 4.5 },
  { name: "Riverside Hub", distance: "3.0 km", price: 28, avail: 9, total: 50, rating: 4.4 },
];

function BookParking() {
  const [selected, setSelected] = useState<string | null>(null);

  function book(lot: string) {
    const s = loadSession();
    const newBooking: Booking = {
      id: "BK-" + Math.floor(1000 + Math.random() * 9000),
      lot,
      slot: ["A", "B", "C", "D"][Math.floor(Math.random() * 4)] + "-" + Math.floor(1 + Math.random() * 30),
      date: new Date().toISOString().slice(0, 10),
      time: "15:00",
      status: "Upcoming",
      price: lots.find((l) => l.name === lot)?.price ?? 40,
    };
    saveSession({ ...s, bookings: [newBooking, ...s.bookings] });
    toast.success(`Booked ${lot} · Slot ${newBooking.slot}`);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Book Parking</h1>
        <p className="text-muted-foreground mt-1">Find the perfect parking spot near you.</p>
      </div>

      {/* Search */}
      <div className="bg-card border border-border rounded-2xl p-5 shadow-soft">
        <div className="grid md:grid-cols-5 gap-3">
          <FieldIcon icon={MapPin} placeholder="Enter location" className="md:col-span-2" />
          <FieldIcon icon={Calendar} type="date" defaultValue={new Date().toISOString().slice(0, 10)} />
          <FieldIcon icon={Clock} type="time" defaultValue="15:00" />
          <select className="px-4 py-3 rounded-xl border border-border bg-background focus:border-primary outline-none">
            <option>Car</option><option>Bike</option><option>SUV</option><option>Truck</option><option>EV</option>
          </select>
        </div>
        <button className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold shadow-soft hover:shadow-glow transition">
          <Search className="h-4 w-4" /> Find Parking
        </button>
      </div>

      {/* Results grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {lots.map((l) => (
          <div
            key={l.name}
            onClick={() => setSelected(l.name)}
            className={`group cursor-pointer rounded-2xl bg-card border p-5 transition hover-lift ${
              selected === l.name ? "border-primary ring-2 ring-primary/30" : "border-border"
            }`}
          >
            <div className="aspect-video rounded-xl bg-secondary mb-4 relative overflow-hidden p-3">
              <span className="absolute top-3 right-3 px-2 py-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold">★ {l.rating}</span>
              <div className="grid grid-cols-8 gap-1 absolute inset-3">
                {Array.from({ length: 32 }).map((_, i) => {
                  const free = (i * 13 + l.price) % 3 !== 0;
                  return <div key={i} className={`rounded-sm ${free ? "bg-success/80" : "bg-destructive/60"}`} />;
                })}
              </div>
            </div>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold">{l.name}</h3>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5"><MapPin className="h-3 w-3" /> {l.distance}</p>
              </div>
              <p className="text-lg font-bold">₹{l.price}<span className="text-xs font-normal text-muted-foreground">/hr</span></p>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className={`text-xs font-semibold ${l.avail < 10 ? "text-destructive" : "text-success"}`}>
                {l.avail} / {l.total} free
              </span>
              <button
                onClick={(e) => { e.stopPropagation(); book(l.name); }}
                className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground font-semibold text-xs hover:bg-primary hover:text-primary-foreground transition"
              >
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FieldIcon({ icon: Icon, className = "", ...rest }: React.InputHTMLAttributes<HTMLInputElement> & { icon: React.ComponentType<{ className?: string }> }) {
  return (
    <div className={`relative ${className}`}>
      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <input {...rest} className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none transition" />
    </div>
  );
}
