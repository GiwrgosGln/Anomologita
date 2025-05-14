import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";
import { AppState, AppStateStatus } from "react-native";
import en from "./translations/en";
import gr from "./translations/gr";

const initI18n = () => {
  const locale = Localization.getLocales()[0];
  const languageCode = locale?.languageCode || "en";

  console.log("Device locale info:", locale);

  i18n.use(initReactI18next).init({
    resources: {
      en: { translation: en },
      gr: { translation: gr },
    },
    lng: languageCode,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });
};

initI18n();

AppState.addEventListener("change", (nextAppState: AppStateStatus) => {
  if (nextAppState === "active") {
    const locale = Localization.getLocales()[0];
    const languageCode = locale?.languageCode || "en";

    if (
      i18n.language !== languageCode &&
      Object.keys(i18n.options.resources || {}).includes(languageCode)
    ) {
      i18n.changeLanguage(languageCode);
    }
  }
});

export default i18n;
