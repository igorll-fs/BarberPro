/* ============================
   BARBERPRO — Configuração de Idioma
   Tela para selecionar idioma do app
   ============================ */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Header, AppCard } from '../../components';
import { colors, spacing, fontSize } from '../../theme';
import { changeLanguage, getCurrentLanguage, availableLanguages } from '../../i18n';

export default function LanguageSettingsScreen() {
  const { t, i18n } = useTranslation();
  const [currentLang, setCurrentLang] = useState(i18n.language);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadCurrentLanguage = async () => {
      const lang = await getCurrentLanguage();
      setCurrentLang(lang);
    };
    loadCurrentLanguage();
  }, []);

  const handleLanguageChange = async (languageCode: string) => {
    if (languageCode === currentLang) return;

    setLoading(true);
    try {
      await changeLanguage(languageCode);
      setCurrentLang(languageCode);
      Alert.alert(
        t('common.success'),
        'Idioma alterado com sucesso!',
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert(t('common.error'), 'Não foi possível alterar o idioma');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title={t('profile.language')}
        showBack
        onBack={() => {}}
      />

      <ScrollView style={styles.content}>
        <Text style={styles.description}>
          Selecione o idioma que você prefere usar no aplicativo.
        </Text>

        {availableLanguages.map((language) => (
          <TouchableOpacity
            key={language.code}
            onPress={() => handleLanguageChange(language.code)}
            disabled={loading}
          >
            <AppCard style={[
              styles.languageCard,
              currentLang === language.code && styles.selectedCard
            ]}>
              <View style={styles.languageInfo}>
                <Text style={styles.flag}>{language.flag}</Text>
                <View style={styles.textContainer}>
                  <Text style={styles.languageName}>{language.name}</Text>
                  <Text style={styles.languageCode}>{language.code}</Text>
                </View>
              </View>
              
              {currentLang === language.code && (
                <View style={styles.checkmark}>
                  <Text style={styles.checkmarkText}>✓</Text>
                </View>
              )}
            </AppCard>
          </TouchableOpacity>
        ))}

        <Text style={styles.note}>
          💡 O idioma será salvo e aplicado automaticamente em todas as telas do app.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  description: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
    lineHeight: 22,
  },
  languageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
    padding: spacing.lg,
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: colors.primary,
  },
  languageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  flag: {
    fontSize: 32,
    marginRight: spacing.md,
  },
  textContainer: {
    flex: 1,
  },
  languageName: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  languageCode: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
  },
  checkmark: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: colors.white,
    fontSize: fontSize.md,
    fontWeight: 'bold',
  },
  note: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    marginTop: spacing.xl,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
