import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import './Header.css';

function Header() {
  const { currentUser, logout } = useContext(AuthContext);

  const handleLogout = () => {
    if (window.confirm('آیا مطمئن هستید که می‌خواهید خارج شوید؟')) {
      logout();
    }
  };

  return (
    <header className="app-header">
      <div className="header-content">
        <div className="header-logo">
          <h1>💰 Expense Tracker</h1>
        </div>

        <div className="header-user">
          <div className="user-info">
            <img 
              src={currentUser?.avatar} 
              alt={currentUser?.fullName}
              className="user-avatar"
            />
            <div className="user-details">
              <span className="user-name">{currentUser?.fullName}</span>
              <span className="user-username">@{currentUser?.username}</span>
            </div>
          </div>
          
          <button className="logout-btn" onClick={handleLogout}>
            🚪 خروج
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
