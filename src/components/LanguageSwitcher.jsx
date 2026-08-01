import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Globe } from "lucide-react";
import { useLang } from "@/lib/i18n.jsx";

export default function LanguageSwitcher() {
  const { lang, setLang } = useLang();
  return (
    <Select value={lang} onValueChange={setLang}>
      <SelectTrigger className="w-[130px] h-9 gap-2 text-sm" aria-label="Language">
        <Globe className="w-4 h-4" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en">English</SelectItem>
        <SelectItem value="ru">Русский</SelectItem>
        <SelectItem value="uz">O‘zbekcha</SelectItem>
      </SelectContent>
    </Select>
  );
}