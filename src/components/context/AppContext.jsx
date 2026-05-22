import { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';
import { WalletContext } from './WalletContext';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const { wallets, updateBalance, getTotalBalance } = useContext(WalletContext);

  const defaultCategories = {
    income: [
      { id: 'salary', name: 'حقوق', icon: '💰', color: '#10b981' },
      { id: 'freelance', name: 'فریلنس', icon: '💼', color: '#3b82f6' },
      { id: 'investment', name: 'سرمایه‌گذاری', icon: '📈', color: '#8b5cf6' },
      { id: 'gift', name: 'هدیه', icon: '🎁', color: '#ec4899' },
      { id: 'other-income', name: 'سایر درآمدها', icon: '💵', color: '#6366f1' }
    ],
    expense: [
      { id: 'food', name: 'خوراک', icon: '🍔', color: '#ef4444' },
      { id: 'transport', name: 'حمل‌ونقل', icon: '🚗', color: '#f59e0b' },
      { id: 'shopping', name: 'خرید', icon: '🛍️', color: '#ec4899' },
      { id: 'bills', name: 'قبوض', icon: '📄', color: '#8b5cf6' },
      { id: 'entertainment', name: 'سرگرمی', icon: '🎮', color: '#06b6d4' },
      { id: 'health', name: 'بهداشت', icon: '🏥', color: '#10b981' },
      { id: 'education', name: 'آموزش', icon: '📚', color: '#3b82f6' },
      { id: 'other-expense', name: 'سایر هزینه‌ها', icon: '💸', color: '#6b7280' }
    ]
  };

  const getStorageKey = (key) => `financeApp_${user?.uid}_${key}`;

  const [transactions, setTransactions] = useState(() => {
    if (!user) return [];
    const saved = localStorage.getItem(getStorageKey('transactions'));
    return saved ? JSON.parse(saved) : [];
  });

  const [categories, setCategories] = useState(() => {
    if (!user) return defaultCategories;
    const saved = localStorage.getItem(getStorageKey('categories'));
    return saved ? JSON.parse(saved) : defaultCategories;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(getStorageKey('transactions'), JSON.stringify(transactions));
    }
  }, [transactions, user]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(getStorageKey('categories'), JSON.stringify(categories));
    }
  }, [categories, user]);

  // ==================== TRANSACTION FUNCTIONS ====================

  const addTransaction = (transaction) => {
    const newTransaction = {
      ...transaction,
      id: `txn-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      walletId: transaction.walletId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setTransactions(prev => [newTransaction, ...prev]);
    
    const amount = parseFloat(newTransaction.amount || 0);
    if (newTransaction.type === 'income') {
      updateBalance(newTransaction.walletId, amount, 'add');
    } else {
      updateBalance(newTransaction.walletId, amount, 'subtract');
    }
    
    return newTransaction;
  };

  const deleteTransaction = (id) => {
    const transaction = transactions.find(t => t.id === id);
    if (!transaction) return;
    
    setTransactions(prev => prev.filter(t => t.id !== id));
    
    const amount = parseFloat(transaction.amount || 0);
    if (transaction.type === 'income') {
      updateBalance(transaction.walletId, amount, 'subtract');
    } else {
      updateBalance(transaction.walletId, amount, 'add');
    }
  };

  const updateTransaction = (id, updatedData) => {
    const oldTransaction = transactions.find(t => t.id === id);
    if (!oldTransaction) return;
    
    const newTransaction = { 
      ...oldTransaction, 
      ...updatedData, 
      updatedAt: new Date().toISOString() 
    };
    
    setTransactions(prev => 
      prev.map(t => t.id === id ? newTransaction : t)
    );
    
    const oldAmount = parseFloat(oldTransaction.amount || 0);
    const newAmount = parseFloat(newTransaction.amount || 0);
    
    if (oldTransaction.walletId !== newTransaction.walletId) {
      if (oldTransaction.type === 'income') {
        updateBalance(oldTransaction.walletId, oldAmount, 'subtract');
      } else {
        updateBalance(oldTransaction.walletId, oldAmount, 'add');
      }
      
      if (newTransaction.type === 'income') {
        updateBalance(newTransaction.walletId, newAmount, 'add');
      } else {
        updateBalance(newTransaction.walletId, newAmount, 'subtract');
      }
    } else {
      if (oldTransaction.type === 'income') {
        updateBalance(oldTransaction.walletId, oldAmount, 'subtract');
      } else {
        updateBalance(oldTransaction.walletId, oldAmount, 'add');
      }
      
      if (newTransaction.type === 'income') {
        updateBalance(newTransaction.walletId, newAmount, 'add');
      } else {
        updateBalance(newTransaction.walletId, newAmount, 'subtract');
      }
    }
  };

  const getTransactionsByWallet = (walletId) => {
    return transactions.filter(t => t.walletId === walletId);
  };

  const getTransactionsByCategory = (categoryId) => {
    return transactions.filter(t => t.categoryId === categoryId);
  };

  const getTransactionsByDateRange = (startDate, endDate) => {
    return transactions.filter(t => {
      const txDate = new Date(t.date);
      return txDate >= startDate && txDate <= endDate;
    });
  };

  // ==================== CATEGORY FUNCTIONS ====================
const addCategory = (categoryData) => {
  const { type, ...category } = categoryData;
  const newCategory = {
    ...category,
    id: `cat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  };
  
  setCategories(prev => ({
    ...prev,
    [type]: [...(prev[type] || []), newCategory]
  }));
  
  return newCategory;
};

