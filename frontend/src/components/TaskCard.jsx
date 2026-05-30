import React from 'react';
import { Calendar, Edit3, Trash2, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';

const TaskCard = ({ task, onEdit, onDelete, onMoveStage }) => {
  const { _id, title, description, stage, priority, dueDate } = task;

  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', _id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const getPriorityStyle = (p) => {
    switch (p) {
      case 'High':
        return { color: '#EF4444', backgroundColor: 'rgba(239, 68, 68, 0.12)' };
      case 'Medium':
        return { color: '#F59E0B', backgroundColor: 'rgba(245, 158, 11, 0.12)' };
      case 'Low':
      default:
        return { color: '#10B981', backgroundColor: 'rgba(16, 185, 129, 0.12)' };
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const isOverdue = () => {
    if (!dueDate || stage === 'Done') return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);
    return due < today;
  };

  const truncate = (text, maxLength = 100) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      style={styles.card}
      className="glass-panel task-card"
    >
      <div style={styles.cardHeader}>
        <span style={{ ...styles.priorityBadge, ...getPriorityStyle(priority) }}>
          {priority}
        </span>
        <div style={styles.actions}>
          <button onClick={() => onEdit(task)} style={styles.actionBtn} title="Edit Task">
            <Edit3 size={14} color="var(--text-secondary)" />
          </button>
          <button onClick={() => onDelete(_id)} style={styles.actionBtnHoverRed} title="Delete Task">
            <Trash2 size={14} color="#EF4444" />
          </button>
        </div>
      </div>

      <h4 style={styles.title}>{title}</h4>
      {description && <p style={styles.description}>{truncate(description)}</p>}

      <div style={styles.cardFooter}>
        {dueDate ? (
          <div style={{
            ...styles.dateContainer,
            color: isOverdue() ? '#EF4444' : 'var(--text-secondary)',
          }}>
            {isOverdue() ? <AlertCircle size={13} style={styles.icon} /> : <Calendar size={13} style={styles.icon} />}
            <span style={styles.dateText}>
              {formatDate(dueDate)}
              {isOverdue() && ' (Overdue)'}
            </span>
          </div>
        ) : (
          <div /> // Spacer
        )}

        {/* Quick Shift buttons for mobile access */}
        <div style={styles.mobileNav}>
          {stage !== 'Todo' && (
            <button 
              onClick={() => onMoveStage(_id, stage === 'Done' ? 'In Progress' : 'Todo')} 
              style={styles.navArrow} 
              title="Move Left"
            >
              <ChevronLeft size={16} />
            </button>
          )}
          {stage !== 'Done' && (
            <button 
              onClick={() => onMoveStage(_id, stage === 'Todo' ? 'In Progress' : 'Done')} 
              style={styles.navArrow} 
              title="Move Right"
            >
              <ChevronRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  card: {
    padding: '16px',
    marginBottom: '12px',
    cursor: 'grab',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    transition: 'all 0.2s ease',
    // Apply styling hook for drag interaction
    ':active': {
      cursor: 'grabbing',
      opacity: 0.5,
    }
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priorityBadge: {
    fontSize: '0.7rem',
    fontWeight: '700',
    padding: '4px 8px',
    borderRadius: '6px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  actions: {
    display: 'flex',
    gap: '6px',
  },
  actionBtn: {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: '4px',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background 0.2s',
    ':hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
    }
  },
  actionBtnHoverRed: {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: '4px',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background 0.2s',
    ':hover': {
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
    }
  },
  title: {
    fontSize: '0.975rem',
    fontWeight: '600',
    color: '#fff',
    textAlign: 'left',
    lineHeight: '1.4',
  },
  description: {
    fontSize: '0.8rem',
    color: 'var(--text-secondary)',
    textAlign: 'left',
    lineHeight: '1.5',
  },
  cardFooter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: '4px',
  },
  dateContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    fontSize: '0.75rem',
  },
  icon: {
    flexShrink: 0,
  },
  dateText: {
    fontWeight: '500',
  },
  mobileNav: {
    display: 'flex',
    gap: '4px',
  },
  navArrow: {
    background: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    color: 'var(--text-secondary)',
    borderRadius: '6px',
    width: '24px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s',
    outline: 'none',
    ':hover': {
      background: 'rgba(255, 255, 255, 0.08)',
      color: '#fff',
    }
  },
};

// CSS Injection for hover details
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    .task-card:hover {
      transform: translateY(-2px);
      border-color: rgba(99, 102, 241, 0.25);
      box-shadow: 0 8px 24px -10px rgba(0, 0, 0, 0.5), 0 0 15px rgba(99, 102, 241, 0.05);
    }
    .task-card button:hover {
      background-color: rgba(255, 255, 255, 0.05);
    }
  `;
  document.head.appendChild(style);
}

export default TaskCard;
