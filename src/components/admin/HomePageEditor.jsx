import React, { useState, useEffect } from "react";
import { translations } from "@/lib/i18n.jsx";
import { useSiteContent, useSaveSiteContent } from "@/hooks/useSiteContent";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Upload, Save, ImageOff } from "lucide-react";

const LANGS = [
  { code: "ru", label: "РУС" },
  { code: "en", label: "ENG" },
  { code: "uz", label: "UZB" },
];

const DEFAULT_HERO = "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=2000&q=80";
const DEFAULT_ABOUT = "https://images.unsplash.com/photo-1486406146926-c627a42ad1c4?auto=format&fit=crop&w=1200&q=80";

const TEXT_FIELDS = [
  { group: "Hero", key: "hero_badge", i18n: "hero.badge", label: "Бейдж" },
  { group: "Hero", key: "hero_title", i18n: "hero.title", label: "Заголовок" },
  { group: "Hero", key: "hero_subtitle", i18n: "hero.subtitle", label: "Подзаголовок", area: true },
  { group: "О нас", key: "about_title", i18n: "about.title", label: "Заголовок" },
  { group: "О нас", key: "about_body", i18n: "about.body", label: "Текст", area: true },
  { group: "Преимущества", key: "feat1_title", i18n: "feat.constructTitle", label: "Блок 1 — заголовок" },
  { group: "Преимущества", key: "feat1_text", i18n: "feat.constructText", label: "Блок 1 — текст" },
  { group: "Преимущества", key: "feat2_title", i18n: "feat.trustedTitle", label: "Блок 2 — заголовок" },
  { group: "Преимущества", key: "feat2_text", i18n: "feat.trustedText", label: "Блок 2 — текст" },
  { group: "Преимущества", key: "feat3_title", i18n: "feat.growingTitle", label: "Блок 3 — заголовок" },
  { group: "Преимущества", key: "feat3_text", i18n: "feat.growingText", label: "Блок 3 — текст" },
  { group: "Как купить", key: "buy_title", i18n: "buy.title", label: "Заголовок" },
  { group: "Как купить", key: "buy_subtitle", i18n: "buy.subtitle", label: "Подзаголовок" },
  { group: "Как купить", key: "step1_t", i18n: "buy.step1t", label: "Шаг 1 — заголовок" },
  { group: "Как купить", key: "step1_d", i18n: "buy.step1d", label: "Шаг 1 — текст" },
  { group: "Как купить", key: "step2_t", i18n: "buy.step2t", label: "Шаг 2 — заголовок" },
  { group: "Как купить", key: "step2_d", i18n: "buy.step2d", label: "Шаг 2 — текст" },
  { group: "Как купить", key: "step3_t", i18n: "buy.step3t", label: "Шаг 3 — заголовок" },
  { group: "Как купить", key: "step3_d", i18n: "buy.step3d", label: "Шаг 3 — текст" },
  { group: "Как купить", key: "step4_t", i18n: "buy.step4t", label: "Шаг 4 — заголовок" },
  { group: "Как купить", key: "step4_d", i18n: "buy.step4d", label: "Шаг 4 — текст" },
  { group: "Контакты", key: "contact_title", i18n: "contact.title", label: "Заголовок" },
  { group: "Контакты", key: "contact_body", i18n: "contact.body", label: "Текст", area: true },
  { group: "Контакты", key: "contact_person", i18n: "contact.person", label: "Имя контактного лица" },
  { group: "Контакты", key: "contact_role", i18n: "contact.role", label: "Должность" },
];

function buildDefaults() {
  const out = {};
  for (const lang of ["en", "ru", "uz"]) {
    const dict = translations[lang];
    const obj = {};
    TEXT_FIELDS.forEach((f) => { obj[f.key] = dict[f.i18n] || ""; });
    out[lang] = obj;
  }
  return out;
}

