import { supabase } from './lib/supabase.js';

// DOM Elements - Auth
const loginOverlay = document.getElementById('login-overlay');
const loginView = document.getElementById('login-view');
const registerView = document.getElementById('register-view');
const showRegisterBtn = document.getElementById('show-register');
const showLoginBtn = document.getElementById('show-login');

const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');
const logoutBtn = document.getElementById('logout-btn');

const initRegForm = document.getElementById('initial-register-form');
const initRegError = document.getElementById('init-reg-error');
const initRegSuccess = document.getElementById('init-reg-success');

const registerUserForm = document.getElementById('register-user-form');
const regError = document.getElementById('reg-error');
const regSuccess = document.getElementById('reg-success');

// DOM Elements - App
const ticketList = document.getElementById('ticket-list');
const ticketTableBody = document.getElementById('ticket-table-body');
const inventoryList = document.getElementById('inventory-list');
const sidebarNav = document.getElementById('sidebar-nav');
const bottomNav = document.getElementById('bottom-nav');

// Stats Elements
const statOpen = document.getElementById('stat-open');
const statProgress = document.getElementById('stat-progress');
const statWaiting = document.getElementById('stat-waiting');
const statFinished = document.getElementById('stat-finished');

const countOpen = document.getElementById('count-open');
const countProgress = document.getElementById('count-progress');
const countWaiting = document.getElementById('count-waiting');
const countFinished = document.getElementById('count-finished');

// Modal Elements
const openModalBtn = document.getElementById('open-modal');
const closeModalBtn = document.getElementById('close-modal');
const cancelModalBtn = document.getElementById('cancel-modal');
const modalOverlay = document.getElementById('modal-overlay');
const ticketForm = document.getElementById('ticket-form');

const detailsModalOverlay = document.getElementById('details-modal-overlay');
const closeDetailsModalBtn = document.getElementById('close-details-modal');
const closeDetailsBtn = document.getElementById('close-details-btn');
const detailsContent = document.getElementById('details-content');
const detailsActions = document.getElementById('details-actions');

let allTickets = [];
let allInventory = [];
let currentCategory = 'Todos';
let currentTableCategory = 'Todos';
let currentPage = 'dashboard';
let currentSelectedTicketId = null;

// Chart Instances
let chartStatus = null;
let chartCategory = null;
let chartPriority = null;

// Helper to format date
function formatRelativeTime(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMinutes = Math.floor((now - date) / (1000 * 60));

  if (diffInMinutes < 60) return `Há ${diffInMinutes} min`;
  if (diffInMinutes < 1440) return `Há ${Math.floor(diffInMinutes / 60)} horas`;
  return date.toLocaleDateString('pt-BR');
}

// Navigation Logic
function switchPage(pageId) {
  currentPage = pageId;
  const targetId = pageId;
  document.querySelectorAll('.nav-item, .bottom-nav__item').forEach(el => {
    el.classList.toggle('nav-item--active', el.getAttribute('data-page') === pageId);
    el.classList.toggle('bottom-nav__item--active', el.getAttribute('data-page') === pageId);
  });
  document.querySelectorAll('.page').forEach(page => {
    page.classList.toggle('page--active', page.id === `page-${targetId}`);
  });
  if (pageId === 'inventory') loadInventoryData();
  if (pageId === 'dashboard' || pageId === 'tickets') loadDashboardData();
}

sidebarNav.addEventListener('click', (e) => {
  const item = e.target.closest('[data-page]');
  if (item) { e.preventDefault(); switchPage(item.getAttribute('data-page')); }
});

bottomNav.addEventListener('click', (e) => {
  const item = e.target.closest('[data-page]');
  if (item) { e.preventDefault(); switchPage(item.getAttribute('data-page')); }
});

