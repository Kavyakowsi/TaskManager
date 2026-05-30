import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, LayoutDashboard, Loader2 } from 'lucide-react';
import { api } from '../api';
import { useToast } from './Toast';

const AuthForm = ({ setUser }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password || (!isLogin && !username)) {
      showToast('Please fill out all required fields', 'error');
      return;
    }

    if (password.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        const response = await api.login(email, password);
        showToast(`Welcome back, ${response.user.username}!`, 'success');
        setUser(response.user);
      } else {
        const response = await api.register(username, email, password);
        showToast('Registration successful! Welcome.', 'success');
        setUser(response.user);
      }
    } catch (err) {
      showToast(err.message || 'Authentication failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card} className="glass-panel">
        <div style={styles.header}>
          <div style={styles.logo}>
            <LayoutDashboard size={32} color="#6366F1" />
          </div>
          <h2 style={styles.title}>TaskSphere</h2>
          <p style={styles.subtitle}>
            {isLogin ? 'Manage your team tasks in one place' : 'Create an account to get started'}
          </p>
        </div>

        <div style={styles.tabs}>
          <button
            type="button"
            onClick={() => { setIsLogin(true); }}
            style={{
              ...styles.tab,
              ...(isLogin ? styles.activeTab : {}),
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setIsLogin(false); }}
            style={{
              ...styles.tab,
              ...(!isLogin ? styles.activeTab : {}),
            }}
          >
            Create Account
          </button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          {!isLogin && (
            <div style={styles.inputGroup}>
              <label style={styles.label}>Username</label>
              <div style={styles.inputWrapper}>
                <User size={18} style={styles.inputIcon} />
                <input
                  type="text"
                  placeholder="john_doe"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="input-field"
                  style={styles.input}
                  required
                />
              </div>
            </div>
          )}

          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <div style={styles.inputWrapper}>
              <Mail size={18} style={styles.inputIcon} />
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                style={styles.input}
                required
              />
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <div style={styles.inputWrapper}>
              <Lock size={18} style={styles.inputIcon} />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                style={styles.input}
                required
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary" style={styles.submitBtn}>
            {loading ? (
              <Loader2 size={18} style={styles.spinner} />
            ) : (
              <>
                <span>{isLogin ? 'Sign In' : 'Sign Up'}</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 'calc(100vh - 120px)',
    padding: '20px',
  },
  card: {
    width: '100%',
    maxWidth: '440px',
    padding: '40px 32px',
    textAlign: 'center',
    animation: 'slideUp 0.4s ease-out forwards',
  },
  header: {
    marginBottom: '28px',
  },
  logo: {
    display: 'inline-flex',
    padding: '12px',
    borderRadius: '14px',
    background: 'rgba(99, 102, 241, 0.1)',
    border: '1px solid rgba(99, 102, 241, 0.2)',
    marginBottom: '16px',
  },
  title: {
    fontSize: '2rem',
    fontWeight: '800',
    fontFamily: 'var(--font-display)',
    background: 'linear-gradient(135deg, #fff 40%, #818cf8 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '0.9rem',
    color: 'var(--text-secondary)',
  },
  tabs: {
    display: 'flex',
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid var(--border-color)',
    borderRadius: '10px',
    padding: '4px',
    marginBottom: '28px',
  },
  tab: {
    flex: 1,
    padding: '10px',
    background: 'transparent',
    border: 'none',
    color: 'var(--text-secondary)',
    fontSize: '0.9rem',
    fontWeight: '600',
    fontFamily: 'var(--font-display)',
    cursor: 'pointer',
    borderRadius: '8px',
    transition: 'all var(--transition-fast)',
  },
  activeTab: {
    background: 'rgba(255, 255, 255, 0.08)',
    color: '#fff',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '6px',
  },
  label: {
    fontSize: '0.8rem',
    fontWeight: '600',
    color: 'var(--text-secondary)',
    fontFamily: 'var(--font-display)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  inputWrapper: {
    position: 'relative',
    width: '100%',
  },
  inputIcon: {
    position: 'absolute',
    left: '14px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'var(--text-muted)',
    pointerEvents: 'none',
  },
  input: {
    paddingLeft: '44px',
  },
  submitBtn: {
    width: '100%',
    marginTop: '8px',
  },
  spinner: {
    animation: 'spin 1s linear infinite',
  },
};

// CSS injection for keyframes
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);
}

export default AuthForm;
