import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, Check, CheckCircle2 } from "lucide-react";
import { loadSession, saveSession } from "@/lib/smartpark-store";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/register/manager")({
  head: () => ({ meta: [{ title: "Sign up — Parking Manager — ParkWise AI" }] }),
  component: ManagerRegister,
});

type Step1Data = {
  managerName: string;
  parkingName: string;
  parkingAddress: string;
  area: string;
  city: string;
  postal: string;
  contactNumber: string;
  email: string;
  parkingType: string;
};

type Step2Data = {
  totalCapacity: string;
  bikeSlots: string;
  carSlots: string;
  suvSlots: string;
  truckSlots: string;
  bikePrice: string;
  carPrice: string;
  suvPrice: string;
  truckPrice: string;
};

const defaultStep1: Step1Data = {
  managerName: "",
  parkingName: "",
  parkingAddress: "",
  area: "",
  city: "",
  postal: "",
  contactNumber: "",
  email: "",
  parkingType: "Public Parking",
};

const defaultStep2: Step2Data = {
  totalCapacity: "100",
  bikeSlots: "20",
  carSlots: "50",
  suvSlots: "20",
  truckSlots: "10",
  bikePrice: "20",
  carPrice: "40",
  suvPrice: "60",
  truckPrice: "80",
};

const facilitiesOptions = [
  { id: "24x7", label: "24x7 Parking", desc: "Open all day & night" },
  { id: "cctv", label: "CCTV Available", desc: "Continuous video monitoring" },
  { id: "ev", label: "EV Charging", desc: "Electric vehicle power stations" },
  { id: "covered", label: "Covered Parking", desc: "Protection from weather" },
  { id: "security", label: "Security Guards", desc: "On-site security personnel" },
  { id: "wheelchair", label: "Wheelchair Accessible", desc: "Accessible spaces & ramps" },
];

