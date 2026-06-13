import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Building2, Car, ArrowLeft, ArrowRight } from "lucide-react";
import { z } from "zod";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Choose your role — ParkWise AI" }] }),
  component: AuthRoleSelect,
});

function AuthRoleSelect() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="px-6 lg:px-8 h-16 flex items-center justify-between max-w-7xl mx-auto w-full">
        <Link to="/" className="flex items-center gap-2">
          <span className="h-9 w-9 rounded-xl bg-primary grid place-items-center text-primary-foreground font-bold">P</span>
          <span className="font-bold">ParkWise <span className="text-primary">AI</span></span>
        </Link>
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
      </header>

      <main className="flex-1 grid place-items-center px-6 py-16">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">
              Get started
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">Choose your role</h1>
            <p className="mt-3 text-muted-foreground">Select how you'd like to use ParkWise AI.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <RoleCard
              icon={Car}
              title="Vehicle Proprietor"
              desc="Register your vehicle and book parking spaces."
              accent="bg-primary"
              iconBg="bg-primary text-primary-foreground"
              onContinue={() => navigate({ to: "/register/proprietor" })}
            />
            <RoleCard
              icon={Building2}
              title="Parking Manager"
              desc="Manage parking slots and monitor parking operations."
              accent="bg-secondary"
              iconBg="bg-secondary text-white"
              onContinue={() => navigate({ to: "/register/manager" })}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

function RoleCard({
  icon: Icon,
  title,
  desc,
  accent,
  iconBg,
  onContinue,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
  accent: string;
  iconBg: string;
  onContinue: () => void;
}) {
  return (
    <button
      onClick={onContinue}
      className="group text-left rounded-3xl bg-card border border-border p-8 hover-lift relative overflow-hidden"
    >
      <div className={`absolute -top-12 -right-12 h-40 w-40 rounded-full ${accent} opacity-10 group-hover:opacity-20 transition`} />
      <div className={`relative h-14 w-14 rounded-2xl ${iconBg} grid place-items-center mb-6`}>
        <Icon className="h-7 w-7" />
      </div>
      <h3 className="text-2xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground">{desc}</p>
      <div className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-foreground text-background font-semibold text-sm group-hover:gap-3 transition-all">
        Continue <ArrowRight className="h-4 w-4" />
      </div>
    </button>
  );
}
