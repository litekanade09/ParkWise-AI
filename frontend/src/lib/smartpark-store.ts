// Lightweight localStorage-backed mock store for ParkWise AI demo.
export type Role = "proprietor" | "manager" | "vehicle_owner" | "parking_manager";

export type Vehicle = {
  id: string;
  number: string;
  type: string;
  color: string;
  model: string;
};

export type Booking = {
  id: string;
  lot: string;
  slot: string;
  date: string;
  time: string;
  status: "Active" | "Upcoming" | "Completed" | "Cancelled";
  price: number;
};

export type Profile = {
  id?: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  postal: string;
  role: Role;
  token?: string;
  profileCompleted?: boolean;
  parkingName?: string;
  parkingAddress?: string;
  city?: string;
  contactNumber?: string;
  parkingType?: string;
  totalCapacity?: number;
  bikeSlots?: number;
  carSlots?: number;
  suvSlots?: number;
  truckSlots?: number;
  bikePrice?: number;
  carPrice?: number;
  suvPrice?: number;
  truckPrice?: number;
  facilities?: string[];
};

const KEY = "smartpark.session.v1";

type Session = {
  profile: Profile | null;
  vehicles: Vehicle[];
  bookings: Booking[];
};

const seedBookings: Booking[] = [
  { id: "BK-1042", lot: "City Centre Mall", slot: "A-12", date: "2026-06-08", time: "14:00", status: "Active", price: 60 },
  { id: "BK-1037", lot: "Airport Terminal 2", slot: "C-04", date: "2026-06-10", time: "09:30", status: "Upcoming", price: 220 },
  { id: "BK-1011", lot: "Marina Square", slot: "B-22", date: "2026-05-28", time: "18:00", status: "Completed", price: 80 },
  { id: "BK-0998", lot: "Tech Park Tower", slot: "D-08", date: "2026-05-21", time: "10:15", status: "Completed", price: 45 },
];

export function loadSession(): Session {
  if (typeof window === "undefined") return { profile: null, vehicles: [], bookings: [] };
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as Session;
  } catch {}
  return { profile: null, vehicles: [], bookings: seedBookings };
}

export function saveSession(s: Session) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(s));
}

export function logout() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
}
