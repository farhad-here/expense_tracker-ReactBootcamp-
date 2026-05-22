import { useApp } from '../context/AppContext';
import { useWallets } from '../context/WalletContext';
import { useReminders } from '../context/ReminderContext';
import { useNavigate } from 'react-router-dom';
import jalaali from 'jalaali-js';
import './ImportExport.css';

export default function ImportExport() {
  const navigate = useNavigate();
  const { transactions, categories, importData, exportData } = useApp();
  const { wallets } = useWallets();
  const { reminders } = useReminders();

  const jalaliToGregorian = (jalaliDate) => {
    try {
      const normalized = jalaliDate.replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d));
      const parts = normalized.split('/');
      
      const jYear = parseInt(parts[0]);
      const jMonth = parseInt(parts[1]);
      const jDay = parseInt(parts[2]);
      
      const gregorian = jalaali.toGregorian(jYear, jMonth, jDay);
      
      return new Date(gregorian.gy, gregorian.gm - 1, gregorian.gd).toISOString();
    } catch (error) {
      console.error('Date conversion error:', error, jalaliDate);
      return new Date().toISOString();
    }
  };

  // Export to JSON
  const handleExportJSON = () => {
    const data = exportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `financial-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Export to CSV
const handleExportCSV = () => {
  const headers = ['تاریخ', 'نوع', 'دسته‌بندی', 'مبلغ', 'توضیحات', 'کیف پول'];
  const rows = transactions.map(t => {
    let categoryName = 'نامشخص';
    
    if (t.categoryId) {
      const allCategories = [...(categories.income || []), ...(categories.expense || [])];
      const foundCategory = allCategories.find(c => c.id === t.categoryId);
      categoryName = foundCategory?.name || categoryName;
    } else if (typeof t.category === 'object' && t.category?.name) {
      categoryName = t.category.name;
    } else if (typeof t.category === 'string') {
      categoryName = t.category;
    }
    
    const wallet = wallets.find(w => w.id === t.walletId);
    
    return [
      new Date(t.date).toLocaleDateString('fa-IR'),
      t.type === 'income' ? 'درآمد' : 'هزینه',
      categoryName,
      t.amount,
      t.description || '',
      wallet?.name || 'پیش‌فرض'
    ];
  });

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `transactions-${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

  // Import from JSON
  const handleImportJSON = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        
        if (confirm('آیا از وارد کردن داده‌ها مطمئن هستید؟ این عمل داده‌های فعلی را جایگزین می‌کند.')) {
          const result = importData(data);
          if (result.success) {
            alert('داده‌ها با موفقیت وارد شدند');
            setTimeout(() => window.location.reload(), 100);
          } else {
            alert('خطا: ' + result.message);
          }
        }
      } catch (error) {
        alert('خطا در خواندن فایل: ' + error.message);
      }
    };
    reader.readAsText(file);
  };

  // Import from CSV
  const handleImportCSV = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target.result;
        const lines = text.split('\n').slice(1); // حذف header
        
        console.log('📄 CSV Lines:', lines.length);
        
        const newTransactions = lines
          .filter(line => line.trim())
          .map((line, index) => {
            const matches = line.match(/"([^"]*)"/g);
            if (!matches || matches.length < 6) {
              console.warn(`⚠️ Line ${index + 1} skipped:`, line);
              return null;
            }

            const [date, type, category, amount, description, walletName] = matches.map(m => 
              m.replace(/^"|"$/g, '').trim()
            );

            const typeKey = type === 'درآمد' ? 'income' : 'expense';
            const categoryObj = categories[typeKey]?.find(c => c.name === category);
            const wallet = wallets.find(w => w.name === walletName);
            const walletId = wallet?.id || wallets[0]?.id;

            const convertedDate = jalaliToGregorian(date);
            
            console.log(`✅ Transaction ${index + 1}:`, {
              originalDate: date,
              convertedDate,
              type: typeKey,
              category: categoryObj?.name || category,
              amount,
              walletId
            });

            return {
              id: `txn-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              date: convertedDate,
              type: typeKey,
              categoryId: categoryObj?.id || `cat-${category}`,
              category: categoryObj || { name: category },
              amount: parseFloat(amount),
              description: description || '',
              walletId: walletId,
              wallet: walletName,
              title: description || category, 
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            };
          })
          .filter(t => t !== null);

        console.log('📊 Total valid transactions:', newTransactions.length);

        if (newTransactions.length === 0) {
          alert('هیچ تراکنش معتبری یافت نشد');
          return;
        }

        if (confirm(`${newTransactions.length} تراکنش یافت شد. آیا می‌خواهید آن‌ها را اضافه کنید؟`)) {
          const result = importData({ transactions: newTransactions });
          if (result.success) {
            alert('تراکنش‌ها با موفقیت وارد شدند');
            navigate('/');
          } else {
            alert('خطا: ' + result.message);
          }
        }
      } catch (error) {
        alert('خطا در خواندن فایل CSV: ' + error.message);
        console.error('CSV Import Error:', error);
      }
    };
    reader.readAsText(file);
    
    // Reset input
    e.target.value = '';
  };

  const totalCategories = (categories.income?.length || 0) + (categories.expense?.length || 0);

  return (
    <div className="import-export">
      <h2>مدیریت داده‌ها</h2>
      
      <div className="data-section">
        <h3>📤 خروجی گرفتن (Export)</h3>
        <div className="export-buttons">
          <button onClick={handleExportJSON} className="btn-export">
            💾 دانلود JSON
            <small>شامل تمام داده‌ها</small>
          </button>
          <button onClick={handleExportCSV} className="btn-export">
            📊 دانلود CSV
            <small>فقط تراکنش‌ها</small>
          </button>
        </div>
      </div>

      <div className="data-section">
        <h3>📥 درون‌ریزی (Import)</h3>
        <div className="import-buttons">
          <label className="btn-import">
            📁 بارگذاری JSON
            <input type="file" accept=".json" onChange={handleImportJSON} hidden />
          </label>
          <label className="btn-import">
            📄 بارگذاری CSV
            <input type="file" accept=".csv" onChange={handleImportCSV} hidden />
          </label>
        </div>
        <p className="warning">⚠️ توجه: درون‌ریزی داده‌های جدید، داده‌های فعلی را جایگزین می‌کند</p>
      </div>

      <div className="data-stats">
        <h3>📊 آمار داده‌ها</h3>
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-label">تراکنش‌ها</span>
            <span className="stat-value">{transactions.length}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">دسته‌بندی‌ها</span>
            <span className="stat-value">{totalCategories}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">کیف پول‌ها</span>
            <span className="stat-value">{wallets.length}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">یادآوری‌ها</span>
            <span className="stat-value">{reminders.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
