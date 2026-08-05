import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useProjects } from "@/hooks/useUnitData";
import { Image } from "@/components/ui/image";
import { Button } from "@/components/ui/button";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import Logo from "@/components/Logo";
import { useLang } from "@/lib/i18n.jsx";
import {
  Building2, ArrowLeft, MapPin, ChevronDown, ArrowRight, LayoutGrid,
} from "lucide-react";
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

// Тестовые проекты для Навои (пока нет реальных данных).
const TEST_NAVOI_PROJECTS = [
  {
    id: "navoi-test-1",
    name: "Yangi Navoi Residence",
    location: "Навои",
    description: "Тестовый проект — современные квартиры с паркингом и закрытым двором.",
    image_url: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: "navoi-test-2",
    name: "Navoi Gardens",
    location: "Навои",
    description: "Тестовый проект — уютный жилой комплекс рядом с городским парком.",
    image_url: "https://images.unsplash.com/photo-1486406146926-c627a42ad1c4?auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: "navoi-test-3",
    name: "Yangi Hayot Navoi",
    location: "Навои",
    description: "Тестовый проект — новостройка в центральной части Навои.",
    image_url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80",
  },
];

const CITIES = [
  { id: "tashkent", name: "Ташкент" },
  { id: "navoi", name: "Навои" },
];

export default function Projects() {
  const { t } = useLang();
  const navigate = useNavigate();
  const { data: dbProjects = [] } = useProjects();
  const [city, setCity] = useState("tashkent");
  const [open, setOpen] = useState(false);

  const projects = useMemo(() => {
    if (city === "navoi") return TEST_NAVOI_PROJECTS;
    return dbProjects;
  }, [city, dbProjects]);

  const currentCity = CITIES.find((c) => c.id === city);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2.5">
            <Logo />
            <div className="font-semibold tracking-tight">Yangi Hayot</div>
          </Link>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <Button asChild size="sm" variant="outline" className="gap-2">
              <Link to="/"><ArrowLeft className="w-4 h-4" /> {t("matrix.home")}</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6 md:p-10 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{t("projects.title")}</h1>
            <p className="text-muted-foreground mt-1 text-sm">{t("projects.subtitle")}</p>
          </div>

          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2 w-full md:w-auto justify-between md:justify-start">
                <span className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> {currentCity.name}
                </span>
                <ChevronDown className="w-4 h-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-1" align="end">
              {CITIES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => { setCity(c.id); setOpen(false); }}
                  className={cn(
                    "flex items-center justify-between w-full rounded-md px-3 py-2 text-sm transition",
                    city === c.id ? "bg-primary/10 text-primary font-medium" : "hover:bg-accent"
                  )}
                >
                  <span className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {c.name}</span>
                  {city === c.id && <span className="w-2 h-2 rounded-full bg-primary" />}
                </button>
              ))}
            </PopoverContent>
          </Popover>
        </div>

        {projects.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
            {t("projects.empty")}
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {projects.map((p) => (
              <div
                key={p.id}
                className="group rounded-2xl overflow-hidden border border-border bg-card hover:shadow-lg transition grid md:grid-cols-2 gap-0"
              >
                <div className="aspect-[16/10] md:aspect-auto md:min-h-[300px] bg-secondary overflow-hidden">
                  {p.image_url ? (
                    <Image src={p.image_url} fittingType="fill" className="w-full h-full" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      <Building2 className="w-10 h-10" />
                    </div>
                  )}
                </div>
                <div className="p-6 md:p-8 flex flex-col justify-center">
                  <h3 className="font-semibold text-xl md:text-2xl">{p.name}</h3>
                  {p.location && (
                    <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1.5">
                      <MapPin className="w-4 h-4" /> {p.location}
                    </p>
                  )}
                  {p.description && (
                    <p className="text-sm text-muted-foreground mt-4 leading-relaxed">{p.description}</p>
                  )}
                  <button
                    onClick={() => navigate("/matrix")}
                    className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary hover:gap-3 transition-all self-start"
                  >
                    <LayoutGrid className="w-4 h-4" /> {t("projects.viewAvailability")} <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}