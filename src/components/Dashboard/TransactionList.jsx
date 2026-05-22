import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import TransactionFilter from './TransactionFilter';
import './TransactionList.css';

function TransactionList() {
  const { transactions, categories, deleteTransaction } = useContext(AppContext);
  const [filteredTransactions, setFilteredTransactions] = useState(transactions);

  // Apply filters
  const handleFilterChange = (filters) => {
    let result = [...transactions];

    // Search query
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      result = result.filter(t => 
        t.title.toLowerCase().includes(query) ||
        t.description?.toLowerCase().includes(query)
      );
    }

    // Type filter
    if (filters.type !== 'all') {
      result = result.filter(t => t.type === filters.type);
    }

    // Category filter
    if (filters.categoryId !== 'all') {
      result = result.filter(t => t.categoryId === filters.categoryId);
    }

    // Date range
    if (filters.startDate) {
      result = result.filter(t => new Date(t.date) >= new Date(filters.startDate));
    }
    if (filters.endDate) {
      result = result.filter(t => new Date(t.date) <= new Date(filters.endDate));
    }

    // Amount range
    if (filters.minAmount) {
      result = result.filter(t => parseFloat(t.amount) >= parseFloat(filters.minAmount));
    }
    if (filters.maxAmount) {
      result = result.filter(t => parseFloat(t.amount) <= parseFloat(filters.maxAmount));
    }

    setFilteredTransactions(result);
  };

  // Update filtered list when transactions change
  React.useEffect(() => {
    setFilteredTransactions(transactions);
  }, [transactions]);

  const handleDelete = (id) => {
    if (window.confirm('آیا مطمئن هستید که می‌خواهید این تراکنش را حذف کنید؟')) {
      deleteTransaction(id);
    }
  };

  const getCategoryInfo = (categoryId) => {
    const allCategories = [
      ...(categories.income || []),
      ...(categories.expense || [])
    ];
    
    return allCategories.find(c => c.id === categoryId) || { 
      name: 'نامشخص', 
      icon: '📦', 
      color: '#95a5a6' 
    };
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('fa-IR').format(amount);
  };

  return (
    <div className="transaction-list-container">
      <TransactionFilter onFilterChange={handleFilterChange} />

      <div className="transaction-list">
        <div className="list-header">
          <h3>📋 لیست تراکنش‌ها</h3>
          <span className="transaction-count">
            {filteredTransactions.length} تراکنش
          </span>
        </div>

        {filteredTransactions.length === 0 ? (
          <div className="empty-state">
            <p>هیچ تراکنشی یافت نشد</p>
          </div>
        ) : (
          <div className="transactions">
            {filteredTransactions.map(transaction => {
              const category = getCategoryInfo(transaction.categoryId);
              return (
                <div 
                  key={transaction.id} 
                  className={`transaction-item ${transaction.type}`}
                >
                  <div className="transaction-icon" style={{ background: category.color }}>
                    {category.icon}
                  </div>
                  
                  <div className="transaction-details">
                    <h4>{transaction.title}</h4>
                    <p className="transaction-category">{category.name}</p>
                    {transaction.description && (
                      <p className="transaction-description">{transaction.description}</p>
                    )}
                    <p className="transaction-date">{formatDate(transaction.date)}</p>
                  </div>

                  <div className="transaction-amount">
                    <span className={`amount ${transaction.type}`}>
                      {transaction.type === 'income' ? '+' : '-'}
                      {formatAmount(transaction.amount)} تومان
                    </span>
                    <button 
                      className="delete-btn"
                      onClick={() => handleDelete(transaction.id)}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default TransactionList;
