import React from 'react';
import { LogOut, LayoutDashboard, User } from 'lucide-react';
import { api } from '../api';
import { useToast } from './Toast';

const Navbar = ({ user, setUser }) => {
  const { showToast } = useToast();

  const handleLogout = () => {
    api.logout();
    setUser(null);
    showToast('Logged out successfully', 'info');
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.charAt(0).toUpperCase();
  };

  return (
    <nav style={styles.nav} className="glass-panel">
      <div style={styles.brand}>
        <LayoutDashboard size={24} color="#6366F1" />
        <span style={styles.logoText}>TaskSphere</span>
      </div>
      
      {user && (
        <div style={styles.userContainer}>
          <div style={styles.profile}>
            <div style={styles.avatar}>
              {getInitials(user.username)}
            </div>
            <div style={styles.userInfo}>
              <span style={styles.username}>{user.username}</span>
              <span style={styles.email}>{user.email}</span>
            </div>
          </div>
          
          <button onClick={handleLogout} style={styles.logoutBtn} title="Sign Out">
            <LogOut size={18} />
            <span style={styles.logoutText}>Sign Out</span>
          </button>
        </div>
      )}
    </nav>
  );
};

const styles = {
  nav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 24px',
    borderRadius: '0 0 16px 16px',
    borderTop: 'none',
    marginBottom: '24px',
    animation: 'fadeIn 0.5s ease',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  logoText: {
    fontFamily: 'var(--font-display)',
    fontWeight: '800',
    fontSize: '1.4rem',
    background: 'linear-gradient(135deg, #fff 30%, #a5b4fc 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    letterSpacing: '-0.03em',
  },
  userContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  profile: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  avatar: {
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '600',
    fontSize: '0.95rem',
    fontFamily: 'var(--font-display)',
    boxShadow: '0 4px 10px rgba(99, 102, 241, 0.25)',
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'left',
    // Hide details on very small screens
    '@media (max-width: 480px)': {
      display: 'none',
    }
  },
  username: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: 'var(--text-primary)',
    lineHeight: '1.2',
  },
  email: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    lineHeight: '1.2',
  },
  logoutBtn: {
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    color: '#EF4444',
    padding: '8px 14px',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.85rem',
    fontWeight: '600',
    fontFamily: 'var(--font-display)',
    transition: 'all var(--transition-fast)',
  },
  logoutText: {
    // Media query is done in JS by conditional sizing or classes, we can keep simple or responsive
  }
};

export default Navbar;
