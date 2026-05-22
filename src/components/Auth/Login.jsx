import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import './Auth.css';

function Login({ onSwitchToRegister }) {
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (!formData.username || !formData.password) {
      setError('لطفاً تمام فیلدها را پر کنید');
      setLoading(false);
      return;
    }

    // Login
    const result = login(formData.username, formData.password);
    
    if (!result.success) {
      setError(result.message);
    }

    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>🔐 ورود به حساب کاربری</h2>
          <p>به Expense Tracker خوش آمدید</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && (
            <div className="error-message">
              ⚠️ {error}
            </div>
          )}

          <div className="form-group">
            <label>نام کاربری یا ایمیل</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="username یا email@example.com"
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label>رمز عبور</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="رمز عبور خود را وارد کنید"
              autoComplete="current-password"
            />
          </div>

          <button 
            type="submit" 
            className="auth-btn"
            disabled={loading}
          >
            {loading ? 'در حال ورود...' : 'ورود'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            حساب کاربری ندارید؟{' '}
            <button 
              className="link-btn"
              onClick={onSwitchToRegister}
            >
              ثبت‌نام کنید
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
