/**
 * ⚠️ ARQUIVO DE CONFIGURAÇÃO CRÍTICA - VERSÃO WEB
 * 
 * APENAS os UIDs listados abaixo podem acessar o modo desenvolvedor.
 */

// Lista de UIDs autorizados para modo desenvolvedor
// DEVE ser idêntica à versão mobile
export const AUTHORIZED_DEV_UIDS: string[] = [
  // Adicione seu UID aqui
];

export const DEV_EMAILS: string[] = [
  'igor@barberpro.app',
];

export function isAuthorizedDev(uid: string | null): boolean {
  if (!uid) return false;
  return AUTHORIZED_DEV_UIDS.includes(uid);
}

export function canCreateDevAccount(email: string | null): boolean {
  if (!email) return false;
  return DEV_EMAILS.includes(email.toLowerCase());
}
