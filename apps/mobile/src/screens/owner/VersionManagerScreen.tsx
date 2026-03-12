/**
 * Tela de Gerenciamento de Versões (Admin)
 * Permite publicar novas versões do app
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { updateService, AppVersion } from '../../services/updates';
import { Header } from '../../components';
import { colors, spacing, fontSize } from '../../theme';

export function VersionManagerScreen() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [versions, setVersions] = useState<AppVersion[]>([]);

  // Form state
  const [version, setVersion] = useState('');
  const [buildNumber, setBuildNumber] = useState('');
  const [releaseNotes, setReleaseNotes] = useState('');
  const [updateUrl, setUpdateUrl] = useState('');
  const [minVersion, setMinVersion] = useState('');
  const [forceUpdate, setForceUpdate] = useState(false);
  const [platform, setPlatform] = useState<'android' | 'ios' | 'all'>('all');

  useEffect(() => {
    loadVersionHistory();
  }, []);

  const loadVersionHistory = async () => {
    setIsLoading(true);
    try {
      const history = await updateService.getVersionHistory(10);
      setVersions(history);
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
      Alert.alert('Erro', 'Não foi possível carregar o histórico de versões');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    // Validações
    if (!version || !buildNumber || !releaseNotes || !updateUrl) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios');
      return;
    }

    // Valida formato da versão (x.x.x)
    const versionRegex = /^\d+\.\d+\.\d+$/;
    if (!versionRegex.test(version)) {
      Alert.alert('Erro', 'Versão deve seguir o formato: x.x.x (ex: 1.2.3)');
      return;
    }

    setIsSaving(true);
    try {
      await updateService.registerNewVersion({
        version,
        buildNumber,
        releaseNotes,
        updateUrl,
        minVersion: minVersion || version,
        forceUpdate,
        platform,
      });

      Alert.alert('Sucesso', 'Versão publicada com sucesso!');
      
      // Limpa o formulário
      setVersion('');
      setBuildNumber('');
      setReleaseNotes('');
      setUpdateUrl('');
      setMinVersion('');
      setForceUpdate(false);
      setPlatform('all');

      // Recarrega o histórico
      loadVersionHistory();
    } catch (error) {
      console.error('Erro ao salvar versão:', error);
      Alert.alert('Erro', 'Não foi possível publicar a versão');
    } finally {
      setIsSaving(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        title={t('versionManager.title', 'Gerenciar Versões')} 
        showBackButton
      />

      <ScrollView style={styles.scrollView}>
        {/* Formulário de Nova Versão */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t('versionManager.newVersion', 'Publicar Nova Versão')}
          </Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Versão * (ex: 1.2.3)</Text>
            <TextInput
              style={styles.input}
              value={version}
              onChangeText={setVersion}
              placeholder="1.0.0"
              keyboardType="numbers-and-punctuation"
              placeholderTextColor={colors.textMuted}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Build Number *</Text>
            <TextInput
              style={styles.input}
              value={buildNumber}
              onChangeText={setBuildNumber}
              placeholder="1"
              keyboardType="number-pad"
              placeholderTextColor={colors.textMuted}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Plataforma</Text>
            <View style={styles.platformButtons}>
              {(['android', 'ios', 'all'] as const).map((p) => (
                <TouchableOpacity
                  key={p}
                  style={[
                    styles.platformButton,
                    platform === p && styles.platformButtonActive,
                  ]}
                  onPress={() => setPlatform(p)}
                >
                  <Text
                    style={[
                      styles.platformButtonText,
                      platform === p && styles.platformButtonTextActive,
                    ]}
                  >
                    {p === 'android' ? 'Android' : p === 'ios' ? 'iOS' : 'Todas'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>URL de Download *</Text>
            <TextInput
              style={styles.input}
              value={updateUrl}
              onChangeText={setUpdateUrl}
              placeholder="https://exemplo.com/app.apk"
              autoCapitalize="none"
              keyboardType="url"
              placeholderTextColor={colors.textMuted}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Versão Mínima Obrigatória</Text>
            <TextInput
              style={styles.input}
              value={minVersion}
              onChangeText={setMinVersion}
              placeholder={version || '1.0.0'}
              keyboardType="numbers-and-punctuation"
              placeholderTextColor={colors.textMuted}
            />
            <Text style={styles.hint}>
              Usuários com versão inferior serão forçados a atualizar
            </Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Notas de Lançamento *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={releaseNotes}
              onChangeText={setReleaseNotes}
              placeholder="- Nova funcionalidade X\n- Correção do bug Y"
              multiline
              numberOfLines={4}
              placeholderTextColor={colors.textMuted}
            />
          </View>

          <View style={styles.switchContainer}>
            <Text style={styles.label}>Forçar Atualização</Text>
            <Switch
              value={forceUpdate}
              onValueChange={setForceUpdate}
              trackColor={{ false: '#767577', true: colors.primary }}
              thumbColor={forceUpdate ? colors.primaryDark : '#f4f3f4'}
            />
          </View>

          <TouchableOpacity
            style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.saveButtonText}>
                {t('versionManager.publish', 'Publicar Versão')}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Histórico de Versões */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t('versionManager.history', 'Histórico de Versões')}
          </Text>

          {isLoading ? (
            <ActivityIndicator style={styles.loader} />
          ) : versions.length === 0 ? (
            <Text style={styles.emptyText}>
              Nenhuma versão publicada ainda
            </Text>
          ) : (
            versions.map((v, index) => (
              <View key={index} style={styles.versionCard}>
                <View style={styles.versionHeader}>
                  <Text style={styles.versionNumber}>v{v.version}</Text>
                  <View style={[
                    styles.platformTag,
                    { backgroundColor: v.platform === 'android' ? '#3DDC84' : v.platform === 'ios' ? '#000' : colors.primary }
                  ]}>
                    <Text style={styles.platformTagText}>
                      {v.platform === 'android' ? 'Android' : v.platform === 'ios' ? 'iOS' : 'Todas'}
                    </Text>
                  </View>
                  {v.forceUpdate && (
                    <View style={styles.forceTag}>
                      <Text style={styles.forceTagText}>Obrigatória</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.versionDate}>
                  {formatDate(v.createdAt)}
                </Text>
                <Text style={styles.versionNotes}>{v.releaseNotes}</Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSize.xl,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.md,
  },
  inputGroup: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  input: {
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: spacing.sm,
    fontSize: fontSize.lg,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  hint: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  platformButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  platformButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 8,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  platformButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  platformButtonText: {
    color: colors.text,
    fontWeight: '600',
  },
  platformButtonTextActive: {
    color: '#fff',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  saveButton: {
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: fontSize.lg,
    fontWeight: 'bold',
  },
  loader: {
    marginVertical: spacing.lg,
  },
  emptyText: {
    textAlign: 'center',
    color: colors.textMuted,
    fontStyle: 'italic',
    padding: spacing.lg,
  },
  versionCard: {
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  versionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
    flexWrap: 'wrap',
  },
  versionNumber: {
    fontSize: fontSize.lg,
    fontWeight: 'bold',
    color: colors.text,
  },
  platformTag: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 4,
  },
  platformTagText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  forceTag: {
    backgroundColor: colors.danger,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 4,
  },
  forceTagText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  versionDate: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    marginBottom: spacing.sm,
  },
  versionNotes: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },
});

export default VersionManagerScreen;
