import React from "react";
import { useNavigate } from "react-router-dom";
import { useProjects } from "@/hooks/useUnitData";
import { useSiteContent } from "@/hooks/useSiteContent";
import { Image } from "@/components/ui/image";
import { Button } from "@/components/ui/button";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import ContactForm from "@/components/ContactForm";
import Logo from "@/components/Logo";
import { useLang } from "@/lib/i18n.jsx";
import {
  Building2, LayoutGrid, Home as HomeIcon, Mail, Phone, MapPin,
  ArrowRight, CheckCircle2, Hammer, ShieldCheck, TrendingUp,
} from "lucide-react";

const CONTENT_TO_I18N = {
  hero_badge: "hero.badge", hero_title: "hero.title", hero_subtitle: "hero.subtitle",
  about_title: "about.title", about_body: "about.body",
  feat1_title: "feat.constructTitle", feat1_text: "feat.constructText",
  feat2_title: "feat.trustedTitle", feat2_text: "feat.trustedText",
  feat3_title: "feat.growingTitle", feat3_text: "feat.growingText",
  buy_title: "buy.title", buy_subtitle: "buy.subtitle",
  step1_t: "buy.step1t", step1_d: "buy.step1d",
  step2_t: "buy.step2t", step2_d: "buy.step2d",
  step3_t: "buy.step3t", step3_d: "buy.step3d",
  step4_t: "buy.step4t", step4_d: "buy.step4d",
  contact_title: "contact.title", contact_body: "contact.body",
  contact_person: "contact.person", contact_role: "contact.role",
};

const DEFAULT_HERO = "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=2000&q=80";
const DEFAULT_ABOUT = "https://images.unsplash.com/photo-1486406146926-c627a42ad1c4?auto=format&fit=crop&w=1200&q=80";

const scrollTo = (id) => {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
};

