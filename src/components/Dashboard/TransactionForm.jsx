import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import './TransactionForm.css';

function TransactionForm() {
  const { addTransaction, categories, wallets } = useApp();
  const [formData, setFormData] = useState({
    type: 'expense',
    title: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    categoryId: '',
    walletId: '',
    description: ''
  });
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.amount || !formData.categoryId || !formData.walletId) {
      setMessage({ type: 'error', text: 'لطفا تمام فیلدهای ضروری را پر کنید' });
      return;
    }

    if (parseFloat(formData.amount) <= 0) {
      setMessage({ type: 'error', text: 'مبلغ باید بیشتر از صفر باشد' });
      return;
    }

    addTransaction(formData);
    setMessage({ type: 'success', text: 'تراکنش با موفقیت ثبت شد' });
    
    setFormData({
      type: 'expense',
      title: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      categoryId: '',
      walletId: '',
      description: ''
    });

    setTimeout(() => setMessage(''), 3000);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // اصلاح اینجا 👇
  const filteredCategories = categories[formData.type] || [];

  return (
    <div className="transaction-form-container">
      <h2 className="form-title">➕ افزودن تراکنش جدید</h2>
      
      {message && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="transaction-form">
        <div className="form-row">
          <div className="form-group">
            <label>نوع تراکنش *</label>
            <div className="type-selector">
              <button
                type="button"
                className={`type-btn ${formData.type === 'expense' ? 'active expense' : ''}`}
                onClick={() => setFormData({ ...formData, type: 'expense', categoryId: '' })}
              >
                📉 هزینه
              </button>
              <button
                type="button"
                className={`type-btn ${formData.type === 'income' ? 'active income' : ''}`}
                onClick={() => setFormData({ ...formData, type: 'income', categoryId: '' })}
              >
                📈 درآمد
              </button>
            </div>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>عنوان *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="مثال: خرید مواد غذایی"
              required
            />
          </div>

          <div className="form-group">
            <label>مبلغ (تومان) *</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="0"
              min="0"
              step="1000"
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>دسته‌بندی *</label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              required
            >
              <option value="">انتخاب کنید</option>
              {filteredCategories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>کیف پول *</label>
            <select
              name="walletId"
              value={formData.walletId}
              onChange={handleChange}
              required
            >
              <option value="">انتخاب کنید</option>
              {wallets.map(wallet => (
                <option key={wallet.id} value={wallet.id}>
                  {wallet.icon} {wallet.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>تاریخ *</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>توضیحات</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="توضیحات اضافی (اختیاری)"
            rows="3"
          />
        </div>

        <button type="submit" className="btn btn-primary btn-block">
          ✅ ثبت تراکنش
        </button>
      </form>
    </div>
  );
}

export default TransactionForm;
