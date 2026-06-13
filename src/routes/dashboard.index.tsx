import { createFileRoute, Navigate } from "@tanstack/react-router";
import { loadSession } from "@/lib/smartpark-store";

export const Route = createFileRoute("/dashboard/")({
  component: DashboardIndex,
});

function DashboardIndex() {
  const s = loadSession();
  if (s.profile?.role === "manager") {
    return null;
  }
  return <Navigate to="/dashboard/book" replace />;
}

