import { Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import * as Localization from "expo-localization";

export default function Index() {
  const { t } = useTranslation();
  const localeInfo = Localization.getLocales()[0];

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>{t("welcome")}</Text>
      <Text>Device language: {localeInfo.languageCode}</Text>
      <Text>Region: {localeInfo.regionCode}</Text>
      <Text>Currency: {localeInfo.currencySymbol}</Text>
    </View>
  );
}
