/* ============================
   BARBERPRO — Internacionalização (i18n)
   Suporte a pt-BR, en, es
   ============================ */
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Traduções
import ptBR from './locales/pt-BR.json';
import en from './locales/en.json';
import es from './locales/es.json';

const resources = {
  'pt-BR': { translation: ptBR },
  'pt': { translation: ptBR },
  'en': { translation: en },
  'en-US': { translation: en },
  'en-GB': { translation: en },
  'es': { translation: es },
  'es-ES': { translation: es },
  'es-MX': { translation: es },
};

const LANGUAGE_KEY = '@barberpro_language';

// Detectar idioma do dispositivo
const detectLanguage = () => {
  const locale = Localization.locale;
  
  // Verificar se temos tradução para o locale exato
  if (resources[locale as keyof typeof resources]) {
    return locale;
  }
  
  // Verificar apenas o idioma (sem região)
  const languageCode = locale.split('-')[0];
  if (resources[languageCode as keyof typeof resources]) {
    return languageCode;
  }
  
  // Padrão: Português
  return 'pt-BR';
};

// Inicializar i18n
const initI18n = async () => {
  let savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
  
  // Se não tem idioma salvo, detecta do dispositivo
  if (!savedLanguage) {
    savedLanguage = detectLanguage();
  }

  i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: savedLanguage,
      fallbackLng: 'pt-BR',
      interpolation: {
        escapeValue: false,
      },
      react: {
        useSuspense: false,
      },
    });

  return i18n;
};

// Função para mudar idioma
export const changeLanguage = async (language: string) => {
  await AsyncStorage.setItem(LANGUAGE_KEY, language);
  await i18n.changeLanguage(language);
};

// Função para obter idioma atual
export const getCurrentLanguage = () => i18n.language;

// Lista de idiomas disponíveis
export const availableLanguages = [
  { code: 'pt-BR', name: 'Português (Brasil)', flag: '🇧🇷' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
];

export default initI18n;