function ManagerRegister() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [step1, setStep1] = useState<Step1Data>(defaultStep1);
  const [step2, setStep2] = useState<Step2Data>(defaultStep2);
  const [facilities, setFacilities] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const s = loadSession();
    if (s.profile) {
      setStep1((prev) => ({
        ...prev,
        managerName: s.profile.fullName || "",
        email: s.profile.email || "",
        contactNumber: s.profile.phone || "",
      }));
    }
  }, []);

  const updateStep1 = <K extends keyof Step1Data>(k: K, v: Step1Data[K]) =>
    setStep1((prev) => ({ ...prev, [k]: v }));

  const updateStep2 = <K extends keyof Step2Data>(k: K, v: Step2Data[K]) =>
    setStep2((prev) => ({ ...prev, [k]: v }));

  const toggleFacility = (id: string) => {
    setFacilities((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleNextStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!step1.managerName || !step1.parkingName || !step1.parkingAddress || !step1.area || !step1.city || !step1.postal || !step1.contactNumber || !step1.email) {
      toast.error("Please fill in all details.");
      return;
    }
    setStep(1);
  };

  const handleNextStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate capacities match sum
    const total = parseInt(step2.totalCapacity) || 0;
    const sum =
      (parseInt(step2.bikeSlots) || 0) +
      (parseInt(step2.carSlots) || 0) +
      (parseInt(step2.suvSlots) || 0) +
      (parseInt(step2.truckSlots) || 0);

    if (sum > total) {
      toast.warning(`Total slots for types (${sum}) exceeds total parking capacity (${total}). Please adjust.`);
    }
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const s = loadSession();

    try {
      let createdUserId = s.profile?.id;
      let userToken = s.profile?.token;

      // Guest registration fallback (compatibility)
      if (!createdUserId) {
        const userRes = await fetch("http://localhost:5000/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: step1.managerName || "Parking Manager",
            email: step1.email,
            phone: step1.contactNumber,
            password: "password123",
            role: "parking_manager",
          }),
        });

        const userJson = await userRes.json();
        if (!userJson.success) {
          throw new Error(userJson.message || "Failed to create manager account");
        }

        createdUserId = userJson.data.user._id;
        userToken = userJson.data.token;
      }

      // Update user profile on backend
      const profileHeaders: any = { "Content-Type": "application/json" };
      if (userToken) {
        profileHeaders["Authorization"] = `Bearer ${userToken}`;
      }
      const profileRes = await fetch("http://localhost:5000/api/auth/profile", {
        method: "PUT",
        headers: profileHeaders,
        body: JSON.stringify({
          name: step1.managerName,
          phone: step1.contactNumber,
          address: step1.parkingAddress,
          postalCode: step1.postal,
        }),
      });

      const profileJson = await profileRes.json();
      if (!profileJson.success) {
        throw new Error(profileJson.message || "Failed to save profile information");
      }

      // Create Parking Lot with userToken header
      const headers: any = { "Content-Type": "application/json" };
      if (userToken) {
        headers["Authorization"] = `Bearer ${userToken}`;
      }

      const lotRes = await fetch("http://localhost:5000/api/parking-lots", {
        method: "POST",
        headers,
        body: JSON.stringify({
          parkingName: step1.parkingName,
          parkingAddress: step1.parkingAddress,
          area: step1.area,
          city: step1.city,
          postalCode: step1.postal,
          contactNumber: step1.contactNumber,
          email: step1.email,
          parkingType: step1.parkingType,
          totalCapacity: parseInt(step2.totalCapacity) || 100,
          bikeSlots: parseInt(step2.bikeSlots) || 20,
          carSlots: parseInt(step2.carSlots) || 50,
          suvSlots: parseInt(step2.suvSlots) || 20,
          truckSlots: parseInt(step2.truckSlots) || 10,
          bikePrice: parseInt(step2.bikePrice) || 20,
          carPrice: parseInt(step2.carPrice) || 40,
          suvPrice: parseInt(step2.suvPrice) || 60,
          truckPrice: parseInt(step2.truckPrice) || 80,
          facilities: facilities,
          createdBy: createdUserId,
        }),
      });

      const lotJson = await lotRes.json();
      if (!lotJson.success) {
        throw new Error(lotJson.message || "Failed to register parking lot");
      }

      const createdLotId = lotJson.data._id;

      // Save to Local Session
      saveSession({
        ...s,
        profile: {
          id: createdUserId,
          fullName: step1.managerName,
          email: step1.email,
          phone: step1.contactNumber,
          address: step1.parkingAddress,
          postal: step1.postal,
          role: "parking_manager",
          parkingName: step1.parkingName,
          parkingAddress: step1.parkingAddress,
          area: step1.area,
          city: step1.city,
          contactNumber: step1.contactNumber,
          parkingType: step1.parkingType,
          totalCapacity: parseInt(step2.totalCapacity) || 100,
          bikeSlots: parseInt(step2.bikeSlots) || 20,
          carSlots: parseInt(step2.carSlots) || 50,
          suvSlots: parseInt(step2.suvSlots) || 20,
          truckSlots: parseInt(step2.truckSlots) || 10,
          bikePrice: parseInt(step2.bikePrice) || 20,
          carPrice: parseInt(step2.carPrice) || 40,
          suvPrice: parseInt(step2.suvPrice) || 60,
          truckPrice: parseInt(step2.truckPrice) || 80,
          facilities: facilities,
          parkingLotId: createdLotId,
          token: userToken,
          profileCompleted: true,
        },
        vehicles: s.vehicles || [],
        bookings: s.bookings || [],
      });

      setSuccess(true);
      setTimeout(() => {
        navigate({ to: "/dashboard" });
      }, 1600);
    } catch (err: any) {
      toast.error(err.message || "An error occurred");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="px-6 lg:px-8 h-16 flex items-center justify-between max-w-5xl mx-auto">
        <Link to="/" className="flex items-center gap-2">
          <span className="h-9 w-9 rounded-xl bg-primary grid place-items-center text-primary-foreground font-bold">P</span>
          <span className="font-bold text-foreground">
            ParkWise <span className="text-primary">AI</span>
          </span>
        </Link>
        <Link to="/auth" className="text-sm text-muted-foreground flex items-center gap-1 hover:text-foreground transition">
          <ArrowLeft className="h-4 w-4" /> Change role
        </Link>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10">
        {success ? (
          <div className="mt-16 bg-card border border-border rounded-3xl p-10 text-center shadow-card animate-in fade-in zoom-in-95 duration-500">
            <div className="mx-auto h-20 w-20 rounded-full bg-success/15 grid place-items-center animate-pulse-ring">
              <CheckCircle2 className="h-10 w-10 text-success" />
            </div>
            <h2 className="mt-6 text-2xl font-bold text-foreground">Welcome to ParkWise AI!</h2>
            <p className="text-muted-foreground mt-2">Your parking space is registered. Loading ParkWise AI manager portal...</p>
          </div>
        ) : (
          <>
            <Progress step={step} />

            {step === 0 && (
              <form onSubmit={handleNextStep1} className="mt-8 bg-card border border-border rounded-3xl p-8 shadow-soft animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="mb-6">
                  <p className="text-xs font-bold uppercase tracking-widest text-primary">Step 1 of 3</p>
                  <h2 className="text-2xl font-bold mt-1 text-foreground">Parking Information</h2>
                  <p className="text-sm text-muted-foreground">Provide basic information about your parking space.</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <Input label="Manager Full Name" value={step1.managerName} onChange={(v) => updateStep1("managerName", v)} required placeholder="e.g. Prajwal Manager" />
                  </div>
                  <div className="sm:col-span-2">
                    <Input label="Parking Name" value={step1.parkingName} onChange={(v) => updateStep1("parkingName", v)} required placeholder="e.g. Airport Terminal 2 Premium Parking" />
                  </div>
                  <div className="sm:col-span-2">
                    <Input label="Parking Address" value={step1.parkingAddress} onChange={(v) => updateStep1("parkingAddress", v)} required placeholder="e.g. Sector 17, Main Highway Road" />
                  </div>
                  <div className="sm:col-span-2">
                    <Input label="Area / Locality" value={step1.area} onChange={(v) => updateStep1("area", v)} required placeholder="e.g. Virar Market, Nalasopara West" />
                  </div>
                  <Input label="City" value={step1.city} onChange={(v) => updateStep1("city", v)} required placeholder="e.g. Pune" />
                  <Input label="Postal Code" value={step1.postal} onChange={(v) => updateStep1("postal", v)} required placeholder="e.g. 411001" />
                  <Input label="Contact Number" value={step1.contactNumber} onChange={(v) => updateStep1("contactNumber", v)} required type="tel" placeholder="e.g. +91 98765 43210" />
                  <Input label="Email Address" value={step1.email} onChange={(v) => updateStep1("email", v)} required type="email" placeholder="e.g. support@airportparking.com" />
                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold uppercase text-muted-foreground tracking-wide">Parking Type</label>
                    <select
                      value={step1.parkingType}
                      onChange={(e) => updateStep1("parkingType", e.target.value)}
                      className="mt-2 w-full px-4 py-3 rounded-xl border border-border bg-card focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none text-foreground text-sm font-medium transition"
                    >
                      {["Public Parking", "Mall Parking", "Office Parking", "Airport Parking", "Residential Parking"].map((t) => (
                        <option key={t} value={t} className="text-foreground">
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-8 flex justify-between pt-4 border-t border-border">
                  <Link to="/auth" className="px-5 py-2.5 rounded-xl border border-border font-semibold text-sm hover:bg-muted transition text-foreground">
                    Back
                  </Link>
                  <button type="submit" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold shadow-soft hover:shadow-glow hover-lift transition cursor-pointer">
                    Next <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </form>
            )}

            {step === 1 && (
              <form onSubmit={handleNextStep2} className="mt-8 bg-card border border-border rounded-3xl p-8 shadow-soft animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="mb-6">
                  <p className="text-xs font-bold uppercase tracking-widest text-primary">Step 2 of 3</p>
                  <h2 className="text-2xl font-bold mt-1 text-foreground">Capacity & Pricing</h2>
                  <p className="text-sm text-muted-foreground">Configure the slot capacities and price tariffs per hour.</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-bold text-foreground border-b border-border pb-2 mb-3">Capacity Configuration</h3>
                    <div className="grid sm:grid-cols-5 gap-4">
                      <div className="sm:col-span-1">
                        <Input label="Total Slots" value={step2.totalCapacity} onChange={(v) => updateStep2("totalCapacity", v)} required type="number" min="1" />
                      </div>
                      <div className="sm:col-span-1">
                        <Input label="Bike Slots" value={step2.bikeSlots} onChange={(v) => updateStep2("bikeSlots", v)} required type="number" min="0" />
                      </div>
                      <div className="sm:col-span-1">
                        <Input label="Car Slots" value={step2.carSlots} onChange={(v) => updateStep2("carSlots", v)} required type="number" min="0" />
                      </div>
                      <div className="sm:col-span-1">
                        <Input label="SUV Slots" value={step2.suvSlots} onChange={(v) => updateStep2("suvSlots", v)} required type="number" min="0" />
                      </div>
                      <div className="sm:col-span-1">
                        <Input label="Truck Slots" value={step2.truckSlots} onChange={(v) => updateStep2("truckSlots", v)} required type="number" min="0" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-foreground border-b border-border pb-2 mb-3">Pricing Configuration (₹ Per Hour)</h3>
                    <div className="grid sm:grid-cols-4 gap-4">
                      <Input label="Bike (₹)" value={step2.bikePrice} onChange={(v) => updateStep2("bikePrice", v)} required type="number" min="0" />
                      <Input label="Car (₹)" value={step2.carPrice} onChange={(v) => updateStep2("carPrice", v)} required type="number" min="0" />
                      <Input label="SUV (₹)" value={step2.suvPrice} onChange={(v) => updateStep2("suvPrice", v)} required type="number" min="0" />
                      <Input label="Truck (₹)" value={step2.truckPrice} onChange={(v) => updateStep2("truckPrice", v)} required type="number" min="0" />
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-between pt-4 border-t border-border">
                  <button type="button" onClick={() => setStep(0)} className="px-5 py-2.5 rounded-xl border border-border font-semibold text-sm hover:bg-muted transition text-foreground">
                    Back
                  </button>
                  <button type="submit" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold shadow-soft hover:shadow-glow hover-lift transition">
                    Next <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleSubmit} className="mt-8 bg-card border border-border rounded-3xl p-8 shadow-soft animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="mb-6">
                  <p className="text-xs font-bold uppercase tracking-widest text-primary">Step 3 of 3</p>
                  <h2 className="text-2xl font-bold mt-1 text-foreground">Parking Facilities</h2>
                  <p className="text-sm text-muted-foreground">Select facilities and services available at your parking space.</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {facilitiesOptions.map((fac) => {
                    const selected = facilities.includes(fac.id);
                    return (
                      <button
                        key={fac.id}
                        type="button"
                        onClick={() => toggleFacility(fac.id)}
                        className={`text-left p-5 rounded-2xl border transition-all ${
                          selected
                            ? "bg-primary/5 border-primary ring-2 ring-primary/20"
                            : "bg-background border-border hover:border-muted-foreground/30"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-foreground">{fac.label}</span>
                          <div
                            className={`h-5 w-5 rounded-full border grid place-items-center transition-colors ${
                              selected ? "bg-primary border-primary text-primary-foreground" : "border-border bg-card"
                            }`}
                          >
                            {selected && <Check className="h-3 w-3 stroke-[3]" />}
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1.5">{fac.desc}</p>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-8 flex justify-between pt-4 border-t border-border">
                  <button type="button" onClick={() => setStep(1)} className="px-5 py-2.5 rounded-xl border border-border font-semibold text-sm hover:bg-muted transition text-foreground">
                    Back
                  </button>
                  <button type="submit" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-secondary text-secondary-foreground font-semibold shadow-soft hover:shadow-card hover-lift transition">
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
  const steps = ["Parking Info", "Capacity & Pricing", "Facilities"];
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
      {steps.map((s, i) => (
        <div key={s} className="flex-1 flex items-center gap-3">
          <div
            className={`h-9 w-9 rounded-full grid place-items-center text-sm font-bold border-2 transition-all ${
              i <= step ? "bg-primary border-primary text-primary-foreground" : "border-border text-muted-foreground bg-card"
            }`}
          >
            {i < step ? <Check className="h-4 w-4" /> : i + 1}
          </div>
          <div className="flex-1 min-w-0">
            <p className={`text-[10px] font-bold tracking-wider uppercase ${i <= step ? "text-foreground" : "text-muted-foreground"}`}>STEP {i + 1}</p>
            <p className={`text-xs truncate ${i === step ? "font-semibold text-foreground" : "text-muted-foreground"}`}>{s}</p>
          </div>
          {i < steps.length - 1 && <div className={`hidden sm:block h-0.5 flex-1 ${i < step ? "bg-primary" : "bg-border"}`} />}
        </div>
      ))}
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
  required,
  placeholder,
  min,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
  min?: string;
}) {
  return (
    <div>
      <label className="text-xs font-semibold uppercase text-muted-foreground tracking-wide">{label}</label>
      <input
        type={type}
        value={value}
        required={required}
        placeholder={placeholder}
        min={min}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none text-sm transition"
      />
    </div>
  );
}
