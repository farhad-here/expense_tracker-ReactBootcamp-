# Personal Finance Manager

A modern, feature-rich personal finance management application built with React and Vite. Track your income, expenses, and manage multiple wallets with ease.

## Features

- **Multi-Wallet Support**: Create and manage multiple wallets with different currencies
- **Transaction Management**: Add, edit, and delete income/expense transactions
- **Category System**: Organize transactions with customizable categories
- **Data Import/Export**: 
  - Export data to JSON or CSV format
  - Import transactions from CSV files
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Local Storage**: All data is stored locally in your browser
- **Real-time Balance Updates**: Wallet balances update automatically with transactions

## Tech Stack

- **React 18**: Modern React with hooks
- **Vite**: Fast build tool and development server
- **React Router**: Client-side routing
- **Lucide React**: Beautiful icon library
- **CSS3**: Custom styling with modern CSS features

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd personal-finance-manager
```
2. Install dependencies:
bash
npm install

3. Start the development server:
bash
npm run dev

4. Open your browser and navigate to `http://localhost:5173`

## Usage

### Creating a Wallet

1. Navigate to the Wallets page
2. Click "Add Wallet"
3. Enter wallet name, initial balance, and currency
4. Click "Add Wallet" to save

### Adding Transactions

1. Go to the Transactions page
2. Click "Add Transaction"
3. Fill in the transaction details:
   - Type (Income/Expense)
   - Amount
   - Category
   - Wallet
   - Date
   - Description (optional)
4. Click "Add Transaction" to save

### Importing Data

1. Navigate to Settings → Import/Export
2. Click "Import CSV"
3. Select your CSV file with the following format:
   
date,type,amount,category,wallet,description

2024-01-01,expense,50,Food,Main Wallet,Groceries

4. Data will be imported and wallets will be updated automatically

### Exporting Data

1. Navigate to Settings → Import/Export
2. Choose export format:
   - **JSON**: Complete backup with all data
   - **CSV**: Transaction list for spreadsheet analysis

