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
      { title: "SmartPark AI — Find Parking Before You Reach There" },
      { name: "description", content: "AI-powered smart parking management with real-time availability, smart booking, and secure vehicle management." },
      { property: "og:title", content: "SmartPark AI — Smart Parking Management" },
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
