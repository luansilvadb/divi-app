/**
 * Centralized Message Catalog (Principle X)
 * All user-facing strings must be defined here.
 */

export const messages = {
  // Success Messages (MSG_S_*)
  MSG_S_TRANSACTION_CREATED: 'Transação criada com sucesso!',
  MSG_S_TRANSACTION_UPDATED: 'Transação atualizada com sucesso!',
  MSG_S_TRANSACTION_DELETED: 'Transação excluída com sucesso!',
  MSG_S_WALLET_CREATED: 'Conta criada com sucesso!',
  MSG_S_WALLET_UPDATED: 'Conta atualizada com sucesso!',
  MSG_S_WALLET_DELETED: 'Conta excluída com sucesso!',
  MSG_S_CATEGORY_CREATED: 'Categoria criada com sucesso!',
  MSG_S_CATEGORY_UPDATED: 'Categoria atualizada com sucesso!',
  MSG_S_CATEGORY_DELETED: 'Categoria excluída com sucesso!',

  // Error Messages (MSG_E_*)
  MSG_E_GENERIC: 'Ocorreu um erro inesperado. Tente novamente.',
  MSG_E_UNAUTHORIZED: 'Sessão expirada. Por favor, faça login novamente.',
  MSG_E_FIELD_REQUIRED: 'O campo {field} é obrigatório.',
  MSG_E_INVALID_AMOUNT: 'O valor deve ser maior que zero.',
  MSG_E_WALLET_NOT_FOUND: 'Conta não encontrada.',
  MSG_E_TRANSACTION_NOT_FOUND: 'Transação não encontrada.',
  MSG_E_LOAD_FAILED: 'Erro ao carregar dados.',

  // Informational Messages (MSG_I_*)
  MSG_I_SYNCING: 'Sincronizando dados...',
  MSG_I_SYNC_COMPLETE: 'Sincronização concluída.',
  MSG_I_NO_DATA: 'Nenhum registro encontrado.',

  // Alert/Confirm Messages (MSG_A_*)
  MSG_A_DELETE_CONFIRM: 'Tem certeza que deseja excluir este item? Esta ação não pode ser desfeita.',
  MSG_A_UNSAVED_CHANGES: 'Você tem alterações não salvas. Deseja sair?',
} as const;

export type MessageCode = keyof typeof messages;

/**
 * Formats a message with parameters
 * Example: formatMessage('MSG_E_FIELD_REQUIRED', { field: 'Email' })
 */
export function formatMessage(code: MessageCode, params: Record<string, string | number> = {}): string {
  let message: string = messages[code];
  
  Object.entries(params).forEach(([key, value]) => {
    message = message.replace(`{${key}}`, String(value));
  });
  
  return message;
}
