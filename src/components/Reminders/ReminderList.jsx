import { useState } from 'react';
import { useReminders } from '../context/ReminderContext';
import './Reminders.css';

export default function ReminderList() {
  const { reminders, deleteReminder, toggleReminder, getNextDueDate } = useReminders();
  const [showForm, setShowForm] = useState(false);

  const formatNextDue = (reminder) => {
    const nextDue = getNextDueDate(reminder);
    if (!nextDue) return 'منقضی شده';
    
    const now = new Date();
    const daysUntil = Math.ceil((nextDue - now) / (1000 * 60 * 60 * 24));
    
    if (daysUntil === 0) return 'امروز';
    if (daysUntil === 1) return 'فردا';
    if (daysUntil < 0) return 'گذشته';
    
    return `${daysUntil} روز دیگر`;
  };

  const getFrequencyLabel = (freq) => {
    const labels = {
      once: 'یکبار',
      daily: 'روزانه',
      weekly: 'هفتگی',
      monthly: 'ماهانه',
      yearly: 'سالانه'
    };
    return labels[freq] || freq;
  };

  return (
    <div className="reminder-list">
      <div className="reminder-header">
        <h2>یادآوری‌های پرداخت</h2>
        <button onClick={() => setShowForm(!showForm)} className="btn-add">
          {showForm ? 'بستن' : '+ یادآوری جدید'}
        </button>
      </div>

      {showForm && <ReminderForm onClose={() => setShowForm(false)} />}

      <div className="reminders-grid">
        {reminders.length === 0 ? (
          <p className="no-data">هیچ یادآوری ثبت نشده است</p>
        ) : (
          reminders.map(reminder => (
            <div key={reminder.id} className={`reminder-card ${!reminder.isActive ? 'inactive' : ''}`}>
              <div className="reminder-info">
                <h3>{reminder.title}</h3>
                <p className="reminder-amount">{reminder.amount.toLocaleString('fa-IR')} تومان</p>
                <div className="reminder-meta">
                  <span className="frequency">{getFrequencyLabel(reminder.frequency)}</span>
                  <span className={`next-due ${formatNextDue(reminder) === 'امروز' ? 'urgent' : ''}`}>
                    {formatNextDue(reminder)}
                  </span>
                </div>
                {reminder.description && (
                  <p className="reminder-desc">{reminder.description}</p>
                )}
              </div>
              <div className="reminder-actions">
                <button onClick={() => toggleReminder(reminder.id)} className="btn-toggle">
                  {reminder.isActive ? '⏸ غیرفعال' : '▶ فعال'}
                </button>
                <button onClick={() => deleteReminder(reminder.id)} className="btn-delete">
                  🗑 حذف
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function ReminderForm({ onClose }) {
  const { addReminder } = useReminders();
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    frequency: 'monthly',
    startDate: new Date().toISOString().split('T')[0],
    description: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addReminder({
      ...formData,
      amount: parseFloat(formData.amount)
    });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="reminder-form">
      <input
        type="text"
        placeholder="عنوان (مثلاً: اجاره خانه)"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        required
      />
      <input
        type="number"
        placeholder="مبلغ (تومان)"
        value={formData.amount}
        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
        required
      />
      <select
        value={formData.frequency}
        onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
      >
        <option value="once">یکبار</option>
        <option value="daily">روزانه</option>
        <option value="weekly">هفتگی</option>
        <option value="monthly">ماهانه</option>
        <option value="yearly">سالانه</option>
      </select>
      <input
        type="date"
        value={formData.startDate}
        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
        required
      />
      <textarea
        placeholder="توضیحات (اختیاری)"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
      />
      <div className="form-actions">
        <button type="submit" className="btn-submit">ذخیره</button>
        <button type="button" onClick={onClose} className="btn-cancel">انصراف</button>
      </div>
    </form>
  );
}
