import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { About } from "@/components/landing/About";
import { Safety } from "@/components/landing/Safety";
import { Contact } from "@/components/landing/Contact";
import { Footer } from "@/components/landing/Footer";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ParkWise AI — Find Parking Before You Reach There" },
      { name: "description", content: "Intelligent Parking Operations & Occupancy Monitoring Platform with real-time availability, smart booking, and secure vehicle management." },
      { property: "og:title", content: "ParkWise AI — Intelligent Parking Operations" },
      { property: "og:description", content: "Real-time parking availability, smart booking, and AI-powered recommendations." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Safety />
        <Contact />
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}
