// --- State Management ---
let tasks = JSON.parse(localStorage.getItem('quantum_tasks')) || [];
let activityLog = JSON.parse(localStorage.getItem('quantum_activity')) || [];

// --- Theme & Export Logic ---
const themeToggleBtn = document.getElementById('theme-toggle');
let currentTheme = localStorage.getItem('quantum_theme') || 'dark';

if (currentTheme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
    themeToggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i> Toggle Theme';
}

themeToggleBtn.addEventListener('click', () => {
    if (document.documentElement.getAttribute('data-theme') === 'light') {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('quantum_theme', 'dark');
        themeToggleBtn.innerHTML = '<i class="fa-solid fa-moon"></i> Toggle Theme';
        currentTheme = 'dark';
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('quantum_theme', 'light');
        themeToggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i> Toggle Theme';
        currentTheme = 'light';
    }
    renderCharts(); 
});

document.getElementById('btn-export').addEventListener('click', () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ tasks, activityLog }));
    const downloadNode = document.createElement('a');
    downloadNode.setAttribute("href", dataStr);
    downloadNode.setAttribute("download", "quantum_backup.json");
    document.body.appendChild(downloadNode); 
    downloadNode.click();
    downloadNode.remove();
    showToast("💾 Data successfully exported.");
});

document.getElementById('btn-import-trigger').addEventListener('click', () => document.getElementById('file-import').click());
document.getElementById('file-import').addEventListener('change', function(e) {
    const reader = new FileReader();
    reader.onload = function(event) {
        try {
            const data = JSON.parse(event.target.result);
            if(data.tasks && data.activityLog) {
                tasks = data.tasks; activityLog = data.activityLog;
                saveAndRender(); showToast("📂 Data successfully restored!");
            }
        } catch (err) { alert("Invalid backup file."); }
    };
    reader.readAsText(e.target.files[0]);
    this.value = '';
});

// --- Charts ---
let donutChartInst = null;
let barChartInst = null;
function renderCharts() {
    Chart.defaults.color = currentTheme === 'light' ? '#64748b' : '#a1a1aa';
    Chart.defaults.font.family = 'Inter';

    const todo = tasks.filter(t => t.status === 'todo').length;
    const progress = tasks.filter(t => t.status === 'progress').length;
    const done = tasks.filter(t => t.status === 'done').length;

    const high = tasks.filter(t => t.priority === 'High' && t.status !== 'done').length;
    const med = tasks.filter(t => t.priority === 'Medium' && t.status !== 'done').length;
    const low = tasks.filter(t => t.priority === 'Low' && t.status !== 'done').length;

    if (donutChartInst) donutChartInst.destroy();
    donutChartInst = new Chart(document.getElementById('donutChart').getContext('2d'), {
        type: 'doughnut',
        data: { labels: ['To Do', 'In Progress', 'Done'], datasets: [{ data: [todo, progress, done], backgroundColor: ['#6366f1', '#f59e0b', '#10b981'], borderWidth: 0 }] },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }
    });

    if (barChartInst) barChartInst.destroy();
    barChartInst = new Chart(document.getElementById('barChart').getContext('2d'), {
        type: 'bar',
        data: { labels: ['High', 'Medium', 'Low'], datasets: [{ label: 'Pending by Priority', data: [high, med, low], backgroundColor: ['#ef4444', '#f59e0b', '#10b981'], borderRadius: 6 }] },
        options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } } }
    });
}

// --- Pomodoro ---
let pomoInterval, pomoTime = 25 * 60, isPomoRunning = false;
function updatePomoDisplay() {
    document.getElementById('pomo-time').textContent = `${Math.floor(pomoTime / 60).toString().padStart(2, '0')}:${(pomoTime % 60).toString().padStart(2, '0')}`;
}
document.getElementById('btn-pomo-start').addEventListener('click', function() {
    if (isPomoRunning) { clearInterval(pomoInterval); this.innerHTML = '<i class="fa-solid fa-play"></i>'; document.getElementById('pomo-status').textContent = 'Paused'; }
    else {
        pomoInterval = setInterval(() => {
            if (pomoTime > 0) { pomoTime--; updatePomoDisplay(); }
            else { clearInterval(pomoInterval); showToast("🍅 Break time!"); document.getElementById('pomo-status').textContent = 'Break'; this.innerHTML = '<i class="fa-solid fa-play"></i>'; isPomoRunning = false; pomoTime = 5 * 60; updatePomoDisplay(); }
        }, 1000);
        this.innerHTML = '<i class="fa-solid fa-pause"></i>'; document.getElementById('pomo-status').textContent = 'Focusing...';
    }
    isPomoRunning = !isPomoRunning;
});
document.getElementById('btn-pomo-reset').addEventListener('click', () => { clearInterval(pomoInterval); isPomoRunning = false; pomoTime = 25 * 60; updatePomoDisplay(); document.getElementById('btn-pomo-start').innerHTML = '<i class="fa-solid fa-play"></i>'; document.getElementById('pomo-status').textContent = 'Ready'; });

