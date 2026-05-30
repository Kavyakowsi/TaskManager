import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import AuthForm from './components/AuthForm';
import DashboardStats from './components/DashboardStats';
import KanbanBoard from './components/KanbanBoard';
import TaskModal from './components/TaskModal';
import { ToastProvider, useToast } from './components/Toast';
import { api } from './api';
import { Loader2 } from 'lucide-react';

function AppContent() {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [authChecking, setAuthChecking] = useState(true);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [filters, setFilters] = useState({ search: '', priority: '' });
  
  const { showToast } = useToast();
  
  // Debounce search input
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const searchTimeoutRef = useRef(null);

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedSearch(filters.search);
    }, 300); // 300ms delay

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [filters.search]);

  // Check auth state on load
  useEffect(() => {
    const initAuth = async () => {
      if (api.isAuthenticated()) {
        try {
          const userData = await api.getMe();
          setUser(userData);
        } catch (err) {
          console.error('Session validation failed:', err.message);
          api.logout(); // Clear invalid token
        }
      }
      setAuthChecking(false);
    };
    initAuth();
  }, []);

  // Fetch tasks when user logs in or filters update
  useEffect(() => {
    const fetchTasks = async () => {
      if (!user) return;
      setTasksLoading(true);
      try {
        const data = await api.getTasks({
          search: debouncedSearch,
          priority: filters.priority
        });
        setTasks(data);
      } catch (err) {
        showToast(err.message || 'Failed to fetch tasks', 'error');
      } finally {
        setTasksLoading(false);
      }
    };

    fetchTasks();
  }, [user, debouncedSearch, filters.priority]);

  // Task Operations
  const handleSaveTask = async (taskData) => {
    try {
      if (selectedTask) {
        // Update task
        const updated = await api.updateTask(selectedTask._id, taskData);
        setTasks((prev) => prev.map((t) => (t._id === selectedTask._id ? updated : t)));
        showToast('Task updated successfully', 'success');
      } else {
        // Create task
        const created = await api.createTask(taskData);
        setTasks((prev) => [created, ...prev]);
        showToast('Task created successfully', 'success');
      }
      setIsModalOpen(false);
      setSelectedTask(null);
    } catch (err) {
      showToast(err.message || 'Failed to save task', 'error');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    
    // Optimistic UI update
    const previousTasks = [...tasks];
    setTasks((prev) => prev.filter((t) => t._id !== taskId));

    try {
      await api.deleteTask(taskId);
      showToast('Task deleted successfully', 'success');
    } catch (err) {
      // Revert if API failed
      setTasks(previousTasks);
      showToast(err.message || 'Failed to delete task', 'error');
    }
  };

  const handleUpdateTaskStage = async (taskId, newStage) => {
    // Find task
    const taskIndex = tasks.findIndex((t) => t._id === taskId);
    if (taskIndex === -1) return;
    
    const task = tasks[taskIndex];
    if (task.stage === newStage) return;

    // Optimistic UI update
    const previousTasks = [...tasks];
    const updatedTasks = [...tasks];
    updatedTasks[taskIndex] = { ...task, stage: newStage };
    setTasks(updatedTasks);

    try {
      await api.updateTask(taskId, { stage: newStage });
    } catch (err) {
      // Revert if API fails
      setTasks(previousTasks);
      showToast(err.message || 'Failed to move task', 'error');
    }
  };

  const openCreateModal = () => {
    setSelectedTask(null);
    setIsModalOpen(true);
  };

  const openEditModal = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  if (authChecking) {
    return (
      <div style={styles.loadingScreen}>
        <Loader2 size={40} color="#6366F1" style={styles.spinner} />
        <span style={styles.loadingText}>Initializing TaskSphere...</span>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <Navbar user={user} setUser={setUser} />
      
      <main style={styles.main}>
        {user ? (
          <>
            <DashboardStats tasks={tasks} />
            
            {tasksLoading && tasks.length === 0 ? (
              <div style={styles.loadingDashboard}>
                <Loader2 size={32} color="#6366F1" style={styles.spinner} />
                <span>Loading your workspace...</span>
              </div>
            ) : (
              <KanbanBoard
                tasks={tasks}
                onAddTask={openCreateModal}
                onEditTask={openEditModal}
                onDeleteTask={handleDeleteTask}
                onUpdateTaskStage={handleUpdateTaskStage}
                filters={filters}
                setFilters={setFilters}
              />
            )}
          </>
        ) : (
          <AuthForm setUser={setUser} />
        )}
      </main>

      <TaskModal
        task={selectedTask}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTask}
      />
    </div>
  );
}

function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}

const styles = {
  loadingScreen: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    gap: '16px',
    backgroundColor: '#090d16',
  },
  loadingText: {
    fontFamily: 'var(--font-display)',
    fontWeight: '600',
    color: 'var(--text-secondary)',
    fontSize: '0.95rem',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px 40px 20px',
  },
  main: {
    animation: 'fadeIn 0.5s ease',
  },
  loadingDashboard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '300px',
    gap: '12px',
    color: 'var(--text-secondary)',
    fontSize: '0.9rem',
  },
  spinner: {
    animation: 'spin 1s linear infinite',
  },
};

export default App;
