import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import './CategoryManager.css';

const CategoryManager = () => {
  const { categories, addCategory, deleteCategory } = useContext(AppContext);
  
  const [formData, setFormData] = useState({
    name: '',
    type: 'expense',
    icon: '📦',
    color: '#3498db'
  });
  
  const [message, setMessage] = useState({ text: '', type: '' });

  // Suggested icons for categories
  const suggestedIcons = [
    '🍔', '🚗', '🏠', '💡', '🎮', '👕', '💊', '📚', 
    '✈️', '🎬', '☕', '🏋️', '🎵', '🛒', '💰', '🎁',
    '📱', '💻', '🍕', '🚌', '⚡', '🔧', '🎨', '📦'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setMessage({ text: 'لطفاً نام دسته‌بندی را وارد کنید', type: 'error' });
      return;
    }

    // Check if category already exists
    const allCategories = [
      ...(categories.expense || []),
      ...(categories.income || [])
    ];
    
    const exists = allCategories.some(
      cat => cat.name.toLowerCase() === formData.name.toLowerCase() && cat.type === formData.type
    );

    if (exists) {
      setMessage({ text: 'این دسته‌بندی قبلاً ثبت شده است', type: 'error' });
      return;
    }

    addCategory(formData);
    setMessage({ text: 'دسته‌بندی با موفقیت اضافه شد', type: 'success' });
    
    // Reset form
    setFormData({
      name: '',
      type: 'expense',
      icon: '📦',
      color: '#3498db'
    });

    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`آیا از حذف دسته‌بندی "${name}" اطمینان دارید؟`)) {
      deleteCategory(id);
      setMessage({ text: 'دسته‌بندی حذف شد', type: 'success' });
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    }
  };

  // Get categories by type from the object structure
  const expenseCategories = categories.expense || [];
  const incomeCategories = categories.income || [];

  return (
    <div className="category-manager">
      <div className="category-form-section">
        <h2>افزودن دسته‌بندی جدید</h2>
        
        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="category-form">
          <div className="form-row">
            <div className="form-group">
              <label>نام دسته‌بندی *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="مثال: رستوران"
              />
            </div>

            <div className="form-group">
              <label>نوع *</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <option value="expense">هزینه</option>
                <option value="income">درآمد</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>آیکون</label>
              <div className="icon-selector">
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="icon-input"
                  maxLength="2"
                />
                <div className="icon-suggestions">
                  {suggestedIcons.map((icon, index) => (
                    <button
                      key={index}
                      type="button"
                      className={`icon-btn ${formData.icon === icon ? 'active' : ''}`}
                      onClick={() => setFormData({ ...formData, icon })}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>رنگ</label>
              <input
                type="color"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="color-input"
              />
            </div>
          </div>

          <button type="submit" className="btn-submit">
            افزودن دسته‌بندی
          </button>
        </form>
      </div>

      <div className="categories-list-section">
        <div className="category-group">
          <h3>دسته‌بندی‌های هزینه ({expenseCategories.length})</h3>
          <div className="categories-grid">
            {expenseCategories.map(category => (
              <div 
                key={category.id} 
                className="category-card"
                style={{ borderLeftColor: category.color }}
              >
                <div className="category-info">
                  <span className="category-icon">{category.icon}</span>
                  <span className="category-name">{category.name}</span>
                </div>
                {!category.isDefault && (
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(category.id, category.name)}
                    title="حذف"
                  >
                    🗑️
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="category-group">
          <h3>دسته‌بندی‌های درآمد ({incomeCategories.length})</h3>
          <div className="categories-grid">
            {incomeCategories.map(category => (
              <div 
                key={category.id} 
                className="category-card"
                style={{ borderLeftColor: category.color }}
              >
                <div className="category-info">
                  <span className="category-icon">{category.icon}</span>
                  <span className="category-name">{category.name}</span>
                </div>
                {!category.isDefault && (
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(category.id, category.name)}
                    title="حذف"
                  >
                    🗑️
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryManager;
