import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, LogOut } from "lucide-react";
import { loadSession, logout, type Profile } from "@/lib/smartpark-store";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    setProfile(loadSession().profile);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setProfile(null);
    setOpen(false);
    navigate({ to: "/" });
  };

  // Determine navigation links dynamically
  const isGuest = !profile;
  const isProprietor = profile?.role === "vehicle_owner" || profile?.role === "proprietor";
  const isManager = profile?.role === "parking_manager" || profile?.role === "manager";

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-background/80 backdrop-blur-md border-b border-border shadow-soft" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="h-9 w-9 rounded-xl bg-primary grid place-items-center text-primary-foreground font-bold shadow-soft">
            P
          </span>
          <span className="font-bold text-lg tracking-tight">ParkWise <span className="text-primary">AI</span></span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {isGuest && (
            <>
              <a href="/" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">Home</a>
              <a href="/#about" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">About</a>
              <a href="/#safety" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">Safety</a>
              <a href="/#contact" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">Contact</a>
            </>
          )}

          {isProprietor && (
            <>
              <Link to="/dashboard/book" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">Book Parking</Link>
              <Link to="/dashboard/vehicles" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">My Vehicles</Link>
              <Link to="/dashboard" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">My Bookings</Link>
            </>
          )}

          {isManager && (
            <Link to="/dashboard" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">Parking Dashboard</Link>
          )}
        </nav>

        {/* Desktop Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {isGuest ? (
            <>
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted rounded-xl transition"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-5 py-2 text-sm font-bold rounded-xl bg-primary text-primary-foreground shadow-soft hover:scale-105 hover:shadow-glow hover:brightness-105 transition-all duration-300"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/dashboard"
                className="px-4 py-2 text-sm font-semibold bg-muted hover:bg-muted/80 rounded-xl transition"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold border border-border rounded-xl text-destructive hover:bg-destructive/10 transition cursor-pointer"
              >
                <LogOut className="h-4 w-4" /> Logout
              </button>
            </>
          )}
        </div>

        {/* Mobile menu trigger */}
        <button className="md:hidden p-2" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {open && (
        <div className="md:hidden border-t border-border bg-card">
          <div className="px-6 py-4 flex flex-col gap-3">
            {isGuest ? (
              <>
                <a href="/" onClick={() => setOpen(false)} className="text-sm font-medium py-1">Home</a>
                <a href="/#about" onClick={() => setOpen(false)} className="text-sm font-medium py-1">About</a>
                <a href="/#safety" onClick={() => setOpen(false)} className="text-sm font-medium py-1">Safety</a>
                <a href="/#contact" onClick={() => setOpen(false)} className="text-sm font-medium py-1">Contact</a>
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <Link
                    to="/login"
                    onClick={() => setOpen(false)}
                    className="text-center py-2.5 rounded-xl border border-border font-bold text-sm text-foreground hover:bg-muted"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setOpen(false)}
                    className="text-center py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow-soft"
                  >
                    Sign Up
                  </Link>
                </div>
              </>
            ) : (
              <>
                {isProprietor && (
                  <>
                    <Link to="/dashboard/book" onClick={() => setOpen(false)} className="text-sm font-medium py-1">Book Parking</Link>
                    <Link to="/dashboard/vehicles" onClick={() => setOpen(false)} className="text-sm font-medium py-1">My Vehicles</Link>
                    <Link to="/dashboard" onClick={() => setOpen(false)} className="text-sm font-medium py-1">My Bookings</Link>
                  </>
                )}
                {isManager && (
                  <Link to="/dashboard" onClick={() => setOpen(false)} className="text-sm font-medium py-1">Parking Dashboard</Link>
                )}
                <div className="pt-2 border-t border-border mt-1 flex flex-col gap-2">
                  <Link
                    to="/dashboard"
                    onClick={() => setOpen(false)}
                    className="w-full text-center py-2.5 bg-muted rounded-xl text-sm font-bold"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full py-2.5 rounded-xl border border-border text-destructive hover:bg-destructive/10 font-bold text-sm flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" /> Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