export default function Home() {
  const { data: projects = [] } = useProjects();
  const { data: content } = useSiteContent();
  const { t, lang } = useLang();
  const navigate = useNavigate();

  const c = (key) => content?.content?.[lang]?.[key] || t(CONTENT_TO_I18N[key] || key);
  const phone = content?.contact_phone || "1349";
  const email = content?.contact_email || "hello@unitmatrix.living";
  const address = content?.contact_address || "1 Skyline Plaza, Downtown";
  const heroImg = content?.hero_image_url || DEFAULT_HERO;
  const aboutImg = content?.about_image_url || DEFAULT_ABOUT;

  const GUIDE = [
    { id: "buy", label: t("nav.buy"), icon: HomeIcon },
    { to: "/projects", label: t("nav.projects"), icon: Building2 },
    { to: "/matrix", label: t("nav.availability"), icon: LayoutGrid },
    { id: "about", label: t("nav.about"), icon: CheckCircle2 },
    { id: "contact", label: t("nav.contact"), icon: Mail },
  ];

  const go = (g) => (g.to ? navigate(g.to) : scrollTo(g.id));

  const FEATURES = [
    { icon: Hammer, title: c("feat1_title"), text: c("feat1_text") },
    { icon: ShieldCheck, title: c("feat2_title"), text: c("feat2_text") },
    { icon: TrendingUp, title: c("feat3_title"), text: c("feat3_text") },
  ];

  const STEPS = [
    { n: "01", t: c("step1_t"), d: c("step1_d") },
    { n: "02", t: c("step2_t"), d: c("step2_d") },
    { n: "03", t: c("step3_t"), d: c("step3_d") },
    { n: "04", t: c("step4_t"), d: c("step4_d") },
  ];

  return (
    <div className="bg-background text-foreground overflow-x-hidden">
      {/* Sticky guide bar */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-xl">
        {/* Mobile */}
        <div className="md:hidden max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-2">
          <LanguageSwitcher className="w-[92px] h-8 gap-1 text-[11px] px-2" />
          <div className="flex items-center gap-2.5">
            <Logo />
            <div className="leading-none font-semibold tracking-tight">Yangi Hayot</div>
          </div>
          <a href={`tel:${phone}`} className="flex items-center gap-1.5 text-xs font-medium text-foreground hover:text-primary transition">
            <span className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
              <Phone className="w-3.5 h-3.5" />
            </span>
            <span className="font-semibold">{phone}</span>
          </a>
        </div>
        {/* Desktop */}
        <div className="hidden md:grid max-w-7xl mx-auto px-4 md:px-8 h-auto min-h-16 py-2 md:grid-cols-[1fr_auto_1fr] gap-3">
          <div className="flex items-center gap-2.5 justify-self-start">
            <Logo />
            <div className="leading-none">
              <div className="font-semibold tracking-tight">Yangi Hayot</div>
            </div>
          </div>
          <nav className="flex items-center justify-self-center gap-1">
            {GUIDE.map((g) => (
              <button
                key={g.id || g.to}
                onClick={() => go(g)}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition"
              >
                <g.icon className="w-4 h-4" />
                {g.label}
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-3 justify-self-end">
            <LanguageSwitcher />
            <a href={`tel:${phone}`} className="hidden lg:flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition">
              <Phone className="w-4 h-4" /> {phone}
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <img
          src={heroImg}
          alt="Modern apartment building"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/80 via-emerald-900/60 to-black/40" />
        <div className="relative max-w-7xl mx-auto px-4 md:px-8 py-24 md:py-36">
          <div className="max-w-2xl text-white">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur px-3 py-1 text-xs font-medium tracking-wide uppercase">
              <Hammer className="w-3.5 h-3.5" /> {c("hero_badge")}
            </span>
            <h1 className="mt-5 text-4xl md:text-6xl font-bold tracking-tight leading-[1.05]">
              {c("hero_title")}
            </h1>
            <p className="mt-5 text-lg text-white/85 max-w-xl">
              {c("hero_subtitle")}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" className="gap-2" onClick={() => navigate("/matrix")}>
                <LayoutGrid className="w-5 h-5" /> {t("hero.seeAvailability")}
              </Button>
              <Button size="lg" variant="secondary" className="gap-2 bg-white text-emerald-900 hover:bg-white/90" onClick={() => navigate("/projects")}>
                <Building2 className="w-5 h-5" /> {t("hero.ourProjects")}
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
              key={g.id || g.to}
              onClick={() => go(g)}
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
            <h2 className="text-3xl font-bold tracking-tight">{c("about_title")}</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">{c("about_body")}</p>
            <div className="mt-8 space-y-3">
              {FEATURES.map((f) => (
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
              src={aboutImg}
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
            <h2 className="text-3xl font-bold tracking-tight">{c("buy_title")}</h2>
            <p className="mt-3 text-muted-foreground">{c("buy_subtitle")}</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {STEPS.map((s) => (
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
            <h2 className="text-3xl font-bold tracking-tight">{t("projects.title")}</h2>
            <p className="mt-2 text-muted-foreground">{t("projects.subtitle")}</p>
          </div>
          <Button variant="outline" className="hidden sm:flex gap-2" onClick={() => navigate("/matrix")}>
            <LayoutGrid className="w-4 h-4" /> {t("nav.availability")}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
        {projects.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
            {t("projects.empty")}
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
                    onClick={() => navigate("/matrix")}
                    className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary hover:gap-3 transition-all"
                  >
                    {t("projects.viewAvailability")} <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Contact */}
      <section id="contact" className="max-w-7xl mx-auto px-4 md:px-8 py-20">
        <div className="rounded-2xl border border-border bg-primary text-primary-foreground p-10 md:p-16">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">{c("contact_title")}</h2>
              <p className="mt-3 text-primary-foreground/85">{c("contact_body")}</p>
              <div className="mt-8 space-y-3">
                <div className="font-medium text-lg">{c("contact_person")} — {c("contact_role")}</div>
                <a href={`tel:${phone}`} className="flex items-center gap-3 hover:underline"><Phone className="w-5 h-5" /> {phone}</a>
                <a href={`mailto:${email}`} className="flex items-center gap-3 hover:underline"><Mail className="w-5 h-5" /> {email}</a>
                <div className="flex items-center gap-3"><MapPin className="w-5 h-5" /> {address}</div>
              </div>
            </div>
            <ContactForm />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2.5">
            <Logo className="w-8 h-8 rounded-lg" />
            <span className="font-medium text-foreground">Yangi Hayot</span>
          </div>
          <div>{t("footer.rights", { year: new Date().getFullYear() })}</div>
        </div>
      </footer>
    </div>
  );
}