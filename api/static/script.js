const API_BASE = ""; // Relative to origin
let currentTab = "task";
const USER_ID = 1; // Default user for this demo

// Initialize Lucide icons
lucide.createIcons();

// State management
let tasks = [];
let notes = [];

async function init() {
    await ensureUser();
    await fetchData();
    renderAll();
}

async function ensureUser() {
    try {
        // Try to create user 1 if not exists
        await fetch(`${API_BASE}/users/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: "student@example.com", password: "password" })
        });
    } catch (e) {
        // User probably exists or error
    }
}

async function fetchData() {
    try {
        const [tasksRes, notesRes] = await Promise.all([
            fetch(`${API_BASE}/tasks/`),
            fetch(`${API_BASE}/notes/`)
        ]);
        tasks = await tasksRes.json();
        notes = await notesRes.json();
        
        document.getElementById('stat-tasks').textContent = tasks.length;
        document.getElementById('stat-notes').textContent = notes.length;
    } catch (e) {
        console.error("Fetch error:", e);
    }
}

function renderAll() {
    renderDashboard();
    renderTasks();
    renderNotes();
    lucide.createIcons();
}

function renderDashboard() {
    const recentTasks = tasks.slice(-3).reverse();
    const recentNotes = notes.slice(-3).reverse();

    document.getElementById('recent-tasks-list').innerHTML = recentTasks.length ? recentTasks.map(t => `
        <div class="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
            <div class="flex items-center space-x-4">
                <div class="p-2 ${t.is_completed ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'} rounded-lg">
                    <i data-lucide="${t.is_completed ? 'check-circle' : 'circle'}" class="w-5 h-5"></i>
                </div>
                <div>
                    <p class="font-medium ${t.is_completed ? 'line-through text-gray-500' : ''}">${t.title}</p>
                    <p class="text-xs text-gray-400">${t.deadline ? new Date(t.deadline).toLocaleDateString() : 'No deadline'}</p>
                </div>
            </div>
            <button onclick="deleteTask(${t.id})" class="text-gray-500 hover:text-red-400 transition">
                <i data-lucide="trash-2" class="w-4 h-4"></i>
            </button>
        </div>
    `).join('') : '<p class="text-center text-gray-500 py-4">No tasks yet.</p>';

    document.getElementById('recent-notes-list').innerHTML = recentNotes.length ? recentNotes.map(n => `
        <div class="p-4 bg-white/5 rounded-2xl space-y-2">
            <h4 class="font-medium">${n.title}</h4>
            <p class="text-sm text-gray-400 line-clamp-1">${n.content}</p>
        </div>
    `).join('') : '<p class="text-center text-gray-500 py-4">No notes yet.</p>';
}

function renderTasks() {
    document.getElementById('full-tasks-list').innerHTML = tasks.map(t => `
        <div class="glass p-6 rounded-2xl space-y-4 card-hover">
            <div class="flex justify-between items-start">
                <h3 class="font-bold text-lg">${t.title}</h3>
                <span class="px-3 py-1 rounded-full text-xs font-semibold ${t.is_completed ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}">
                    ${t.is_completed ? 'Completed' : 'Pending'}
                </span>
            </div>
            <p class="text-gray-400 text-sm">${t.description || 'No description'}</p>
            <div class="flex justify-between items-center pt-2">
                <span class="text-xs text-gray-500 flex items-center space-x-1">
                    <i data-lucide="calendar" class="w-3 h-3"></i>
                    <span>${t.deadline ? new Date(t.deadline).toLocaleString() : 'N/A'}</span>
                </span>
                <div class="flex space-x-2">
                    <button onclick="deleteTask(${t.id})" class="p-2 hover:bg-red-500/20 hover:text-red-400 rounded-lg transition">
                        <i data-lucide="trash-2" class="w-4 h-4"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function renderNotes() {
    document.getElementById('full-notes-list').innerHTML = notes.map(n => `
        <div class="glass p-6 rounded-2xl space-y-3 card-hover">
            <h3 class="font-bold text-lg">${n.title}</h3>
            <p class="text-gray-400 text-sm line-clamp-3">${n.content}</p>
            <div class="flex justify-between items-center pt-4 border-t border-white/5">
                <span class="text-xs text-gray-500">${new Date(n.created_at).toLocaleDateString()}</span>
                <button onclick="deleteNote(${n.id})" class="text-gray-500 hover:text-red-400 transition">
                    <i data-lucide="trash-2" class="w-4 h-4"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// Navigation
function showSection(section) {
    const sections = ['dashboard', 'tasks', 'notes'];
    sections.forEach(s => {
        document.getElementById(`${s}-section`).classList.add('hidden');
        document.getElementById(`nav-${s}`).classList.remove('active-tab');
    });
    
    document.getElementById(`${section}-section`).classList.remove('hidden');
    document.getElementById(`nav-${section}`).classList.add('active-tab');
    document.getElementById('section-title').textContent = section.charAt(0).toUpperCase() + section.slice(1);
    
    if (section === 'dashboard') {
        document.getElementById('section-title').textContent = "Welcome back, John!";
    }
}

// Modal handling
function openModal() {
    document.getElementById('modal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('modal').classList.add('hidden');
}

function setModalTab(tab) {
    currentTab = tab;
    document.getElementById('tab-task').classList.toggle('bg-blue-600', tab === 'task');
    document.getElementById('tab-note').classList.toggle('bg-blue-600', tab === 'note');
    document.getElementById('task-fields').classList.toggle('hidden', tab !== 'task');
    document.getElementById('note-fields').classList.toggle('hidden', tab !== 'note');
}

// Form submission
document.getElementById('add-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (currentTab === 'task') {
        const payload = {
            title: document.getElementById('task-title').value,
            description: document.getElementById('task-desc').value,
            deadline: document.getElementById('task-deadline').value || null
        };
        await fetch(`${API_BASE}/users/${USER_ID}/tasks/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
    } else {
        const payload = {
            title: document.getElementById('note-title').value,
            content: document.getElementById('note-content').value
        };
        await fetch(`${API_BASE}/users/${USER_ID}/notes/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
    }
    
    closeModal();
    e.target.reset();
    await fetchData();
    renderAll();
});

async function deleteTask(id) {
    if (!confirm("Are you sure?")) return;
    await fetch(`${API_BASE}/tasks/${id}`, { method: 'DELETE' });
    await fetchData();
    renderAll();
}

async function deleteNote(id) {
    if (!confirm("Are you sure?")) return;
    await fetch(`${API_BASE}/notes/${id}`, { method: 'DELETE' });
    await fetchData();
    renderAll();
}

// Start the app
init();
