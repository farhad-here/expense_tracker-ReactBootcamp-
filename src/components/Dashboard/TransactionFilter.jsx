import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import './TransactionFilter.css';

function TransactionFilter({ onFilterChange }) {
  const { categories } = useContext(AppContext);
  
  const [filters, setFilters] = useState({
    searchQuery: '',
    type: 'all',
    categoryId: 'all',
    startDate: '',
    endDate: '',
    minAmount: '',
    maxAmount: ''
  });

  const handleChange = (field, value) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      searchQuery: '',
      type: 'all',
      categoryId: 'all',
      startDate: '',
      endDate: '',
      minAmount: '',
      maxAmount: ''
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <div className="transaction-filter">
      <div className="filter-header">
        <h3>🔍 فیلتر و جست‌وجو</h3>
        <button className="reset-btn" onClick={handleReset}>
          ریست فیلترها
        </button>
      </div>

      <div className="filter-grid">
        {/* Search Box */}
        <div className="filter-item full-width">
          <label>جست‌وجو</label>
          <input
            type="text"
            placeholder="جست‌وجو در عنوان یا توضیحات..."
            value={filters.searchQuery}
            onChange={(e) => handleChange('searchQuery', e.target.value)}
          />
        </div>

        {/* Type Filter */}
        <div className="filter-item">
          <label>نوع تراکنش</label>
          <select 
            value={filters.type}
            onChange={(e) => handleChange('type', e.target.value)}
          >
            <option value="all">همه</option>
            <option value="income">درآمد</option>
            <option value="expense">هزینه</option>
          </select>
        </div>

        {/* Category Filter */}
{/* Category Filter */}
<div className="filter-item">
  <label>دسته‌بندی</label>
  <select 
    value={filters.categoryId}
    onChange={(e) => handleChange('categoryId', e.target.value)}
  >
    <option value="all">همه دسته‌بندی‌ها</option>
    <optgroup label="هزینه‌ها">
      {(categories.expense || []).map(cat => (
        <option key={cat.id} value={cat.id}>
          {cat.icon} {cat.name}
        </option>
      ))}
    </optgroup>
    <optgroup label="درآمدها">
      {(categories.income || []).map(cat => (
        <option key={cat.id} value={cat.id}>
          {cat.icon} {cat.name}
        </option>
      ))}
    </optgroup>
  </select>
</div>


        {/* Date Range */}
        <div className="filter-item">
          <label>از تاریخ</label>
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => handleChange('startDate', e.target.value)}
          />
        </div>

        <div className="filter-item">
          <label>تا تاریخ</label>
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => handleChange('endDate', e.target.value)}
          />
        </div>

        {/* Amount Range */}
        <div className="filter-item">
          <label>حداقل مبلغ</label>
          <input
            type="number"
            placeholder="0"
            value={filters.minAmount}
            onChange={(e) => handleChange('minAmount', e.target.value)}
          />
        </div>

        <div className="filter-item">
          <label>حداکثر مبلغ</label>
          <input
            type="number"
            placeholder="بدون محدودیت"
            value={filters.maxAmount}
            onChange={(e) => handleChange('maxAmount', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

export default TransactionFilter;
