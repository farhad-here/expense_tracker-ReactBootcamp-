import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import './Summary.css';

function Summary() {
  const { transactions, getTotalBalance } = useApp();

  const stats = useMemo(() => {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    const thisMonthTransactions = transactions.filter(t => {
      const date = new Date(t.date);
      return date >= monthStart && date <= monthEnd;
    });

    const totalIncome = thisMonthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const totalExpense = thisMonthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const totalBalance = getTotalBalance();

    return {
      totalIncome,
      totalExpense,
      totalBalance,
      savings: totalIncome - totalExpense
    };
  }, [transactions, getTotalBalance]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fa-IR').format(Math.round(amount));
  };

  return (
    <div className="summary">
      <div className="summary-card balance">
        <div className="summary-icon">💰</div>
        <div className="summary-info">
          <p className="summary-label">موجودی کل</p>
          <h3 className="summary-value">{formatCurrency(stats.totalBalance)} تومان</h3>
        </div>
      </div>
      
      <div className="summary-card income">
        <div className="summary-icon">📈</div>
        <div className="summary-info">
          <p className="summary-label">درآمد ماه</p>
          <h3 className="summary-value income-value">{formatCurrency(stats.totalIncome)} تومان</h3>
        </div>
      </div>
      
      <div className="summary-card expense">
        <div className="summary-icon">📉</div>
        <div className="summary-info">
          <p className="summary-label">هزینه ماه</p>
          <h3 className="summary-value expense-value">{formatCurrency(stats.totalExpense)} تومان</h3>
        </div>
      </div>
      
      <div className="summary-card savings">
        <div className="summary-icon">💎</div>
        <div className="summary-info">
          <p className="summary-label">پس‌انداز ماه</p>
          <h3 className={`summary-value ${stats.savings >= 0 ? 'income-value' : 'expense-value'}`}>
            {formatCurrency(stats.savings)} تومان
          </h3>
        </div>
      </div>
    </div>
  );
}

export default Summary;