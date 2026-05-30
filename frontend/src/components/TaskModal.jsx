import React, { useState, useEffect } from 'react';
import { X, Calendar, AlertCircle } from 'lucide-react';

const TaskModal = ({ task, isOpen, onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [stage, setStage] = useState('Todo');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setStage(task.stage || 'Todo');
      setPriority(task.priority || 'Medium');
      // Format date for input value (YYYY-MM-DD)
      if (task.dueDate) {
        setDueDate(new Date(task.dueDate).toISOString().substring(0, 10));
      } else {
        setDueDate('');
      }
    } else {
      // Clear form for a new task
      setTitle('');
      setDescription('');
      setStage('Todo');
      setPriority('Medium');
      setDueDate('');
    }
    setErrors({});
  }, [task, isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simple validation
    if (!title.trim()) {
      setErrors({ title: 'Task title is required' });
      return;
    }

    const taskData = {
      title: title.trim(),
      description: description.trim(),
      stage,
      priority,
      dueDate: dueDate || null
    };

    onSave(taskData);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div style={styles.overlay} onClick={handleOverlayClick}>
      <div style={styles.modal} className="glass-panel">
        {/* Modal Header */}
        <div style={styles.header}>
          <h3 style={styles.modalTitle}>{task ? 'Edit Task' : 'Create Task'}</h3>
          <button onClick={onClose} style={styles.closeBtn} title="Close">
            <X size={20} color="var(--text-secondary)" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Task Title <span style={{ color: '#EF4444' }}>*</span></label>
            <input
              type="text"
              placeholder="e.g., Design database schema"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (e.target.value.trim()) setErrors({});
              }}
              className="input-field"
              style={{
                ...styles.input,
                ...(errors.title ? { borderColor: '#EF4444' } : {}),
              }}
              required
            />
            {errors.title && (
              <span style={styles.errorText}>
                <AlertCircle size={12} style={{ marginRight: '4px' }} />
                {errors.title}
              </span>
            )}
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Description</label>
            <textarea
              placeholder="Add details about this task..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input-field"
              style={styles.textarea}
              rows={4}
            />
          </div>

          <div style={styles.row}>
            <div style={{ ...styles.inputGroup, flex: 1 }}>
              <label style={styles.label}>Status Stage</label>
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value)}
                className="input-field"
                style={styles.select}
              >
                <option value="Todo">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Completed</option>
              </select>
            </div>

            <div style={{ ...styles.inputGroup, flex: 1 }}>
              <label style={styles.label}>Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="input-field"
                style={styles.select}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Due Date</label>
            <div style={styles.dateWrapper}>
              <Calendar size={18} style={styles.dateIcon} />
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="input-field"
                style={styles.dateInput}
              />
            </div>
          </div>

          {/* Action buttons */}
          <div style={styles.footer}>
            <button type="button" onClick={onClose} className="btn-secondary" style={styles.btn}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" style={styles.btn}>
              {task ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(5, 7, 12, 0.75)',
    backdropFilter: 'blur(8px)',
    zIndex: 999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    animation: 'fadeIn 0.2s ease-out',
  },
  modal: {
    width: '100%',
    maxWidth: '520px',
    padding: '30px',
    animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
    maxHeight: '90vh',
    overflowY: 'auto',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: '16px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    marginBottom: '24px',
  },
  modalTitle: {
    fontSize: '1.4rem',
    fontWeight: '700',
    color: '#fff',
  },
  closeBtn: {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: '4px',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background 0.2s',
    outline: 'none',
    ':hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
    }
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
  input: {
    height: '42px',
  },
  textarea: {
    resize: 'vertical',
  },
  row: {
    display: 'flex',
    gap: '16px',
  },
  select: {
    height: '42px',
    cursor: 'pointer',
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml;utf8,<svg fill='gray' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/><path d='M0 0h24v24H0z' fill='none'/></svg>")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 12px center',
    backgroundSize: '18px',
  },
  dateWrapper: {
    position: 'relative',
    width: '100%',
  },
  dateIcon: {
    position: 'absolute',
    left: '14px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'var(--text-muted)',
    pointerEvents: 'none',
  },
  dateInput: {
    paddingLeft: '44px',
    height: '42px',
    colorScheme: 'dark', // Native calendar dark mode support!
  },
  errorText: {
    fontSize: '0.75rem',
    color: '#EF4444',
    display: 'flex',
    alignItems: 'center',
    marginTop: '2px',
  },
  footer: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '12px',
    paddingTop: '20px',
    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
  },
  btn: {
    padding: '10px 20px',
  },
};

export default TaskModal;
