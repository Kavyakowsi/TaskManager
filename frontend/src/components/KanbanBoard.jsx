import React, { useState } from 'react';
import { Search, Plus, ListFilter, Circle } from 'lucide-react';
import TaskCard from './TaskCard';

const KanbanBoard = ({ tasks, onAddTask, onEditTask, onDeleteTask, onUpdateTaskStage, filters, setFilters }) => {
  const [draggedOverColumn, setDraggedOverColumn] = useState(null);

  const columns = [
    { id: 'Todo', title: 'To Do', color: '#6B7280', glow: 'rgba(107, 114, 128, 0.2)' },
    { id: 'In Progress', title: 'In Progress', color: '#F59E0B', glow: 'rgba(245, 158, 11, 0.2)' },
    { id: 'Done', title: 'Completed', color: '#10B981', glow: 'rgba(16, 185, 129, 0.2)' },
  ];

  // Handle Drag & Drop
  const handleDragOver = (e, columnId) => {
    e.preventDefault();
    if (draggedOverColumn !== columnId) {
      setDraggedOverColumn(columnId);
    }
  };

  const handleDragLeave = () => {
    setDraggedOverColumn(null);
  };

  const handleDrop = (e, targetColumnId) => {
    e.preventDefault();
    setDraggedOverColumn(null);
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId) {
      onUpdateTaskStage(taskId, targetColumnId);
    }
  };

  const handleSearchChange = (e) => {
    setFilters({ ...filters, search: e.target.value });
  };

  const handlePriorityChange = (e) => {
    setFilters({ ...filters, priority: e.target.value });
  };

  // Filter tasks by column locally
  const getTasksByColumn = (columnId) => {
    return tasks.filter((task) => task.stage === columnId);
  };

  return (
    <div style={styles.boardContainer}>
      {/* Board Controls (Search, Filter, Create) */}
      <div style={styles.controls} className="glass-panel">
        <div style={styles.searchWrapper}>
          <Search size={18} style={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search tasks..."
            value={filters.search}
            onChange={handleSearchChange}
            className="input-field"
            style={styles.searchInput}
          />
        </div>

        <div style={styles.filterAndAction}>
          <div style={styles.filterWrapper}>
            <ListFilter size={18} style={styles.filterIcon} />
            <select
              value={filters.priority}
              onChange={handlePriorityChange}
              className="input-field"
              style={styles.selectInput}
            >
              <option value="">All Priorities</option>
              <option value="Low">Low Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="High">High Priority</option>
            </select>
          </div>

          <button onClick={onAddTask} className="btn-primary" style={styles.addBtn}>
            <Plus size={18} />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* Columns Grid */}
      <div style={styles.grid}>
        {columns.map((col) => {
          const colTasks = getTasksByColumn(col.id);
          const isDraggingOver = draggedOverColumn === col.id;

          return (
            <div
              key={col.id}
              onDragOver={(e) => handleDragOver(e, col.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, col.id)}
              style={{
                ...styles.column,
                ...(isDraggingOver ? {
                  borderColor: col.color,
                  backgroundColor: 'rgba(255, 255, 255, 0.01)',
                  boxShadow: `inset 0 0 20px ${col.glow}`,
                } : {}),
              }}
              className="glass-panel"
            >
              {/* Column Header */}
              <div style={styles.columnHeader}>
                <div style={styles.colTitleWrapper}>
                  <Circle size={8} fill={col.color} stroke="none" style={{ marginRight: '8px' }} />
                  <h3 style={styles.columnTitle}>{col.title}</h3>
                </div>
                <span style={{ ...styles.badge, backgroundColor: 'rgba(255,255,255,0.06)' }}>
                  {colTasks.length}
                </span>
              </div>

              {/* Column Body / Droppable Area */}
              <div style={styles.columnBody} className="column-content">
                {colTasks.length > 0 ? (
                  colTasks.map((task) => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      onEdit={onEditTask}
                      onDelete={onDeleteTask}
                      onMoveStage={onUpdateTaskStage}
                    />
                  ))
                ) : (
                  <div style={styles.emptyState}>
                    <p style={styles.emptyText}>No tasks here</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const styles = {
  boardContainer: {
    animation: 'fadeIn 0.7s ease',
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 20px',
    marginBottom: '24px',
    gap: '16px',
    flexWrap: 'wrap',
  },
  searchWrapper: {
    position: 'relative',
    flex: 1,
    minWidth: '240px',
  },
  searchIcon: {
    position: 'absolute',
    left: '14px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'var(--text-muted)',
    pointerEvents: 'none',
  },
  searchInput: {
    paddingLeft: '42px',
    height: '42px',
  },
  filterAndAction: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'wrap',
  },
  filterWrapper: {
    position: 'relative',
    width: '180px',
  },
  filterIcon: {
    position: 'absolute',
    left: '14px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'var(--text-muted)',
    pointerEvents: 'none',
  },
  selectInput: {
    paddingLeft: '42px',
    height: '42px',
    cursor: 'pointer',
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml;utf8,<svg fill='gray' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/><path d='M0 0h24v24H0z' fill='none'/></svg>")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 12px center',
    backgroundSize: '18px',
  },
  addBtn: {
    height: '42px',
    padding: '0 20px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '20px',
    alignItems: 'start',
    '@media (max-width: 800px)': {
      gridTemplateColumns: '1fr',
    }
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    maxHeight: '75vh',
    borderRadius: '16px',
    padding: '16px',
    transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
  },
  columnHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: '14px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    marginBottom: '16px',
  },
  colTitleWrapper: {
    display: 'flex',
    alignItems: 'center',
  },
  columnTitle: {
    fontSize: '1.05rem',
    fontWeight: '600',
    color: '#fff',
  },
  badge: {
    fontSize: '0.8rem',
    fontWeight: '600',
    padding: '2px 8px',
    borderRadius: '20px',
    color: 'var(--text-secondary)',
  },
  columnBody: {
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
    flexGrow: 1,
    minHeight: '200px',
    paddingRight: '4px',
  },
  emptyState: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '140px',
    border: '2px dashed rgba(255, 255, 255, 0.03)',
    borderRadius: '12px',
  },
  emptyText: {
    color: 'var(--text-muted)',
    fontSize: '0.85rem',
  },
};

export default KanbanBoard;
