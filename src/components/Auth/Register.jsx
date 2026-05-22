import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import './Auth.css';

function Register({ onSwitchToLogin }) {
  const { register } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
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
    if (!formData.fullName || !formData.username || !formData.email || !formData.password) {
      setError('لطفاً تمام فیلدها را پر کنید');
      setLoading(false);
      return;
    }

    if (formData.username.length < 3) {
      setError('نام کاربری باید حداقل ۳ کاراکتر باشد');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('رمز عبور باید حداقل ۶ کاراکتر باشد');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('رمز عبور و تکرار آن یکسان نیستند');
      setLoading(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('فرمت ایمیل صحیح نیست');
      setLoading(false);
      return;
    }

    // Register
    const result = register({
      fullName: formData.fullName,
      username: formData.username,
      email: formData.email,
      password: formData.password
    });

    if (!result.success) {
      setError(result.message);
    }

    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>📝 ثبت‌نام</h2>
          <p>حساب کاربری جدید ایجاد کنید</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && (
            <div className="error-message">
              ⚠️ {error}
            </div>
          )}

          <div className="form-group">
            <label>نام و نام خانوادگی</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Fred Ghaherdoost or فرهاد قاهردوست"
            />
          </div>

          <div className="form-group">
            <label>نام کاربری</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Fred_gs"
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label>ایمیل</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Fred@example.com"
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label>رمز عبور</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="حداقل ۶ کاراکتر"
              autoComplete="new-password"
            />
          </div>

          <div className="form-group">
            <label>تکرار رمز عبور</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="رمز عبور را دوباره وارد کنید"
              autoComplete="new-password"
            />
          </div>

          <button 
            type="submit" 
            className="auth-btn"
            disabled={loading}
          >
            {loading ? 'در حال ثبت‌نام...' : 'ثبت‌نام'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            قبلاً ثبت‌نام کرده‌اید؟{' '}
            <button 
              className="link-btn"
              onClick={onSwitchToLogin}
            >
              وارد شوید
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
