import { Activity, Brain, Car, ShieldCheck } from "lucide-react";

const cards = [
  { icon: Activity, title: "Real-Time Parking Availability", desc: "Monitor parking occupancy in real time across thousands of locations." },
  { icon: Brain, title: "AI-Based Parking Predictions", desc: "Predict future slot availability with our advanced ML models." },
  { icon: Car, title: "Smart Vehicle Management", desc: "Manage vehicles, bookings and reservations effortlessly from one place." },
  { icon: ShieldCheck, title: "Secure Parking Ecosystem", desc: "Enhanced safety with verified entries, exits and continuous monitoring." },
];

export function About() {
  return (
    <section id="about" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-2xl mb-14">
          <p className="text-sm font-semibold text-primary uppercase tracking-widest">Why SmartPark AI?</p>
          <h2 className="mt-3 text-4xl sm:text-5xl font-bold tracking-tight">Parking, reimagined for the AI era.</h2>
          <p className="mt-4 text-muted-foreground text-lg">
            A premium platform built for proprietors and managers — fast bookings, smart predictions, total visibility.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {cards.map((c) => (
            <div
              key={c.title}
              className="group relative rounded-2xl bg-card border border-border p-6 hover-lift"
            >
              <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="h-12 w-12 rounded-xl bg-primary/15 grid place-items-center mb-5 group-hover:bg-primary transition-colors">
                <c.icon className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{c.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
