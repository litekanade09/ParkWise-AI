import { createFileRoute } from "@tanstack/react-router";
import { Car, Plus, Trash2, Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { loadSession, saveSession, type Vehicle } from "@/lib/smartpark-store";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/vehicles")({
  component: Vehicles,
});

function Vehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [open, setOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  useEffect(() => {
    setVehicles(loadSession().vehicles);
  }, []);

  function add(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const v: Vehicle = {
      id: crypto.randomUUID(),
      number: String(fd.get("number")),
      type: String(fd.get("type")),
      color: String(fd.get("color")),
      model: String(fd.get("model")),
    };
    const s = loadSession();
    const next = [...s.vehicles, v];
    saveSession({ ...s, vehicles: next });
    setVehicles(next);
    setOpen(false);
    toast.success("Vehicle added");
  }

  function edit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editingVehicle) return;
    const fd = new FormData(e.currentTarget);
    const updated: Vehicle = {
      id: editingVehicle.id,
      number: String(fd.get("number")),
      type: String(fd.get("type")),
      color: String(fd.get("color")),
      model: String(fd.get("model")),
    };
    const s = loadSession();
    const next = s.vehicles.map((v) => (v.id === editingVehicle.id ? updated : v));
    saveSession({ ...s, vehicles: next });
    setVehicles(next);
    setEditingVehicle(null);
    toast.success("Vehicle updated");
  }

  function remove(id: string) {
    const s = loadSession();
    const next = s.vehicles.filter((v) => v.id !== id);
    saveSession({ ...s, vehicles: next });
    setVehicles(next);
    toast.success("Vehicle removed");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Vehicles</h1>
          <p className="text-muted-foreground mt-1">Manage all your registered vehicles.</p>
        </div>
        <button onClick={() => setOpen(true)} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold shadow-soft hover:shadow-glow transition">
          <Plus className="h-4 w-4" /> Add Vehicle
        </button>
      </div>

      {vehicles.length === 0 ? (
        <div className="bg-card border border-border border-dashed rounded-2xl p-16 text-center">
          <Car className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 font-semibold">No vehicles yet</h3>
          <p className="text-sm text-muted-foreground">Add your first vehicle to start booking parking.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {vehicles.map((v) => (
            <div key={v.id} className="rounded-2xl bg-card border border-border p-5 hover-lift">
              <div className="flex items-start justify-between">
                <div className="h-12 w-12 rounded-xl bg-primary grid place-items-center">
                  <Car className="h-6 w-6 text-primary-foreground" />
                </div>
                <div className="flex gap-1">
                  <button onClick={() => setEditingVehicle(v)} className="h-9 w-9 rounded-lg hover:bg-muted grid place-items-center text-muted-foreground transition" title="Edit Vehicle">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button onClick={() => remove(v.id)} className="h-9 w-9 rounded-lg hover:bg-destructive/10 hover:text-destructive grid place-items-center text-muted-foreground transition" title="Delete Vehicle">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <h3 className="mt-4 font-bold text-lg font-mono">{v.number}</h3>
              <p className="text-sm text-muted-foreground">{v.model} · {v.color}</p>
              <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-accent">{v.type}</span>
                <span className="text-xs text-success font-semibold">● Verified</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" onClick={() => setOpen(false)}>
          <form onSubmit={add} onClick={(e) => e.stopPropagation()} className="bg-card rounded-3xl border border-border p-8 w-full max-w-md shadow-card">
            <h2 className="text-xl font-bold">Add Vehicle</h2>
            <div className="mt-6 space-y-4">
              <Inp name="number" label="Vehicle Number" placeholder="MH 12 AB 4521" required />
              <div>
                <label className="text-xs font-semibold uppercase text-muted-foreground tracking-wide">Vehicle Type</label>
                <select name="type" className="mt-2 w-full px-4 py-3 rounded-xl border border-border bg-background outline-none focus:border-primary">
                  {["Car","Bike","SUV","Truck","Electric Vehicle"].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <Inp name="color" label="Color" required />
              <Inp name="model" label="Model" required />
            </div>
            <div className="mt-6 flex gap-3">
              <button type="button" onClick={() => setOpen(false)} className="flex-1 py-2.5 rounded-xl border border-border font-semibold">Cancel</button>
              <button type="submit" className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold">Add</button>
            </div>
          </form>
        </div>
      )}

      {editingVehicle && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" onClick={() => setEditingVehicle(null)}>
          <form onSubmit={edit} onClick={(e) => e.stopPropagation()} className="bg-card rounded-3xl border border-border p-8 w-full max-w-md shadow-card">
            <h2 className="text-xl font-bold">Edit Vehicle</h2>
            <div className="mt-6 space-y-4">
              <Inp name="number" label="Vehicle Number" placeholder="MH 12 AB 4521" defaultValue={editingVehicle.number} required />
              <div>
                <label className="text-xs font-semibold uppercase text-muted-foreground tracking-wide">Vehicle Type</label>
                <select name="type" defaultValue={editingVehicle.type} className="mt-2 w-full px-4 py-3 rounded-xl border border-border bg-background outline-none focus:border-primary">
                  {["Car","Bike","SUV","Truck","Electric Vehicle"].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <Inp name="color" label="Color" defaultValue={editingVehicle.color} required />
              <Inp name="model" label="Model" defaultValue={editingVehicle.model} required />
            </div>
            <div className="mt-6 flex gap-3">
              <button type="button" onClick={() => setEditingVehicle(null)} className="flex-1 py-2.5 rounded-xl border border-border font-semibold">Cancel</button>
              <button type="submit" className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold">Save Changes</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function Inp({ label, name, ...rest }: React.InputHTMLAttributes<HTMLInputElement> & { label: string; name: string }) {
  return (
    <div>
      <label className="text-xs font-semibold uppercase text-muted-foreground tracking-wide">{label}</label>
      <input name={name} {...rest} className="mt-2 w-full px-4 py-3 rounded-xl border border-border bg-background outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition" />
    </div>
  );
}
