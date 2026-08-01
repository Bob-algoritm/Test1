import React from "react";
import { useProjects } from "@/hooks/useUnitData";
import { Image } from "@/components/ui/image";
import { Button } from "@/components/ui/button";
import {
  Building2, LayoutGrid, Home as HomeIcon, Mail, Phone, MapPin,
  ArrowRight, CheckCircle2, Hammer, ShieldCheck, TrendingUp,
} from "lucide-react";
import Matrix from "@/pages/Matrix";

const GUIDE = [
  { id: "buy", label: "Buy a House", icon: HomeIcon },
  { id: "projects", label: "Our Projects", icon: Building2 },
  { id: "availability", label: "Availability Matrix", icon: LayoutGrid },
  { id: "about", label: "About Us", icon: CheckCircle2 },
  { id: "contact", label: "Contact", icon: Mail },
];

const scrollTo = (id) => {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
};

export default function Home() {
  const { data: projects = [] } = useProjects();

  return (
    <div className="bg-background text-foreground">
      {/* Sticky guide bar */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <Building2 className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="leading-none">
              <div className="font-semibold tracking-tight">UnitMatrix</div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">Living</div>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-1">
            {GUIDE.map((g) => (
              <button
                key={g.id}
                onClick={() => scrollTo(g.id)}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition"
              >
                <g.icon className="w-4 h-4" />
                {g.label}
              </button>
            ))}
          </nav>
          <Button size="sm" className="gap-2" onClick={() => scrollTo("availability")}>
            Browse Homes <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <img
          src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=2000&q=80"
          alt="Modern apartment building"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/80 via-emerald-900/60 to-black/40" />
        <div className="relative max-w-7xl mx-auto px-4 md:px-8 py-24 md:py-36">
          <div className="max-w-2xl text-white">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur px-3 py-1 text-xs font-medium tracking-wide uppercase">
              <Hammer className="w-3.5 h-3.5" /> We design &amp; build
            </span>
            <h1 className="mt-5 text-4xl md:text-6xl font-bold tracking-tight leading-[1.05]">
              Homes built for the way you live.
            </h1>
            <p className="mt-5 text-lg text-white/85 max-w-xl">
              UnitMatrix Living develops modern apartments and lets you check real-time
              availability unit by unit — so you always know exactly what&apos;s ready to move into.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" className="gap-2" onClick={() => scrollTo("availability")}>
                <LayoutGrid className="w-5 h-5" /> See Availability
              </Button>
              <Button size="lg" variant="secondary" className="gap-2 bg-white text-emerald-900 hover:bg-white/90" onClick={() => scrollTo("projects")}>
                <Building2 className="w-5 h-5" /> Our Projects
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Guide buttons */}
      <section className="border-b border-border bg-secondary/40">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 grid grid-cols-2 md:grid-cols-5 gap-3">
          {GUIDE.map((g) => (
            <button
              key={g.id}
              onClick={() => scrollTo(g.id)}
              className="group flex flex-col items-start gap-3 rounded-xl border border-border bg-background p-4 text-left transition hover:border-primary/50 hover:shadow-sm"
            >
              <span className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition">
                <g.icon className="w-5 h-5" />
              </span>
              <span className="font-medium text-sm">{g.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* About */}
      <section id="about" className="max-w-7xl mx-auto px-4 md:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">A company that builds, then opens the door.</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              We are a full-service real estate developer. From land acquisition and design to
              construction and handover, UnitMatrix Living manages every step — so quality is
              never outsourced and availability is always accurate.
            </p>
            <div className="mt-8 space-y-3">
              {[
                { icon: Hammer, title: "In-house construction", text: "Our crews build every project to a single standard." },
                { icon: ShieldCheck, title: "Trusted & transparent", text: "Live availability and pricing, updated in real time." },
                { icon: TrendingUp, title: "Growing portfolio", text: "New communities breaking ground every year." },
              ].map((f) => (
                <div key={f.title} className="flex gap-3">
                  <span className="w-9 h-9 shrink-0 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <f.icon className="w-4.5 h-4.5" />
                  </span>
                  <div>
                    <div className="font-medium">{f.title}</div>
                    <div className="text-sm text-muted-foreground">{f.text}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden border border-border aspect-[4/3]">
            <img
              src="https://images.unsplash.com/photo-1486406146926-c627a42ad1c4?auto=format&fit=crop&w=1200&q=80"
              alt="Our construction"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Buy a house steps */}
      <section id="buy" className="border-y border-border bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold tracking-tight">How to buy a home with us</h2>
            <p className="mt-3 text-muted-foreground">
              Four simple steps from browsing to keys in hand.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { n: "01", t: "Browse availability", d: "Explore the live matrix to find units that match your budget and size." },
              { n: "02", t: "Reserve a unit", d: "Lock in your apartment with our team — its status updates instantly." },
              { n: "03", t: "Sign & finance", d: "We guide you through contracts and financing options." },
              { n: "04", t: "Move in", d: "Collect your keys and step into your new home." },
            ].map((s) => (
              <div key={s.n} className="rounded-xl border border-border bg-background p-6">
                <div className="text-primary font-semibold text-sm">{s.n}</div>
                <div className="mt-2 font-semibold">{s.t}</div>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects */}
      <section id="projects" className="max-w-7xl mx-auto px-4 md:px-8 py-20">
        <div className="flex items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Our projects</h2>
            <p className="mt-2 text-muted-foreground">Communities we&apos;ve built and are building now.</p>
          </div>
        </div>
        {projects.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
            New projects are on the way — check back soon.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((p) => (
              <div key={p.id} className="group rounded-2xl overflow-hidden border border-border bg-card hover:shadow-lg transition">
                <div className="aspect-[16/10] bg-secondary overflow-hidden">
                  {p.image_url ? (
                    <Image src={p.image_url} fittingType="fill" className="w-full h-full" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      <Building2 className="w-8 h-8" />
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-lg">{p.name}</h3>
                  {p.location && <p className="text-sm text-muted-foreground mt-1">{p.location}</p>}
                  {p.description && <p className="text-sm text-muted-foreground mt-3 leading-relaxed line-clamp-2">{p.description}</p>}
                  <button
                    onClick={() => scrollTo("availability")}
                    className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary hover:gap-3 transition-all"
                  >
                    View availability <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Availability matrix */}
      <section id="availability" className="border-t border-border bg-secondary/20">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-20">
          <div className="mb-8">
            <h2 className="text-3xl font-bold tracking-tight">Live availability matrix</h2>
            <p className="mt-2 text-muted-foreground">
              Real-time unit availability across every building we develop.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-background overflow-hidden">
            <Matrix />
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="max-w-7xl mx-auto px-4 md:px-8 py-20">
        <div className="rounded-2xl border border-border bg-primary text-primary-foreground p-10 md:p-16">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Ready to find your home?</h2>
              <p className="mt-3 text-primary-foreground/85">
                Talk to our sales team or browse the matrix — we&apos;ll help you secure your unit.
              </p>
              <Button variant="secondary" className="mt-6 gap-2 bg-white text-emerald-900 hover:bg-white/90" onClick={() => scrollTo("availability")}>
                <LayoutGrid className="w-5 h-5" /> Open the matrix
              </Button>
            </div>
            <div className="space-y-3 md:justify-self-end">
              <div className="flex items-center gap-3"><Phone className="w-5 h-5" /> +1 (555) 010-2025</div>
              <div className="flex items-center gap-3"><Mail className="w-5 h-5" /> hello@unitmatrix.living</div>
              <div className="flex items-center gap-3"><MapPin className="w-5 h-5" /> 1 Skyline Plaza, Downtown</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Building2 className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-medium text-foreground">UnitMatrix Living</span>
          </div>
          <div>© {new Date().getFullYear()} UnitMatrix Living. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}