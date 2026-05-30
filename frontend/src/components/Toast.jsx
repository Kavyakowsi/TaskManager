import React, { createContext, useContext, useState, useCallback } from 'react';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Auto remove toast after 3.5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast container */}
      <div style={styles.container}>
        {toasts.map((toast) => (
          <div key={toast.id} style={{ ...styles.toast, ...styles[toast.type] }} className="toast-item">
            <span style={styles.iconContainer}>
              {toast.type === 'success' && <CheckCircle2 size={18} color="#10B981" />}
              {toast.type === 'error' && <AlertCircle size={18} color="#EF4444" />}
              {toast.type === 'info' && <Info size={18} color="#06B6D4" />}
            </span>
            <p style={styles.message}>{toast.message}</p>
            <button onClick={() => removeToast(toast.id)} style={styles.closeBtn}>
              <X size={14} color="#9CA3AF" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

const styles = {
  container: {
    position: 'fixed',
    top: '20px',
    right: '20px',
    zIndex: 9999,
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    maxWidth: '380px',
    width: 'calc(100% - 40px)',
  },
  toast: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 16px',
    borderRadius: '12px',
    background: 'rgba(17, 24, 39, 0.9)',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
    animation: 'slideInRight 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards',
    transformOrigin: 'right top',
  },
  success: {
    borderLeft: '4px solid #10B981',
  },
  error: {
    borderLeft: '4px solid #EF4444',
  },
  info: {
    borderLeft: '4px solid #06B6D4',
  },
  iconContainer: {
    display: 'flex',
    alignItems: 'center',
    marginRight: '12px',
    flexShrink: 0,
  },
  message: {
    fontSize: '0.875rem',
    color: '#F3F4F6',
    fontWeight: '500',
    margin: 0,
    flexGrow: 1,
    lineHeight: '1.4',
  },
  closeBtn: {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4px',
    marginLeft: '12px',
    borderRadius: '4px',
    transition: 'background 0.2s',
    outline: 'none',
  },
};
