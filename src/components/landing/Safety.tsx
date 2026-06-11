import { Camera, Crosshair, FileCheck, ScanLine } from "lucide-react";

const features = [
  { icon: Camera, title: "24/7 CCTV Monitoring", desc: "Continuous surveillance with cloud-stored footage." },
  { icon: Crosshair, title: "AI-Based Vehicle Tracking", desc: "Track your vehicle's location and status in real-time." },
  { icon: FileCheck, title: "Secure Parking Verification", desc: "Digital verification with tamper-proof entry logs." },
  { icon: ScanLine, title: "Automatic Entry & Exit Logs", desc: "License-plate recognition logs every visit." },
];

export function Safety() {
  return (
    <section id="safety" className="py-24 bg-secondary text-white relative overflow-hidden">
      <div className="absolute inset-0 -z-0 opacity-20">
        <div className="absolute top-0 right-1/4 h-96 w-96 rounded-full bg-primary blur-3xl" />
      </div>
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-sm font-semibold text-primary uppercase tracking-widest">Safety First</p>
            <h2 className="mt-3 text-4xl sm:text-5xl font-bold tracking-tight">
              Your Vehicle's Safety <br /> Comes First.
            </h2>
            <p className="mt-4 text-white/70 text-lg max-w-lg">
              Multi-layered security infrastructure ensures every vehicle is monitored, verified, and protected.
            </p>

            <div className="mt-10 grid sm:grid-cols-2 gap-4">
              {features.map((f) => (
                <div key={f.title} className="rounded-2xl glass-dark p-5 hover:bg-white/10 transition-colors">
                  <div className="h-10 w-10 rounded-lg bg-primary text-secondary grid place-items-center mb-3">
                    <f.icon className="h-5 w-5" />
                  </div>
                  <h4 className="font-semibold mb-1">{f.title}</h4>
                  <p className="text-xs text-white/60">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Visual illustration */}
          <div className="relative">
            <div className="relative aspect-[4/5] max-w-md mx-auto">
              <div className="absolute inset-0 rounded-3xl border border-white/10 glass-dark p-6">
                {/* CCTV view */}
                <div className="rounded-2xl bg-black/60 border border-white/10 aspect-video relative overflow-hidden mb-4">
                  <div className="absolute top-3 left-3 flex items-center gap-2 text-xs">
                    <span className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
                    <span className="text-white/80 font-mono">LIVE · CAM 04</span>
                  </div>
                  <div className="absolute bottom-3 right-3 text-[10px] text-white/60 font-mono">
                    08-JUN-2026 14:32
                  </div>
                  {/* parked cars schematic */}
                  <svg viewBox="0 0 200 120" className="absolute inset-0 w-full h-full">
                    <rect x="10" y="20" width="40" height="22" rx="3" fill="#FFD600" opacity="0.8" />
                    <rect x="60" y="20" width="40" height="22" rx="3" fill="#22C55E" opacity="0.6" />
                    <rect x="110" y="20" width="40" height="22" rx="3" fill="#EF4444" opacity="0.6" />
                    <rect x="10" y="78" width="40" height="22" rx="3" fill="#22C55E" opacity="0.6" />
                    <rect x="60" y="78" width="40" height="22" rx="3" fill="#FFD600" opacity="0.8" />
                    <rect x="110" y="78" width="40" height="22" rx="3" fill="#22C55E" opacity="0.6" />
                  </svg>
                </div>

                <div className="space-y-2">
                  {[
                    { plate: "MH 12 AB 4521", action: "Entry verified", time: "14:30" },
                    { plate: "DL 08 CN 9876", action: "Exit logged", time: "14:18" },
                    { plate: "KA 03 XY 1122", action: "Entry verified", time: "14:05" },
                  ].map((log) => (
                    <div key={log.plate} className="flex items-center justify-between p-2.5 rounded-lg bg-white/5">
                      <div className="flex items-center gap-2">
                        <ScanLine className="h-4 w-4 text-primary" />
                        <div>
                          <p className="text-xs font-semibold font-mono">{log.plate}</p>
                          <p className="text-[10px] text-white/50">{log.action}</p>
                        </div>
                      </div>
                      <span className="text-xs text-white/60 font-mono">{log.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
