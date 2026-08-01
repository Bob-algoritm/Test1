import React, { createContext, useContext, useState, useCallback, useMemo } from "react";

const translations = {
  en: {
    "nav.buy": "Buy a House",
    "nav.projects": "Our Projects",
    "nav.availability": "Availability Matrix",
    "nav.about": "About Us",
    "nav.contact": "Contact",
    "header.browseHomes": "Browse Homes",
    "hero.badge": "We design & build",
    "hero.title": "Homes built for the way you live.",
    "hero.subtitle": "UnitMatrix Living develops modern apartments and lets you check real-time availability unit by unit — so you always know exactly what's ready to move into.",
    "hero.seeAvailability": "See Availability",
    "hero.ourProjects": "Our Projects",
    "about.title": "A company that builds, then opens the door.",
    "about.body": "We are a full-service real estate developer. From land acquisition and design to construction and handover, UnitMatrix Living manages every step — so quality is never outsourced and availability is always accurate.",
    "feat.constructTitle": "In-house construction",
    "feat.constructText": "Our crews build every project to a single standard.",
    "feat.trustedTitle": "Trusted & transparent",
    "feat.trustedText": "Live availability and pricing, updated in real time.",
    "feat.growingTitle": "Growing portfolio",
    "feat.growingText": "New communities breaking ground every year.",
    "buy.title": "How to buy a home with us",
    "buy.subtitle": "Four simple steps from browsing to keys in hand.",
    "buy.step1t": "Browse availability",
    "buy.step1d": "Explore the live matrix to find units that match your budget and size.",
    "buy.step2t": "Reserve a unit",
    "buy.step2d": "Lock in your apartment with our team — its status updates instantly.",
    "buy.step3t": "Sign & finance",
    "buy.step3d": "We guide you through contracts and financing options.",
    "buy.step4t": "Move in",
    "buy.step4d": "Collect your keys and step into your new home.",
    "projects.title": "Our projects",
    "projects.subtitle": "Communities we've built and are building now.",
    "projects.empty": "New projects are on the way — check back soon.",
    "projects.viewAvailability": "View availability",
    "availability.title": "Live availability matrix",
    "availability.subtitle": "Real-time unit availability across every building we develop.",
    "contact.title": "Ready to find your home?",
    "contact.body": "Talk to our sales team or browse the matrix — we'll help you secure your unit.",
    "contact.openMatrix": "Open the matrix",
    "contact.person": "Sarah Lin",
    "contact.role": "Sales Director",
    "footer.rights": "© {year} UnitMatrix Living. All rights reserved.",
  },
  ru: {
    "nav.buy": "Купить дом",
    "nav.projects": "Наши проекты",
    "nav.availability": "Матрица доступности",
    "nav.about": "О нас",
    "nav.contact": "Контакты",
    "header.browseHomes": "Смотреть дома",
    "hero.badge": "Проектируем и строим",
    "hero.title": "Дома, созданные для вашего образа жизни.",
    "hero.subtitle": "UnitMatrix Living строит современные квартиры и позволяет отслеживать доступность каждой квартиры в реальном времени — вы всегда знаете, что готово к заселению.",
    "hero.seeAvailability": "Посмотреть доступность",
    "hero.ourProjects": "Наши проекты",
    "about.title": "Компания, которая строит, а затем открывает двери.",
    "about.body": "Мы — девелопер полного цикла. От подбора участка и проектирования до строительства и передачи ключей UnitMatrix Living управляет каждым этапом — поэтому качество никогда не передаётся на аутсорс, а доступность всегда точна.",
    "feat.constructTitle": "Собственное строительство",
    "feat.constructText": "Наши бригады строят каждый проект по единому стандарту.",
    "feat.trustedTitle": "Надёжность и прозрачность",
    "feat.trustedText": "Актуальная доступность и цены в реальном времени.",
    "feat.growingTitle": "Растущий портфель",
    "feat.growingText": "Новые кварталы закладываются каждый год.",
    "buy.title": "Как купить дом у нас",
    "buy.subtitle": "Четыре простых шага от выбора до получения ключей.",
    "buy.step1t": "Изучите доступность",
    "buy.step1d": "Смотрите живую матрицу, чтобы найти квартиры по вашему бюджету и размеру.",
    "buy.step2t": "Забронируйте квартиру",
    "buy.step2d": "Закрепите квартиру с нашей командой — статус обновится мгновенно.",
    "buy.step3t": "Договор и финансирование",
    "buy.step3d": "Мы проведём вас через договоры и варианты финансирования.",
    "buy.step4t": "Заселяйтесь",
    "buy.step4d": "Получите ключи и войдите в новый дом.",
    "projects.title": "Наши проекты",
    "projects.subtitle": "Кварталы, которые мы построили и строим сейчас.",
    "projects.empty": "Новые проекты скоро появятся — заходите позже.",
    "projects.viewAvailability": "Посмотреть доступность",
    "availability.title": "Живая матрица доступности",
    "availability.subtitle": "Доступность квартир в реальном времени во всех наших домах.",
    "contact.title": "Готовы найти свой дом?",
    "contact.body": "Поговорите с отделом продаж или откройте матрицу — поможем закрепить квартиру.",
    "contact.openMatrix": "Открыть матрицу",
    "contact.person": "Сара Лин",
    "contact.role": "Директор по продажам",
    "footer.rights": "© {year} UnitMatrix Living. Все права защищены.",
  },
  uz: {
    "nav.buy": "Uy sotib olish",
    "nav.projects": "Loyihalarimiz",
    "nav.availability": "Mavjudlik matritsasi",
    "nav.about": "Biz haqimizda",
    "nav.contact": "Aloqa",
    "header.browseHomes": "Uylarni ko‘rish",
    "hero.badge": "Loyihalashtiramiz va quramiz",
    "hero.title": "Sizning hayot tarzingiz uchun qurilgan uylar.",
    "hero.subtitle": "UnitMatrix Living zamonaviy kvartiralarni quradi va har bir kvartiraning mavjudligini real vaqtda ko‘rish imkonini beradi — nima ko‘chib o‘tishga tayyor ekanligini doimo bilasiz.",
    "hero.seeAvailability": "Mavjudlikni ko‘rish",
    "hero.ourProjects": "Loyihalarimiz",
    "about.title": "Avval quruvchi, so‘ng eshikni ochuvchi kompaniya.",
    "about.body": "Biz — to‘liq xizmat ko‘rsatuvchi ko‘chmas mulk ishlab chiqaruvchimiz. Yerni tanlash va loyihalashdan qurilish va topshirishgacha UnitMatrix Living har bir bosqichni boshqaradi — shuning uchun sifat hech qachon topshirilmaydi va mavjudlik doim aniq.",
    "feat.constructTitle": "O‘z qurilishimiz",
    "feat.constructText": "Bizning brigadalarimiz har bir loyihani bitta standart bo‘yicha quradi.",
    "feat.trustedTitle": "Ishonchli va shaffof",
    "feat.trustedText": "Real vaqtda yangilanadigan mavjudlik va narxlar.",
    "feat.growingTitle": "O‘sib borayotgan portfel",
    "feat.growingText": "Har yili yangi mahallalar barpo etilmoqda.",
    "buy.title": "Bizdan uy qanday sotib olinadi",
    "buy.subtitle": "Ko‘rishdan kalitchgacha to‘rt oddiy qadam.",
    "buy.step1t": "Mavjudlikni ko‘ring",
    "buy.step1d": "Byudjetingiz va o‘lchamingizga mos kvartiralarni topish uchun jonli matritsani ko‘ring.",
    "buy.step2t": "Kvartirani bron qiling",
    "buy.step2d": "Kvartirani jamoamiz bilan mahkamlang — uning holati darhol yangilanadi.",
    "buy.step3t": "Shartnoma va moliya",
    "buy.step3d": "Shartnomalar va moliyalashtirish variantlarida yordam beramiz.",
    "buy.step4t": "Ko‘chib kiring",
    "buy.step4d": "Kalitlaringizni oling va yangi uyingizga kiring.",
    "projects.title": "Loyihalarimiz",
    "projects.subtitle": "Biz qurgan va hozir qurayotgan mahallalar.",
    "projects.empty": "Yangi loyihalar yo‘lda — tez orada qaytib keling.",
    "projects.viewAvailability": "Mavjudlikni ko‘rish",
    "availability.title": "Jonli mavjudlik matritsasi",
    "availability.subtitle": "Biz qurgan har bir binodagi real vaqtdagi kvartira mavjudligi.",
    "contact.title": "O‘z uyingizni topishga tayyormisiz?",
    "contact.body": "Sotuv jamoasi bilan gaplashing yoki matritsani oching — kvartirani mahkamlashga yordam beramiz.",
    "contact.openMatrix": "Matritsani ochish",
    "contact.person": "Sarah Lin",
    "contact.role": "Sotuv direktori",
    "footer.rights": "© {year} UnitMatrix Living. Barcha huquqlar himoyalangan.",
  },
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("lang") || "en";
    }
    return "en";
  });

  const setLang = useCallback((l) => {
    setLangState(l);
    try { localStorage.setItem("lang", l); } catch (e) { /* ignore */ }
  }, []);

  const t = useCallback((key, vars) => {
    const dict = translations[lang] || translations.en;
    let str = dict[key] ?? translations.en[key] ?? key;
    if (vars) {
      Object.keys(vars).forEach((k) => {
        str = str.replace(`{${k}}`, String(vars[k]));
      });
    }
    return str;
  }, [lang]);

  const value = useMemo(() => ({ lang, setLang, t, languages: ["en", "ru", "uz"] }), [lang, setLang, t]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be used within a LanguageProvider");
  return ctx;
}