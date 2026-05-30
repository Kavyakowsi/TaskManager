import React from 'react';
import { CheckCircle2, Clock, ListTodo, AlertTriangle, PlayCircle } from 'lucide-react';

const DashboardStats = ({ tasks }) => {
  const total = tasks.length;
  const todo = tasks.filter((t) => t.stage === 'Todo').length;
  const inProgress = tasks.filter((t) => t.stage === 'In Progress').length;
  const done = tasks.filter((t) => t.stage === 'Done').length;
  
  const completionRate = total > 0 ? Math.round((done / total) * 100) : 0;
  
  // Calculate overdue tasks
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const overdue = tasks.filter((t) => {
    if (!t.dueDate || t.stage === 'Done') return false;
    const due = new Date(t.dueDate);
    due.setHours(0, 0, 0, 0);
    return due < now;
  }).length;

  const highPriority = tasks.filter((t) => t.priority === 'High' && t.stage !== 'Done').length;

  return (
    <div style={styles.container}>
      {/* Visual Progress Arc/Circle */}
      <div style={styles.card} className="glass-panel">
        <div style={styles.progressSection}>
          <div style={styles.progressCircle}>
            <svg width="80" height="80" viewBox="0 0 80 80">
              <circle
                cx="40"
                cy="40"
                r="34"
                fill="none"
                stroke="rgba(255, 255, 255, 0.05)"
                strokeWidth="6"
              />
              <circle
                cx="40"
                cy="40"
                r="34"
                fill="none"
                stroke="url(#progressGradient)"
                strokeWidth="6"
                strokeDasharray={`${2 * Math.PI * 34}`}
                strokeDashoffset={`${2 * Math.PI * 34 * (1 - completionRate / 100)}`}
                strokeLinecap="round"
                transform="rotate(-90 40 40)"
                style={styles.circleSvg}
              />
              <defs>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6366F1" />
                  <stop offset="100%" stopColor="#06B6D4" />
                </linearGradient>
              </defs>
            </svg>
            <div style={styles.progressLabel}>
              <span style={styles.progressPercentage}>{completionRate}%</span>
            </div>
          </div>
          <div style={styles.progressText}>
            <h3 style={styles.progressTitle}>Completion Rate</h3>
            <p style={styles.progressSubtitle}>{done} of {total} tasks completed</p>
          </div>
        </div>
      </div>

      {/* Grid of stats */}
      <div style={styles.statsGrid}>
        <div style={styles.statBox} className="glass-panel">
          <div style={{ ...styles.iconBg, backgroundColor: 'rgba(107, 114, 128, 0.15)' }}>
            <ListTodo size={20} color="#9CA3AF" />
          </div>
          <div style={styles.statDetails}>
            <span style={styles.statValue}>{todo}</span>
            <span style={styles.statName}>To Do</span>
          </div>
        </div>

        <div style={styles.statBox} className="glass-panel">
          <div style={{ ...styles.iconBg, backgroundColor: 'rgba(245, 158, 11, 0.15)' }}>
            <PlayCircle size={20} color="#F59E0B" />
          </div>
          <div style={styles.statDetails}>
            <span style={styles.statValue}>{inProgress}</span>
            <span style={styles.statName}>In Progress</span>
          </div>
        </div>

        <div style={styles.statBox} className="glass-panel">
          <div style={{ ...styles.iconBg, backgroundColor: 'rgba(16, 185, 129, 0.15)' }}>
            <CheckCircle2 size={20} color="#10B981" />
          </div>
          <div style={styles.statDetails}>
            <span style={styles.statValue}>{done}</span>
            <span style={styles.statName}>Completed</span>
          </div>
        </div>

        {/* Warning card for urgent concerns */}
        <div style={{
          ...styles.statBox,
          ...(overdue > 0 ? styles.overdueBox : {}),
        }} className="glass-panel">
          <div style={{
            ...styles.iconBg,
            backgroundColor: overdue > 0 ? 'rgba(239, 68, 68, 0.15)' : 'rgba(99, 102, 241, 0.15)',
          }}>
            <AlertTriangle size={20} color={overdue > 0 ? '#EF4444' : '#6366F1'} />
          </div>
          <div style={styles.statDetails}>
            <span style={{
              ...styles.statValue,
              color: overdue > 0 ? '#EF4444' : 'var(--text-primary)',
            }}>{overdue > 0 ? overdue : highPriority}</span>
            <span style={styles.statName}>{overdue > 0 ? 'Overdue Tasks' : 'High Priority'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'grid',
    gridTemplateColumns: '1.2fr 3fr',
    gap: '16px',
    marginBottom: '24px',
    animation: 'fadeIn 0.6s ease',
    // Mobile responsive layouts
    '@media (max-width: 900px)': {
      gridTemplateColumns: '1fr',
    }
  },
  card: {
    padding: '20px 24px',
    display: 'flex',
    alignItems: 'center',
  },
  progressSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  progressCircle: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleSvg: {
    transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  progressLabel: {
    position: 'absolute',
    textAlign: 'center',
  },
  progressPercentage: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    fontSize: '1.15rem',
    color: '#fff',
  },
  progressText: {
    textAlign: 'left',
  },
  progressTitle: {
    fontSize: '1.05rem',
    fontWeight: '600',
    marginBottom: '4px',
  },
  progressSubtitle: {
    fontSize: '0.8rem',
    color: 'var(--text-secondary)',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: '16px',
  },
  statBox: {
    display: 'flex',
    alignItems: 'center',
    padding: '16px 20px',
    gap: '16px',
  },
  overdueBox: {
    borderColor: 'rgba(239, 68, 68, 0.25)',
    boxShadow: '0 0 15px rgba(239, 68, 68, 0.05)',
  },
  iconBg: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  statDetails: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    textAlign: 'left',
  },
  statValue: {
    fontSize: '1.4rem',
    fontWeight: '700',
    color: '#fff',
    lineHeight: '1.1',
    fontFamily: 'var(--font-display)',
  },
  statName: {
    fontSize: '0.75rem',
    color: 'var(--text-secondary)',
    fontWeight: '500',
    marginTop: '2px',
  },
};

export default DashboardStats;
