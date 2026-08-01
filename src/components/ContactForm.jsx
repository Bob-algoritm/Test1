import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Send, CheckCircle2, Loader2 } from "lucide-react";
import { useLang } from "@/lib/i18n.jsx";

export default function ContactForm() {
  const { t } = useLang();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    setLoading(true);
    try {
      await base44.entities.Inquiry.create({
        name: name.trim(),
        phone: phone.trim(),
      });
      setDone(true);
      setName("");
      setPhone("");
    } catch (err) {
      toast({ title: t("contact.error"), variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="rounded-xl bg-white text-foreground p-8 text-center">
        <CheckCircle2 className="w-10 h-10 mx-auto text-primary" />
        <p className="mt-3 font-medium">{t("contact.success")}</p>
        <Button variant="ghost" className="mt-4" onClick={() => setDone(false)}>
          {t("contact.sendAnother")}
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="rounded-xl bg-white text-foreground p-6 md:p-8 space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="cf-name">{t("contact.nameLabel")}</Label>
        <Input
          id="cf-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="Jane Doe"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="cf-phone">{t("contact.phoneLabel")}</Label>
        <Input
          id="cf-phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          placeholder="+998 90 123 45 67"
        />
      </div>
      <Button type="submit" disabled={loading} className="w-full gap-2">
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        {t("contact.submit")}
      </Button>
    </form>
  );
}