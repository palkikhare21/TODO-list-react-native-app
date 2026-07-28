import React, { FormEvent, useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { CalendarClock, CheckCircle2, LayoutList, LogOut, Plus, ShieldCheck, Sparkles, Trash2 } from 'lucide-react';
import './styles.css';

const API_URL = 'https://todo-list-react-native-app.onrender.com';
const LOCAL_TOKEN = 'local-demo-token';
const LOCAL_TASKS_KEY = 'todo_demo_tasks';

type Priority = 'low' | 'medium' | 'high';
type Filter = 'all' | 'pending' | 'completed';

type Task = {
  _id: string;
  title: string;
  description: string;
  dateTime: string;
  deadline: string;
  priority: Priority;
  category?: string;
  completed: boolean;
};

type AuthMode = 'login' | 'register';

const priorityScore: Record<Priority, number> = { high: 30, medium: 20, low: 10 };

function toLocalInputDate(value: Date) {
  const offset = value.getTimezoneOffset() * 60000;
  return new Date(value.getTime() - offset).toISOString().slice(0, 16);
}

async function request<T>(path: string, options: RequestInit = {}, token?: string): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.message ?? 'Request failed');
  }
  return data as T;
}

function readLocalTasks() {
  return JSON.parse(localStorage.getItem(LOCAL_TASKS_KEY) ?? '[]') as Task[];
}

function writeLocalTasks(tasks: Task[]) {
  localStorage.setItem(LOCAL_TASKS_KEY, JSON.stringify(tasks));
}

function createLocalTask(task: Omit<Task, '_id' | 'completed'>) {
  const created: Task = {
    ...task,
    _id: crypto.randomUUID(),
    completed: false,
  };
  writeLocalTasks([created, ...readLocalTasks()]);
  return created;
}

function smartSort(tasks: Task[]) {
  return [...tasks].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    const deadlineBoost = (deadline: string) => {
      const hours = (new Date(deadline).getTime() - Date.now()) / 36e5;
      if (hours < 0) return 40;
      if (hours <= 24) return 30;
      if (hours <= 72) return 20;
      if (hours <= 168) return 10;
      return 0;
    };
    return (
      priorityScore[b.priority] +
      deadlineBoost(b.deadline) -
      (priorityScore[a.priority] + deadlineBoost(a.deadline))
    );
  });
}

function deadlineLabel(deadline: string) {
  const hours = (new Date(deadline).getTime() - Date.now()) / 36e5;
  if (hours < 0) return 'Overdue';
  if (hours <= 24) return 'Due today';
  if (hours <= 72) return 'Due soon';
  return new Date(deadline).toLocaleDateString();
}

