export function Footer() {
  return (
    <footer className="bg-secondary text-white/70 py-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="h-8 w-8 rounded-lg bg-primary grid place-items-center text-secondary font-bold">P</span>
            <span className="font-bold text-white">ParkWise AI</span>
          </div>
          <p className="text-xs text-white/50 max-w-sm">Intelligent Parking Operations & Occupancy Monitoring Platform</p>
        </div>
        <p className="text-sm">© 2026 ParkWise AI. Crafted with precision.</p>
        <div className="flex gap-6 text-sm">
          <a href="#" className="hover:text-primary">Privacy</a>
          <a href="#" className="hover:text-primary">Terms</a>
          <a href="#contact" className="hover:text-primary">Support</a>
        </div>
      </div>
    </footer>
  );
}
