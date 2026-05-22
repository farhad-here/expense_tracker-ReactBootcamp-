import { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';

export const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [wallets, setWallets] = useState([]);
  const [activeWallet, setActiveWallet] = useState(null);

  // Load wallets from localStorage
  useEffect(() => {
    if (user) {
      const saved = localStorage.getItem(`wallets_${user.username}`);
      if (saved) {
        const loadedWallets = JSON.parse(saved);
        setWallets(loadedWallets);
        
        // Set first wallet as active if none selected
        if (!activeWallet && loadedWallets.length > 0) {
          setActiveWallet(loadedWallets[0].id);
        }
      } else {
        // Create default wallet
        const defaultWallet = {
          id: Date.now(),
          name: 'کیف پول اصلی',
          type: 'cash',
          balance: 0,
          currency: 'IRR',
          icon: '💵',
          createdAt: new Date().toISOString()
        };
        setWallets([defaultWallet]);
        setActiveWallet(defaultWallet.id);
      }
    }
  }, [user]);

  // Save wallets to localStorage
  useEffect(() => {
    if (user && wallets.length > 0) {
      localStorage.setItem(`wallets_${user.username}`, JSON.stringify(wallets));
    }
  }, [wallets, user]);

  // Add new wallet
  const addWallet = (wallet) => {
    const newWallet = {
      id: Date.now(),
      ...wallet,
      balance: parseFloat(wallet.balance) || 0,
      createdAt: new Date().toISOString()
    };
    setWallets(prev => [...prev, newWallet]);
    return newWallet;
  };

  // Update wallet
  const updateWallet = (id, updates) => {
    setWallets(prev =>
      prev.map(w => w.id === id ? { ...w, ...updates } : w)
    );
  };

  // Delete wallet
  const deleteWallet = (id) => {
    if (wallets.length === 1) {
      alert('حداقل یک کیف پول باید وجود داشته باشد');
      return false;
    }
    
    setWallets(prev => prev.filter(w => w.id !== id));
    
    if (activeWallet === id) {
      setActiveWallet(wallets.find(w => w.id !== id)?.id);
    }
    
    return true;
  };

  // Transfer between wallets
  const transferBetweenWallets = (fromId, toId, amount, description = '') => {
    const fromWallet = wallets.find(w => w.id === fromId);
    const toWallet = wallets.find(w => w.id === toId);

    if (!fromWallet || !toWallet) {
      throw new Error('کیف پول یافت نشد');
    }

    if (fromWallet.balance < amount) {
      throw new Error('موجودی کافی نیست');
    }

    setWallets(prev => prev.map(w => {
      if (w.id === fromId) {
        return { ...w, balance: w.balance - amount };
      }
      if (w.id === toId) {
        return { ...w, balance: w.balance + amount };
      }
      return w;
    }));

    return {
      id: Date.now(),
      type: 'transfer',
      fromWallet: fromWallet.name,
      toWallet: toWallet.name,
      amount,
      description,
      date: new Date().toISOString()
    };
  };

// Update wallet balance
const updateBalance = (walletId, amount, type = 'add') => {
  setWallets(prev => prev.map(w => {
    if (String(w.id) === String(walletId)) {
      const newBalance = type === 'add' 
        ? w.balance + amount 
        : w.balance - amount;
      return { ...w, balance: newBalance };
    }
    return w;
  }));
};



  // Get wallet by ID
  const getWallet = (id) => {
    return wallets.find(w => w.id === id);
  };

  // Get total balance across all wallets
  const getTotalBalance = () => {
    return wallets.reduce((sum, w) => sum + w.balance, 0);
  };

  const value = {
    wallets,
    activeWallet,
    setActiveWallet,
    addWallet,
    updateWallet,
    deleteWallet,
    transferBetweenWallets,
    updateBalance,
    getWallet,
    getTotalBalance
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallets = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallets must be used within WalletProvider');
  }
  return context;
};