function App() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [token, setToken] = useState(() => localStorage.getItem('todo_token') ?? '');
  const [demoMode, setDemoMode] = useState(() => localStorage.getItem('todo_token') === LOCAL_TOKEN);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<Filter>('all');
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: '',
    description: '',
    dateTime: toLocalInputDate(new Date()),
    deadline: toLocalInputDate(new Date(Date.now() + 24 * 36e5)),
    priority: 'medium' as Priority,
    category: '',
  });

  const visibleTasks = useMemo(() => {
    const filtered = tasks.filter(task => {
      if (filter === 'pending') return !task.completed;
      if (filter === 'completed') return task.completed;
      return true;
    });
    return smartSort(filtered);
  }, [filter, tasks]);

  async function loadTasks(activeToken = token) {
    if (!activeToken) return;
    if (activeToken === LOCAL_TOKEN) {
      setTasks(readLocalTasks());
      return;
    }
    setTasks(await request<Task[]>('/tasks', {}, activeToken));
  }

  useEffect(() => {
    loadTasks().catch(err => setError(err.message));
  }, [token]);

  async function submitAuth(event: FormEvent) {
    event.preventDefault();
    setError('');
    try {
      if (!email.trim() || password.length < 6) {
        throw new Error('Enter a valid email and a password of at least 6 characters.');
      }
      const result = await request<{ accessToken: string }>(`/auth/${mode}`, {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      localStorage.setItem('todo_token', result.accessToken);
      setToken(result.accessToken);
      setDemoMode(false);
      setPassword('');
      await loadTasks(result.accessToken);
    } catch (err) {
      localStorage.setItem('todo_token', LOCAL_TOKEN);
      setToken(LOCAL_TOKEN);
      setDemoMode(true);
      setPassword('');
      setError('Backend is not running, so the app opened in local demo mode. You can still add, complete, and delete tasks.');
    }
  }

  async function addTask(event: FormEvent) {
    event.preventDefault();
    setError('');
    try {
      if (token === LOCAL_TOKEN) {
        const created = createLocalTask({
          ...form,
          dateTime: new Date(form.dateTime).toISOString(),
          deadline: new Date(form.deadline).toISOString(),
        });
        setTasks(current => [created, ...current]);
        setForm(current => ({ ...current, title: '', description: '', category: '' }));
        return;
      }
      const created = await request<Task>(
        '/tasks',
        {
          method: 'POST',
          body: JSON.stringify({
            ...form,
            dateTime: new Date(form.dateTime).toISOString(),
            deadline: new Date(form.deadline).toISOString(),
          }),
        },
        token,
      );
      setTasks(current => [created, ...current]);
      setForm(current => ({ ...current, title: '', description: '', category: '' }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not add task');
    }
  }

  async function toggleTask(id: string) {
    if (token === LOCAL_TOKEN) {
      const updated = tasks.map(task => (task._id === id ? { ...task, completed: !task.completed } : task));
      setTasks(updated);
      writeLocalTasks(updated);
      return;
    }
    const updated = await request<Task>(`/tasks/${id}/complete`, { method: 'PATCH' }, token);
    setTasks(current => current.map(task => (task._id === id ? updated : task)));
  }

  async function deleteTask(id: string) {
    if (token === LOCAL_TOKEN) {
      const updated = tasks.filter(task => task._id !== id);
      setTasks(updated);
      writeLocalTasks(updated);
      return;
    }
    await request(`/tasks/${id}`, { method: 'DELETE' }, token);
    setTasks(current => current.filter(task => task._id !== id));
  }

  function logout() {
    localStorage.removeItem('todo_token');
    setToken('');
    setDemoMode(false);
    setTasks([]);
  }

  if (!token) {
    return (
      <main className="auth-page">
        <section className="auth-panel">
          <div className="auth-copy">
            <div className="brand-mark">TP</div>
            <p className="eyebrow">TaskPilot</p>
            <h1>Today’s work, sorted by what matters.</h1>
            <p className="lede">A calm task workspace for planning deadlines, priority, status, and categories from one focused dashboard.</p>
            <div className="mini-board" aria-hidden="true">
              <div className="mini-card high"><span>High</span><strong>Submit internship build</strong><small>Due today</small></div>
              <div className="mini-card medium"><span>Medium</span><strong>Record demo flow</strong><small>Tomorrow</small></div>
              <div className="mini-card low"><span>Low</span><strong>Polish README</strong><small>This week</small></div>
            </div>
            <div className="proof-grid">
              <span><ShieldCheck size={16} /> Login</span>
              <span><LayoutList size={16} /> Filters</span>
              <span><CalendarClock size={16} /> Deadlines</span>
            </div>
          </div>
          <form onSubmit={submitAuth} className="auth-form">
            <div>
              <h2>{mode === 'login' ? 'Sign in' : 'Create account'}</h2>
              <p className="form-note">Use your email and password to manage your task board.</p>
            </div>
            <div className="tabs">
              <button type="button" className={mode === 'login' ? 'active' : ''} onClick={() => setMode('login')}>Login</button>
              <button type="button" className={mode === 'register' ? 'active' : ''} onClick={() => setMode('register')}>Register</button>
            </div>
            <label>Email<input value={email} onChange={event => setEmail(event.target.value)} type="email" required /></label>
            <label>Password<input value={password} onChange={event => setPassword(event.target.value)} type="password" minLength={6} required /></label>
            {error && <p className="error">{error}</p>}
            <button className="primary" type="submit">{mode === 'login' ? 'Login' : 'Create account'}</button>
          </form>
        </section>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <nav className="top-nav">
        <div className="nav-brand">
          <div className="nav-logo">TP</div>
          <span>TaskPilot</span>
        </div>
        <div className="nav-links">
          <a href="#tasks">Tasks</a>
          <a href="#create">Create</a>
          <a href="#summary">Summary</a>
        </div>
        <button className="icon-button" onClick={logout} title="Logout"><LogOut size={20} /></button>
      </nav>

      <header className="dashboard-hero">
        <div>
          <p className="eyebrow">TaskPilot dashboard</p>
          <h1>Organize today’s priorities.</h1>
          <p>Capture work, track deadlines, and let urgent tasks rise to the top automatically.</p>
        </div>
        <div className="hero-stats" id="summary">
          <div><strong>{tasks.length}</strong><span>Total tasks</span></div>
          <div><strong>{tasks.filter(task => !task.completed).length}</strong><span>Pending</span></div>
          <div><strong>{tasks.filter(task => task.completed).length}</strong><span>Completed</span></div>
        </div>
      </header>

      {error && <p className="error">{error}</p>}
      {demoMode && <p className="notice">Local demo mode is active. Start the backend to use API storage.</p>}

      <section className="workspace">
        <form className="task-form" id="create" onSubmit={addTask}>
          <h2><Plus size={20} /> Add task</h2>
          <label>Title<input value={form.title} onChange={event => setForm({ ...form, title: event.target.value })} required /></label>
          <label>Description<textarea value={form.description} onChange={event => setForm({ ...form, description: event.target.value })} /></label>
          <div className="two-col">
            <label>Date-time<input type="datetime-local" value={form.dateTime} onChange={event => setForm({ ...form, dateTime: event.target.value })} required /></label>
            <label>Deadline<input type="datetime-local" value={form.deadline} onChange={event => setForm({ ...form, deadline: event.target.value })} required /></label>
          </div>
          <div className="two-col">
            <label>Priority<select value={form.priority} onChange={event => setForm({ ...form, priority: event.target.value as Priority })}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select></label>
            <label>Category<input value={form.category} onChange={event => setForm({ ...form, category: event.target.value })} /></label>
          </div>
          <button className="primary" type="submit">Save task</button>
        </form>

        <section className="task-list" id="tasks">
          <div className="list-head">
            <h2><CalendarClock size={20} /> Tasks</h2>
            <div className="filters">
              {(['all', 'pending', 'completed'] as Filter[]).map(item => (
                <button key={item} className={filter === item ? 'active' : ''} onClick={() => setFilter(item)}>{item}</button>
              ))}
            </div>
          </div>

          <div className="cards">
            {visibleTasks.length === 0 && <p className="empty">No tasks yet. Add your first task from the form.</p>}
            {visibleTasks.map(task => (
              <article className={`task-card ${task.completed ? 'done' : ''}`} key={task._id}>
                <div>
                  <div className="task-title-row">
                    <h3>{task.title}</h3>
                    <span className={`badge ${task.priority}`}>{task.priority}</span>
                  </div>
                  <p>{task.description || 'No description added.'}</p>
                  <div className="meta">
                    <span>{deadlineLabel(task.deadline)}</span>
                    {task.category && <span>{task.category}</span>}
                    <span>{task.completed ? 'Completed' : 'Pending'}</span>
                  </div>
                </div>
                <div className="task-actions">
                  <button onClick={() => toggleTask(task._id)}><CheckCircle2 size={18} /> {task.completed ? 'Undo' : 'Done'}</button>
                  <button className="danger" onClick={() => deleteTask(task._id)}><Trash2 size={18} /> Delete</button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </section>

      <footer className="footer">
        <span>TaskPilot internship project</span>
        <span><Sparkles size={15} /> Authentication, priorities, filters, deadlines, and smart sorting</span>
      </footer>
    </main>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
