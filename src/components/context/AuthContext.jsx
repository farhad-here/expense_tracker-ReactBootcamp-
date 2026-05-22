import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load users and current user from localStorage
  useEffect(() => {
    const storedUsers = localStorage.getItem('expense_tracker_users');
    const storedCurrentUser = localStorage.getItem('expense_tracker_current_user');

    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    }

    if (storedCurrentUser) {
      setCurrentUser(JSON.parse(storedCurrentUser));
    }

    setLoading(false);
  }, []);

  // Save users to localStorage
  const saveUsers = (usersList) => {
    setUsers(usersList);
    localStorage.setItem('expense_tracker_users', JSON.stringify(usersList));
  };

  // Save current user to localStorage
  const saveCurrentUser = (user) => {
    setCurrentUser(user);
    if (user) {
      localStorage.setItem('expense_tracker_current_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('expense_tracker_current_user');
    }
  };

  // Register new user
  const register = (userData) => {
    const { username, email, password, fullName } = userData;

    // Check if user already exists
    const existingUser = users.find(
      u => u.username === username || u.email === email
    );

    if (existingUser) {
      if (existingUser.username === username) {
        return { success: false, message: 'نام کاربری قبلاً استفاده شده است' };
      }
      if (existingUser.email === email) {
        return { success: false, message: 'ایمیل قبلاً ثبت شده است' };
      }
    }

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      username,
      email,
      password, 
      fullName,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=random`,
      createdAt: new Date().toISOString(),
      settings: {
        currency: 'تومان',
        language: 'fa',
        theme: 'light'
      }
    };

    const updatedUsers = [...users, newUser];
    saveUsers(updatedUsers);

    // Auto login after registration
    const userWithoutPassword = { ...newUser };
    delete userWithoutPassword.password;
    saveCurrentUser(userWithoutPassword);

    return { success: true, message: 'ثبت‌نام با موفقیت انجام شد' };
  };

  // Login user
  const login = (username, password) => {
    const user = users.find(
      u => (u.username === username || u.email === username) && u.password === password
    );

    if (!user) {
      return { success: false, message: 'نام کاربری یا رمز عبور اشتباه است' };
    }

    const userWithoutPassword = { ...user };
    delete userWithoutPassword.password;
    saveCurrentUser(userWithoutPassword);

    return { success: true, message: 'ورود با موفقیت انجام شد' };
  };

  // Logout user
  const logout = () => {
    saveCurrentUser(null);
  };

  // Update user profile
  const updateProfile = (updates) => {
    if (!currentUser) return { success: false, message: 'کاربری وارد نشده است' };

    const updatedUsers = users.map(u => {
      if (u.id === currentUser.id) {
        return { ...u, ...updates };
      }
      return u;
    });

    saveUsers(updatedUsers);

    const updatedCurrentUser = { ...currentUser, ...updates };
    delete updatedCurrentUser.password;
    saveCurrentUser(updatedCurrentUser);

    return { success: true, message: 'پروفایل با موفقیت به‌روزرسانی شد' };
  };

  // Change password
  const changePassword = (oldPassword, newPassword) => {
    if (!currentUser) return { success: false, message: 'کاربری وارد نشده است' };

    const user = users.find(u => u.id === currentUser.id);
    
    if (user.password !== oldPassword) {
      return { success: false, message: 'رمز عبور فعلی اشتباه است' };
    }

    const updatedUsers = users.map(u => {
      if (u.id === currentUser.id) {
        return { ...u, password: newPassword };
      }
      return u;
    });

    saveUsers(updatedUsers);

    return { success: true, message: 'رمز عبور با موفقیت تغییر کرد' };
  };

  const value = {
    currentUser,
    users,
    loading,
    register,
    login,
    logout,
    updateProfile,
    changePassword,
    isAuthenticated: !!currentUser
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
