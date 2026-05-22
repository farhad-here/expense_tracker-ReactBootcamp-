import { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';

export const ReminderContext = createContext();

export const ReminderProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [reminders, setReminders] = useState([]);

  // Load reminders from localStorage
  useEffect(() => {
    if (user) {
      const saved = localStorage.getItem(`reminders_${user.username}`);
      if (saved) {
        setReminders(JSON.parse(saved));
      }
    }
  }, [user]);

  // Save reminders to localStorage
  useEffect(() => {
    if (user && reminders.length > 0) {
      localStorage.setItem(`reminders_${user.username}`, JSON.stringify(reminders));
    }
  }, [reminders, user]);

  // Add new reminder
  const addReminder = (reminder) => {
    const newReminder = {
      id: Date.now(),
      ...reminder,
      createdAt: new Date().toISOString(),
      lastNotified: null,
      isActive: true
    };
    setReminders(prev => [...prev, newReminder]);
    return newReminder;
  };

  // Update reminder
  const updateReminder = (id, updates) => {
    setReminders(prev =>
      prev.map(r => r.id === id ? { ...r, ...updates } : r)
    );
  };

  // Delete reminder
  const deleteReminder = (id) => {
    setReminders(prev => prev.filter(r => r.id !== id));
  };

  // Toggle reminder active status
  const toggleReminder = (id) => {
    setReminders(prev =>
      prev.map(r => r.id === id ? { ...r, isActive: !r.isActive } : r)
    );
  };

  // Check for due reminders
  const checkDueReminders = () => {
    const now = new Date();
    const dueReminders = reminders.filter(r => {
      if (!r.isActive) return false;

      const nextDue = getNextDueDate(r);
      if (!nextDue) return false;

      // Check if due within next 3 days
      const daysUntilDue = Math.ceil((nextDue - now) / (1000 * 60 * 60 * 24));
      return daysUntilDue <= 3 && daysUntilDue >= 0;
    });

    return dueReminders;
  };

  // Calculate next due date
  const getNextDueDate = (reminder) => {
    const startDate = new Date(reminder.startDate);
    const now = new Date();

    if (reminder.frequency === 'once') {
      return startDate > now ? startDate : null;
    }

    let nextDate = new Date(startDate);
    
    while (nextDate < now) {
      switch (reminder.frequency) {
        case 'daily':
          nextDate.setDate(nextDate.getDate() + 1);
          break;
        case 'weekly':
          nextDate.setDate(nextDate.getDate() + 7);
          break;
        case 'monthly':
          nextDate.setMonth(nextDate.getMonth() + 1);
          break;
        case 'yearly':
          nextDate.setFullYear(nextDate.getFullYear() + 1);
          break;
        default:
          return null;
      }
    }

    return nextDate;
  };

  // Mark reminder as notified
  const markAsNotified = (id) => {
    setReminders(prev =>
      prev.map(r => r.id === id ? { ...r, lastNotified: new Date().toISOString() } : r)
    );
  };

  const value = {
    reminders,
    addReminder,
    updateReminder,
    deleteReminder,
    toggleReminder,
    checkDueReminders,
    getNextDueDate,
    markAsNotified
  };

  return (
    <ReminderContext.Provider value={value}>
      {children}
    </ReminderContext.Provider>
  );
};

export const useReminders = () => {
  const context = useContext(ReminderContext);
  if (!context) {
    throw new Error('useReminders must be used within ReminderProvider');
  }
  return context;
};
