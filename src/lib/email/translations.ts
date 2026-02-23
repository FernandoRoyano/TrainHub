import en from "../../../messages/en.json";
import es from "../../../messages/es.json";

const messages: Record<string, typeof en> = { en, es };

export function getEmailTranslations(locale: string) {
  const lang = messages[locale] || messages.es;
  return lang.emails;
}

export function getLocaleForEmail(locale?: string | null): string {
  return locale && ["en", "es"].includes(locale) ? locale : "es";
}
