import { Mail, MapPin, Phone, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function Contact() {
  const [loading, setLoading] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Message sent — we'll get back to you within 24 hours.");
      (e.target as HTMLFormElement).reset();
    }, 700);
  }

  return (
    <section id="contact" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-sm font-semibold text-primary uppercase tracking-widest">Get in touch</p>
          <h2 className="mt-3 text-4xl sm:text-5xl font-bold tracking-tight">Contact Us</h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            Questions about ParkWise AI? Our team is here to help.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2 rounded-3xl bg-secondary text-white p-8 flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-2">Let's talk.</h3>
              <p className="text-white/60 text-sm">Reach out through any channel below.</p>
            </div>
            <div className="space-y-5 mt-10">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-xl bg-primary text-secondary grid place-items-center shrink-0">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-white/50 uppercase">Phone</p>
                  <p className="font-semibold">+91 98765 43210</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-xl bg-primary text-secondary grid place-items-center shrink-0">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-white/50 uppercase">Email</p>
                  <p className="font-semibold">hello@parkwise.ai</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-xl bg-primary text-secondary grid place-items-center shrink-0">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-white/50 uppercase">Location</p>
                  <p className="font-semibold">Bengaluru, India</p>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={onSubmit} className="lg:col-span-3 rounded-3xl bg-card border border-border p-8 shadow-soft">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Name" name="name" required />
              <Field label="Email" name="email" type="email" required />
            </div>
            <div className="mt-4">
              <Field label="Subject" name="subject" required />
            </div>
            <div className="mt-4">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Message</label>
              <textarea
                name="message"
                rows={5}
                required
                className="mt-2 w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none transition resize-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold shadow-soft hover:shadow-glow transition-all disabled:opacity-60"
            >
              <Send className="h-4 w-4" />
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

function Field({ label, name, type = "text", required }: { label: string; name: string; type?: string; required?: boolean }) {
  return (
    <div>
      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{label}</label>
      <input
        name={name}
        type={type}
        required={required}
        className="mt-2 w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none transition"
      />
    </div>
  );
}
