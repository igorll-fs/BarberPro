/**
 * Serviço de Atualização OTA (Over-the-Air)
 * Permite o app verificar e baixar atualizações automaticamente
 */

import { Platform } from 'react-native';
import * as Application from 'expo-application';
import * as Updates from 'expo-updates';
import { Alert, Linking } from 'react-native';
import { getFirestore, doc, getDoc, collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { app } from './firebase';

const db = getFirestore(app);

export interface AppVersion {
  version: string;
  buildNumber: string;
  forceUpdate: boolean;
  updateUrl: string;
  releaseNotes: string;
  minVersion: string;
  createdAt: Date;
  platform: 'android' | 'ios' | 'all';
}

export interface UpdateCheckResult {
  hasUpdate: boolean;
  forceUpdate: boolean;
  latestVersion: AppVersion | null;
  currentVersion: string;
  updateUrl: string | null;
}

class UpdateService {
  private currentVersion: string = '';
  private currentBuildNumber: string = '';

  constructor() {
    this.initialize();
  }

  private async initialize() {
    this.currentVersion = Application.nativeApplicationVersion || '1.0.0';
    this.currentBuildNumber = Application.nativeBuildVersion || '1';
  }

  /**
   * Verifica se há atualizações disponíveis
   */
  async checkForUpdates(): Promise<UpdateCheckResult> {
    try {
      await this.initialize();

      // Busca a versão mais recente no Firestore
      const versionsRef = collection(db, 'app_versions');
      const q = query(
        versionsRef,
        orderBy('createdAt', 'desc'),
        limit(1)
      );

      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        return {
          hasUpdate: false,
          forceUpdate: false,
          latestVersion: null,
          currentVersion: this.currentVersion,
          updateUrl: null,
        };
      }

      const latestVersion = snapshot.docs[0].data() as AppVersion;

      // Verifica se a atualização é para esta plataforma
      if (latestVersion.platform !== 'all' && latestVersion.platform !== Platform.OS) {
        return {
          hasUpdate: false,
          forceUpdate: false,
          latestVersion,
          currentVersion: this.currentVersion,
          updateUrl: null,
        };
      }

      // Compara versões
      const hasUpdate = this.compareVersions(latestVersion.version, this.currentVersion) > 0;
      
      // Verifica se é atualização forçada (versão atual < versão mínima)
      const forceUpdate = this.compareVersions(this.currentVersion, latestVersion.minVersion) < 0;

      return {
        hasUpdate,
        forceUpdate,
        latestVersion,
        currentVersion: this.currentVersion,
        updateUrl: hasUpdate ? latestVersion.updateUrl : null,
      };
    } catch (error) {
      console.error('Erro ao verificar atualizações:', error);
      return {
        hasUpdate: false,
        forceUpdate: false,
        latestVersion: null,
        currentVersion: this.currentVersion,
        updateUrl: null,
      };
    }
  }

  /**
   * Compara duas versões (semânticas)
   * Retorna: 1 se v1 > v2, -1 se v1 < v2, 0 se iguais
   */
  private compareVersions(v1: string, v2: string): number {
    const parts1 = v1.split('.').map(Number);
    const parts2 = v2.split('.').map(Number);

    for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
      const part1 = parts1[i] || 0;
      const part2 = parts2[i] || 0;

      if (part1 > part2) return 1;
      if (part1 < part2) return -1;
    }

    return 0;
  }

  /**
   * Mostra diálogo de atualização
   */
  showUpdateDialog(result: UpdateCheckResult): Promise<boolean> {
    return new Promise((resolve) => {
      if (!result.hasUpdate || !result.latestVersion) {
        resolve(false);
        return;
      }

      const { forceUpdate, latestVersion, updateUrl } = result;

      const title = forceUpdate 
        ? 'Atualização Necessária' 
        : 'Nova Versão Disponível';

      const message = forceUpdate
        ? `Você precisa atualizar para a versão ${latestVersion.version} para continuar usando o app.\n\n${latestVersion.releaseNotes}`
        : `Uma nova versão (${latestVersion.version}) está disponível!\n\n${latestVersion.releaseNotes}\n\nDeseja atualizar agora?`;

      const buttons: any[] = [
        {
          text: forceUpdate ? 'Sair' : 'Depois',
          onPress: () => resolve(false),
          style: forceUpdate ? 'destructive' : 'cancel',
        },
      ];

      if (updateUrl) {
        buttons.push({
          text: 'Atualizar',
          onPress: () => {
            Linking.openURL(updateUrl);
            resolve(true);
          },
          style: 'default',
        });
      }

      Alert.alert(title, message, buttons, { cancelable: !forceUpdate });
    });
  }

  /**
   * Verifica e aplica atualizações OTA do Expo (JavaScript bundle)
   */
  async checkForOTAUpdates(): Promise<{ hasUpdate: boolean; isNew: boolean }> {
    try {
      // Verifica se há atualização OTA disponível
      const update = await Updates.checkForUpdateAsync();

      if (update.isAvailable) {
        // Baixa a atualização
        await Updates.fetchUpdateAsync();
        
        // Retorna true indicando que precisa reiniciar
        return { hasUpdate: true, isNew: true };
      }

      return { hasUpdate: false, isNew: false };
    } catch (error) {
      console.error('Erro ao verificar OTA updates:', error);
      return { hasUpdate: false, isNew: false };
    }
  }

  /**
   * Aplica atualização OTA e reinicia o app
   */
  async applyOTAUpdate(): Promise<void> {
    try {
      await Updates.reloadAsync();
    } catch (error) {
      console.error('Erro ao aplicar OTA update:', error);
      throw error;
    }
  }

  /**
   * Mostra diálogo para reiniciar após OTA update
   */
  showOTARestartDialog() {
    Alert.alert(
      'Atualização Baixada',
      'Uma atualização foi baixada. O app precisa reiniciar para aplicar as mudanças.',
      [
        {
          text: 'Reiniciar Agora',
          onPress: () => this.applyOTAUpdate(),
        },
      ],
      { cancelable: false }
    );
  }

  /**
   * Fluxo completo de verificação de atualizações
   */
  async performFullUpdateCheck(): Promise<void> {
    try {
      // 1. Verifica atualização nativa (APK/IPA)
      const nativeUpdate = await this.checkForUpdates();

      if (nativeUpdate.hasUpdate) {
        const shouldUpdate = await this.showUpdateDialog(nativeUpdate);
        
        if (nativeUpdate.forceUpdate && !shouldUpdate) {
          // Se for atualização forçada e usuário recusou, fecha o app
          // (opcional - pode implementar lógica diferente)
          return;
        }

        if (shouldUpdate) {
          // Usuário escolheu atualizar - o diálogo já abriu a URL
          return;
        }
      }

      // 2. Verifica atualização OTA (JavaScript)
      const otaUpdate = await this.checkForOTAUpdates();

      if (otaUpdate.hasUpdate && otaUpdate.isNew) {
        this.showOTARestartDialog();
      }
    } catch (error) {
      console.error('Erro no fluxo de atualização:', error);
    }
  }

  /**
   * Registra nova versão no Firestore (usado pelo admin)
   */
  async registerNewVersion(version: Omit<AppVersion, 'createdAt'>): Promise<void> {
    try {
      const versionsRef = collection(db, 'app_versions');
      await addDoc(versionsRef, {
        ...version,
        createdAt: new Date(),
      });
    } catch (error) {
      console.error('Erro ao registrar versão:', error);
      throw error;
    }
  }

  /**
   * Obtém histórico de versões
   */
  async getVersionHistory(limitCount: number = 10): Promise<AppVersion[]> {
    try {
      const versionsRef = collection(db, 'app_versions');
      const q = query(
        versionsRef,
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => doc.data() as AppVersion);
    } catch (error) {
      console.error('Erro ao obter histórico:', error);
      return [];
    }
  }
}

// Singleton instance
export const updateService = new UpdateService();

// Import necessário para registerNewVersion
import { addDoc } from 'firebase/firestore';

export default updateService;
