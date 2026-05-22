import React, { useState } from 'react';
import Summary from './Summary';
import TransactionForm from './TransactionForm';
import TransactionList from './TransactionList';
import CategoryManager from './CategoryManager';
import WalletManager from '../Wallets/WalletManager';
import ReminderList from '../Reminders/ReminderList';
import ImportExport from '../DataManagement/ImportExport';
import './Dashboard.css';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('transactions');

  const renderContent = () => {
    switch (activeTab) {
      case 'transactions':
        return (
          <>
            <Summary />
            <TransactionForm />
            <TransactionList />
          </>
        );
      case 'categories':
        return <CategoryManager />;
      case 'wallets':
        return <WalletManager />;
      case 'reminders':
        return <ReminderList />;
      case 'export':
        return <ImportExport />;
      default:
        return null;
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-tabs">
        <button
          className={`tab ${activeTab === 'transactions' ? 'active' : ''}`}
          onClick={() => setActiveTab('transactions')}
        >
          تراکنش‌ها
        </button>
        <button
          className={`tab ${activeTab === 'categories' ? 'active' : ''}`}
          onClick={() => setActiveTab('categories')}
        >
          دسته‌بندی‌ها
        </button>
        <button
          className={`tab ${activeTab === 'wallets' ? 'active' : ''}`}
          onClick={() => setActiveTab('wallets')}
        >
          کیف پول‌ها
        </button>
        <button
          className={`tab ${activeTab === 'reminders' ? 'active' : ''}`}
          onClick={() => setActiveTab('reminders')}
        >
          یادآوری‌ها
        </button>
        <button
          className={`tab ${activeTab === 'export' ? 'active' : ''}`}
          onClick={() => setActiveTab('export')}
        >
          خروجی
        </button>
      </div>

      <div className="dashboard-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default Dashboard;
