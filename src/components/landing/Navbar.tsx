import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { to: "/", label: "Home" },
    { to: "/#about", label: "About" },
    { to: "/#safety", label: "Safety" },
    { to: "/#contact", label: "Contact" },
  ];

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-background/80 backdrop-blur-md border-b border-border shadow-soft" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="h-9 w-9 rounded-xl bg-primary grid place-items-center text-primary-foreground font-bold shadow-soft">
            S
          </span>
          <span className="font-bold text-lg tracking-tight">SmartPark <span className="text-primary">AI</span></span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.to}
              className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/auth"
            className="px-6 py-2.5 text-sm font-bold rounded-xl bg-primary text-primary-foreground shadow-soft hover:scale-105 hover:shadow-glow hover:brightness-105 transition-all duration-300"
          >
            Book Parking
          </Link>
        </div>

        <button className="md:hidden p-2" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-card">
          <div className="px-6 py-4 flex flex-col gap-3">
            {links.map((l) => (
              <a key={l.label} href={l.to} onClick={() => setOpen(false)} className="text-sm font-medium py-1">
                {l.label}
              </a>
            ))}
            <div className="pt-2">
              <Link
                to="/auth"
                onClick={() => setOpen(false)}
                className="w-full text-center py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow-soft hover:scale-[1.02] hover:shadow-glow hover:brightness-105 transition-all duration-300 block"
              >
                Book Parking
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