// --- New Task Modal & Advanced Inputs ---
function getBase64(file) {
    return new Promise((resolve, reject) => {
        if(!file) return resolve(null);
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

function initModals() {
    const container = document.getElementById('modal-container');
    container.innerHTML = `
        <div id="task-modal" class="modal hidden">
            <div class="modal-content bento-card">
                <div class="modal-header">
                    <h2>Deploy Advanced Task</h2>
                    <button type="button" class="btn-close-activity" onclick="document.getElementById('task-modal').classList.add('hidden')"><i class="fa-solid fa-xmark"></i></button>
                </div>
                <form id="task-form">
                    <input type="text" id="task-title" class="modern-select w-100" style="margin-bottom:15px;" placeholder="Task Objective" required>
                    
                    <div style="font-size: 0.75rem; color: var(--text-secondary); margin-bottom: 5px;">Supports Markdown (**, *, -)</div>
                    <textarea id="task-desc" class="modern-select w-100" style="margin-bottom:15px; resize:vertical; min-height:80px;" placeholder="Task Description..."></textarea>
                    
                    <input type="text" id="task-subtasks" class="modern-select w-100" style="margin-bottom:15px;" placeholder="Subtasks (separate with commas)">
                    
                    <div style="font-size: 0.75rem; color: var(--text-secondary); margin-bottom: 5px;">Attach Image (Optional)</div>
                    <input type="file" id="task-image" accept="image/*" class="modern-select w-100" style="margin-bottom:15px; padding: 5px;">

                    <input type="date" id="task-date" class="modern-select w-100" style="margin-bottom:15px;" required>
                    <select id="task-priority" class="modern-select w-100" style="margin-bottom:15px;">
                        <option value="High">High Priority</option>
                        <option value="Medium" selected>Medium Priority</option>
                        <option value="Low">Low Priority</option>
                    </select>
                    <button type="submit" class="btn-primary w-100">Initialize Task</button>
                </form>
            </div>
        </div>
    `;

    document.getElementById('task-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const title = document.getElementById('task-title').value;
        const desc = document.getElementById('task-desc').value;
        const date = document.getElementById('task-date').value;
        const priority = document.getElementById('task-priority').value;
        
        // Parse Subtasks
        const subtasksInput = document.getElementById('task-subtasks').value;
        const subtasks = subtasksInput ? subtasksInput.split(',').map(s => ({ text: s.trim(), done: false })) : [];

        // Parse Image to Base64
        const imageFile = document.getElementById('task-image').files[0];
        const base64Image = await getBase64(imageFile);

        const newTask = { id: 'tsk_' + Date.now(), title, desc, subtasks, image: base64Image, date, priority, status: 'todo' };
        tasks.push(newTask); logActivity(`Created task: ${title}`); saveAndRender();
        
        e.target.reset(); document.getElementById('task-modal').classList.add('hidden');
    });
}

// --- Kanban & UI Rendering ---
const columns = { todo: document.getElementById('col-todo'), progress: document.getElementById('col-progress'), done: document.getElementById('col-done') };

function renderBoard() {
    Object.values(columns).forEach(col => { const header = col.querySelector('.col-title'); col.innerHTML = ''; col.appendChild(header); });
    const filter = document.getElementById('filter-select').value;
    let counts = { todo: 0, progress: 0, done: 0 };

    tasks.forEach(task => {
        if (filter !== 'All' && task.priority !== filter) return;
        counts[task.status]++;
        
        const card = document.createElement('div');
        card.className = `task-card`; card.draggable = true; card.id = task.id; card.setAttribute('data-priority', task.priority);

        // Subtasks HTML
        let subtasksHTML = '';
        if (task.subtasks && task.subtasks.length > 0) {
            const completedSubs = task.subtasks.filter(s => s.done).length;
            const progressPercent = (completedSubs / task.subtasks.length) * 100;
            
            subtasksHTML = `<div class="subtasks-container">
                <div class="subtask-progress-bar"><div class="subtask-progress-fill" style="width: ${progressPercent}%"></div></div>`;
            
            task.subtasks.forEach((sub, index) => {
                subtasksHTML += `
                <div class="subtask-item ${sub.done ? 'done' : ''}" onclick="toggleSubtask('${task.id}', ${index})">
                    <input type="checkbox" ${sub.done ? 'checked' : ''} onclick="event.stopPropagation(); toggleSubtask('${task.id}', ${index})">
                    <span>${sub.text}</span>
                </div>`;
            });
            subtasksHTML += `</div>`;
        }

        // Action Buttons
        let actions = '';
        if (task.status === 'todo') actions += `<button class="btn-icon progress" onclick="updateStatus('${task.id}', 'progress')" title="Start Progress"><i class="fa-solid fa-play"></i></button>`;
        if (task.status !== 'done') actions += `<button class="btn-icon complete" onclick="updateStatus('${task.id}', 'done')" title="Mark as Done"><i class="fa-solid fa-check"></i></button>`;
        actions += `<button class="btn-icon delete" onclick="deleteTask('${task.id}')" title="Delete Task"><i class="fa-solid fa-trash"></i></button>`;

        card.innerHTML = `
            <div class="task-header">
                <div class="task-title" style="${task.status === 'done' ? 'text-decoration:line-through; color:var(--text-secondary);' : ''}">${task.title}</div>
            </div>
            ${task.image ? `<img src="${task.image}" class="task-attachment">` : ''}
            ${task.desc ? `<div class="task-desc">${marked.parse(task.desc)}</div>` : ''}
            ${subtasksHTML}
            <div class="task-date"><i class="fa-regular fa-calendar"></i> ${task.date}</div>
            <div class="task-actions">${actions}</div>
        `;

        card.addEventListener('dragstart', handleDragStart); card.addEventListener('dragend', handleDragEnd);
        columns[task.status].appendChild(card);
    });

    document.getElementById('count-todo').innerText = counts.todo; document.getElementById('count-progress').innerText = counts.progress; document.getElementById('count-done').innerText = counts.done;
    document.getElementById('stat-total').innerText = tasks.length; document.getElementById('stat-pending').innerText = tasks.length - counts.done;
    renderCharts();
}

// Global functions for inline HTML events
window.toggleSubtask = function(taskId, subIndex) {
    const task = tasks.find(t => t.id === taskId);
    if(task && task.subtasks) {
        task.subtasks[subIndex].done = !task.subtasks[subIndex].done;
        saveAndRender();
    }
};

window.updateStatus = function(id, newStatus) {
    const task = tasks.find(t => t.id === id);
    if(task) { task.status = newStatus; logActivity(`Moved to ${newStatus}: ${task.title}`); saveAndRender(); if(newStatus==='done') showToast(`✔ Task Completed!`); }
};

window.deleteTask = function(id) {
    if(confirm("Delete this task?")) { tasks = tasks.filter(t => t.id !== id); logActivity(`Deleted task.`); saveAndRender(); }
};

function saveAndRender() { localStorage.setItem('quantum_tasks', JSON.stringify(tasks)); localStorage.setItem('quantum_activity', JSON.stringify(activityLog)); renderBoard(); }

// --- Drag & Drop ---
let draggedItem = null;
function handleDragStart() { draggedItem = this; setTimeout(() => this.classList.add('dragging'), 0); }
function handleDragEnd() { this.classList.remove('dragging'); draggedItem = null; }
Object.values(columns).forEach(col => {
    col.addEventListener('dragover', e => e.preventDefault());
    col.addEventListener('drop', e => {
        const status = col.getAttribute('data-status'); const task = tasks.find(t => t.id === draggedItem.id);
        if(task && task.status !== status) { task.status = status; logActivity(`Moved task to ${status}`); saveAndRender(); }
    });
});

// --- Utilities ---
function logActivity(msg) { const time = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}); activityLog.unshift({ msg, time }); if(activityLog.length > 30) activityLog.pop(); }
document.getElementById('btn-activity').addEventListener('click', (e) => { e.preventDefault(); document.getElementById('activity-list').innerHTML = activityLog.map(log => `<div class="activity-item"><div class="activity-time">${log.time}</div><div class="activity-text">${log.msg}</div></div>`).join(''); document.getElementById('activity-modal').classList.remove('hidden'); });
function showToast(msg) { const toast = document.createElement('div'); toast.className = 'toast'; toast.innerHTML = `<i class="fa-solid fa-bell"></i> ${msg}`; document.getElementById('toast-container').appendChild(toast); setTimeout(() => toast.remove(), 4000); }

// Init
document.getElementById('btn-new-task').addEventListener('click', () => document.getElementById('task-modal').classList.remove('hidden'));
document.getElementById('filter-select').addEventListener('change', renderBoard);
initModals(); renderBoard();