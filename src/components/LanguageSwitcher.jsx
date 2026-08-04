import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Globe } from "lucide-react";
import { useLang } from "@/lib/i18n.jsx";

const LANGS = [
  { value: "en", label: "ENG" },
  { value: "ru", label: "РУС" },
  { value: "uz", label: "UZB" },
];

export default function LanguageSwitcher() {
  const { lang, setLang } = useLang();
  const current = LANGS.find((l) => l.value === lang)?.label ?? lang.toUpperCase();
  return (
    <Select value={lang} onValueChange={setLang}>
      <SelectTrigger className="w-[88px] h-9 gap-1.5 text-sm" aria-label="Language">
        <Globe className="w-3.5 h-3.5" />
        <SelectValue>{current}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {LANGS.map((l) => (
          <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}