const updateCategory = (categoryId, updatedData) => {
  const { type } = updatedData;
  setCategories(prev => ({
    ...prev,
    [type]: (prev[type] || []).map(cat => 
      cat.id === categoryId ? { ...cat, ...updatedData } : cat
    )
  }));
};

const deleteCategory = (categoryId) => {
  const hasTransactions = transactions.some(t => t.categoryId === categoryId);
  
  if (hasTransactions) {
    throw new Error('این دسته‌بندی دارای تراکنش است و نمی‌توان آن را حذف کرد');
  }
  
  // Find which type this category belongs to
  let categoryType = null;
  if ((categories.expense || []).some(cat => cat.id === categoryId)) {
    categoryType = 'expense';
  } else if ((categories.income || []).some(cat => cat.id === categoryId)) {
    categoryType = 'income';
  }
  
  if (categoryType) {
    setCategories(prev => ({
      ...prev,
      [categoryType]: (prev[categoryType] || []).filter(cat => cat.id !== categoryId)
    }));
  }
};
  // ==================== STATISTICS ====================

  const getStatistics = (startDate, endDate) => {
    const filteredTransactions = getTransactionsByDateRange(startDate, endDate);
    
    const totalIncome = filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
    
    const totalExpense = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
    
    const categoryBreakdown = {};
    filteredTransactions.forEach(t => {
      if (!categoryBreakdown[t.categoryId]) {
        categoryBreakdown[t.categoryId] = 0;
      }
      categoryBreakdown[t.categoryId] += parseFloat(t.amount || 0);
    });
    
    return {
      totalIncome,
      totalExpense,
      netIncome: totalIncome - totalExpense,
      categoryBreakdown,
      transactionCount: filteredTransactions.length
    };
  };
// ==================== IMPORT/EXPORT ====================

const importData = (data) => {
  try {
    if (!data || typeof data !== 'object') {
      throw new Error('داده‌های ورودی نامعتبر است');
    }

    // Import transactions
    if (Array.isArray(data.transactions)) {
      const validTransactions = data.transactions.filter(t => 
        t.amount && t.type && t.date && t.walletId
      );
      
      const walletChanges = {};
      validTransactions.forEach(t => {
        const walletId = t.walletId;
        const amount = parseFloat(t.amount || 0);
        
        if (!walletChanges[walletId]) {
          walletChanges[walletId] = 0;
        }
        
        if (t.type === 'income') {
          walletChanges[walletId] += amount;
        } else {
          walletChanges[walletId] -= amount;
        }
      });
      
      Object.entries(walletChanges).forEach(([walletId, change]) => {
        if (change > 0) {
          updateBalance(walletId, Math.abs(change), 'add');
        } else if (change < 0) {
          updateBalance(walletId, Math.abs(change), 'subtract');
        }
      });
      
      const allTransactions = [...transactions, ...validTransactions];
      localStorage.setItem(getStorageKey('transactions'), JSON.stringify(allTransactions));
      setTransactions(allTransactions);
      
      console.log('✅ Imported transactions:', validTransactions.length);
      console.log('✅ Wallet changes:', walletChanges);
    }

    // Import categories (optional)
    if (data.categories && typeof data.categories === 'object') {
      localStorage.setItem(getStorageKey('categories'), JSON.stringify(data.categories));
      setCategories(data.categories);
    }

    return { success: true, message: 'داده‌ها با موفقیت وارد شد' };
  } catch (error) {
    console.error('Import error:', error);
    return { success: false, message: error.message };
  }
};


const exportData = () => {
  return {
    transactions,
    categories,
    wallets,
    exportDate: new Date().toISOString(),
    version: '1.0'
  };
};


  const value = {
    transactions,
    categories,
    wallets,
    getTotalBalance,
    
    addTransaction,
    deleteTransaction,
    updateTransaction,
    getTransactionsByWallet,
    getTransactionsByCategory,
    getTransactionsByDateRange,
    
    addCategory,
    updateCategory,
    deleteCategory,
    
    getStatistics,
    importData,
    exportData,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