// Render Ticket Card
function createTicketCard(ticket) {
  const card = document.createElement('article');
  card.className = 'ticket-card';
  const priorityClass = ticket.priority === 'Crítica' ? 'tag--priority-high' : '';
  const categoryClass = `tag--category-${ticket.category?.toLowerCase() || 'it'}`;
  
  let statusClass = '';
  if (ticket.status === 'Em Atendimento') statusClass = 'tag--status-progress';
  if (ticket.status === 'Pausado') statusClass = 'tag--status-waiting';
  if (ticket.status === 'Concluído') statusClass = 'tag--status-finished';

  card.innerHTML = `
    <div class="ticket-card__header">
      <div><span class="text-code">#${ticket.id.slice(0, 8).toUpperCase()}</span><h3 class="text-headline-sm">${ticket.title}</h3></div>
      <span class="tag ${priorityClass}">${ticket.priority}</span>
    </div>
    <div class="ticket-card__tags">
      <span class="tag ${categoryClass}">${ticket.category}</span>
      <span class="tag ${statusClass}">${ticket.status}</span>
    </div>
    <p class="text-body-sm">${ticket.description}</p>
    <div class="ticket-card__footer">
      <div class="text-body-sm"><span class="material-symbols-outlined">schedule</span>${formatRelativeTime(ticket.created_at)}</div>
      <div class="ticket-card__actions">
        <button class="btn btn--ghost action-details" data-id="${ticket.id}">Detalhes</button>
        <button class="btn btn--primary action-assign" data-id="${ticket.id}" ${ticket.status !== 'Pendente' ? 'disabled' : ''}>
          ${ticket.status === 'Pendente' ? 'Atribuir' : ticket.status}
        </button>
      </div>
    </div>
  `;
  return card;
}

// Render Ticket Table Row
function createTicketTableRow(ticket) {
  const tr = document.createElement('tr');
  
  const priorityClass = ticket.priority === 'Crítica' ? 'tag--priority-high' : '';
  const categoryClass = `tag--category-${ticket.category?.toLowerCase() || 'it'}`;
  
  let statusClass = '';
  if (ticket.status === 'Em Atendimento') statusClass = 'tag--status-progress';
  if (ticket.status === 'Pausado') statusClass = 'tag--status-waiting';
  if (ticket.status === 'Concluído') statusClass = 'tag--status-finished';

  tr.innerHTML = `
    <td class="text-code">#${ticket.id.slice(0, 8).toUpperCase()}</td>
    <td class="text-body-md" style="font-weight: 500;">${ticket.title}</td>
    <td><span class="tag ${categoryClass}">${ticket.category}</span></td>
    <td><span class="tag ${priorityClass}">${ticket.priority}</span></td>
    <td><span class="tag ${statusClass}">${ticket.status}</span></td>
    <td class="text-body-sm">${new Date(ticket.created_at).toLocaleDateString('pt-BR')}</td>
    <td>
      <button class="btn btn--ghost action-details" data-id="${ticket.id}" style="padding: 4px 8px; min-width: auto; min-height: auto;">Detalhes</button>
    </td>
  `;
  return tr;
}

// Render Inventory Card
function createInventoryCard(item) {
  const card = document.createElement('div');
  card.className = 'stat-card';
  card.style.flex = '1 1 300px';
  card.innerHTML = `
    <div class="stat-card__header">
      <span class="material-symbols-outlined">devices</span>
      <span class="badge ${item.status === 'Ativo' ? 'badge--primary' : 'badge--error'}">${item.status}</span>
    </div>
    <div class="stat-card__content">
      <p class="text-headline-sm">${item.name}</p>
      <p class="text-body-sm stat-card__label">${item.location}</p>
    </div>
  `;
  return card;
}

// Data Loaders
async function loadDashboardData() {
  try {
    const { data, error } = await supabase.from('tickets').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    allTickets = data;
    updateStats();
    renderTicketList();
    renderTicketTable();
    renderReports();
    // Update details if modal is open
    if (currentSelectedTicketId && detailsModalOverlay.classList.contains('modal-overlay--active')) {
      showDetails(currentSelectedTicketId);
    }
  } catch (err) { console.error(err); }
}

async function loadInventoryData() {
  try {
    const { data, error } = await supabase.from('inventory').select('*').order('name');
    if (error) throw error;
    allInventory = data;
    inventoryList.innerHTML = '';
    data.forEach(item => inventoryList.appendChild(createInventoryCard(item)));
  } catch (err) { console.error(err); }
}

