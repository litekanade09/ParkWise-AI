import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, CheckCircle2, Plus, Trash2 } from "lucide-react";
import { loadSession, saveSession } from "@/lib/smartpark-store";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/register/proprietor")({
  head: () => ({ meta: [{ title: "Sign up — Vehicle Proprietor — SmartPark AI" }] }),
  component: ProprietorRegister,
});

type ProfileData = {
  fullName: string;
  email: string;
  address: string;
  phone: string;
  postal: string;
  agree: boolean;
};

type VehicleData = {
  number: string;
  type: string;
  color: string;
  model: string;
};

const emptyProfile: ProfileData = {
  fullName: "",
  email: "",
  address: "",
  phone: "",
  postal: "",
  agree: false,
};

function ProprietorRegister() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<ProfileData>(emptyProfile);
  const [vehicles, setVehicles] = useState<VehicleData[]>([
    { number: "", type: "Car", color: "", model: "" }
  ]);
  const [success, setSuccess] = useState(false);

  const updateProfile = <K extends keyof ProfileData>(k: K, v: ProfileData[K]) =>
    setProfile((p) => ({ ...p, [k]: v }));

  const handleAddVehicle = () => {
    setVehicles((v) => [...v, { number: "", type: "Car", color: "", model: "" }]);
  };

  const handleRemoveVehicle = (index: number) => {
    setVehicles((v) => v.filter((_, idx) => idx !== index));
  };

  const handleUpdateVehicle = (index: number, field: keyof VehicleData, value: string) => {
    setVehicles((v) =>
      v.map((item, idx) => (idx === index ? { ...item, [field]: value } : item))
    );
  };

  function next(e: React.FormEvent) {
    e.preventDefault();
    if (!profile.agree) {
      toast.error("Please agree to the Terms and Conditions.");
      return;
    }
    setStep(1);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    
    // Validate that all vehicles have data
    for (let i = 0; i < vehicles.length; i++) {
      const v = vehicles[i];
      if (!v.number.trim() || !v.color.trim() || !v.model.trim()) {
        toast.error(`Please fill in all details for Vehicle #${i + 1}`);
        return;
      }
    }

    const s = loadSession();
    const formattedVehicles = vehicles.map((v) => ({
      id: crypto.randomUUID(),
      number: v.number,
      type: v.type,
      color: v.color,
      model: v.model,
    }));

    saveSession({
      ...s,
      profile: {
        fullName: profile.fullName,
        email: profile.email,
        phone: profile.phone,
        address: profile.address,
        postal: profile.postal,
        role: "proprietor",
      },
      vehicles: [
        ...s.vehicles,
        ...formattedVehicles,
      ],
    });
    setSuccess(true);
    setTimeout(() => navigate({ to: "/dashboard/book" }), 1600);
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="px-6 lg:px-8 h-16 flex items-center justify-between max-w-5xl mx-auto">
        <Link to="/" className="flex items-center gap-2">
          <span className="h-9 w-9 rounded-xl bg-primary grid place-items-center text-primary-foreground font-bold">S</span>
          <span className="font-bold">SmartPark <span className="text-primary">AI</span></span>
        </Link>
        <Link to="/auth" className="text-sm text-muted-foreground flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" /> Change role
        </Link>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-10">
        {success ? (
          <SuccessCard />
        ) : (
          <>
            <Progress step={step} />

            {step === 0 && (
              <form onSubmit={next} className="mt-8 bg-card border border-border rounded-3xl p-8 shadow-soft">
                <h2 className="text-2xl font-bold">Personal Information</h2>
                <p className="text-sm text-muted-foreground">Tell us a bit about yourself.</p>
                <div className="mt-6 grid sm:grid-cols-2 gap-4">
                  <Input label="Full Name" value={profile.fullName} onChange={(v) => updateProfile("fullName", v)} required />
                  <Input label="Email Address" type="email" value={profile.email} onChange={(v) => updateProfile("email", v)} required />
                  <Input label="Phone Number" value={profile.phone} onChange={(v) => updateProfile("phone", v)} required />
                  <Input label="Postal Code" value={profile.postal} onChange={(v) => updateProfile("postal", v)} required />
                  <div className="sm:col-span-2">
                    <Input label="Address" value={profile.address} onChange={(v) => updateProfile("address", v)} required />
                  </div>
                </div>

                <label className="mt-6 flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={profile.agree} onChange={(e) => updateProfile("agree", e.target.checked)} className="mt-1 h-4 w-4 accent-[color:var(--primary)]" />
                  <span className="text-sm text-muted-foreground">I agree to the <span className="text-foreground font-semibold underline">Terms and Conditions</span> and Privacy Policy.</span>
                </label>

                <div className="mt-8 flex justify-between">
                  <Link to="/auth" className="px-5 py-2.5 rounded-xl border border-border font-semibold text-sm">Back</Link>
                  <button type="submit" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold shadow-soft hover:shadow-glow transition">
                    Next <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </form>
            )}

            {step === 1 && (
              <form onSubmit={submit} className="mt-8 bg-card border border-border rounded-3xl p-8 shadow-soft">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold">My Vehicle</h2>
                  <p className="text-sm text-muted-foreground">Add your vehicles to your account.</p>
                </div>

                <div className="space-y-6">
                  {vehicles.map((veh, idx) => (
                    <div key={idx} className="bg-background border border-border rounded-2xl p-5 relative">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-bold uppercase tracking-wider text-primary">Vehicle #{idx + 1}</span>
                        {idx > 0 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveVehicle(idx)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 text-xs font-semibold transition"
                          >
                            <Trash2 className="h-3.5 w-3.5" /> Remove
                          </button>
                        )}
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-semibold uppercase text-muted-foreground tracking-wide">Vehicle Number</label>
                          <input
                            type="text"
                            required
                            placeholder="MH 12 AB 4521"
                            value={veh.number}
                            onChange={(e) => handleUpdateVehicle(idx, "number", e.target.value)}
                            className="mt-2 w-full px-4 py-3 rounded-xl border border-border bg-card focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none transition"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-semibold uppercase text-muted-foreground tracking-wide">Vehicle Type</label>
                          <select
                            value={veh.type}
                            onChange={(e) => handleUpdateVehicle(idx, "type", e.target.value)}
                            className="mt-2 w-full px-4 py-3 rounded-xl border border-border bg-card focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none"
                          >
                            {["Car", "Bike", "SUV", "Truck", "Electric Vehicle"].map(t => <option key={t}>{t}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="text-xs font-semibold uppercase text-muted-foreground tracking-wide">Vehicle Color</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Red, Black"
                            value={veh.color}
                            onChange={(e) => handleUpdateVehicle(idx, "color", e.target.value)}
                            className="mt-2 w-full px-4 py-3 rounded-xl border border-border bg-card focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none transition"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-semibold uppercase text-muted-foreground tracking-wide">Vehicle Model</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Tesla Model Y"
                            value={veh.model}
                            onChange={(e) => handleUpdateVehicle(idx, "model", e.target.value)}
                            className="mt-2 w-full px-4 py-3 rounded-xl border border-border bg-card focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none transition"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleAddVehicle}
                  className="mt-4 w-full py-3 border border-dashed border-border rounded-xl font-semibold text-sm text-muted-foreground hover:border-primary hover:text-primary transition flex items-center justify-center gap-2"
                >
                  <Plus className="h-4 w-4" /> + Add Another Vehicle
                </button>

                <div className="mt-8 flex justify-between pt-4 border-t border-border">
                  <button type="button" onClick={() => setStep(0)} className="px-5 py-2.5 rounded-xl border border-border font-semibold text-sm">Back</button>
                  <button type="submit" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-secondary text-secondary-foreground font-semibold shadow-soft hover:shadow-card transition">
                    Submit <Check className="h-4 w-4" />
                  </button>
                </div>
              </form>
            )}
          </>
        )}
      </main>
      <Toaster />
    </div>
  );
}

function Progress({ step }: { step: number }) {
  const steps = ["Personal Info", "My Vehicle"];
  return (
    <div className="flex items-center gap-3">
      {steps.map((s, i) => (
        <div key={s} className="flex-1 flex items-center gap-3">
          <div className={`h-9 w-9 rounded-full grid place-items-center text-sm font-bold border-2 ${
            i <= step ? "bg-primary border-primary text-primary-foreground" : "border-border text-muted-foreground bg-card"
          }`}>
            {i < step ? <Check className="h-4 w-4" /> : i + 1}
          </div>
          <div className="flex-1">
            <p className={`text-xs font-semibold ${i <= step ? "text-foreground" : "text-muted-foreground"}`}>STEP {i + 1}</p>
            <p className={`text-sm ${i === step ? "font-semibold" : "text-muted-foreground"}`}>{s}</p>
          </div>
          {i < steps.length - 1 && <div className={`h-0.5 flex-1 ${i < step ? "bg-primary" : "bg-border"}`} />}
        </div>
      ))}
    </div>
  );
}

function Input({ label, value, onChange, type = "text", required, placeholder }: { label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean; placeholder?: string }) {
  return (
    <div>
      <label className="text-xs font-semibold uppercase text-muted-foreground tracking-wide">{label}</label>
      <input
        type={type}
        value={value}
        required={required}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full px-4 py-3 rounded-xl border border-border bg-card focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none transition"
      />
    </div>
  );
}

function SuccessCard() {
  return (
    <div className="mt-16 bg-card border border-border rounded-3xl p-10 text-center shadow-card animate-in fade-in zoom-in-95 duration-500">
      <div className="mx-auto h-20 w-20 rounded-full bg-success/15 grid place-items-center animate-pulse-ring">
        <CheckCircle2 className="h-10 w-10 text-success" />
      </div>
      <h2 className="mt-6 text-2xl font-bold">You're all set!</h2>
      <p className="text-muted-foreground mt-2">Account created successfully. Redirecting to your dashboard...</p>
    </div>
  );
}
