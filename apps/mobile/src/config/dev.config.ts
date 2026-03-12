/**
 * ⚠️ ARQUIVO DE CONFIGURAÇÃO CRÍTICA
 * 
 * APENAS os UIDs listados abaixo podem acessar o modo desenvolvedor.
 * Este arquivo deve ser mantido seguro e nunca compartilhado publicamente.
 * 
 * Para adicionar um novo dev:
 * 1. Peça o UID do usuário (visible no Firebase Console > Authentication)
 * 2. Adicione à array AUTHORIZED_DEV_UIDS
 * 3. Faça deploy
 */

// Lista de UIDs autorizados para modo desenvolvedor
// Substitua pelo seu UID real após criar a conta
export const AUTHORIZED_DEV_UIDS: string[] = [
  // EXEMPLO (substitua pelo seu UID real):
  // 'abc123xyz789',  // Igor - Dev Principal
  
  // Adicione seu UID aqui após criar a conta
];

// Email do desenvolvedor principal (para referência)
export const DEV_EMAILS: string[] = [
  'igor@barberpro.app',
];

/**
 * Verifica se um UID tem permissão de desenvolvedor
 */
export function isAuthorizedDev(uid: string | null): boolean {
  if (!uid) return false;
  return AUTHORIZED_DEV_UIDS.includes(uid);
}

/**
 * Verifica se um email pode ser usado para criar conta dev
 * (email deve estar na lista DEV_EMAILS)
 */
export function canCreateDevAccount(email: string | null): boolean {
  if (!email) return false;
  return DEV_EMAILS.includes(email.toLowerCase());
}