function updateStats() {
  const stats = {
    open: allTickets.filter(t => t.status === 'Pendente').length,
    progress: allTickets.filter(t => t.status === 'Em Atendimento').length,
    waiting: allTickets.filter(t => t.status === 'Pausado').length,
    finished: allTickets.filter(t => t.status === 'Concluído').length
  };
  statOpen.textContent = stats.open; countOpen.textContent = stats.open;
  statProgress.textContent = stats.progress; countProgress.textContent = stats.progress;
  statWaiting.textContent = stats.waiting; countWaiting.textContent = stats.waiting;
  statFinished.textContent = stats.finished; countFinished.textContent = stats.finished;
}

function renderTicketList() {
  const filtered = currentCategory === 'Todos' ? allTickets : allTickets.filter(t => t.category === currentCategory);
  ticketList.innerHTML = '';
  if (filtered.length === 0) {
    ticketList.innerHTML = '<p class="text-body-md" style="grid-column: 1/-1; text-align: center; padding: var(--space-lg);">Nenhum chamado encontrado.</p>';
  } else {
    filtered.forEach(t => ticketList.appendChild(createTicketCard(t)));
  }
}

function renderTicketTable() {
  const filtered = currentTableCategory === 'Todos' ? allTickets : allTickets.filter(t => t.category === currentTableCategory);
  ticketTableBody.innerHTML = '';
  if (filtered.length === 0) {
    ticketTableBody.innerHTML = '<tr><td colspan="7" class="text-body-md" style="text-align: center;">Nenhum chamado encontrado.</td></tr>';
  } else {
    filtered.forEach(t => ticketTableBody.appendChild(createTicketTableRow(t)));
  }
}

function renderReports() {
  if (allTickets.length === 0) return;

  // KPIs
  const total = allTickets.length;
  const resolved = allTickets.filter(t => t.status === 'Concluído').length;
  const resolvedPct = total > 0 ? Math.round((resolved / total) * 100) : 0;
  const critical = allTickets.filter(t => t.priority === 'Crítica').length;

  document.getElementById('rep-total').textContent = total;
  document.getElementById('rep-resolved-pct').textContent = resolvedPct + '%';
  document.getElementById('rep-critical').textContent = critical;

  // Process Data for Charts
  const countsByStatus = { 'Pendente': 0, 'Em Atendimento': 0, 'Pausado': 0, 'Concluído': 0 };
  const countsByCategory = { 'TI': 0, 'Elétrica': 0, 'Predial': 0, 'Segurança': 0, 'Telecom': 0 };
  const countsByPriority = { 'Baixa': 0, 'Média': 0, 'Alta': 0, 'Crítica': 0 };

  allTickets.forEach(t => {
    if (countsByStatus[t.status] !== undefined) countsByStatus[t.status]++;
    if (countsByCategory[t.category] !== undefined) countsByCategory[t.category]++;
    if (countsByPriority[t.priority] !== undefined) countsByPriority[t.priority]++;
  });

  const chartOptions = { responsive: true, maintainAspectRatio: false };

  // Status Chart (Doughnut)
  const ctxStatus = document.getElementById('chart-status').getContext('2d');
  if (chartStatus) chartStatus.destroy();
  chartStatus = new Chart(ctxStatus, {
    type: 'doughnut',
    data: {
      labels: Object.keys(countsByStatus),
      datasets: [{
        data: Object.values(countsByStatus),
        backgroundColor: ['#565e74', '#2563EB', '#EAB308', '#16A34A'],
        borderWidth: 0
      }]
    },
    options: chartOptions
  });

  // Category Chart (Polar Area or Pie)
  const ctxCat = document.getElementById('chart-category').getContext('2d');
  if (chartCategory) chartCategory.destroy();
  chartCategory = new Chart(ctxCat, {
    type: 'pie',
    data: {
      labels: Object.keys(countsByCategory),
      datasets: [{
        data: Object.values(countsByCategory),
        backgroundColor: ['#0F172A', '#334155', '#475569', '#64748b', '#94a3b8'],
        borderWidth: 0
      }]
    },
    options: chartOptions
  });

  // Priority Chart (Bar)
  const ctxPrio = document.getElementById('chart-priority').getContext('2d');
  if (chartPriority) chartPriority.destroy();
  chartPriority = new Chart(ctxPrio, {
    type: 'bar',
    data: {
      labels: Object.keys(countsByPriority),
      datasets: [{
        label: 'Chamados',
        data: Object.values(countsByPriority),
        backgroundColor: ['#94a3b8', '#3b82f6', '#f59e0b', '#ef4444'],
        borderRadius: 4
      }]
    },
    options: {
      ...chartOptions,
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true, ticks: { precision: 0 } } }
    }
  });
}

