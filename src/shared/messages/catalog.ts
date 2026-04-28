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

  // Activity Messages (MSG_ACT_*)
  MSG_ACT_TX_CREATED: 'Nova Transação',
  MSG_ACT_TX_UPDATED: 'Transação Atualizada',
  MSG_ACT_TX_DELETED: 'Transação Removida',
  MSG_ACT_TX_DESC: 'R$ {amount} : {title}',
  MSG_ACT_TX_DEL_DESC: 'Remoção da transação: {title}',

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
  MSG_I_TX_NEW: 'Nova Transação',
  MSG_I_TX_EDIT: 'Editar Transação',
  MSG_I_TX_NEW_DESC: 'Cadastre sua nova movimentação',
  MSG_I_TX_EDIT_DESC: 'Ajuste os detalhes deste registro',
  MSG_I_WALLET_NEW: 'Nova Conta',
  MSG_I_WALLET_EDIT: 'Editar Conta',
  MSG_I_WALLET_NEW_DESC: 'Adicione uma nova carteira ou conta bancária',
  MSG_I_WALLET_EDIT_DESC: 'Ajuste os detalhes da sua conta',
  MSG_I_CATEGORY_NEW: 'Nova Categoria',
  MSG_I_CATEGORY_EDIT: 'Editar Categoria',
  MSG_I_CATEGORY_NEW_DESC: 'Crie uma nova categoria para organizar seus gastos',
  MSG_I_CATEGORY_EDIT_DESC: 'Ajuste os detalhes da sua categoria',
  MSG_I_VIEW_TX_TITLE: 'Transações',
  MSG_I_VIEW_TX_HIGHLIGHT: 'Histórico',
  MSG_I_VIEW_TX_SUBTITLE: 'Acompanhe e gerencie todas as suas movimentações financeiras em um só lugar.',
  MSG_I_SEARCH_TX: 'Buscar transações...',
  MSG_I_MONTH_SUMMARY: 'Resumo do Mês',
  MSG_I_INCOME: 'Entradas',
  MSG_I_EXPENSE: 'Saídas',
  MSG_I_NET_BALANCE: 'Resultado Líquido',
  MSG_I_TOP_EXPENSES: 'Maiores Gastos',
  MSG_I_NO_DATA_PERIOD: 'Sem dados no período',
  MSG_I_EMPTY_TX: 'Nenhuma movimentação encontrada para este período ou pesquisa.',
  MSG_I_FULL_REPORTS: 'Relatórios completos',
  MSG_I_ADD: 'Adicionar',
  MSG_I_NET_WORTH: 'Patrimônio Total',
  MSG_I_NET_WORTH_DESC: 'Consolidado de todas as contas',
  MSG_I_VS_LAST_MONTH: 'vs. mês passado',
  MSG_I_BUDGET_USAGE: 'Uso do orçamento',
  MSG_I_MY_ACCOUNTS: 'Minhas Contas',
  MSG_I_REAL_TIME_ASSETS: 'Ativos em tempo real',
  MSG_I_PATRIMONIAL_EVOLUTION: 'Evolução Patrimonial',
  MSG_I_CONSOLIDATED_HISTORY: 'Histórico de saldo consolidado',
  MSG_I_RECENT_ACTIVITIES: 'Atividades Recentes',
  MSG_I_VIEW_ALL_HISTORY: 'Ver todo o histórico',
  MSG_I_ALL: 'Todos',
  MSG_I_MONTHS_6: '6 Meses',
  MSG_I_YEAR_1: '1 Ano',
  MSG_I_NO_ACTIVITY: 'Nenhuma atividade encontrada',

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
