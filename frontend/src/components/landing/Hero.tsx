import { Link } from "@tanstack/react-router";
import { ArrowRight, MapPin, Zap, ShieldCheck } from "lucide-react";

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* background accents */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 -left-32 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-secondary/10 blur-3xl" />
        <svg className="absolute inset-0 h-full w-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05]">
            Find Parking <br />
            <span className="relative inline-block">
              <span className="relative z-10">Before You</span>
              <span className="absolute inset-x-0 bottom-2 h-4 bg-primary/60 -z-0" />
            </span>{" "}
            Reach There.
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-xl">
            Real-time parking availability, smart booking, AI-powered recommendations, and secure vehicle management — all in one premium platform.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/auth"
              className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-primary-foreground font-bold shadow-soft hover:scale-105 hover:shadow-glow transition-all duration-300"
            >
              Book Parking
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#about"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-secondary text-white font-semibold shadow-soft hover:bg-secondary/90 transition-all"
            >
              Learn More
            </a>
          </div>

          <div className="mt-10 flex flex-wrap gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-success" /> 24/7 Secure</div>
            <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /> 1,200+ Locations</div>
            <div className="flex items-center gap-2"><Zap className="h-4 w-4 text-secondary" /> 30s Booking</div>
          </div>
        </div>

        {/* Hero illustration */}
        <div className="relative">
          <div className="relative aspect-square max-w-lg mx-auto">
            <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-primary/30 via-primary/10 to-transparent blur-2xl" />
            <div className="relative h-full w-full rounded-[2.5rem] bg-card shadow-card border border-border overflow-hidden p-6">
              {/* Mock dashboard card */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs text-muted-foreground">Current location</p>
                  <p className="font-semibold">Downtown Plaza</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-success/15 text-success text-xs font-semibold">Live</span>
              </div>

              {/* Parking grid illustration */}
              <div className="rounded-2xl bg-secondary p-5 mb-4">
                <p className="text-xs text-white/60 mb-3 font-medium">Level 2 · 24 of 48 free</p>
                <div className="grid grid-cols-6 gap-1.5">
                  {Array.from({ length: 36 }).map((_, i) => {
                    const state = i % 5 === 0 ? "occ" : i % 7 === 0 ? "res" : "free";
                    const color =
                      state === "free" ? "bg-success" : state === "occ" ? "bg-destructive/80" : "bg-primary";
                    return <div key={i} className={`aspect-square rounded ${color} opacity-90`} />;
                  })}
                </div>
                <div className="flex items-center justify-between mt-3 text-[10px] text-white/60">
                  <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-success" /> Available</span>
                  <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-primary" /> Reserved</span>
                  <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-destructive/80" /> Occupied</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-border p-3">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Nearest</p>
                  <p className="font-semibold text-sm">Slot A-12</p>
                  <p className="text-xs text-muted-foreground">120m away</p>
                </div>
                <div className="rounded-xl bg-primary p-3 text-primary-foreground">
                  <p className="text-[10px] uppercase tracking-wide opacity-70">Price</p>
                  <p className="font-bold">₹40/hr</p>
                  <p className="text-xs">AI optimized</p>
                </div>
              </div>
            </div>

            {/* floating badges */}
            <div className="absolute -top-4 -right-2 animate-float">
              <div className="rounded-2xl bg-card border border-border shadow-card px-4 py-3 flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-success/15 grid place-items-center">
                  <ShieldCheck className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">CCTV Monitored</p>
                  <p className="text-sm font-semibold">100% Secure</p>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-4 -left-4 animate-float" style={{ animationDelay: "1.5s" }}>
              <div className="rounded-2xl bg-secondary text-white shadow-card px-4 py-3 flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary grid place-items-center text-primary-foreground">
                  <Zap className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-white/60">AI Prediction</p>
                  <p className="text-sm font-semibold">94% accuracy</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
