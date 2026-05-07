"use client"

import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  CheckSquare, 
  BookOpen, 
  Plus, 
  Bell, 
  GraduationCap,
  Trash2,
  Calendar,
  CheckCircle,
  Circle,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Task {
  id: number;
  title: string;
  description?: string;
  deadline?: string;
  is_completed: boolean;
  owner_id: number;
}

interface Note {
  id: number;
  title: string;
  content: string;
  created_at: string;
  owner_id: number;
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState('task');
  const [loading, setLoading] = useState(true);

  // Form states
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskDeadline, setTaskDeadline] = useState('');
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');

  const USER_ID = 1;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [tRes, nRes] = await Promise.all([
        fetch('/api/tasks/'),
        fetch('/api/notes/')
      ]);
      
      const tData = tRes.ok ? await tRes.json() : [];
      const nData = nRes.ok ? await nRes.json() : [];
      
      setTasks(Array.isArray(tData) ? tData : []);
      setNotes(Array.isArray(nData) ? nData : []);
      setLoading(false);
    } catch (e) {
      console.error("Failed to fetch data:", e);
      setTasks([]);
      setNotes([]);
      setLoading(false);
    }
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch(`/api/users/${USER_ID}/tasks/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: taskTitle,
          description: taskDesc,
          deadline: taskDeadline || null
        })
      });
      setTaskTitle('');
      setTaskDesc('');
      setTaskDeadline('');
      setIsModalOpen(false);
      fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch(`/api/users/${USER_ID}/notes/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: noteTitle,
          content: noteContent
        })
      });
      setNoteTitle('');
      setNoteContent('');
      setIsModalOpen(false);
      fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  const deleteTask = async (id: number) => {
    if (!confirm('Are you sure?')) return;
    await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
    fetchData();
  };

  const deleteNote = async (id: number) => {
    if (!confirm('Are you sure?')) return;
    await fetch(`/api/notes/${id}`, { method: 'DELETE' });
    fetchData();
  };

  const renderSection = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard icon={<CheckSquare />} label="Active Tasks" value={tasks.length.toString()} color="blue" />
              <StatCard icon={<BookOpen />} label="Study Notes" value={notes.length.toString()} color="purple" />
              <StatCard icon={<GraduationCap />} label="Academic Progress" value="85%" color="green" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="glass p-8 rounded-3xl">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Recent Tasks</h2>
                  <button onClick={() => setActiveTab('tasks')} className="text-blue-400 text-sm hover:underline">View all</button>
                </div>
                <div className="space-y-4">
                  {tasks.slice(-3).reverse().map(t => (
                    <div key={t.id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-lg ${t.is_completed ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}>
                          {t.is_completed ? <CheckCircle size={20} /> : <Circle size={20} />}
                        </div>
                        <div>
                          <p className={`font-medium ${t.is_completed ? 'line-through text-gray-500' : ''}`}>{t.title}</p>
                          <p className="text-xs text-gray-400">{t.deadline ? new Date(t.deadline).toLocaleDateString() : 'No deadline'}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="glass p-8 rounded-3xl">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Latest Notes</h2>
                  <button onClick={() => setActiveTab('notes')} className="text-blue-400 text-sm hover:underline">View all</button>
                </div>
                <div className="space-y-4">
                  {notes.slice(-3).reverse().map(n => (
                    <div key={n.id} className="p-4 bg-white/5 rounded-2xl">
                      <h4 className="font-medium">{n.title}</h4>
                      <p className="text-sm text-gray-400 line-clamp-1">{n.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case 'tasks':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-bottom-4 duration-500">
            {tasks.map(t => (
              <div key={t.id} className="glass p-6 rounded-3xl space-y-4 hover:translate-y-[-4px] transition-all">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-lg">{t.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${t.is_completed ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}>
                    {t.is_completed ? 'Completed' : 'Pending'}
                  </span>
                </div>
                <p className="text-gray-400 text-sm">{t.description || 'No description'}</p>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-xs text-gray-500 flex items-center space-x-1">
                    <Calendar size={14} />
                    <span>{t.deadline ? new Date(t.deadline).toLocaleString() : 'N/A'}</span>
                  </span>
                  <button onClick={() => deleteTask(t.id)} className="p-2 hover:bg-red-500/20 hover:text-red-400 rounded-lg transition">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        );
      case 'notes':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-bottom-4 duration-500">
            {notes.map(n => (
              <div key={n.id} className="glass p-6 rounded-3xl space-y-3 hover:translate-y-[-4px] transition-all">
                <h3 className="font-bold text-lg">{n.title}</h3>
                <p className="text-gray-400 text-sm line-clamp-3">{n.content}</p>
                <div className="flex justify-between items-center pt-4 border-t border-white/5">
                  <span className="text-xs text-gray-500">{new Date(n.created_at).toLocaleDateString()}</span>
                  <button onClick={() => deleteNote(n.id)} className="text-gray-500 hover:text-red-400 transition">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#1a1a2e]">
      {/* Sidebar */}
      <aside className="w-64 glass h-screen flex flex-col p-6 space-y-8 hidden md:flex border-r border-white/5">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-blue-500 p-2 rounded-xl shadow-lg shadow-blue-500/20">
            <GraduationCap className="text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">StudentHub</span>
        </div>

        <nav className="flex-1 space-y-2">
          <NavItem active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={<LayoutDashboard size={20} />} label="Dashboard" />
          <NavItem active={activeTab === 'tasks'} onClick={() => setActiveTab('tasks')} icon={<CheckSquare size={20} />} label="Tasks" />
          <NavItem active={activeTab === 'notes'} onClick={() => setActiveTab('notes')} icon={<BookOpen size={20} />} label="Notes" />
        </nav>

        <div className="mt-auto pt-6 border-t border-white/10">
          <div className="flex items-center space-x-3 p-3 glass rounded-2xl">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-bold">JD</div>
            <div>
              <p className="text-sm font-medium">John Doe</p>
              <p className="text-xs text-gray-400">Student</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 h-screen overflow-y-auto p-4 md:p-10">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold">{activeTab === 'dashboard' ? 'Welcome back, John!' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
            <p className="text-gray-400">Manage your tasks and notes efficiently.</p>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 glass rounded-full hover:bg-white/10 transition">
              <Bell size={20} />
            </button>
            <button onClick={() => setIsModalOpen(true)} className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl transition shadow-lg shadow-blue-500/20">
              <Plus size={18} />
              <span>Quick Add</span>
            </button>
          </div>
        </header>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : renderSection()}
      </main>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass w-full max-w-md rounded-3xl p-8 space-y-6"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Add New Entry</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-white/10 rounded-lg">
                  <X size={20} />
                </button>
              </div>
              
              <div className="flex space-x-2 bg-white/5 p-1 rounded-xl">
                <button onClick={() => setModalTab('task')} className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${modalTab === 'task' ? 'bg-blue-600 shadow-lg' : 'hover:bg-white/5'}`}>Task</button>
                <button onClick={() => setModalTab('note')} className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${modalTab === 'note' ? 'bg-blue-600 shadow-lg' : 'hover:bg-white/5'}`}>Note</button>
              </div>

              <form onSubmit={modalTab === 'task' ? handleAddTask : handleAddNote} className="space-y-4">
                {modalTab === 'task' ? (
                  <div className="space-y-4">
                    <input value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} type="text" placeholder="What needs to be done?" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50" required />
                    <textarea value={taskDesc} onChange={(e) => setTaskDesc(e.target.value)} placeholder="Details (optional)" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 h-24 focus:outline-none focus:ring-2 focus:ring-blue-500/50"></textarea>
                    <input value={taskDeadline} onChange={(e) => setTaskDeadline(e.target.value)} type="datetime-local" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <input value={noteTitle} onChange={(e) => setNoteTitle(e.target.value)} type="text" placeholder="Note title" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50" required />
                    <textarea value={noteContent} onChange={(e) => setNoteContent(e.target.value)} placeholder="Content..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 h-32 focus:outline-none focus:ring-2 focus:ring-blue-500/50" required></textarea>
                  </div>
                )}
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-xl font-semibold transition shadow-lg shadow-blue-500/20">Save Entry</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface NavItemProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

function NavItem({ active, onClick, icon, label }: NavItemProps) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center space-x-3 p-3 rounded-xl transition ${active ? 'bg-blue-600/20 text-blue-400 border-l-4 border-blue-500' : 'hover:bg-white/5 text-gray-400'}`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </button>
  );
}

interface StatCardProps {
  icon: React.ReactElement;
  label: string;
  value: string;
  color: 'blue' | 'purple' | 'green';
}

function StatCard({ icon, label, value, color }: StatCardProps) {
  const colors = {
    blue: 'bg-blue-500/20 text-blue-400',
    purple: 'bg-purple-500/20 text-purple-400',
    green: 'bg-green-500/20 text-green-400'
  };
  return (
    <div className="glass p-6 rounded-3xl space-y-2 hover:translate-y-[-4px] transition-all">
      <div className={`${colors[color]} w-10 h-10 rounded-xl flex items-center justify-center`}>
        {React.cloneElement(icon, { size: 24 } as any)}
      </div>
      <p className="text-gray-400 text-sm">{label}</p>
      <h3 className="text-2xl font-bold">{value}</h3>
    </div>
  );
}
