import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { loadSession, saveSession } from "@/lib/smartpark-store";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/register/manager")({
  head: () => ({ meta: [{ title: "Sign up — Parking Manager — SmartPark AI" }] }),
  component: ManagerRegister,
});

function ManagerRegister() {
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const s = loadSession();
    saveSession({
      ...s,
      profile: {
        fullName: String(fd.get("fullName") ?? ""),
        email: String(fd.get("email") ?? ""),
        phone: String(fd.get("phone") ?? ""),
        address: String(fd.get("address") ?? ""),
        postal: String(fd.get("postal") ?? ""),
        role: "manager",
      },
    });
    setSuccess(true);
    setTimeout(() => navigate({ to: "/dashboard" }), 1500);
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
          <div className="mt-16 bg-card border border-border rounded-3xl p-10 text-center shadow-card">
            <div className="mx-auto h-20 w-20 rounded-full bg-success/15 grid place-items-center animate-pulse-ring">
              <CheckCircle2 className="h-10 w-10 text-success" />
            </div>
            <h2 className="mt-6 text-2xl font-bold">Welcome aboard!</h2>
            <p className="text-muted-foreground mt-2">Manager account ready. Loading your dashboard...</p>
          </div>
        ) : (
          <form onSubmit={submit} className="bg-card border border-border rounded-3xl p-8 shadow-soft">
            <p className="text-xs font-bold uppercase tracking-widest text-primary">Parking Manager</p>
            <h2 className="mt-1 text-2xl font-bold">Create your manager account</h2>
            <p className="text-sm text-muted-foreground">Set up your profile to start managing parking lots.</p>

            <div className="mt-6 grid sm:grid-cols-2 gap-4">
              <Field name="fullName" label="Full Name" required />
              <Field name="email" type="email" label="Email Address" required />
              <Field name="phone" label="Phone Number" required />
              <Field name="postal" label="Postal Code" required />
              <div className="sm:col-span-2"><Field name="address" label="Business Address" required /></div>
            </div>

            <button type="submit" className="mt-8 w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold shadow-soft hover:shadow-glow transition">
              Create Account
            </button>
          </form>
        )}
      </main>
      <Toaster />
    </div>
  );
}

function Field({ label, name, type = "text", required }: { label: string; name: string; type?: string; required?: boolean }) {
  return (
    <div>
      <label className="text-xs font-semibold uppercase text-muted-foreground tracking-wide">{label}</label>
      <input
        name={name}
        type={type}
        required={required}
        className="mt-2 w-full px-4 py-3 rounded-xl border border-border bg-card focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none transition"
      />
    </div>
  );
}
