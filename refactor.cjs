const fs = require('fs');
const path = require('path');

const mappings = [
  { oldPath: /@\/shared\/domain\/entities\/Transaction/g, newPath: '@/modules/transactions/core/entities/ITransaction' },
  { oldPath: /@\/shared\/domain\/entities\/Wallet/g, newPath: '@/modules/wallets/core/entities/IWallet' },
  { oldPath: /@\/shared\/domain\/entities\/(SyncMetadata|ISyncMetadata)/g, newPath: '@/shared/domain/ISyncMetadata' },
  { oldPath: /@\/shared\/domain\/entities\/Budget/g, newPath: '@/modules/budgets/core/entities/IBudget' },
  { oldPath: /@\/shared\/domain\/entities\/Category/g, newPath: '@/modules/categories/core/entities/ICategory' },
  { oldPath: /@\/shared\/domain\/entities\/Goal/g, newPath: '@/modules/goals/core/entities/IGoal' },
  { oldPath: /@\/shared\/domain\/entities\/Loan/g, newPath: '@/modules/loans/core/entities/ILoan' },
  { oldPath: /@\/shared\/domain\/entities\/Payee/g, newPath: '@/modules/transactions/core/entities/IPayee' },
  { oldPath: /@\/shared\/domain\/entities\/Subscription/g, newPath: '@/modules/subscriptions/core/entities/ISubscription' },
  { oldPath: /@\/shared\/domain\/contracts\/ITransactionRepository/g, newPath: '@/modules/transactions/core/ports/ITransactionRepository' },
  { oldPath: /@\/shared\/domain\/contracts\/IWalletRepository/g, newPath: '@/modules/wallets/core/ports/IWalletRepository' },
  { oldPath: /@\/modules\/auth\/domain\/contracts\/IAuthService/g, newPath: '@/modules/auth/core/ports/IAuthService' },
];

const renames = [
  { old: /\bTransaction\b/g, new: 'ITransaction' },
  { old: /\bWallet\b/g, new: 'IWallet' },
  { old: /\bSyncMetadata\b/g, new: 'ISyncMetadata' },
  { old: /\bBudget\b/g, new: 'IBudget' },
  { old: /\bCategory\b/g, new: 'ICategory' },
  { old: /\bGoal\b/g, new: 'IGoal' },
  { old: /\bLoan\b/g, new: 'ILoan' },
  { old: /\bPayee\b/g, new: 'IPayee' },
  { old: /\bSubscription\b/g, new: 'ISubscription' },
];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // 1. Update Import Paths
  mappings.forEach(m => {
    content = content.replace(m.oldPath, m.newPath);
  });

  // 2. Renames
  renames.forEach(r => {
    content = content.replace(r.old, r.new);
  });

  // 3. User -> IUser specifically in auth-related files
  if (filePath.includes('auth') || filePath.includes('Auth')) {
    content = content.replace(/\bUser\b/g, 'IUser');
  }

  // 4. Fix IITransaction or IISyncMetadata (double I)
  content = content.replace(/\bIITransaction\b/g, 'ITransaction');
  content = content.replace(/\bIIWallet\b/g, 'IWallet');
  content = content.replace(/\bIISyncMetadata\b/g, 'ISyncMetadata');
  content = content.replace(/\bIIBudget\b/g, 'IBudget');
  content = content.replace(/\bIICategory\b/g, 'ICategory');
  content = content.replace(/\bIIGoal\b/g, 'IGoal');
  content = content.replace(/\bIILoan\b/g, 'ILoan');
  content = content.replace(/\bIIPayee\b/g, 'IPayee');
  content = content.replace(/\bIISubscription\b/g, 'ISubscription');

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${filePath}`);
  }
}

function walk(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.vue')) {
      processFile(fullPath);
    }
  });
}

walk('src');
