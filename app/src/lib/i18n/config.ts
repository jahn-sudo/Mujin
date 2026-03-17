import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "@/locales/en.json";
import ja from "@/locales/ja.json";

export const LANG_KEY = "mujin_lang";

// Reads persisted language on client; defaults to English on server.
const savedLang =
  typeof window !== "undefined"
    ? (localStorage.getItem(LANG_KEY) ?? "en")
    : "en";

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources: {
      en: { translation: en },
      ja: { translation: ja },
    },
    lng: savedLang,
    fallbackLng: "en",
    interpolation: { escapeValue: false },
  });
}

export default i18n;
