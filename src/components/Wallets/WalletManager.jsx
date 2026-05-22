import { useState } from 'react';
import { useWallets } from '../context/WalletContext';
import './Wallets.css';

export default function WalletManager() {
  const { wallets, activeWallet, setActiveWallet, addWallet, deleteWallet, transferBetweenWallets, getTotalBalance } = useWallets();
  const [showAddForm, setShowAddForm] = useState(false);
  const [showTransferForm, setShowTransferForm] = useState(false);

  const walletTypes = {
    cash: { label: 'نقدی', icon: '💵' },
    bank: { label: 'حساب بانکی', icon: '🏦' },
    credit: { label: 'کارت اعتباری', icon: '💳' },
    savings: { label: 'پس‌انداز', icon: '🏛️' },
    crypto: { label: 'ارز دیجیتال', icon: '₿' }
  };

  return (
    <div className="wallet-manager">
      <div className="wallet-header">
        <div>
          <h2>کیف پول‌های من</h2>
          <p className="total-balance">
            مجموع موجودی: <strong>{getTotalBalance().toLocaleString('fa-IR')}</strong> تومان
          </p>
        </div>
        <div className="header-actions">
          <button onClick={() => setShowTransferForm(true)} className="btn-transfer">
            🔄 انتقال وجه
          </button>
          <button onClick={() => setShowAddForm(true)} className="btn-add">
            + کیف پول جدید
          </button>
        </div>
      </div>

      {showAddForm && <AddWalletForm onClose={() => setShowAddForm(false)} types={walletTypes} />}
      {showTransferForm && <TransferForm onClose={() => setShowTransferForm(false)} wallets={wallets} onTransfer={transferBetweenWallets} />}

      <div className="wallets-grid">
        {wallets.map(wallet => (
          <div
            key={wallet.id}
            className={`wallet-card ${activeWallet === wallet.id ? 'active' : ''}`}
            onClick={() => setActiveWallet(wallet.id)}
          >
            <div className="wallet-icon">{wallet.icon}</div>
            <div className="wallet-info">
              <h3>{wallet.name}</h3>
              <p className="wallet-type">{walletTypes[wallet.type]?.label || wallet.type}</p>
              <p className="wallet-balance">{wallet.balance.toLocaleString('fa-IR')} تومان</p>
            </div>
            {wallets.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm(`آیا از حذف "${wallet.name}" مطمئن هستید؟`)) {
                    deleteWallet(wallet.id);
                  }
                }}
                className="btn-delete-wallet"
              >
                🗑
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function AddWalletForm({ onClose, types }) {
  const { addWallet } = useWallets();
  const [formData, setFormData] = useState({
    name: '',
    type: 'cash',
    balance: '0',
    icon: '💵'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addWallet(formData);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <form className="modal-form" onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
        <h3>کیف پول جدید</h3>
        <input
          type="text"
          placeholder="نام کیف پول"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <select
          value={formData.type}
          onChange={(e) => {
            const type = e.target.value;
            setFormData({ ...formData, type, icon: types[type].icon });
          }}
        >
          {Object.entries(types).map(([key, val]) => (
            <option key={key} value={key}>{val.icon} {val.label}</option>
          ))}
        </select>
        <input
          type="number"
          placeholder="موجودی اولیه (تومان)"
          value={formData.balance}
          onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
        />
        <div className="form-actions">
          <button type="submit" className="btn-submit">ذخیره</button>
          <button type="button" onClick={onClose} className="btn-cancel">انصراف</button>
        </div>
      </form>
    </div>
  );
}

function TransferForm({ onClose, wallets, onTransfer }) {
  const [formData, setFormData] = useState({
    fromWallet: wallets[0]?.id || '',
    toWallet: wallets[1]?.id || '',
    amount: '',
    description: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      onTransfer(
        parseInt(formData.fromWallet),
        parseInt(formData.toWallet),
        parseFloat(formData.amount),
        formData.description
      );
      alert('انتقال با موفقیت انجام شد');
      onClose();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <form className="modal-form" onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
        <h3>انتقال وجه بین کیف پول‌ها</h3>
        <select
          value={formData.fromWallet}
          onChange={(e) => setFormData({ ...formData, fromWallet: e.target.value })}
          required
        >
          <option value="">از کیف پول...</option>
          {wallets.map(w => (
            <option key={w.id} value={w.id}>
              {w.icon} {w.name} ({w.balance.toLocaleString('fa-IR')} تومان)
            </option>
          ))}
        </select>
        <select
          value={formData.toWallet}
          onChange={(e) => setFormData({ ...formData, toWallet: e.target.value })}
          required
        >
          <option value="">به کیف پول...</option>
          {wallets.filter(w => w.id !== parseInt(formData.fromWallet)).map(w => (
            <option key={w.id} value={w.id}>{w.icon} {w.name}</option>
          ))}
        </select>
        <input
          type="number"
          placeholder="مبلغ (تومان)"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          required
        />
        <textarea
          placeholder="توضیحات (اختیاری)"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
        <div className="form-actions">
          <button type="submit" className="btn-submit">انتقال</button>
          <button type="button" onClick={onClose} className="btn-cancel">انصراف</button>
        </div>
      </form>
    </div>
  );
}