// Event Listeners
document.getElementById('filter-group').addEventListener('click', (e) => {
  const btn = e.target.closest('.filter-btn');
  if (btn) {
    document.querySelectorAll('#filter-group .filter-btn').forEach(b => b.classList.remove('filter-btn--active'));
    btn.classList.add('filter-btn--active');
    currentCategory = btn.getAttribute('data-category');
    renderTicketList();
  }
});

document.getElementById('table-filter-group').addEventListener('click', (e) => {
  const btn = e.target.closest('.filter-btn');
  if (btn) {
    document.querySelectorAll('#table-filter-group .filter-btn').forEach(b => b.classList.remove('filter-btn--active'));
    btn.classList.add('filter-btn--active');
    currentTableCategory = btn.getAttribute('data-category');
    renderTicketTable();
  }
});

// Modal Logic
function toggleModal(show) { modalOverlay.classList.toggle('modal-overlay--active', show); if (!show) ticketForm.reset(); }
openModalBtn.addEventListener('click', () => toggleModal(true));
closeModalBtn.addEventListener('click', () => toggleModal(false));
cancelModalBtn.addEventListener('click', () => toggleModal(false));

ticketForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = {
    title: document.getElementById('title').value,
    category: document.getElementById('category').value,
    priority: document.getElementById('priority').value,
    description: document.getElementById('description').value,
    status: 'Pendente'
  };
  const { error } = await supabase.from('tickets').insert([formData]);
  if (!error) toggleModal(false);
});

// Action Handlers
async function updateTicketStatus(id, newStatus) {
  try {
    const { error } = await supabase.from('tickets').update({ status: newStatus }).eq('id', id);
    if (error) throw error;
  } catch (err) {
    alert('Erro ao atualizar status: ' + err.message);
  }
}

function showDetails(ticketId) {
  currentSelectedTicketId = ticketId;
  const ticket = allTickets.find(t => t.id === ticketId);
  if (!ticket) return;

  detailsContent.innerHTML = `
    <div class="details-row"><span>ID</span><span>#${ticket.id.toUpperCase()}</span></div>
    <div class="details-row"><span>Título</span><span>${ticket.title}</span></div>
    <div class="details-row"><span>Status</span><span class="tag">${ticket.status}</span></div>
    <div class="details-row"><span>Categoria</span><span>${ticket.category}</span></div>
    <div class="details-row"><span>Prioridade</span><span>${ticket.priority}</span></div>
    <div class="details-row"><span>Criado em</span><span>${new Date(ticket.created_at).toLocaleString('pt-BR')}</span></div>
    <div style="margin-top: var(--space-md);">
      <p class="text-label-md" style="color: var(--on-surface-variant); margin-bottom: 4px;">Descrição</p>
      <p class="text-body-md">${ticket.description}</p>
    </div>
  `;
  detailsModalOverlay.classList.add('modal-overlay--active');
}

ticketList.addEventListener('click', handleTicketAction);
ticketTableBody.addEventListener('click', handleTicketAction);

async function handleTicketAction(e) {
  const detailsBtn = e.target.closest('.action-details');
  const assignBtn = e.target.closest('.action-assign');
  
  if (detailsBtn) {
    showDetails(detailsBtn.getAttribute('data-id'));
  }
  
  if (assignBtn) {
    const id = assignBtn.getAttribute('data-id');
    await updateTicketStatus(id, 'Em Atendimento');
  }
}

