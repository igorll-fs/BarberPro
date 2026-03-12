/**
 * Hook para gerenciar atualizações do app
 * Verifica automaticamente por atualizações ao iniciar
 */

import { useEffect, useState, useCallback } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { updateService, UpdateCheckResult } from '../services/updates';

interface UseUpdatesReturn {
  isChecking: boolean;
  updateResult: UpdateCheckResult | null;
  checkForUpdates: () => Promise<void>;
  performUpdate: () => Promise<boolean>;
  lastChecked: Date | null;
}

export function useUpdates(checkOnMount: boolean = true): UseUpdatesReturn {
  const [isChecking, setIsChecking] = useState(false);
  const [updateResult, setUpdateResult] = useState<UpdateCheckResult | null>(null);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  /**
   * Verifica por atualizações
   */
  const checkForUpdates = useCallback(async () => {
    setIsChecking(true);
    try {
      const result = await updateService.checkForUpdates();
      setUpdateResult(result);
      setLastChecked(new Date());

      // Se houver atualização, mostra o diálogo automaticamente
      if (result.hasUpdate) {
        await updateService.showUpdateDialog(result);
      }
    } catch (error) {
      console.error('Erro ao verificar atualizações:', error);
    } finally {
      setIsChecking(false);
    }
  }, []);

  /**
   * Executa o fluxo completo de atualização
   */
  const performUpdate = useCallback(async (): Promise<boolean> => {
    if (!updateResult?.hasUpdate) return false;
    
    return await updateService.showUpdateDialog(updateResult);
  }, [updateResult]);

  /**
   * Verifica atualizações ao montar o componente
   */
  useEffect(() => {
    if (checkOnMount) {
      // Aguarda 2 segundos para não travar a inicialização
      const timer = setTimeout(() => {
        checkForUpdates();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [checkOnMount, checkForUpdates]);

  /**
   * Verifica atualizações quando o app volta para primeiro plano
   */
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        // Verifica se já passou 1 hora desde a última verificação
        const shouldCheck = !lastChecked || 
          (new Date().getTime() - lastChecked.getTime()) > 60 * 60 * 1000;
        
        if (shouldCheck) {
          checkForUpdates();
        }
      }
    });

    return () => {
      subscription.remove();
    };
  }, [lastChecked, checkForUpdates]);

  return {
    isChecking,
    updateResult,
    checkForUpdates,
    performUpdate,
    lastChecked,
  };
}

export default useUpdates;
