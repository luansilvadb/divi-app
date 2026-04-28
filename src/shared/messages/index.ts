/**
 * Centralized Message Catalog for user-facing strings.
 * Strictly adheres to Constitution Rule X.
 * All keys must follow prefixes: MSG_E (Error), MSG_S (Success), MSG_A (Alert), MSG_I (Info).
 */
export const MessageCatalog = {
  // Common Errors
  MSG_E_UNEXPECTED: 'An unexpected error occurred. Please try again.',
  MSG_E_VALIDATION_FAILED: 'Validation failed: {details}',
  MSG_E_NOT_FOUND: 'The requested resource was not found.',
  MSG_E_UNAUTHORIZED: 'You are not authorized to perform this action.',
  
  // Common Success
  MSG_S_CREATED: 'Resource created successfully.',
  MSG_S_UPDATED: 'Resource updated successfully.',
  MSG_S_DELETED: 'Resource deleted successfully.',
  
  // Common Alerts
  MSG_A_UNSAVED_CHANGES: 'You have unsaved changes. Are you sure you want to leave?',
} as const;

export type MessageKey = keyof typeof MessageCatalog;

/**
 * Formats a message from the catalog by replacing placeholders.
 * @param key The semantic key of the message
 * @param params Object containing values for placeholders
 */
export function formatMessage(key: MessageKey, params?: Record<string, string>): string {
  let message: string = MessageCatalog[key];
  if (!params) return message;

  Object.entries(params).forEach(([k, v]) => {
    message = message.replace(new RegExp(`{${k}}`, 'g'), v);
  });

  return message;
}