detailsActions.addEventListener('click', async (e) => {
  const btn = e.target.closest('[data-status]');
  if (btn && currentSelectedTicketId) {
    const newStatus = btn.getAttribute('data-status');
    await updateTicketStatus(currentSelectedTicketId, newStatus);
    // Modal updates automatically via real-time subscription calling loadDashboardData
  }
});

closeDetailsModalBtn.addEventListener('click', () => { detailsModalOverlay.classList.remove('modal-overlay--active'); currentSelectedTicketId = null; });
closeDetailsBtn.addEventListener('click', () => { detailsModalOverlay.classList.remove('modal-overlay--active'); currentSelectedTicketId = null; });

// Auth Logic
async function checkAuth() {
  const { data: { session } } = await supabase.auth.getSession();
  if (session) {
    loginOverlay.classList.add('login-overlay--hidden');
    loadDashboardData();
  } else {
    loginOverlay.classList.remove('login-overlay--hidden');
  }
}

supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN') {
    loginOverlay.classList.add('login-overlay--hidden');
    loadDashboardData();
  } else if (event === 'SIGNED_OUT') {
    loginOverlay.classList.remove('login-overlay--hidden');
    // Clear data
    ticketList.innerHTML = '';
    inventoryList.innerHTML = '';
  }
});



loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  loginError.style.display = 'none';
  const loginBtn = document.getElementById('login-btn');
  loginBtn.textContent = 'Entrando...';
  loginBtn.disabled = true;

  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  loginBtn.textContent = 'Entrar';
  loginBtn.disabled = false;

  if (error) {
    if (error.message.includes('Email not confirmed')) {
      loginError.textContent = '⚠️ E-mail não confirmado. Verifique sua caixa de entrada ou desative a confirmação de e-mail no painel Supabase.';
    } else if (error.message.includes('Invalid login credentials')) {
      loginError.textContent = '❌ E-mail ou senha incorretos.';
    } else {
      loginError.textContent = '❌ Erro: ' + error.message;
    }
    loginError.style.display = 'block';
  } else {
    loginForm.reset();
  }
});

initRegForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  initRegError.style.display = 'none';
  initRegSuccess.style.display = 'none';

  const name = document.getElementById('init-reg-name').value;
  const email = document.getElementById('init-reg-email').value;
  const password = document.getElementById('init-reg-password').value;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name,
        role: 'Admin' // Usuário inicial ganha Admin por padrão
      }
    }
  });

  if (error) {
    initRegError.textContent = error.message;
    initRegError.style.display = 'block';
  } else {
    initRegSuccess.style.display = 'block';
    initRegForm.reset();
    setTimeout(() => {
      // Volta para a view de login usando o onclick inline
      registerView.style.display = 'none';
      loginView.style.display = 'block';
      initRegSuccess.style.display = 'none';
    }, 2000);
  }
});

logoutBtn.addEventListener('click', async () => {
  await supabase.auth.signOut();
});

registerUserForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  regError.style.display = 'none';
  regSuccess.style.display = 'none';
  
  const name = document.getElementById('reg-name').value;
  const email = document.getElementById('reg-email').value;
  const password = document.getElementById('reg-password').value;
  const role = document.getElementById('reg-role').value;

  // Usa o Supabase Auth para cadastrar. 
  // Nota: Isso pode enviar um email de confirmação dependendo da config do Supabase.
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name,
        role: role
      }
    }
  });

  if (error) {
    regError.textContent = 'Erro ao cadastrar: ' + error.message;
    regError.style.display = 'block';
  } else {
    regSuccess.style.display = 'block';
    registerUserForm.reset();
    setTimeout(() => { regSuccess.style.display = 'none'; }, 3000);
  }
});

// Init
checkAuth();
supabase.channel('public:tickets').on('postgres_changes', { event: '*', schema: 'public', table: 'tickets' }, loadDashboardData).subscribe();