export default function HomePageEditor() {
  const { data: record, isLoading } = useSiteContent();
  const save = useSaveSiteContent();
  const [lang, setLang] = useState("ru");
  const [content, setContent] = useState(buildDefaults);
  const [heroImage, setHeroImage] = useState(DEFAULT_HERO);
  const [aboutImage, setAboutImage] = useState(DEFAULT_ABOUT);
  const [phone, setPhone] = useState("1349");
  const [email, setEmail] = useState("hello@unitmatrix.living");
  const [address, setAddress] = useState("1 Skyline Plaza, Downtown");
  const [uploading, setUploading] = useState(null);

  useEffect(() => {
    if (!record) return;
    if (record.content) setContent({ ...buildDefaults(), ...record.content });
    if (record.hero_image_url) setHeroImage(record.hero_image_url);
    if (record.about_image_url) setAboutImage(record.about_image_url);
    if (record.contact_phone) setPhone(record.contact_phone);
    if (record.contact_email) setEmail(record.contact_email);
    if (record.contact_address) setAddress(record.contact_address);
  }, [record]);

  const update = (key, value) =>
    setContent((c) => ({ ...c, [lang]: { ...c[lang], [key]: value } }));

  const upload = async (e, field) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(field);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      if (field === "hero") setHeroImage(file_url);
      else if (field === "about") setAboutImage(file_url);
    } finally {
      setUploading(null);
    }
  };

  const saveAll = () => {
    save.mutate({
      content,
      hero_image_url: heroImage,
      about_image_url: aboutImage,
      contact_phone: phone,
      contact_email: email,
      contact_address: address,
    });
  };

  if (isLoading) {
    return <div className="flex justify-center py-10"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>;
  }

  const groups = [...new Set(TEXT_FIELDS.map((f) => f.group))];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Контент главной страницы</h2>
          <p className="text-sm text-muted-foreground">Текст, фото и контакты. Редактируется по языкам.</p>
        </div>
        <div className="flex items-center gap-3">
          <Tabs value={lang} onValueChange={setLang}>
            <TabsList>
              {LANGS.map((l) => <TabsTrigger key={l.code} value={l.code}>{l.label}</TabsTrigger>)}
            </TabsList>
          </Tabs>
          <Button onClick={saveAll} disabled={save.isPending} className="gap-2">
            {save.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Сохранить
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <ImageField label="Hero — фоновое фото" src={heroImage} onChange={setHeroImage} onUpload={(e) => upload(e, "hero")} uploading={uploading === "hero"} />
        <ImageField label="О нас — фото" src={aboutImage} onChange={setAboutImage} onUpload={(e) => upload(e, "about")} uploading={uploading === "about"} />
      </div>

      <div className="rounded-xl border border-border p-5 space-y-4">
        <h3 className="font-medium">Контакты (общие для всех языков)</h3>
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Телефон</Label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Адрес</Label>
            <Input value={address} onChange={(e) => setAddress(e.target.value)} />
          </div>
        </div>
      </div>

      {groups.map((group) => (
        <div key={group} className="rounded-xl border border-border p-5 space-y-4">
          <h3 className="font-medium">{group} <span className="text-xs text-muted-foreground font-normal">— {LANGS.find((l) => l.code === lang)?.label}</span></h3>
          <div className="grid gap-4">
            {TEXT_FIELDS.filter((f) => f.group === group).map((f) => (
              <div key={f.key} className="space-y-2">
                <Label>{f.label}</Label>
                {f.area ? (
                  <Textarea rows={3} value={content[lang]?.[f.key] ?? ""} onChange={(e) => update(f.key, e.target.value)} />
                ) : (
                  <Input value={content[lang]?.[f.key] ?? ""} onChange={(e) => update(f.key, e.target.value)} />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function ImageField({ label, src, onChange, onUpload, uploading }) {
  return (
    <div className="rounded-xl border border-border p-4 space-y-3">
      <Label>{label}</Label>
      <div className="aspect-video rounded-lg overflow-hidden border border-border bg-sidebar/40 flex items-center justify-center">
        {src ? <img src={src} alt="" className="w-full h-full object-cover" /> : <ImageOff className="w-8 h-8 text-muted-foreground" />}
      </div>
      <div className="flex items-center gap-3">
        <Input type="file" accept="image/*" onChange={onUpload} disabled={uploading} />
        {uploading && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
      </div>
      <Input value={src} onChange={(e) => onChange?.(e.target.value)} placeholder="URL изображения" />
    </div>
  );
}