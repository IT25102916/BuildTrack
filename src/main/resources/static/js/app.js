/**
 * Main Application Logic - Includes Auth & Dashboards
 */

document.addEventListener('DOMContentLoaded', () => {
    // ── Auth Elements ──
    const loginModal = document.getElementById('login-modal');
    const loginForm = document.getElementById('login-form');
    const loginError = document.getElementById('login-error');
    const btnLogout = document.getElementById('btn-logout');

    // ── Documents Elements ──
    const documentsTableBody = document.getElementById('documents-table-body');
    const documentsLoadingSpinner = document.getElementById('loading-spinner-documents');
    const documentsEmptyState = document.getElementById('empty-state-documents');
    
    // ── Global State ──
    let currentUser = null;
    let projects = [];
    let team = [];
    let documentsList = [];
    let isSubmitting = false;

    // ── Navigation Elements ──
    const navDashboard = document.getElementById('nav-dashboard');
    const navProjects = document.getElementById('nav-projects');
    const navTasks = document.getElementById('nav-tasks');
    const navDailyLogs = document.getElementById('nav-daily-logs');
    const navPunch = document.getElementById('nav-punch');
    const navSafety = document.getElementById('nav-safety');
    const navRfis = document.getElementById('nav-rfis');
    const navTeam = document.getElementById('nav-team');
    const navDocuments = document.getElementById('nav-documents');
    const navAnalytics = document.getElementById('nav-analytics');
    const navContractors = document.getElementById('nav-contractors');
    const navReports = document.getElementById('nav-reports');
    const navSettings = document.getElementById('nav-settings');
    const navFinance = document.getElementById('nav-finance');
    const navInventory = document.getElementById('nav-inventory');
    
    const viewDashboard = document.getElementById('view-dashboard');
    const viewProjects = document.getElementById('view-projects');
    const viewTasks = document.getElementById('view-tasks');
    const viewDailyLogs = document.getElementById('view-daily-logs');
    const viewPunch = document.getElementById('view-punch');
    const viewSafety = document.getElementById('view-safety');
    const viewRfis = document.getElementById('view-rfis');
    const viewTeam = document.getElementById('view-team');
    const viewDocuments = document.getElementById('view-documents');
    const viewAnalytics = document.getElementById('view-analytics');
    const viewContractors = document.getElementById('view-contractors');
    const viewReports = document.getElementById('view-reports');
    const viewSettings = document.getElementById('view-settings');
    const viewFinance = document.getElementById('finance-section');
    const viewInventory = document.getElementById('view-inventory');

    // ── Dashboard Elements ──
    const dashboardContent = document.getElementById('dashboard-content');
    const dashboardSubtitle = document.getElementById('dashboard-subtitle');

    // ── Projects Elements ──
    const projectsTableBody = document.getElementById('projects-table-body');
    const projectsLoadingSpinner = document.getElementById('loading-spinner');
    const projectsEmptyState = document.getElementById('empty-state-projects');
    const btnNewProject = document.getElementById('btn-new-project');
    const projectModal = document.getElementById('project-modal');
    const btnCloseProjectModal = document.getElementById('btn-close-modal');
    const btnCancelProjectModal = document.getElementById('btn-cancel-modal');
    const projectForm = document.getElementById('project-form');

    // ── Team Elements ──
    const teamTableBody = document.getElementById('team-table-body');
    const teamLoadingSpinner = document.getElementById('loading-spinner-team');
    const teamEmptyState = document.getElementById('empty-state-team');
    const btnNewUser = document.getElementById('btn-new-user');
    const userModal = document.getElementById('user-modal');
    const btnCloseUserModal = document.getElementById('btn-close-user-modal');
    const btnCancelUserModal = document.getElementById('btn-cancel-user-modal');
    const userForm = document.getElementById('user-form');

    // ── Initialization ──
    checkAuth();

    // ── Auth Logic ──
    async function checkAuth() {
        try {
            currentUser = await api.get('/auth/me');
            setupAuthenticatedSession();
        } catch (error) {
            // Not logged in
            loginModal.classList.remove('hidden');
        }
    }

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        const btnText = document.getElementById('login-btn-text');
        const spinner = document.getElementById('login-spinner');
        
        btnText.textContent = 'Signing in...';
        spinner.classList.remove('hidden');
        loginError.textContent = '';
        
        try {
            currentUser = await api.post('/auth/login', { email, password });
            loginModal.classList.add('hidden');
            setupAuthenticatedSession();
        } catch (error) {
            loginError.textContent = error.message || 'Login failed';
        } finally {
            btnText.textContent = 'Sign In';
            spinner.classList.add('hidden');
        }
    });

    btnLogout.addEventListener('click', async () => {
        try {
            await api.post('/auth/logout');
            currentUser = null;
            loginModal.classList.remove('hidden');
        } catch (error) {
            showToast('Error', 'Failed to log out', 'error');
        }
    });

    function setupAuthenticatedSession() {
        // Update user profile UI
        document.getElementById('current-user-name').textContent = currentUser.name;
        document.getElementById('current-user-role').textContent = currentUser.role;
        document.getElementById('current-user-avatar').src = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=3b82f6&color=fff`;
        
        // Render Dashboard
        renderDashboard();
        
        // Hide/Show sidebar links based on role
        const role = currentUser.role.toLowerCase();
        
        const allNavs = [navDashboard, navProjects, navTasks, navDailyLogs, navPunch, navSafety, navRfis, navTeam, navDocuments, navAnalytics, navContractors, navReports, navSettings, navFinance, navInventory];
        allNavs.forEach(nav => {
            if(nav && nav.parentElement) nav.parentElement.style.display = 'none';
        });

        if(navDashboard) navDashboard.parentElement.style.display = 'block';

        if (role === 'admin') {
            allNavs.forEach(nav => { if(nav && nav.parentElement) nav.parentElement.style.display = 'block'; });
        } else if (role === 'pm') {
            [navProjects, navTasks, navDailyLogs, navPunch, navSafety, navRfis, navTeam, navDocuments, navAnalytics, navContractors, navReports, navSettings].forEach(nav => {
                if(nav && nav.parentElement) nav.parentElement.style.display = 'block';
            });
        } else if (role === 'site_engineer') {
            [navProjects, navTasks, navDailyLogs, navPunch, navSafety, navRfis, navDocuments, navReports].forEach(nav => {
                if(nav && nav.parentElement) nav.parentElement.style.display = 'block';
            });
        } else if (role === 'subcontractor') {
            [navTasks, navPunch, navDocuments, navReports].forEach(nav => {
                if(nav && nav.parentElement) nav.parentElement.style.display = 'block';
            });
        } else if (role === 'client') {
            [navProjects, navTasks, navPunch, navDocuments, navReports].forEach(nav => {
                if(nav && nav.parentElement) nav.parentElement.style.display = 'block';
            });
        } else if (role === 'procurement') {
            [navProjects, navTasks, navInventory, navContractors, navReports].forEach(nav => {
                if(nav && nav.parentElement) nav.parentElement.style.display = 'block';
            });
        } else if (role === 'finance' || role === 'finance executive') {
            [navProjects, navFinance, navReports, navAnalytics].forEach(nav => {
                if(nav && nav.parentElement) nav.parentElement.style.display = 'block';
            });
        } else if (role === 'inventory_manager') {
            [navProjects, navInventory, navReports].forEach(nav => {
                if(nav && nav.parentElement) nav.parentElement.style.display = 'block';
            });
        }

        applyRoleRestrictions();
        
        // Default to Dashboard
        switchView('dashboard');
    }

    // ── Dashboard Logic ──
    function renderDashboard() {
        dashboardSubtitle.textContent = `Welcome back, ${currentUser.name.split(' ')[0]}`;
        dashboardContent.innerHTML = '';
        
        const role = currentUser.role.toLowerCase();
        
        if (role === 'admin' || role === 'pm' || role === 'project manager') {
            dashboardContent.innerHTML = `
                <div class="card" style="padding: 20px;">
                    <h3 style="margin-bottom:10px;"><i class="fa-solid fa-chart-pie" style="color:var(--brand-primary); margin-right:8px;"></i> Portfolio Health</h3>
                    <div style="font-size:32px; font-weight:700; color:var(--text-main);">92%</div>
                    <div style="font-size:14px; color:var(--text-secondary);">Projects on schedule</div>
                </div>
                <div class="card" style="padding: 20px;">
                    <h3 style="margin-bottom:10px;"><i class="fa-solid fa-file-invoice-dollar" style="color:#ef4444; margin-right:8px;"></i> Open RFIs</h3>
                    <div style="font-size:32px; font-weight:700; color:var(--text-main);">14</div>
                    <div style="font-size:14px; color:var(--text-secondary);">Across all active projects</div>
                </div>
                <div class="card" style="padding: 20px;">
                    <h3 style="margin-bottom:10px;"><i class="fa-solid fa-users-gear" style="color:#10b981; margin-right:8px;"></i> Field Manpower</h3>
                    <div style="font-size:32px; font-weight:700; color:var(--text-main);">124</div>
                    <div style="font-size:14px; color:var(--text-secondary);">Workers on site today</div>
                </div>
            `;
        } else if (role === 'subcontractor') {
            dashboardContent.innerHTML = `
                <div class="card" style="padding: 20px;">
                    <h3 style="margin-bottom:10px;"><i class="fa-solid fa-clipboard-list" style="color:var(--brand-primary); margin-right:8px;"></i> My Tasks</h3>
                    <div style="font-size:32px; font-weight:700; color:var(--text-main);">5</div>
                    <div style="font-size:14px; color:var(--text-secondary);">Pending tasks this week</div>
                </div>
                <div class="card" style="padding: 20px;">
                    <h3 style="margin-bottom:10px;"><i class="fa-solid fa-triangle-exclamation" style="color:#f59e0b; margin-right:8px;"></i> Open Punch Items</h3>
                    <div style="font-size:32px; font-weight:700; color:var(--text-main);">2</div>
                    <div style="font-size:14px; color:var(--text-secondary);">Require immediate action</div>
                </div>
            `;
        } else if (role === 'client') {
            dashboardContent.innerHTML = `
                <div class="card" style="padding: 20px;">
                    <h3 style="margin-bottom:10px;"><i class="fa-solid fa-building-circle-check" style="color:var(--brand-primary); margin-right:8px;"></i> Overall Progress</h3>
                    <div style="font-size:32px; font-weight:700; color:var(--text-main);">45%</div>
                    <div style="font-size:14px; color:var(--text-secondary);">Estimated completion in 4 months</div>
                </div>
                <div class="card" style="padding: 20px;">
                    <h3 style="margin-bottom:10px;"><i class="fa-solid fa-money-bill-trend-up" style="color:#10b981; margin-right:8px;"></i> Total Spend</h3>
                    <div style="font-size:32px; font-weight:700; color:var(--text-main);">$1.2M</div>
                    <div style="font-size:14px; color:var(--text-secondary);">Within approved budget</div>
                </div>
            `;
        } else if (role === 'finance executive' || role === 'finance') {
            dashboardContent.innerHTML = `
                <div class="card" style="padding: 20px;">
                    <h3 style="margin-bottom:10px;"><i class="fa-solid fa-file-invoice-dollar" style="color:var(--brand-primary); margin-right:8px;"></i> Pending Invoices</h3>
                    <div style="font-size:32px; font-weight:700; color:var(--text-main);" id="dash-pending-invoices">–</div>
                    <div style="font-size:14px; color:var(--text-secondary);">Awaiting approval</div>
                </div>
                <div class="card" style="padding: 20px;">
                    <h3 style="margin-bottom:10px;"><i class="fa-solid fa-money-bill-trend-up" style="color:#10b981; margin-right:8px;"></i> Total Transactions</h3>
                    <div style="font-size:32px; font-weight:700; color:var(--text-main);" id="dash-total-tx">–</div>
                    <div style="font-size:14px; color:var(--text-secondary);">Recorded this month</div>
                </div>
            `;
        } else if (role === 'inventory_manager') {
            dashboardContent.innerHTML = `
                <div class="card" style="padding: 20px;">
                    <h3 style="margin-bottom:10px;"><i class="fa-solid fa-boxes-stacked" style="color:var(--brand-primary); margin-right:8px;"></i> Total Items</h3>
                    <div style="font-size:32px; font-weight:700; color:var(--text-main);" id="dash-inv-total">–</div>
                    <div style="font-size:14px; color:var(--text-secondary);">Inventory items tracked</div>
                </div>
                <div class="card" style="padding: 20px;">
                    <h3 style="margin-bottom:10px;"><i class="fa-solid fa-triangle-exclamation" style="color:#ef4444; margin-right:8px;"></i> Low Stock</h3>
                    <div style="font-size:32px; font-weight:700; color:#ef4444;" id="dash-inv-low">–</div>
                    <div style="font-size:14px; color:var(--text-secondary);">Items below reorder level</div>
                </div>
                <div class="card" style="padding: 20px;">
                    <h3 style="margin-bottom:10px;"><i class="fa-solid fa-truck-ramp-box" style="color:#f59e0b; margin-right:8px;"></i> Pending Orders</h3>
                    <div style="font-size:32px; font-weight:700; color:var(--text-main);" id="dash-inv-orders">–</div>
                    <div style="font-size:14px; color:var(--text-secondary);">Purchase orders in transit</div>
                </div>
            `;
            // Load real data for inventory dashboard
            api.get('/inventory/items').then(items => {
                document.getElementById('dash-inv-total').textContent = items.length;
            }).catch(() => {});
            api.get('/inventory/low-stock').then(items => {
                document.getElementById('dash-inv-low').textContent = items.length;
            }).catch(() => {});
            api.get('/procurement/purchase-orders').then(pos => {
                const pending = pos.filter(p => p.status === 'ordered').length;
                document.getElementById('dash-inv-orders').textContent = pending;
            }).catch(() => {});
        } else {
            // Fallback Dashboard
            dashboardContent.innerHTML = `
                <div class="card" style="padding: 20px;">
                    <h3 style="margin-bottom:10px;"><i class="fa-solid fa-bell" style="color:var(--brand-primary); margin-right:8px;"></i> Notifications</h3>
                    <div style="font-size:32px; font-weight:700; color:var(--text-main);">3</div>
                    <div style="font-size:14px; color:var(--text-secondary);">Unread notifications</div>
                </div>
            `;
        }
    }

    // ── Navigation Listeners ──
    navDashboard.addEventListener('click', (e) => { e.preventDefault(); switchView('dashboard'); });
    navProjects.addEventListener('click', (e) => { e.preventDefault(); switchView('projects'); loadProjects(); });
    if (navTasks) navTasks.addEventListener('click', (e) => { e.preventDefault(); switchView('tasks'); });
    if (navDailyLogs) navDailyLogs.addEventListener('click', (e) => { e.preventDefault(); switchView('daily-logs'); });
    if (navPunch) navPunch.addEventListener('click', (e) => { e.preventDefault(); switchView('punch'); });
    if (navSafety) navSafety.addEventListener('click', (e) => { e.preventDefault(); switchView('safety'); });
    if (navRfis) navRfis.addEventListener('click', (e) => { e.preventDefault(); switchView('rfis'); });
    navTeam.addEventListener('click', (e) => { e.preventDefault(); switchView('team'); loadTeam(); });
    navDocuments.addEventListener('click', (e) => { e.preventDefault(); switchView('documents'); loadDocuments(); });
    navAnalytics.addEventListener('click', (e) => { e.preventDefault(); switchView('analytics'); renderAnalytics(); });
    navContractors.addEventListener('click', (e) => { e.preventDefault(); switchView('contractors'); loadContractors(); });
    navReports.addEventListener('click', (e) => { e.preventDefault(); switchView('reports'); });
    navSettings.addEventListener('click', (e) => { e.preventDefault(); switchView('settings'); renderSettings(); });
    navFinance.addEventListener('click', (e) => { e.preventDefault(); switchView('finance'); loadFinanceData(); });
    navInventory.addEventListener('click', (e) => { e.preventDefault(); switchView('inventory'); loadInventoryData(); });

    const placeholderLinks = document.querySelectorAll('.nav-links a:not(.nav-link), .user-profile > div:not([style]), .avatar');
    placeholderLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            showToast('Coming Soon', 'This feature is currently under development.', 'success');
        });
    });

    // ── Functions: Routing ──
    function switchView(viewName) {
        document.querySelectorAll('.nav-links li').forEach(li => li.classList.remove('active'));
        document.querySelectorAll('.view-section').forEach(view => view.classList.add('hidden'));

        if (viewName === 'dashboard') {
            navDashboard.parentElement.classList.add('active');
            viewDashboard.classList.remove('hidden');
        } else if (viewName === 'projects') {
            navProjects.parentElement.classList.add('active');
            viewProjects.classList.remove('hidden');
        } else if (viewName === 'tasks') {
            if (navTasks) navTasks.parentElement.classList.add('active');
            if (viewTasks) viewTasks.classList.remove('hidden');
            populateDropdowns();
            loadTasks();
        } else if (viewName === 'daily-logs') {
            if (navDailyLogs) navDailyLogs.parentElement.classList.add('active');
            if (viewDailyLogs) viewDailyLogs.classList.remove('hidden');
            populateDropdowns();
            loadDailyLogs();
        } else if (viewName === 'punch') {
            if (navPunch) navPunch.parentElement.classList.add('active');
            if (viewPunch) viewPunch.classList.remove('hidden');
            populateDropdowns();
            loadPunchItems();
        } else if (viewName === 'safety') {
            if (navSafety) navSafety.parentElement.classList.add('active');
            if (viewSafety) viewSafety.classList.remove('hidden');
            populateDropdowns();
            loadSafetyIncidents();
        } else if (viewName === 'rfis') {
            if (navRfis) navRfis.parentElement.classList.add('active');
            if (viewRfis) viewRfis.classList.remove('hidden');
            populateDropdowns();
            loadRfisAndSubmittals();
        } else if (viewName === 'team') {
            navTeam.parentElement.classList.add('active');
            viewTeam.classList.remove('hidden');
            if (currentUser && currentUser.role.toLowerCase() === 'pm') {
                btnDirectoryTab.classList.remove('active');
                btnAttendanceTab.classList.add('active');
                teamDirectorySection.classList.add('hidden');
                teamAttendanceSection.classList.remove('hidden');
                loadAttendance();
            }
        } else if (viewName === 'documents') {
            navDocuments.parentElement.classList.add('active');
            viewDocuments.classList.remove('hidden');
        } else if (viewName === 'analytics') {
            navAnalytics.parentElement.classList.add('active');
            viewAnalytics.classList.remove('hidden');
        } else if (viewName === 'contractors') {
            navContractors.parentElement.classList.add('active');
            viewContractors.classList.remove('hidden');
        } else if (viewName === 'reports') {
            navReports.parentElement.classList.add('active');
            viewReports.classList.remove('hidden');
        } else if (viewName === 'settings') {
            navSettings.parentElement.classList.add('active');
            viewSettings.classList.remove('hidden');
        } else if (viewName === 'finance') {
            navFinance.parentElement.classList.add('active');
            viewFinance.classList.remove('hidden');
        } else if (viewName === 'inventory') {
            navInventory.parentElement.classList.add('active');
            viewInventory.classList.remove('hidden');
        }
    }

    // 🚀 Project Event Listeners 🚀

    // 🚀 Finance Event Listeners & Functions 🚀
    const btnFinanceBudgets = document.getElementById('btn-finance-budgets');
    const btnFinanceInvoices = document.getElementById('btn-finance-invoices');
    const btnFinanceTransactions = document.getElementById('btn-finance-transactions');
    const btnFinancePayroll = document.getElementById('btn-finance-payroll');

    const viewFinanceBudgets = document.getElementById('finance-budgets-view');
    const viewFinanceInvoices = document.getElementById('finance-invoices-view');
    const viewFinanceTransactions = document.getElementById('finance-transactions-view');
    const viewFinancePayroll = document.getElementById('finance-payroll-view');

    function switchFinanceTab(tab) {
        document.querySelectorAll('#finance-section .tabs button').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('#finance-section .card').forEach(view => view.classList.add('hidden'));

        if (tab === 'budgets') {
            btnFinanceBudgets.classList.add('active');
            viewFinanceBudgets.classList.remove('hidden');
            loadBudgets();
        } else if (tab === 'invoices') {
            btnFinanceInvoices.classList.add('active');
            viewFinanceInvoices.classList.remove('hidden');
            loadInvoices();
        } else if (tab === 'transactions') {
            btnFinanceTransactions.classList.add('active');
            viewFinanceTransactions.classList.remove('hidden');
            loadTransactions();
        } else if (tab === 'payroll') {
            btnFinancePayroll.classList.add('active');
            viewFinancePayroll.classList.remove('hidden');
            loadPayroll();
        }
    }

    btnFinanceBudgets.addEventListener('click', () => switchFinanceTab('budgets'));
    btnFinanceInvoices.addEventListener('click', () => switchFinanceTab('invoices'));
    btnFinanceTransactions.addEventListener('click', () => switchFinanceTab('transactions'));
    btnFinancePayroll.addEventListener('click', () => switchFinanceTab('payroll'));

    async function loadFinanceData() {
        switchFinanceTab('budgets');
    }

    async function loadBudgets() {
        try {
            const projects = await api.get('/projects');
            const tbody = document.getElementById('finance-budgets-body');
            tbody.innerHTML = '';
            
            let allBudgets = [];
            for (const p of projects) {
                const lines = await api.get('/budget/lines/project/' + p.id);
                lines.forEach(l => {
                    l.projectName = p.name;
                    allBudgets.push(l);
                });
            }

            if(allBudgets.length === 0) {
                tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;">No budget lines found.</td></tr>';
                return;
            }

            allBudgets.forEach(b => {
                const tr = document.createElement('tr');
                const isOver = b.actualAmount > b.budgetedAmount;
                const statusBadge = isOver ? '<span class="badge badge-warning">Over Budget</span>' : '<span class="badge badge-success">On Track</span>';
                tr.innerHTML = `
                    <td>Project ${b.projectId} - ${b.projectName}</td>
                    <td>${b.costCode}</td>
                    <td>${b.description || ''}</td>
                    <td>$${b.budgetedAmount ? b.budgetedAmount.toFixed(2) : '0.00'}</td>
                    <td>$${b.actualAmount ? b.actualAmount.toFixed(2) : '0.00'}</td>
                    <td>${statusBadge}</td>
                    <td data-requires-role="finance,admin">
                        <button class="btn btn-secondary btn-sm" onclick="editBudget(${b.id}, ${b.projectId})"><i class="fa-solid fa-pen"></i></button>
                        <button class="btn btn-secondary btn-sm" style="color:var(--danger-color)" onclick="deleteBudget(${b.id})"><i class="fa-solid fa-trash"></i></button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
            applyRoleRestrictions();
        } catch (error) {
            console.error('Failed to load budgets', error);
        }
    }

    async function loadInvoices() {
        try {
            const invoices = await api.get('/finance/invoices');
            const tbody = document.getElementById('finance-invoices-body');
            tbody.innerHTML = '';
            if(invoices.length === 0) {
                tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">No invoices found.</td></tr>';
                return;
            }
            invoices.forEach(inv => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${inv.invoiceNumber}</td>
                    <td>Project ${inv.projectId}</td>
                    <td>$${inv.amount ? inv.amount.toFixed(2) : '0.00'}</td>
                    <td>${inv.dueDate ? inv.dueDate.split('T')[0] : ''}</td>
                    <td><span class="badge ${inv.status === 'Pending' ? 'badge-warning' : 'badge-success'}">${inv.status}</span></td>
                    <td data-requires-role="finance,admin">
                        ${inv.status === 'Pending' ? `<button class="btn btn-sm btn-primary" style="margin-right:5px;" onclick="approveInvoice(${inv.id})">Approve</button>` : ''}
                        <button class="btn btn-secondary btn-sm" onclick="editInvoice(${inv.id})"><i class="fa-solid fa-pen"></i></button>
                        <button class="btn btn-secondary btn-sm" style="color:var(--danger-color)" onclick="deleteInvoice(${inv.id})"><i class="fa-solid fa-trash"></i></button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
            applyRoleRestrictions();
        } catch (error) {
            console.error('Failed to load invoices', error);
        }
    }

    async function loadTransactions() {
        try {
            const transactions = await api.get('/finance/transactions');
            const tbody = document.getElementById('finance-transactions-body');
            tbody.innerHTML = '';
            
            const expenses = transactions.filter(t => t.type !== 'PAYROLL');
            if(expenses.length === 0) {
                tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;">No transactions found.</td></tr>';
                return;
            }
            
            expenses.forEach(tx => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${tx.id}</td>
                    <td>${tx.transactionDate ? tx.transactionDate.split('T')[0] : ''}</td>
                    <td>Project ${tx.projectId}</td>
                    <td>${tx.category}</td>
                    <td>$${tx.amount ? tx.amount.toFixed(2) : '0.00'}</td>
                    <td>${tx.description || ''}</td>
                    <td data-requires-role="finance,admin">
                        <button class="btn btn-secondary btn-sm" onclick="editTransaction(${tx.id})"><i class="fa-solid fa-pen"></i></button>
                        <button class="btn btn-secondary btn-sm" style="color:var(--danger-color)" onclick="deleteTransaction(${tx.id})"><i class="fa-solid fa-trash"></i></button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
            applyRoleRestrictions();
        } catch (error) {
            console.error('Failed to load transactions', error);
        }
    }

    async function loadPayroll() {
        try {
            const transactions = await api.get('/finance/transactions');
            const tbody = document.getElementById('finance-payroll-body');
            tbody.innerHTML = '';
            
            const payrolls = transactions.filter(t => t.type === 'PAYROLL');
            if(payrolls.length === 0) {
                tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">No payroll data found.</td></tr>';
                return;
            }
            
            payrolls.forEach(tx => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${tx.id}</td>
                    <td>${tx.transactionDate ? tx.transactionDate.split('T')[0] : ''}</td>
                    <td>Project ${tx.projectId}</td>
                    <td>$${tx.amount ? tx.amount.toFixed(2) : '0.00'}</td>
                    <td>${tx.description || ''}</td>
                    <td data-requires-role="finance,admin">
                        <button class="btn btn-secondary btn-sm" onclick="editTransaction(${tx.id})"><i class="fa-solid fa-pen"></i></button>
                        <button class="btn btn-secondary btn-sm" style="color:var(--danger-color)" onclick="deleteTransaction(${tx.id})"><i class="fa-solid fa-trash"></i></button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
            applyRoleRestrictions();
        } catch (error) {
            console.error('Failed to load payroll', error);
        }
    }

    // Modal listeners & logic for Finance
    const budgetModal = document.getElementById('budget-modal');
    if(document.getElementById('btn-add-budget')) {
        document.getElementById('btn-add-budget').addEventListener('click', () => {
            document.getElementById('budget-form').reset();
            document.getElementById('budget-id').value = '';
            document.getElementById('budget-modal-title').textContent = 'Add Budget Line';
            budgetModal.classList.remove('hidden');
        });
        document.getElementById('btn-close-budget-modal').addEventListener('click', () => budgetModal.classList.add('hidden'));
        document.getElementById('btn-cancel-budget-modal').addEventListener('click', () => budgetModal.classList.add('hidden'));
        
        document.getElementById('budget-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = document.getElementById('budget-id').value;
            const data = {
                projectId: document.getElementById('budget-project-id').value,
                costCode: document.getElementById('budget-cost-code').value,
                description: document.getElementById('budget-desc').value,
                budgetedAmount: document.getElementById('budget-amount').value,
                actualAmount: document.getElementById('budget-actual').value
            };
            try {
                if(id) {
                    await api.put('/budget/lines/' + id, data);
                } else {
                    await api.post('/budget/lines', data);
                }
                budgetModal.classList.add('hidden');
                loadBudgets();
            } catch(e) { alert('Error saving budget line'); }
        });
    }

    window.editBudget = async (id, projectId) => {
        try {
            const lines = await api.get('/budget/lines/project/' + projectId);
            const line = lines.find(l => l.id === id);
            if(line) {
                document.getElementById('budget-id').value = line.id;
                document.getElementById('budget-project-id').value = line.projectId;
                document.getElementById('budget-cost-code').value = line.costCode || '';
                document.getElementById('budget-desc').value = line.description || '';
                document.getElementById('budget-amount').value = line.budgetedAmount || 0;
                document.getElementById('budget-actual').value = line.actualAmount || 0;
                document.getElementById('budget-modal-title').textContent = 'Edit Budget Line';
                budgetModal.classList.remove('hidden');
            }
        } catch(e) { console.error(e); }
    };
    window.deleteBudget = async (id) => {
        if(confirm('Are you sure you want to delete this budget line?')) {
            try { await api.delete('/budget/lines/' + id); loadBudgets(); } catch(e) { alert('Error deleting'); }
        }
    };

    const invoiceModal = document.getElementById('invoice-modal');
    if(document.getElementById('btn-add-invoice')) {
        document.getElementById('btn-add-invoice').addEventListener('click', () => {
            document.getElementById('invoice-form').reset();
            document.getElementById('invoice-id').value = '';
            document.getElementById('invoice-modal-title').textContent = 'Add Invoice';
            invoiceModal.classList.remove('hidden');
        });
        document.getElementById('btn-close-invoice-modal').addEventListener('click', () => invoiceModal.classList.add('hidden'));
        document.getElementById('btn-cancel-invoice-modal').addEventListener('click', () => invoiceModal.classList.add('hidden'));
        
        document.getElementById('invoice-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = document.getElementById('invoice-id').value;
            const data = {
                invoiceNumber: document.getElementById('invoice-number').value,
                projectId: document.getElementById('invoice-project-id').value,
                supplierId: document.getElementById('invoice-supplier-id').value || null,
                amount: document.getElementById('invoice-amount').value,
                dueDate: document.getElementById('invoice-date').value,
                status: document.getElementById('invoice-status').value
            };
            try {
                if(id) {
                    await api.put('/finance/invoices/' + id, data);
                } else {
                    await api.post('/finance/invoices', data);
                }
                invoiceModal.classList.add('hidden');
                loadInvoices();
            } catch(e) { alert('Error saving invoice'); }
        });
    }

    window.editInvoice = async (id) => {
        try {
            const invoices = await api.get('/finance/invoices');
            const inv = invoices.find(i => i.id === id);
            if(inv) {
                document.getElementById('invoice-id').value = inv.id;
                document.getElementById('invoice-number').value = inv.invoiceNumber || '';
                document.getElementById('invoice-project-id').value = inv.projectId;
                document.getElementById('invoice-supplier-id').value = inv.supplierId || '';
                document.getElementById('invoice-amount').value = inv.amount || 0;
                if(inv.dueDate) document.getElementById('invoice-date').value = inv.dueDate.split('T')[0];
                document.getElementById('invoice-status').value = inv.status || 'Pending';
                document.getElementById('invoice-modal-title').textContent = 'Edit Invoice';
                invoiceModal.classList.remove('hidden');
            }
        } catch(e) { console.error(e); }
    };
    window.deleteInvoice = async (id) => {
        if(confirm('Are you sure you want to delete this invoice?')) {
            try { await api.delete('/finance/invoices/' + id); loadInvoices(); } catch(e) { alert('Error deleting'); }
        }
    };
    window.approveInvoice = async function(id) {
        try {
            await api.put('/finance/invoices/' + id, { status: 'Approved' });
            showToast('Success', 'Invoice approved.', 'success');
            loadInvoices();
        } catch (error) {
            showToast('Error', 'Could not approve invoice', 'error');
        }
    };

    const transactionModal = document.getElementById('transaction-modal');
    if(document.getElementById('btn-add-transaction')) {
        document.getElementById('btn-add-transaction').addEventListener('click', () => {
            document.getElementById('transaction-form').reset();
            document.getElementById('transaction-id').value = '';
            document.getElementById('transaction-type').value = 'EXPENSE';
            document.getElementById('transaction-modal-title').textContent = 'Add Transaction';
            transactionModal.classList.remove('hidden');
        });
        document.getElementById('btn-close-transaction-modal').addEventListener('click', () => transactionModal.classList.add('hidden'));
        document.getElementById('btn-cancel-transaction-modal').addEventListener('click', () => transactionModal.classList.add('hidden'));
        
        document.getElementById('btn-add-payroll').addEventListener('click', () => {
            document.getElementById('transaction-form').reset();
            document.getElementById('transaction-id').value = '';
            document.getElementById('transaction-type').value = 'PAYROLL';
            document.getElementById('transaction-modal-title').textContent = 'Add Payroll Payment';
            transactionModal.classList.remove('hidden');
        });

        document.getElementById('transaction-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = document.getElementById('transaction-id').value;
            const data = {
                projectId: document.getElementById('transaction-project-id').value,
                transactionDate: document.getElementById('transaction-date').value,
                type: document.getElementById('transaction-type').value,
                category: document.getElementById('transaction-category').value,
                amount: document.getElementById('transaction-amount').value,
                description: document.getElementById('transaction-desc').value
            };
            try {
                if(id) {
                    await api.put('/finance/transactions/' + id, data);
                } else {
                    await api.post('/finance/transactions', data);
                }
                transactionModal.classList.add('hidden');
                if(data.type === 'PAYROLL') loadPayroll(); else loadTransactions();
            } catch(e) { alert('Error saving transaction'); }
        });
    }

    window.editTransaction = async (id) => {
        try {
            const txs = await api.get('/finance/transactions');
            const tx = txs.find(t => t.id === id);
            if(tx) {
                document.getElementById('transaction-id').value = tx.id;
                document.getElementById('transaction-project-id').value = tx.projectId;
                if(tx.transactionDate) document.getElementById('transaction-date').value = tx.transactionDate.split('T')[0];
                document.getElementById('transaction-type').value = tx.type || 'EXPENSE';
                document.getElementById('transaction-category').value = tx.category || '';
                document.getElementById('transaction-amount').value = tx.amount || 0;
                document.getElementById('transaction-desc').value = tx.description || '';
                document.getElementById('transaction-modal-title').textContent = 'Edit Transaction';
                transactionModal.classList.remove('hidden');
            }
        } catch(e) { console.error(e); }
    };
    window.deleteTransaction = async (id) => {
        if(confirm('Are you sure you want to delete this transaction?')) {
            try { await api.delete('/finance/transactions/' + id); loadTransactions(); loadPayroll(); } catch(e) { alert('Error deleting'); }
        }
    };

    // ────────────────────────────────────────────────────────────────────
    // 🗃️ INVENTORY MODULE
    // ────────────────────────────────────────────────────────────────────
    let inventoryItems = [];  // cache for selects

    const btnAddItem        = document.getElementById('btn-add-item');
    const btnInvStock       = document.getElementById('btn-inv-stock');
    const btnInvReceive     = document.getElementById('btn-inv-receive');
    const btnInvIssue       = document.getElementById('btn-inv-issue');
    const btnInvOrders      = document.getElementById('btn-inv-orders');
    const btnInvLedger      = document.getElementById('btn-inv-ledger');

    const invStockView      = document.getElementById('inv-stock-view');
    const invReceiveView    = document.getElementById('inv-receive-view');
    const invIssueView      = document.getElementById('inv-issue-view');
    const invOrdersView     = document.getElementById('inv-orders-view');
    const invLedgerView     = document.getElementById('inv-ledger-view');

    const invItemModal      = document.getElementById('inv-item-modal');
    const invItemForm       = document.getElementById('inv-item-form');
    const receiveForm       = document.getElementById('receive-form');
    const issueForm         = document.getElementById('issue-form');

    function switchInvTab(tab) {
        document.querySelectorAll('#view-inventory .tabs button').forEach(b => b.classList.remove('active'));
        [invStockView, invReceiveView, invIssueView, invOrdersView, invLedgerView].forEach(v => v.classList.add('hidden'));

        if (tab === 'stock')    { btnInvStock.classList.add('active');    invStockView.classList.remove('hidden');    loadStockLevels(); }
        if (tab === 'receive')  { btnInvReceive.classList.add('active');  invReceiveView.classList.remove('hidden');  populateItemSelects(); }
        if (tab === 'issue')    { btnInvIssue.classList.add('active');    invIssueView.classList.remove('hidden');    populateItemSelects(); populateProjectSelect(); }
        if (tab === 'orders')   { btnInvOrders.classList.add('active');   invOrdersView.classList.remove('hidden');   loadPurchaseOrders(); }
        if (tab === 'ledger')   { btnInvLedger.classList.add('active');   invLedgerView.classList.remove('hidden');   loadMovementLedger(); }
    }

    btnInvStock.addEventListener('click',   () => switchInvTab('stock'));
    btnInvReceive.addEventListener('click', () => switchInvTab('receive'));
    btnInvIssue.addEventListener('click',   () => switchInvTab('issue'));
    btnInvOrders.addEventListener('click',  () => switchInvTab('orders'));
    btnInvLedger.addEventListener('click',  () => switchInvTab('ledger'));

    // Open Add-Item modal
    btnAddItem.addEventListener('click', () => {
        document.getElementById('inv-modal-title').textContent = 'Add Inventory Item';
        document.getElementById('inv-item-id').value = '';
        invItemForm.reset();
        populateSupplierSelect();
        invItemModal.classList.remove('hidden');
    });
    document.getElementById('btn-close-inv-modal').addEventListener('click', () => invItemModal.classList.add('hidden'));
    document.getElementById('btn-cancel-inv-modal').addEventListener('click', () => invItemModal.classList.add('hidden'));
    invItemModal.addEventListener('click', (e) => { if (e.target === invItemModal) invItemModal.classList.add('hidden'); });

    invItemForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('inv-item-id').value;
        const supplierVal = document.getElementById('inv-item-supplier').value;
        const payload = {
            name:         document.getElementById('inv-item-name').value,
            category:     document.getElementById('inv-item-category').value,
            unit:         document.getElementById('inv-item-unit').value,
            reorderLevel: parseFloat(document.getElementById('inv-item-reorder').value) || 0,
            unitCost:     parseFloat(document.getElementById('inv-item-cost').value) || 0,
            quantityOnHand: parseFloat(document.getElementById('inv-item-qty').value) || 0,
            supplierId:   supplierVal ? parseInt(supplierVal) : null,
            description:  document.getElementById('inv-item-desc').value,
        };
        try {
            if (id) {
                await api.put('/inventory/items/' + id, payload);
                showToast('Success', 'Item updated', 'success');
            } else {
                await api.post('/inventory/items', payload);
                showToast('Success', 'Item added to inventory', 'success');
            }
            invItemModal.classList.add('hidden');
            loadStockLevels();
        } catch (err) {
            showToast('Error', err.message, 'error');
        }
    });

    async function loadInventoryData() {
        if (currentUser && currentUser.role.toLowerCase() === 'client') {
            switchInvTab('ledger');
        } else {
            switchInvTab('stock');
        }
    }

    async function loadStockLevels() {
        const tbody = document.getElementById('inv-stock-body');
        tbody.innerHTML = '<tr><td colspan="8" style="text-align:center">Loading...</td></tr>';
        try {
            inventoryItems = await api.get('/inventory/items');
            const lowStock = inventoryItems.filter(i =>
                parseFloat(i.reorderLevel) > 0 && parseFloat(i.quantityOnHand) <= parseFloat(i.reorderLevel)
            );

            const badge = document.getElementById('inv-low-stock-badge');
            const cnt   = document.getElementById('inv-low-stock-count');
            if (lowStock.length > 0) {
                badge.classList.remove('hidden');
                cnt.textContent = lowStock.length;
            } else {
                badge.classList.add('hidden');
            }

            tbody.innerHTML = '';
            if (inventoryItems.length === 0) {
                tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; color:var(--text-secondary);">No items. Click "Add Item" to get started.</td></tr>';
                return;
            }
            inventoryItems.forEach(item => {
                const isLow = parseFloat(item.reorderLevel) > 0 && parseFloat(item.quantityOnHand) <= parseFloat(item.reorderLevel);
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td style="font-weight:600">${item.name}</td>
                    <td>${item.category || '–'}</td>
                    <td>${item.unit}</td>
                    <td style="font-weight:700; color:${isLow ? '#ef4444' : 'var(--text-main)'}">${parseFloat(item.quantityOnHand).toFixed(2)}</td>
                    <td>${parseFloat(item.reorderLevel).toFixed(2)}</td>
                    <td>$${parseFloat(item.unitCost).toFixed(2)}</td>
                    <td>${isLow
                        ? '<span style="background:#fef2f2; color:#ef4444; padding:3px 10px; border-radius:20px; font-size:12px; font-weight:600;"><i class="fa-solid fa-triangle-exclamation"></i> Low Stock</span>'
                        : '<span style="background:#f0fdf4; color:#16a34a; padding:3px 10px; border-radius:20px; font-size:12px; font-weight:600;">OK</span>'}
                    </td>
                    <td>
                        <button class="btn-icon" onclick="window.editInvItem(${item.id})" title="Edit"><i class="fa-solid fa-pen"></i></button>
                        <button class="btn-icon danger" onclick="window.deleteInvItem(${item.id})" title="Delete"><i class="fa-solid fa-trash"></i></button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        } catch (err) {
            tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; color:#ef4444;">Failed to load inventory</td></tr>';
        }
    }

    window.editInvItem = function(id) {
        const item = inventoryItems.find(i => i.id === id);
        if (!item) return;
        document.getElementById('inv-modal-title').textContent = 'Edit Inventory Item';
        document.getElementById('inv-item-id').value = item.id;
        document.getElementById('inv-item-name').value = item.name;
        document.getElementById('inv-item-category').value = item.category || '';
        document.getElementById('inv-item-unit').value = item.unit;
        document.getElementById('inv-item-reorder').value = item.reorderLevel;
        document.getElementById('inv-item-cost').value = item.unitCost;
        document.getElementById('inv-item-qty').value = item.quantityOnHand || 0;
        document.getElementById('inv-item-desc').value = item.description || '';
        populateSupplierSelect().then(() => {
            document.getElementById('inv-item-supplier').value = item.supplierId || '';
        });
        invItemModal.classList.remove('hidden');
    };

    window.deleteInvItem = async function(id) {
        if (!confirm('Are you sure you want to delete this inventory item?')) return;
        try {
            await api.delete('/inventory/items/' + id);
            showToast('Success', 'Item deleted successfully', 'success');
            loadStockLevels();
        } catch (error) {
            showToast('Delete Failed', error.message, 'error');
        }
    };

    function populateItemSelects() {
        ['receive-item-id', 'issue-item-id'].forEach(selId => {
            const sel = document.getElementById(selId);
            sel.innerHTML = '<option value="">-- Select Item --</option>';
            inventoryItems.forEach(item => {
                const opt = document.createElement('option');
                opt.value = item.id;
                opt.textContent = `${item.name} (${parseFloat(item.quantityOnHand).toFixed(2)} ${item.unit})`;
                sel.appendChild(opt);
            });
        });
        if (inventoryItems.length === 0) {
            loadStockLevels().then(populateItemSelects);
        }
    }

    async function populateSupplierSelect() {
        const sel = document.getElementById('inv-item-supplier');
        // Do not repopulate if we already have suppliers loaded, unless empty
        if (sel.options.length > 1) return; 
        
        sel.innerHTML = '<option value="">-- No Supplier --</option>';
        try {
            const suppliers = await api.get('/suppliers');
            suppliers.forEach(sup => {
                const opt = document.createElement('option');
                opt.value = sup.id;
                opt.textContent = `#${sup.id} - ${sup.name}`;
                sel.appendChild(opt);
            });
        } catch (error) {
            console.error('Failed to load suppliers:', error);
        }
    }

    async function populateProjectSelect() {
        const sel = document.getElementById('issue-project-id');
        sel.innerHTML = '<option value="">-- Select Project --</option>';
        try {
            const projs = await api.get('/projects');
            projs.forEach(p => {
                const opt = document.createElement('option');
                opt.value = p.id;
                opt.textContent = p.name;
                sel.appendChild(opt);
            });
        } catch (err) { console.error('Could not load projects', err); }
    }

    receiveForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const itemId = document.getElementById('receive-item-id').value;
        const qty    = document.getElementById('receive-qty').value;
        const notes  = document.getElementById('receive-notes').value;
        if (!itemId) return showToast('Error', 'Please select an item', 'error');
        try {
            await api.post(`/inventory/items/${itemId}/receive`, {
                quantity: parseFloat(qty),
                notes,
                performedByUserId: currentUser.id,
                performedByName:   currentUser.name
            });
            showToast('Success', 'Stock received and updated', 'success');
            receiveForm.reset();
            inventoryItems = await api.get('/inventory/items');
            populateItemSelects();
        } catch (err) {
            showToast('Error', err.message || 'Failed to receive stock', 'error');
        }
    });

    issueForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const itemId    = document.getElementById('issue-item-id').value;
        const projectId = document.getElementById('issue-project-id').value;
        const qty       = document.getElementById('issue-qty').value;
        const notes     = document.getElementById('issue-notes').value;
        if (!itemId) return showToast('Error', 'Please select an item', 'error');
        if (!projectId) return showToast('Error', 'Please select a project', 'error');
        try {
            await api.post(`/inventory/items/${itemId}/issue`, {
                quantity: parseFloat(qty),
                projectId: parseInt(projectId),
                notes,
                performedByUserId: currentUser.id,
                performedByName:   currentUser.name
            });
            showToast('Success', 'Materials issued successfully', 'success');
            issueForm.reset();
            inventoryItems = await api.get('/inventory/items');
            populateItemSelects();
        } catch (err) {
            showToast('Error', err.message || 'Insufficient stock', 'error');
        }
    });

    async function loadPurchaseOrders() {
        const tbody = document.getElementById('inv-orders-body');
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center">Loading...</td></tr>';
        try {
            const pos = await api.get('/procurement/purchase-orders');
            tbody.innerHTML = '';
            if (pos.length === 0) {
                tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; color:var(--text-secondary);">No purchase orders yet.</td></tr>';
                return;
            }
            pos.forEach(po => {
                const isDelayed = po.expectedDeliveryDate && !po.actualDeliveryDate && new Date(po.expectedDeliveryDate) < new Date();
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${po.description}</td>
                    <td>${po.supplierName || '–'}</td>
                    <td>$${parseFloat(po.amount).toFixed(2)}</td>
                    <td>${po.orderDate}</td>
                    <td style="color:${isDelayed ? '#ef4444' : 'inherit'}">${po.expectedDeliveryDate || '–'}${isDelayed ? ' <i class="fa-solid fa-triangle-exclamation" title="Delayed"></i>' : ''}</td>
                    <td><span style="background:${po.status==='delivered'?'#f0fdf4':'#fffbeb'}; color:${po.status==='delivered'?'#16a34a':'#b45309'}; padding:3px 10px; border-radius:20px; font-size:12px; font-weight:600;">${po.status}</span></td>
                `;
                tbody.appendChild(tr);
            });
        } catch (err) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; color:#ef4444;">Failed to load orders</td></tr>';
        }
    }

    async function loadMovementLedger() {
        const tbody = document.getElementById('inv-ledger-body');
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center">Loading...</td></tr>';
        try {
            let txs;
            if (currentUser && currentUser.role.toLowerCase() === 'client') {
                txs = await api.get('/inventory/issued-to-me');
            } else {
                txs = await api.get('/inventory/transactions');
            }
            tbody.innerHTML = '';
            if (txs.length === 0) {
                tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; color:var(--text-secondary);">No movements recorded yet.</td></tr>';
                return;
            }
            txs.forEach(tx => {
                const item = inventoryItems.find(i => i.id === tx.inventoryItemId);
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${tx.transactionDate}</td>
                    <td>${item ? item.name : 'Item #' + tx.inventoryItemId}</td>
                    <td><span style="background:${tx.type==='RECEIPT'?'#f0fdf4':'#fef2f2'}; color:${tx.type==='RECEIPT'?'#16a34a':'#ef4444'}; padding:3px 10px; border-radius:20px; font-size:12px; font-weight:600;">${tx.type}</span></td>
                    <td>${parseFloat(tx.quantity).toFixed(2)}</td>
                    <td>${tx.notes || '–'}</td>
                    <td>${tx.performedByName || '–'}</td>
                `;
                tbody.appendChild(tr);
            });
        } catch (err) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; color:#ef4444;">Failed to load ledger</td></tr>';
        }
    }

    // ────────────────────────────────────────────────────────────────────
    // End Inventory Module
    // ────────────────────────────────────────────────────────────────────
    
    // 🚀 Project Event Listeners 🚀──
    btnNewProject.addEventListener('click', openNewProjectModal);
    btnCloseProjectModal.addEventListener('click', () => closeProjectModal());
    btnCancelProjectModal.addEventListener('click', () => closeProjectModal());
    projectModal.addEventListener('click', (e) => {
        if (e.target === projectModal) closeProjectModal();
    });
    projectForm.addEventListener('submit', handleProjectSubmit);

    // ── Functions: Projects ──
    async function loadProjects() {
        showLoading('projects', true);
        try {
            projects = await api.get('/projects');
            renderProjectsTable();
        } catch (error) {
            showToast('Failed to load projects', error.message, 'error');
            renderProjectsTable();
        } finally {
            showLoading('projects', false);
        }
    }

    function renderProjectsTable() {
        projectsTableBody.innerHTML = '';
        if (projects.length === 0) {
            projectsEmptyState.classList.remove('hidden');
        } else {
            projectsEmptyState.classList.add('hidden');
            projects.forEach(project => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>
                        <div style="font-weight: 600;">${project.name}</div>
                        <div style="font-size: 12px; color: var(--text-secondary)">ID: PROJ-${String(project.id).padStart(4, '0')}</div>
                    </td>
                    <td>${project.address}</td>
                    <td>
                        <div>Start: ${project.startDate}</div>
                        <div style="color: var(--text-secondary)">End: ${project.endDate || 'TBD'}</div>
                    </td>
                    <td>
                        <span class="status-badge status-${project.status.toLowerCase().replace(' ', '-')}">
                            ${project.status}
                        </span>
                    </td>
                    <td>
                        ${(currentUser && (currentUser.role.toLowerCase() === 'admin' || currentUser.role.toLowerCase() === 'pm')) ? `<button class="btn-icon" onclick="editProject(${project.id})" title="Edit"><i class="fa-solid fa-pen"></i></button>` : ''}
                        ${(currentUser && currentUser.role.toLowerCase() === 'admin') ? `<button class="btn-icon danger" onclick="deleteProject(${project.id})" title="Delete"><i class="fa-solid fa-trash"></i></button>` : ''}
                        ${(currentUser && currentUser.role.toLowerCase() === 'admin') ? `<button class="btn-icon" onclick="assignPm(${project.id})" title="Assign PM"><i class="fa-solid fa-user-plus"></i></button>` : ''}
                    </td>
                `;
                projectsTableBody.appendChild(tr);
            });
        }
    }

    async function openNewProjectModal() {
        clearFormErrors();
        projectForm.reset();
        document.getElementById('project-id').value = '';
        document.getElementById('modal-title').textContent = 'New Project';
        projectModal.classList.remove('hidden');
        
        const users = await api.get('/users');
        const assignmentSelect = document.getElementById('projectAssignments');
        assignmentSelect.innerHTML = '';
        users.forEach(u => {
            const opt = document.createElement('option');
            opt.value = u.id;
            opt.textContent = u.name + ' (' + u.role + ')';
            assignmentSelect.appendChild(opt);
        });
    }

    window.editProject = (id) => {
        const project = projects.find(p => p.id === id);
        if (!project) return;
        clearFormErrors();
        document.getElementById('modal-title').textContent = 'Edit Project';
        document.getElementById('project-id').value = project.id;
        document.getElementById('name').value = project.name;
        document.getElementById('address').value = project.address;
        document.getElementById('startDate').value = project.startDate;
        document.getElementById('endDate').value = project.endDate || '';
        document.getElementById('status').value = project.status;
        projectModal.classList.remove('hidden');
    };

    window.deleteProject = async (id) => {
        if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) return;
        try {
            await api.delete(`/projects/${id}`);
            showToast('Success', 'Project deleted successfully', 'success');
            loadProjects();
        } catch (error) {
            showToast('Delete Failed', error.message, 'error');
        }
    };

    function closeProjectModal() {
        projectModal.classList.add('hidden');
    }

    async function handleProjectSubmit(e) {
        e.preventDefault();
        if (isSubmitting) return;
        clearFormErrors();
        setSubmitting('project', true);
        const id = document.getElementById('project-id').value;
        const projectData = {
            name: document.getElementById('name').value,
            address: document.getElementById('address').value,
            startDate: document.getElementById('startDate').value,
            endDate: document.getElementById('endDate').value || null,
            status: document.getElementById('status').value,
            type: document.getElementById('projectType') ? document.getElementById('projectType').value : 'Commercial'
        };
        try {
            if (id) {
                await api.put(`/projects/${id}`, projectData);
                showToast('Success', 'Project updated successfully', 'success');
            } else {
                const newProj = await api.post('/projects', projectData);
                const assignSelect = document.getElementById('projectAssignments');
                if (assignSelect) {
                    const assignedUserIds = Array.from(assignSelect.selectedOptions).map(opt => opt.value);
                    for(const uId of assignedUserIds) {
                        await api.post(`/projects/${newProj.id}/assignments/${uId}`);
                    }
                }
                showToast('Success', 'Project created successfully', 'success');
            }
            closeProjectModal();
            loadProjects();
        } catch (error) {
            if (error.status === 400) {
                showToast('Validation Error', 'Please check the form for errors', 'error');
            } else {
                showToast('Error', error.message, 'error');
            }
        } finally {
            setSubmitting('project', false);
        }
    }

    // ── Team Event Listeners ──
    btnNewUser.addEventListener('click', openNewUserModal);
    btnCloseUserModal.addEventListener('click', () => closeUserModal());
    btnCancelUserModal.addEventListener('click', () => closeUserModal());
    userModal.addEventListener('click', (e) => {
        if (e.target === userModal) closeUserModal();
    });
    userForm.addEventListener('submit', handleUserSubmit);

    // ── Functions: Team ──
    async function loadTeam() {
        showLoading('team', true);
        try {
            team = await api.get('/users');
            renderTeamTable();
        } catch (error) {
            showToast('Failed to load team members', error.message, 'error');
            renderTeamTable();
        } finally {
            showLoading('team', false);
        }
    }

    function renderTeamTable() {
        teamTableBody.innerHTML = '';
        if (team.length === 0) {
            teamEmptyState.classList.remove('hidden');
        } else {
            teamEmptyState.classList.add('hidden');
            team.forEach(user => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <div style="width: 32px; height: 32px; border-radius: 50%; background-color: var(--accent-primary); color: white; display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 12px;">
                                ${user.avatarInitials}
                            </div>
                            <div style="font-weight: 600;">${user.name}</div>
                        </div>
                    </td>
                    <td>${user.role}</td>
                    <td>${user.email}</td>
                    <td>${user.phone || 'N/A'}</td>
                    <td>${user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</td>
                    <td>
                        <span class="status-badge status-${user.active ? 'active' : 'inactive'}">
                            ${user.active ? 'Active' : 'Inactive'}
                        </span>
                    </td>
                    <td>
                        <button class="btn-icon" onclick="editUser(${user.id})" title="Edit"><i class="fa-solid fa-pen"></i></button>
                        <button class="btn-icon danger" onclick="deleteUser(${user.id})" title="Delete"><i class="fa-solid fa-trash"></i></button>
                    </td>
                `;
                teamTableBody.appendChild(tr);
            });
        }
    }

    function openNewUserModal() {
        clearFormErrors();
        userForm.reset();
        document.getElementById('user-id').value = '';
        document.getElementById('user-modal-title').textContent = 'Add Team Member';
        userModal.classList.remove('hidden');
    }

    window.editUser = (id) => {
        const user = team.find(u => u.id === id);
        if (!user) return;
        clearFormErrors();
        document.getElementById('user-modal-title').textContent = 'Edit Team Member';
        document.getElementById('user-id').value = user.id;
        document.getElementById('userName').value = user.name;
        document.getElementById('userEmail').value = user.email;
        document.getElementById('userPhone').value = user.phone || '';
        document.getElementById('userRole').value = user.role;
        userModal.classList.remove('hidden');
    };

    window.deleteUser = async (id) => {
        if (!confirm('Are you sure you want to remove this team member?')) return;
        try {
            await api.delete(`/users/${id}`);
            showToast('Success', 'Team member removed', 'success');
            loadTeam();
        } catch (error) {
            showToast('Delete Failed', error.message, 'error');
        }
    };

    function closeUserModal() {
        userModal.classList.add('hidden');
    }

    async function handleUserSubmit(e) {
        e.preventDefault();
        if (isSubmitting) return;
        clearFormErrors();
        setSubmitting('user', true);
        const id = document.getElementById('user-id').value;
        const name = document.getElementById('userName').value;
        
        const parts = name.trim().split(/\s+/);
        let initials = "";
        if (parts.length >= 2) {
            initials = (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        } else if (parts.length === 1 && parts[0].length > 0) {
            initials = parts[0].substring(0, 2).toUpperCase();
        }

        const userData = {
            name: name,
            email: document.getElementById('userEmail').value,
            phone: document.getElementById('userPhone').value || null,
            role: document.getElementById('userRole').value,
            avatarInitials: initials || 'XX',
            active: true
        };

        try {
            if (id) {
                await api.put(`/users/${id}`, userData);
                showToast('Success', 'Team member updated', 'success');
            } else {
                await api.post('/users', userData);
                showToast('Success', 'Team member added', 'success');
            }
            closeUserModal();
            loadTeam();
        } catch (error) {
            showToast('Error', error.message, 'error');
        } finally {
            setSubmitting('user', false);
        }
    }

    // ── Functions: Documents ──
    async function loadDocuments() {
        showLoading('documents', true);
        try {
            const projects = await api.get('/projects');
            let allDocs = [];
            for (const p of projects) {
                const docs = await api.get('/documents/project/' + p.id);
                docs.forEach(d => {
                    d.projectName = p.name;
                    allDocs.push(d);
                });
            }
            documentsList = allDocs;
            renderDocumentsTable();
        } catch (error) {
            showToast('Failed to load documents', error.message, 'error');
            documentsList = [];
            renderDocumentsTable();
        } finally {
            showLoading('documents', false);
        }
    }

    function renderDocumentsTable() {
        documentsTableBody.innerHTML = '';
        if (documentsList.length === 0) {
            documentsEmptyState.classList.remove('hidden');
        } else {
            documentsEmptyState.classList.add('hidden');
            documentsList.forEach(doc => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${doc.id}</td>
                    <td>Project ${doc.projectId} - ${doc.projectName}</td>
                    <td>${doc.fileName}</td>
                    <td>${doc.fileType || ''}</td>
                    <td><a href="${doc.fileUrl}" target="_blank" style="color:var(--primary-color);">View <i class="fa-solid fa-external-link"></i></a></td>
                    <td>User ${doc.uploadedByUserId}</td>
                    <td>${doc.createdAt ? doc.createdAt.split('T')[0] : ''}</td>
                    <td data-requires-role="admin">
                        <button class="btn btn-secondary btn-sm" style="color:var(--danger-color)" onclick="deleteDocument(${doc.id})"><i class="fa-solid fa-trash"></i></button>
                    </td>
                `;
                documentsTableBody.appendChild(tr);
            });
            applyRoleRestrictions();
        }
    }

    // Modal listeners & logic for Documents
    const documentModal = document.getElementById('document-modal');
    if(document.getElementById('btn-add-document')) {
        document.getElementById('btn-add-document').addEventListener('click', () => {
            document.getElementById('document-form').reset();
            document.getElementById('document-id').value = '';
            document.getElementById('document-modal-title').textContent = 'Upload Document';
            documentModal.classList.remove('hidden');
        });
        document.getElementById('btn-close-document-modal').addEventListener('click', () => documentModal.classList.add('hidden'));
        document.getElementById('btn-cancel-document-modal').addEventListener('click', () => documentModal.classList.add('hidden'));
        
        document.getElementById('document-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = document.getElementById('document-id').value;
            const data = {
                projectId: document.getElementById('document-project-id').value,
                fileName: document.getElementById('document-file-name').value,
                fileType: document.getElementById('document-file-type').value,
                fileUrl: document.getElementById('document-file-url').value,
                uploadedByUserId: document.getElementById('document-uploaded-by').value
            };
            try {
                if(id) {
                    await api.put('/documents/' + id, data);
                } else {
                    await api.post('/documents', data);
                }
                documentModal.classList.add('hidden');
                loadDocuments();
            } catch(err) { alert('Error saving document'); }
        });
    }

    window.deleteDocument = async (id) => {
        if(confirm('Are you sure you want to delete this document?')) {
            try { await api.delete('/documents/' + id); loadDocuments(); } catch(err) { alert('Error deleting document'); }
        }
    };

    // ── Functions: Analytics ──
    let budgetChartInstance = null;
    let completionChartInstance = null;

    function renderAnalytics() {
        if (!window.Chart) return;
        
        Chart.defaults.color = '#94a3b8'; // text-secondary
        Chart.defaults.font.family = 'Inter';

        // Destroy previous instances if they exist
        if (budgetChartInstance) budgetChartInstance.destroy();
        if (completionChartInstance) completionChartInstance.destroy();

        const ctxBudget = document.getElementById('budgetChart').getContext('2d');
        budgetChartInstance = new Chart(ctxBudget, {
            type: 'bar',
            data: {
                labels: ['Project Alpha', 'Project Beta', 'Project Gamma'],
                datasets: [
                    {
                        label: 'Budget',
                        data: [500000, 1200000, 300000],
                        backgroundColor: 'rgba(59, 130, 246, 0.5)',
                        borderColor: 'rgb(59, 130, 246)',
                        borderWidth: 1
                    },
                    {
                        label: 'Actual',
                        data: [450000, 1300000, 150000],
                        backgroundColor: 'rgba(239, 68, 68, 0.5)',
                        borderColor: 'rgb(239, 68, 68)',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    y: { beginAtZero: true, grid: { color: 'rgba(255, 255, 255, 0.1)' } },
                    x: { grid: { color: 'rgba(255, 255, 255, 0.1)' } }
                }
            }
        });

        const ctxCompletion = document.getElementById('completionChart').getContext('2d');
        completionChartInstance = new Chart(ctxCompletion, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Overall Portfolio Completion (%)',
                    data: [10, 25, 40, 55, 75, 92],
                    fill: false,
                    borderColor: 'rgb(16, 185, 129)',
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: { max: 100, min: 0, grid: { color: 'rgba(255, 255, 255, 0.1)' } },
                    x: { grid: { color: 'rgba(255, 255, 255, 0.1)' } }
                }
            }
        });
    }

    // ── Functions: Settings ──
    function renderSettings() {
        if (!currentUser) return;
        document.getElementById('settings-name').value = currentUser.name;
        document.getElementById('settings-email').value = currentUser.email;
        document.getElementById('settings-role').value = currentUser.role;
    }

    // ── Utility Functions ──
    function showLoading(type, show) {
        if (type === 'projects') {
            if (show) {
                projectsLoadingSpinner.classList.remove('hidden');
                projectsTableBody.innerHTML = '';
                projectsEmptyState.classList.add('hidden');
            } else {
                projectsLoadingSpinner.classList.add('hidden');
            }
        } else if (type === 'team') {
            if (show) {
                teamLoadingSpinner.classList.remove('hidden');
                teamTableBody.innerHTML = '';
                teamEmptyState.classList.add('hidden');
            } else {
                teamLoadingSpinner.classList.add('hidden');
            }
        } else if (type === 'documents') {
            if (show) {
                documentsLoadingSpinner.classList.remove('hidden');
                documentsTableBody.innerHTML = '';
                documentsEmptyState.classList.add('hidden');
            } else {
                documentsLoadingSpinner.classList.add('hidden');
            }
        }
    }

    function setSubmitting(type, submitting) {
        isSubmitting = submitting;
        if (type === 'project') {
            const btnText = document.getElementById('save-btn-text');
            const spinner = document.getElementById('save-spinner');
            const saveBtn = document.getElementById('btn-save-modal');
            if (submitting) { btnText.textContent = 'Saving...'; spinner.classList.remove('hidden'); saveBtn.disabled = true; } 
            else { btnText.textContent = 'Save Project'; spinner.classList.add('hidden'); saveBtn.disabled = false; }
        } else if (type === 'user') {
            const btnText = document.getElementById('save-user-btn-text');
            const spinner = document.getElementById('save-user-spinner');
            const saveBtn = document.getElementById('btn-save-user-modal');
            if (submitting) { btnText.textContent = 'Saving...'; spinner.classList.remove('hidden'); saveBtn.disabled = true; } 
            else { btnText.textContent = 'Save Member'; spinner.classList.add('hidden'); saveBtn.disabled = false; }
        }
    }

    function clearFormErrors() {
        document.querySelectorAll('.error-text').forEach(el => el.textContent = '');
    }

    function showToast(title, message, type = 'error') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        const icon = type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation';
        toast.innerHTML = `
            <i class="fa-solid ${icon}"></i>
            <div class="toast-content">
                <h4>${title}</h4>
                <p>${message}</p>
            </div>
        `;
        container.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            toast.style.transition = 'all 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 5000);
    }
// --- Attendance Logic ---
    const btnDirectoryTab = document.getElementById('btn-directory-tab');
    const btnAttendanceTab = document.getElementById('btn-attendance-tab');
    const teamDirectorySection = document.getElementById('team-directory-section');
    const teamAttendanceSection = document.getElementById('team-attendance-section');
    const btnLoadAttendance = document.getElementById('btn-load-attendance');
    const btnClockIn = document.getElementById('btn-clock-in');
    const attendanceDate = document.getElementById('attendance-date');
    const attendanceTableBody = document.getElementById('attendance-table-body');

    attendanceDate.valueAsDate = new Date();

    btnDirectoryTab.addEventListener('click', () => {
        btnDirectoryTab.classList.add('active');
        btnAttendanceTab.classList.remove('active');
        teamDirectorySection.classList.remove('hidden');
        teamAttendanceSection.classList.add('hidden');
    });

    btnAttendanceTab.addEventListener('click', () => {
        btnAttendanceTab.classList.add('active');
        btnDirectoryTab.classList.remove('active');
        teamAttendanceSection.classList.remove('hidden');
        teamDirectorySection.classList.add('hidden');
        loadAttendance();
    });

    btnLoadAttendance.addEventListener('click', loadAttendance);

    btnClockIn.addEventListener('click', async () => {
        try {
            await api.post('/attendance/clock-in', { user: { id: currentUser.id } });
            showToast('Success', 'Clocked in successfully', 'success');
            loadAttendance();
        } catch (error) {
            showToast('Error', 'Failed to clock in', 'error');
        }
    });

    window.clockOut = async (id) => {
        try {
            await api.put('/attendance/' + id + '/clock-out');
            showToast('Success', 'Clocked out successfully', 'success');
            loadAttendance();
        } catch (error) {
            showToast('Error', 'Failed to clock out', 'error');
        }
    };

    async function loadAttendance() {
        const date = attendanceDate.value;
        if (!date) return;
        try {
            const records = await api.get('/attendance/date/' + date);
            attendanceTableBody.innerHTML = records.map(r => "<tr><td>" + (r.user ? r.user.name : 'Unknown') + "</td><td>" + (r.clockIn ? new Date(r.clockIn).toLocaleTimeString() : '-') + "</td><td>" + (r.clockOut ? new Date(r.clockOut).toLocaleTimeString() : '-') + "</td><td><span class='status-badge status-active'>" + r.status + "</span></td><td>" + (!r.clockOut && (r.user && r.user.id === currentUser.id) ? "<button class='btn btn-secondary btn-sm' onclick='clockOut(" + r.id + ")'>Clock Out</button>" : '') + "</td></tr>").join('');
            if(records.length === 0) {
                attendanceTableBody.innerHTML = '<tr><td colspan="5" style="text-align:center;">No records found</td></tr>';
            }
        } catch (error) {
            console.error(error);
        }
    }

    // Make all data-tables horizontally scrollable to prevent overlapping
    // ==========================================
    // Contractors & Suppliers Module
    // ==========================================

    const btnTabSubcontractors = document.getElementById('btn-tab-subcontractors');
    const btnTabSuppliers = document.getElementById('btn-tab-suppliers');
    const subcontractorsView = document.getElementById('subcontractors-view');
    const suppliersView = document.getElementById('suppliers-view');

    if(btnTabSubcontractors) btnTabSubcontractors.addEventListener('click', () => {
        btnTabSubcontractors.classList.add('active');
        btnTabSuppliers.classList.remove('active');
        subcontractorsView.classList.remove('hidden');
        suppliersView.classList.add('hidden');
        loadSubcontractors();
    });

    if(btnTabSuppliers) btnTabSuppliers.addEventListener('click', () => {
        btnTabSuppliers.classList.add('active');
        btnTabSubcontractors.classList.remove('active');
        suppliersView.classList.remove('hidden');
        subcontractorsView.classList.add('hidden');
        loadSuppliers();
    });

    // Subcontractors
    async function loadContractors() {
        if(btnTabSubcontractors && btnTabSubcontractors.classList.contains('active')) {
            loadSubcontractors();
        } else {
            loadSuppliers();
        }
    }
    
    window.loadContractors = loadContractors; // Make globally accessible just in case

    async function loadSubcontractors() {
        try {
            const subs = await api.get('/suppliers/subcontractors');
            const tbody = document.getElementById('subcontractors-table-body');
            if(!tbody) return;
            tbody.innerHTML = '';
            subs.forEach(s => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td><span class="id-tag">#${s.id}</span></td>
                    <td>${s.name}</td>
                    <td>${s.contactName || ''}</td>
                    <td>${s.phone || ''}</td>
                    <td>${s.licenseNumber || ''}</td>
                    <td><span class="status-badge ${s.status === 'Active' ? 'status-active' : 'status-inactive'}">${s.status}</span></td>
                    <td data-requires-role="procurement,admin">
                        <button class="btn btn-secondary btn-sm" onclick="editSubcontractor(${s.id})"><i class="fa-solid fa-pen"></i></button>
                        <button class="btn btn-secondary btn-sm" style="color:var(--danger-color)" onclick="deleteSubcontractor(${s.id})"><i class="fa-solid fa-trash"></i></button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
            applyRoleRestrictions();
        } catch(e) {
            console.error('Failed to load subcontractors', e);
        }
    }

    const subcontractorModal = document.getElementById('subcontractor-modal');
    if(document.getElementById('btn-add-subcontractor')) {
        document.getElementById('btn-add-subcontractor').addEventListener('click', () => {
            document.getElementById('subcontractor-form').reset();
            document.getElementById('subcontractor-id').value = '';
            const idInput = document.getElementById('subcontractor-id-input');
            if(idInput) {
                idInput.value = '';
                idInput.disabled = false;
            }
            document.getElementById('subcontractor-modal-title').textContent = 'Add Subcontractor';
            subcontractorModal.classList.remove('hidden');
        });
    }

    if(document.getElementById('btn-close-subcontractor-modal')) {
        document.getElementById('btn-close-subcontractor-modal').addEventListener('click', () => subcontractorModal.classList.add('hidden'));
        document.getElementById('btn-cancel-subcontractor-modal').addEventListener('click', () => subcontractorModal.classList.add('hidden'));
    }

    if(document.getElementById('subcontractor-form')) {
        document.getElementById('subcontractor-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = document.getElementById('subcontractor-id').value;
            const customId = document.getElementById('subcontractor-id-input')?.value?.trim();
            const data = {
                name: document.getElementById('subcontractor-name').value,
                contactName: document.getElementById('subcontractor-contact').value,
                phone: document.getElementById('subcontractor-phone').value,
                email: document.getElementById('subcontractor-email').value,
                licenseNumber: document.getElementById('subcontractor-license').value,
                insuranceExpiry: document.getElementById('subcontractor-insurance').value,
                status: document.getElementById('subcontractor-status').value
            };
            if(!id && customId) {
                data.id = parseInt(customId, 10);
            }
            try {
                if(id) {
                    await api.put('/suppliers/subcontractors/' + id, data);
                } else {
                    await api.post('/suppliers/subcontractors', data);
                }
                subcontractorModal.classList.add('hidden');
                loadSubcontractors();
            } catch(error) {
                alert(error.message || 'Error saving subcontractor');
            }
        });
    }

    window.editSubcontractor = async (id) => {
        try {
            const subs = await api.get('/suppliers/subcontractors');
            const sub = subs.find(s => s.id === id);
            if(sub) {
                document.getElementById('subcontractor-id').value = sub.id;
                const idInput = document.getElementById('subcontractor-id-input');
                if(idInput) {
                    idInput.value = sub.id;
                    idInput.disabled = true;
                }
                document.getElementById('subcontractor-name').value = sub.name;
                document.getElementById('subcontractor-contact').value = sub.contactName || '';
                document.getElementById('subcontractor-phone').value = sub.phone || '';
                document.getElementById('subcontractor-email').value = sub.email || '';
                document.getElementById('subcontractor-license').value = sub.licenseNumber || '';
                if(sub.insuranceExpiry) {
                    document.getElementById('subcontractor-insurance').value = sub.insuranceExpiry.split('T')[0];
                }
                document.getElementById('subcontractor-status').value = sub.status || 'Active';
                document.getElementById('subcontractor-modal-title').textContent = `Edit Subcontractor (ID: #${sub.id})`;
                subcontractorModal.classList.remove('hidden');
            }
        } catch(e) { console.error(e); }
    };

    window.deleteSubcontractor = async (id) => {
        if(confirm('Are you sure you want to delete this subcontractor?')) {
            try {
                await api.delete('/suppliers/subcontractors/' + id);
                loadSubcontractors();
            } catch(e) {
                alert('Error deleting subcontractor');
            }
        }
    };

    // Suppliers
    async function loadSuppliers() {
        try {
            const suppliers = await api.get('/suppliers');
            const tbody = document.getElementById('suppliers-table-body');
            if(!tbody) return;
            tbody.innerHTML = '';
            suppliers.forEach(s => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td><span class="id-tag">#${s.id}</span></td>
                    <td>${s.name} ${!s.active ? '<span class="status-badge status-inactive">Inactive</span>' : ''}</td>
                    <td>${s.contactName || ''}</td>
                    <td>${s.phone || ''}</td>
                    <td>${s.type || ''}</td>
                    <td>${s.rating ? s.rating + '/5' : 'N/A'}</td>
                    <td data-requires-role="procurement,admin">
                        <button class="btn btn-secondary btn-sm" onclick="editSupplier(${s.id})"><i class="fa-solid fa-pen"></i></button>
                        <button class="btn btn-secondary btn-sm" style="color:var(--danger-color)" onclick="deleteSupplier(${s.id})"><i class="fa-solid fa-trash"></i></button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
            applyRoleRestrictions();
        } catch(e) {
            console.error('Failed to load suppliers', e);
        }
    }

    const supplierModal = document.getElementById('supplier-modal');
    if(document.getElementById('btn-add-supplier')) {
        document.getElementById('btn-add-supplier').addEventListener('click', () => {
            document.getElementById('supplier-form').reset();
            document.getElementById('supplier-id').value = '';
            const idInput = document.getElementById('supplier-id-input');
            if(idInput) {
                idInput.value = '';
                idInput.disabled = false;
            }
            document.getElementById('supplier-active').checked = true;
            document.getElementById('supplier-modal-title').textContent = 'Add Supplier';
            supplierModal.classList.remove('hidden');
        });
    }

    if(document.getElementById('btn-close-supplier-modal')) {
        document.getElementById('btn-close-supplier-modal').addEventListener('click', () => supplierModal.classList.add('hidden'));
        document.getElementById('btn-cancel-supplier-modal').addEventListener('click', () => supplierModal.classList.add('hidden'));
    }

    if(document.getElementById('supplier-form')) {
        document.getElementById('supplier-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = document.getElementById('supplier-id').value;
            const customId = document.getElementById('supplier-id-input')?.value?.trim();
            const data = {
                name: document.getElementById('supplier-name').value,
                contactName: document.getElementById('supplier-contact').value,
                phone: document.getElementById('supplier-phone').value,
                email: document.getElementById('supplier-email').value,
                type: document.getElementById('supplier-type').value,
                active: document.getElementById('supplier-active').checked
            };
            if(!id && customId) {
                data.id = parseInt(customId, 10);
            }
            try {
                if(id) {
                    await api.put('/suppliers/' + id, data);
                } else {
                    await api.post('/suppliers', data);
                }
                supplierModal.classList.add('hidden');
                loadSuppliers();
            } catch(error) {
                alert(error.message || 'Error saving supplier');
            }
        });
    }

    window.editSupplier = async (id) => {
        try {
            const suppliers = await api.get('/suppliers');
            const sub = suppliers.find(s => s.id === id);
            if(sub) {
                document.getElementById('supplier-id').value = sub.id;
                const idInput = document.getElementById('supplier-id-input');
                if(idInput) {
                    idInput.value = sub.id;
                    idInput.disabled = true;
                }
                document.getElementById('supplier-name').value = sub.name;
                document.getElementById('supplier-contact').value = sub.contactName || '';
                document.getElementById('supplier-phone').value = sub.phone || '';
                document.getElementById('supplier-email').value = sub.email || '';
                document.getElementById('supplier-type').value = sub.type || '';
                document.getElementById('supplier-active').checked = sub.active;
                document.getElementById('supplier-modal-title').textContent = `Edit Supplier (ID: #${sub.id})`;
                supplierModal.classList.remove('hidden');
            }
        } catch(e) { console.error(e); }
    };

    window.deleteSupplier = async (id) => {
        if(confirm('Are you sure you want to delete this supplier?')) {
            try {
                await api.delete('/suppliers/' + id);
                loadSuppliers();
            } catch(e) {
                alert('Error deleting supplier');
            }
        }
    };

    function makeTablesResponsive() {
        document.querySelectorAll('table.data-table').forEach(table => {
            if (!table.parentElement.classList.contains('table-responsive')) {
                const wrapper = document.createElement('div');
                wrapper.className = 'table-responsive';
                table.parentNode.insertBefore(wrapper, table);
                wrapper.appendChild(table);
            }
        });
    }
    makeTablesResponsive();

    function applyRoleRestrictions() {
        if (!currentUser) return;
        const role = currentUser.role.toLowerCase();
        
        document.querySelectorAll('[data-requires-role]').forEach(el => {
            const requiredRoles = el.getAttribute('data-requires-role').split(',').map(r => r.trim().toLowerCase());
            if (requiredRoles.includes(role) || role === 'admin') {
                el.style.display = ''; // Reset to default
            } else {
                el.style.display = 'none';
            }
        });
        
        // Inventory View Specific Restrictions
        const btnNewInventoryItem = document.getElementById('btn-new-item');
        if (role === 'client') {
            if (btnNewInventoryItem) btnNewInventoryItem.style.display = 'none';
            const tabContainer = document.querySelector('.tabs');
            if (tabContainer) tabContainer.style.display = 'none';
        } else if (role !== 'admin' && role !== 'procurement' && role !== 'inventory_manager') {
            if (btnNewInventoryItem) btnNewInventoryItem.style.display = 'none';
        }
    }


    // ── Assign PM Logic ──
    const assignPmModal = document.getElementById('assign-pm-modal');
    const assignPmForm = document.getElementById('assign-pm-form');
    const btnCloseAssignPm = document.getElementById('btn-close-assign-pm');
    const btnCancelAssignPm = document.getElementById('btn-cancel-assign-pm');
    const assignPmUserId = document.getElementById('assign-pm-user-id');
    const assignPmProjectId = document.getElementById('assign-pm-project-id');

    if (btnCloseAssignPm) btnCloseAssignPm.addEventListener('click', () => assignPmModal.classList.add('hidden'));
    if (btnCancelAssignPm) btnCancelAssignPm.addEventListener('click', () => assignPmModal.classList.add('hidden'));

    window.assignPm = async function(projectId) {
        assignPmProjectId.value = projectId;
        try {
            const users = await api.get('/users');
            // Filter to pm or site_engineer
            const staff = users.filter(u => u.role.toLowerCase() === 'pm' || u.role.toLowerCase() === 'site_engineer');
            assignPmUserId.innerHTML = '<option value="">-- Select Staff --</option>';
            staff.forEach(u => {
                const opt = document.createElement('option');
                opt.value = u.id;
                opt.textContent = `${u.name} (${u.role})`;
                assignPmUserId.appendChild(opt);
            });
            assignPmModal.classList.remove('hidden');
        } catch (err) {
            showToast('Error', 'Failed to load users', 'error');
        }
    };

    if (assignPmForm) {
        assignPmForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const projectId = assignPmProjectId.value;
            const userId = assignPmUserId.value;
            if (!userId) return;

            try {
                await api.post(`/projects/${projectId}/assignments/${userId}`, {});
                showToast('Success', 'Staff assigned to project', 'success');
                assignPmModal.classList.add('hidden');
            } catch (err) {
                showToast('Error', 'Failed to assign staff. They might already be assigned.', 'error');
            }
        });
    }

    // ══════════════════════════════════════════════════════════════════════
    // 🚀 NEW MODULES: Tasks, Daily Logs, Punch List, Safety, RFIs & Submittals
    // ══════════════════════════════════════════════════════════════════════

    // ── Helper: Escape HTML ──
    function escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    // ── Helper: Populate Project & Assignee Dropdowns ──
    async function populateDropdowns() {
        if (projects.length === 0) {
            try { projects = await api.get('/projects'); } catch(e) {}
        }
        if (team.length === 0) {
            try { team = await api.get('/users'); } catch(e) {}
        }

        const projectFilters = [tasksProjectFilter, dailyLogsProjectFilter, punchProjectFilter, safetyProjectFilter, rfisProjectFilter];
        projectFilters.forEach(select => {
            if (!select) return;
            const currentVal = select.value;
            select.innerHTML = '<option value="">All Projects</option>';
            projects.forEach(p => {
                const opt = document.createElement('option');
                opt.value = p.id;
                opt.textContent = p.name;
                select.appendChild(opt);
            });
            if (currentVal) select.value = currentVal;
        });

        const projectModalSelects = [
            document.getElementById('task-project-id'),
            document.getElementById('log-project-id'),
            document.getElementById('punch-project-id'),
            document.getElementById('safety-project-id'),
            document.getElementById('rfi-project-id'),
            document.getElementById('submittal-project-id')
        ];
        projectModalSelects.forEach(select => {
            if (!select) return;
            const currentVal = select.value;
            select.innerHTML = '<option value="">-- Select Project --</option>';
            projects.forEach(p => {
                const opt = document.createElement('option');
                opt.value = p.id;
                opt.textContent = p.name;
                select.appendChild(opt);
            });
            if (currentVal) select.value = currentVal;
        });

        const assignedSelect = document.getElementById('task-assigned-user');
        if (assignedSelect) {
            const currentVal = assignedSelect.value;
            assignedSelect.innerHTML = '<option value="">-- Unassigned --</option>';
            team.forEach(u => {
                const opt = document.createElement('option');
                opt.value = u.id;
                opt.textContent = `${u.name} (${u.role})`;
                assignedSelect.appendChild(opt);
            });
            if (currentVal) assignedSelect.value = currentVal;
        }
    }

    // Modal Helper: Wire close handlers
    function setupModalClose(modal, closeBtn, cancelBtn) {
        if (closeBtn) closeBtn.addEventListener('click', () => modal.classList.add('hidden'));
        if (cancelBtn) cancelBtn.addEventListener('click', () => modal.classList.add('hidden'));
        if (modal) modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.add('hidden');
        });
    }

    // ──────────────────────────────────────────────────────────────────────
    // 1. TASKS & SCHEDULING (FULL CRUD: POST, GET, PUT, DELETE)
    // ──────────────────────────────────────────────────────────────────────
    setupModalClose(taskModal, btnCloseTaskModal, btnCancelTaskModal);

    if (tasksProjectFilter) {
        tasksProjectFilter.addEventListener('change', () => loadTasks());
    }

    if (btnAddTask) {
        btnAddTask.addEventListener('click', () => {
            taskForm.reset();
            document.getElementById('task-id').value = '';
            document.getElementById('task-modal-title').textContent = 'New Task';
            document.getElementById('task-percent').value = 0;
            document.getElementById('task-percent-display').textContent = '0%';
            if (tasksProjectFilter && tasksProjectFilter.value) {
                document.getElementById('task-project-id').value = tasksProjectFilter.value;
            }
            taskModal.classList.remove('hidden');
        });
    }

    if (taskForm) {
        taskForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = document.getElementById('task-id').value;
            const userSelect = document.getElementById('task-assigned-user');
            const payload = {
                projectId: Number(document.getElementById('task-project-id').value),
                name: document.getElementById('task-name').value.trim(),
                startDate: document.getElementById('task-start-date').value || null,
                endDate: document.getElementById('task-end-date').value || null,
                assignedUserId: userSelect.value ? Number(userSelect.value) : null,
                assignedName: userSelect.value && userSelect.selectedOptions[0] ? userSelect.selectedOptions[0].text.split(' (')[0] : null,
                percentComplete: Number(document.getElementById('task-percent').value || 0),
                status: document.getElementById('task-status').value,
                isMilestone: document.getElementById('task-is-milestone').checked,
                isCritical: document.getElementById('task-is-critical').checked
            };

            try {
                if (id) {
                    await api.put(`/tasks/${id}`, payload);
                    showToast('Success', 'Task updated successfully', 'success');
                } else {
                    await api.post('/tasks', payload);
                    showToast('Success', 'Task created successfully', 'success');
                }
                taskModal.classList.add('hidden');
                loadTasks();
            } catch (err) {
                showToast('Error', err.message || 'Failed to save task', 'error');
            }
        });
    }

    async function loadTasks(projectId) {
        projectId = projectId || (tasksProjectFilter ? tasksProjectFilter.value : '');
        if (loadingTasks) loadingTasks.classList.remove('hidden');
        if (emptyTasks) emptyTasks.classList.add('hidden');
        if (tasksTableBody) tasksTableBody.innerHTML = '';
        try {
            const endpoint = projectId ? `/tasks/project/${projectId}` : '/tasks';
            allTasks = await api.get(endpoint) || [];
            renderTasksTable();
        } catch (err) {
            showToast('Error', 'Failed to load tasks: ' + err.message, 'error');
            renderTasksTable();
        } finally {
            if (loadingTasks) loadingTasks.classList.add('hidden');
        }
    }

    function renderTasksTable() {
        if (!tasksTableBody) return;
        tasksTableBody.innerHTML = '';
        const total = allTasks.length;
        const progress = allTasks.filter(t => t.status === 'in_progress').length;
        const completed = allTasks.filter(t => t.status === 'completed').length;
        const critical = allTasks.filter(t => t.isCritical || t.critical || t.isMilestone || t.milestone).length;

        const elTotal = document.getElementById('stat-tasks-total');
        const elProgress = document.getElementById('stat-tasks-progress');
        const elCompleted = document.getElementById('stat-tasks-completed');
        const elCritical = document.getElementById('stat-tasks-critical');

        if (elTotal) elTotal.textContent = total;
        if (elProgress) elProgress.textContent = progress;
        if (elCompleted) elCompleted.textContent = completed;
        if (elCritical) elCritical.textContent = critical;

        if (total === 0) {
            if (emptyTasks) emptyTasks.classList.remove('hidden');
            return;
        }
        if (emptyTasks) emptyTasks.classList.add('hidden');

        allTasks.forEach(task => {
            const p = projects.find(proj => proj.id === task.projectId);
            const isMilestone = task.isMilestone || task.milestone;
            const isCritical = task.isCritical || task.critical;
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>
                    <div style="font-weight: 600;">${escapeHtml(task.name)}</div>
                    <div style="font-size: 11px; color: var(--text-secondary); display:flex; gap:6px; margin-top:3px;">
                        ${isMilestone ? '<span class="stat-pill" style="color:#fbbf24;"><i class="fa-solid fa-flag"></i> Milestone</span>' : ''}
                        ${isCritical ? '<span class="stat-pill" style="color:#f87171;"><i class="fa-solid fa-fire"></i> Critical Path</span>' : ''}
                    </div>
                </td>
                <td>${p ? escapeHtml(p.name) : 'Project #' + task.projectId}</td>
                <td>
                    <div>${task.startDate || '—'}</div>
                    <div style="font-size:12px; color:var(--text-secondary)">to ${task.endDate || '—'}</div>
                </td>
                <td>${escapeHtml(task.assignedName || 'Unassigned')}</td>
                <td>
                    <div class="progress-bar-container">
                        <div class="progress-bar-fill" style="width: ${task.percentComplete || 0}%"></div>
                    </div>
                    <span style="font-size: 12px; font-weight: 600;">${task.percentComplete || 0}%</span>
                </td>
                <td>
                    <span class="status-badge status-${task.status}">
                        ${task.status ? task.status.replace('_', ' ').toUpperCase() : 'PENDING'}
                    </span>
                </td>
                <td style="text-align: right;">
                    <button class="btn-icon" onclick="editTask(${task.id})" title="Edit Task" data-requires-role="pm,admin"><i class="fa-solid fa-pen-to-square"></i></button>
                    <button class="btn-icon danger" onclick="deleteTask(${task.id})" title="Delete Task" data-requires-role="pm,admin"><i class="fa-solid fa-trash"></i></button>
                </td>
            `;
            tasksTableBody.appendChild(tr);
        });
        applyRoleRestrictions();
    }

    window.editTask = function(id) {
        const task = allTasks.find(t => t.id === id);
        if (!task) return;
        document.getElementById('task-id').value = task.id;
        document.getElementById('task-modal-title').textContent = 'Edit Task';
        document.getElementById('task-project-id').value = task.projectId;
        document.getElementById('task-name').value = task.name;
        document.getElementById('task-start-date').value = task.startDate || '';
        document.getElementById('task-end-date').value = task.endDate || '';
        document.getElementById('task-assigned-user').value = task.assignedUserId || '';
        document.getElementById('task-status').value = task.status || 'pending';
        document.getElementById('task-percent').value = task.percentComplete || 0;
        document.getElementById('task-percent-display').textContent = (task.percentComplete || 0) + '%';
        document.getElementById('task-is-milestone').checked = Boolean(task.isMilestone || task.milestone);
        document.getElementById('task-is-critical').checked = Boolean(task.isCritical || task.critical);
        taskModal.classList.remove('hidden');
    };

    window.deleteTask = async function(id) {
        if (!confirm('Are you sure you want to delete this task?')) return;
        try {
            await api.delete(`/tasks/${id}`);
            showToast('Success', 'Task deleted successfully', 'success');
            loadTasks();
        } catch (err) {
            showToast('Error', 'Failed to delete task: ' + err.message, 'error');
        }
    };

    // ──────────────────────────────────────────────────────────────────────
    // 2. DAILY FIELD LOGS (FULL CRUD & PM SIGN-OFF: POST, GET, PUT, DELETE)
    // ──────────────────────────────────────────────────────────────────────
    setupModalClose(dailyLogModal, btnCloseDailyLogModal, btnCancelDailyLogModal);

    if (dailyLogsProjectFilter) {
        dailyLogsProjectFilter.addEventListener('change', () => loadDailyLogs());
    }

    if (btnAddDailyLog) {
        btnAddDailyLog.addEventListener('click', () => {
            dailyLogForm.reset();
            document.getElementById('log-id').value = '';
            document.getElementById('daily-log-modal-title').textContent = 'New Daily Field Log';
            document.getElementById('log-date').value = new Date().toISOString().split('T')[0];
            document.getElementById('log-manpower').value = 1;
            if (dailyLogsProjectFilter && dailyLogsProjectFilter.value) {
                document.getElementById('log-project-id').value = dailyLogsProjectFilter.value;
            }
            dailyLogModal.classList.remove('hidden');
        });
    }

    if (dailyLogForm) {
        dailyLogForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = document.getElementById('log-id').value;
            const payload = {
                projectId: Number(document.getElementById('log-project-id').value),
                logDate: document.getElementById('log-date').value,
                weather: document.getElementById('log-weather').value,
                temperature: document.getElementById('log-temp').value.trim() || null,
                manpowerCount: Number(document.getElementById('log-manpower').value || 0),
                workPerformed: document.getElementById('log-work').value.trim(),
                delays: document.getElementById('log-delays').value.trim() || null
            };

            try {
                if (id) {
                    await api.put(`/daily-logs/${id}`, payload);
                    showToast('Success', 'Daily log updated', 'success');
                } else {
                    await api.post('/daily-logs', payload);
                    showToast('Success', 'Daily log created', 'success');
                }
                dailyLogModal.classList.add('hidden');
                loadDailyLogs();
            } catch (err) {
                showToast('Error', err.message || 'Failed to save daily log', 'error');
            }
        });
    }

    async function loadDailyLogs(projectId) {
        projectId = projectId || (dailyLogsProjectFilter ? dailyLogsProjectFilter.value : '');
        if (loadingDailyLogs) loadingDailyLogs.classList.remove('hidden');
        if (emptyDailyLogs) emptyDailyLogs.classList.add('hidden');
        if (dailyLogsTableBody) dailyLogsTableBody.innerHTML = '';
        try {
            const endpoint = projectId ? `/daily-logs/project/${projectId}` : '/daily-logs';
            allDailyLogs = await api.get(endpoint) || [];
            renderDailyLogsTable();
        } catch (err) {
            showToast('Error', 'Failed to load daily logs: ' + err.message, 'error');
            renderDailyLogsTable();
        } finally {
            if (loadingDailyLogs) loadingDailyLogs.classList.add('hidden');
        }
    }

    function renderDailyLogsTable() {
        if (!dailyLogsTableBody) return;
        dailyLogsTableBody.innerHTML = '';
        const total = allDailyLogs.length;
        const signed = allDailyLogs.filter(l => l.isSigned || l.signed).length;
        const pending = total - signed;
        const manpower = allDailyLogs.reduce((sum, l) => sum + (Number(l.manpowerCount) || 0), 0);

        const elTotal = document.getElementById('stat-logs-total');
        const elSigned = document.getElementById('stat-logs-signed');
        const elPending = document.getElementById('stat-logs-pending');
        const elManpower = document.getElementById('stat-logs-manpower');

        if (elTotal) elTotal.textContent = total;
        if (elSigned) elSigned.textContent = signed;
        if (elPending) elPending.textContent = pending;
        if (elManpower) elManpower.textContent = manpower;

        if (total === 0) {
            if (emptyDailyLogs) emptyDailyLogs.classList.remove('hidden');
            return;
        }
        if (emptyDailyLogs) emptyDailyLogs.classList.add('hidden');

        allDailyLogs.forEach(log => {
            const p = projects.find(proj => proj.id === log.projectId);
            const isSigned = log.isSigned || log.signed;
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td style="font-weight: 600;">${log.logDate}</td>
                <td>${p ? escapeHtml(p.name) : 'Project #' + log.projectId}</td>
                <td>${escapeHtml(log.weather || 'Clear')} ${log.temperature ? '• ' + escapeHtml(log.temperature) : ''}</td>
                <td><span class="stat-pill"><i class="fa-solid fa-users"></i> ${log.manpowerCount} workers</span></td>
                <td style="max-width: 250px;">
                    <div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${escapeHtml(log.workPerformed || '')}">
                        ${escapeHtml(log.workPerformed || '—')}
                    </div>
                </td>
                <td style="max-width: 180px; color: var(--text-secondary);">
                    <div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${escapeHtml(log.delays || '')}">
                        ${escapeHtml(log.delays || 'None')}
                    </div>
                </td>
                <td>
                    ${isSigned 
                        ? `<span class="status-badge status-signed"><i class="fa-solid fa-check"></i> Signed (${escapeHtml(log.signedByName || 'PM')})</span>`
                        : `<span class="status-badge status-unsigned"><i class="fa-solid fa-clock"></i> Unsigned</span>`
                    }
                </td>
                <td style="text-align: right;">
                    ${!isSigned ? `<button class="btn btn-sm btn-primary" onclick="signDailyLog(${log.id})" title="Sign & Approve as PM" style="padding: 4px 8px; font-size: 11px; margin-right: 4px;" data-requires-role="pm,admin"><i class="fa-solid fa-file-signature"></i> Sign</button>` : ''}
                    <button class="btn-icon" onclick="editDailyLog(${log.id})" title="Edit Log"><i class="fa-solid fa-pen-to-square"></i></button>
                    <button class="btn-icon danger" onclick="deleteDailyLog(${log.id})" title="Delete Log"><i class="fa-solid fa-trash"></i></button>
                </td>
            `;
            dailyLogsTableBody.appendChild(tr);
        });
        applyRoleRestrictions();
    }

    window.signDailyLog = async function(id) {
        try {
            await api.put(`/daily-logs/${id}`, {
                isSigned: true,
                signedByName: currentUser?.name || 'Marcus Brody (PM)'
            });
            showToast('Approved', 'Daily field log formally signed & approved', 'success');
            loadDailyLogs();
        } catch (err) {
            showToast('Error', 'Failed to sign log: ' + err.message, 'error');
        }
    };

    window.editDailyLog = function(id) {
        const log = allDailyLogs.find(l => l.id === id);
        if (!log) return;
        document.getElementById('log-id').value = log.id;
        document.getElementById('daily-log-modal-title').textContent = 'Edit Daily Log';
        document.getElementById('log-project-id').value = log.projectId;
        document.getElementById('log-date').value = log.logDate || '';
        document.getElementById('log-weather').value = log.weather || 'Sunny';
        document.getElementById('log-temp').value = log.temperature || '';
        document.getElementById('log-manpower').value = log.manpowerCount || 0;
        document.getElementById('log-work').value = log.workPerformed || '';
        document.getElementById('log-delays').value = log.delays || '';
        dailyLogModal.classList.remove('hidden');
    };

    window.deleteDailyLog = async function(id) {
        if (!confirm('Are you sure you want to delete this daily field log?')) return;
        try {
            await api.delete(`/daily-logs/${id}`);
            showToast('Success', 'Daily log deleted', 'success');
            loadDailyLogs();
        } catch (err) {
            showToast('Error', 'Failed to delete daily log: ' + err.message, 'error');
        }
    };

    // ──────────────────────────────────────────────────────────────────────
    // 3. PUNCH LIST ITEMS (FULL CRUD & CLOSEOUT: POST, GET, PUT, DELETE)
    // ──────────────────────────────────────────────────────────────────────
    setupModalClose(punchModal, btnClosePunchModal, btnCancelPunchModal);

    if (punchProjectFilter) {
        punchProjectFilter.addEventListener('change', () => loadPunchItems());
    }

    // Punch sub-tab filter buttons
    const punchTabs = [
        { id: 'btn-punch-filter-all', filter: 'all' },
        { id: 'btn-punch-filter-open', filter: 'open' },
        { id: 'btn-punch-filter-review', filter: 'ready_review' },
        { id: 'btn-punch-filter-closed', filter: 'closed' }
    ];
    punchTabs.forEach(tab => {
        const btn = document.getElementById(tab.id);
        if (btn) {
            btn.addEventListener('click', () => {
                punchTabs.forEach(t => document.getElementById(t.id)?.classList.remove('active'));
                btn.classList.add('active');
                punchCurrentFilter = tab.filter;
                renderPunchTable();
            });
        }
    });

    if (btnAddPunch) {
        btnAddPunch.addEventListener('click', () => {
            punchForm.reset();
            document.getElementById('punch-id').value = '';
            document.getElementById('punch-modal-title').textContent = 'New Punch Item';
            if (punchProjectFilter && punchProjectFilter.value) {
                document.getElementById('punch-project-id').value = punchProjectFilter.value;
            }
            punchModal.classList.remove('hidden');
        });
    }

    if (punchForm) {
        punchForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = document.getElementById('punch-id').value;
            const payload = {
                projectId: Number(document.getElementById('punch-project-id').value),
                location: document.getElementById('punch-location').value.trim(),
                description: document.getElementById('punch-description').value.trim(),
                responsibleParty: document.getElementById('punch-responsible').value.trim() || null,
                dueDate: document.getElementById('punch-due-date').value || null,
                status: document.getElementById('punch-status').value
            };

            try {
                if (id) {
                    await api.put(`/punch/${id}`, payload);
                    showToast('Success', 'Punch item updated', 'success');
                } else {
                    await api.post('/punch', payload);
                    showToast('Success', 'Punch item reported', 'success');
                }
                punchModal.classList.add('hidden');
                loadPunchItems();
            } catch (err) {
                showToast('Error', err.message || 'Failed to save punch item', 'error');
            }
        });
    }

    async function loadPunchItems(projectId) {
        projectId = projectId || (punchProjectFilter ? punchProjectFilter.value : '');
        if (loadingPunch) loadingPunch.classList.remove('hidden');
        if (emptyPunch) emptyPunch.classList.add('hidden');
        if (punchTableBody) punchTableBody.innerHTML = '';
        try {
            const endpoint = projectId ? `/punch/project/${projectId}` : '/punch';
            allPunchItems = await api.get(endpoint) || [];
            renderPunchTable();
        } catch (err) {
            showToast('Error', 'Failed to load punch items: ' + err.message, 'error');
            renderPunchTable();
        } finally {
            if (loadingPunch) loadingPunch.classList.add('hidden');
        }
    }

    function renderPunchTable() {
        if (!punchTableBody) return;
        punchTableBody.innerHTML = '';
        const total = allPunchItems.length;
        const open = allPunchItems.filter(p => p.status === 'open').length;
        const review = allPunchItems.filter(p => p.status === 'ready_review').length;
        const closed = allPunchItems.filter(p => p.status === 'closed').length;

        const elTotal = document.getElementById('stat-punch-total');
        const elOpen = document.getElementById('stat-punch-open');
        const elReview = document.getElementById('stat-punch-review');
        const elClosed = document.getElementById('stat-punch-closed');

        if (elTotal) elTotal.textContent = total;
        if (elOpen) elOpen.textContent = open;
        if (elReview) elReview.textContent = review;
        if (elClosed) elClosed.textContent = closed;

        let filtered = allPunchItems;
        if (punchCurrentFilter !== 'all') {
            filtered = allPunchItems.filter(p => p.status === punchCurrentFilter);
        }

        if (filtered.length === 0) {
            if (emptyPunch) emptyPunch.classList.remove('hidden');
            return;
        }
        if (emptyPunch) emptyPunch.classList.add('hidden');

        filtered.forEach(p => {
            const proj = projects.find(pr => pr.id === p.projectId);
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td style="font-weight: 600;">PUNCH-${String(p.id).padStart(4, '0')}</td>
                <td>${proj ? escapeHtml(proj.name) : 'Project #' + p.projectId}</td>
                <td>${escapeHtml(p.location)}</td>
                <td style="max-width: 250px;">
                    <div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${escapeHtml(p.description)}">
                        ${escapeHtml(p.description)}
                    </div>
                </td>
                <td>${escapeHtml(p.responsibleParty || 'Unassigned')}</td>
                <td>${p.dueDate || '—'}</td>
                <td>
                    <span class="status-badge status-${p.status}">
                        ${p.status === 'ready_review' ? 'READY REVIEW' : p.status.toUpperCase()}
                    </span>
                </td>
                <td style="text-align: right;">
                    ${p.status === 'open' ? `<button class="btn btn-sm btn-secondary" onclick="readyPunchItem(${p.id})" title="Mark Ready for Review" style="padding:4px 8px; font-size:11px; margin-right:4px;"><i class="fa-solid fa-eye"></i> Ready</button>` : ''}
                    ${p.status !== 'closed' ? `<button class="btn btn-sm btn-primary" onclick="closePunchItem(${p.id})" title="Sign-off & Close Item" style="padding:4px 8px; font-size:11px; margin-right:4px;"><i class="fa-solid fa-check-double"></i> Close</button>` : ''}
                    <button class="btn-icon" onclick="editPunchItem(${p.id})" title="Edit Punch Item"><i class="fa-solid fa-pen-to-square"></i></button>
                    <button class="btn-icon danger" onclick="deletePunchItem(${p.id})" title="Delete"><i class="fa-solid fa-trash"></i></button>
                </td>
            `;
            punchTableBody.appendChild(tr);
        });
        applyRoleRestrictions();
    }

    window.readyPunchItem = async function(id) {
        try {
            await api.put(`/punch/${id}`, { status: 'ready_review' });
            showToast('Updated', 'Punch item marked ready for review', 'success');
            loadPunchItems();
        } catch (err) {
            showToast('Error', 'Failed to update punch item: ' + err.message, 'error');
        }
    };

    window.closePunchItem = async function(id) {
        try {
            await api.put(`/punch/${id}`, { status: 'closed' });
            showToast('Closed', 'Punch item verified and marked closed', 'success');
            loadPunchItems();
        } catch (err) {
            showToast('Error', 'Failed to close punch item: ' + err.message, 'error');
        }
    };

    window.editPunchItem = function(id) {
        const item = allPunchItems.find(p => p.id === id);
        if (!item) return;
        document.getElementById('punch-id').value = item.id;
        document.getElementById('punch-modal-title').textContent = 'Edit Punch Item';
        document.getElementById('punch-project-id').value = item.projectId;
        document.getElementById('punch-location').value = item.location || '';
        document.getElementById('punch-description').value = item.description || '';
        document.getElementById('punch-responsible').value = item.responsibleParty || '';
        document.getElementById('punch-due-date').value = item.dueDate || '';
        document.getElementById('punch-status').value = item.status || 'open';
        punchModal.classList.remove('hidden');
    };

    window.deletePunchItem = async function(id) {
        if (!confirm('Are you sure you want to delete this punch item?')) return;
        try {
            await api.delete(`/punch/${id}`);
            showToast('Success', 'Punch item deleted', 'success');
            loadPunchItems();
        } catch (err) {
            showToast('Error', 'Failed to delete punch item: ' + err.message, 'error');
        }
    };

    // ──────────────────────────────────────────────────────────────────────
    // 4. SAFETY INCIDENTS (FULL CRUD & RESOLUTION: POST, GET, PUT, DELETE)
    // ──────────────────────────────────────────────────────────────────────
    setupModalClose(safetyModal, btnCloseSafetyModal, btnCancelSafetyModal);

    if (safetyProjectFilter) {
        safetyProjectFilter.addEventListener('change', () => loadSafetyIncidents());
    }

    if (btnAddSafety) {
        btnAddSafety.addEventListener('click', () => {
            safetyForm.reset();
            document.getElementById('safety-id').value = '';
            document.getElementById('safety-modal-title').textContent = 'Report Safety Incident / Hazard';
            document.getElementById('safety-date').value = new Date().toISOString().split('T')[0];
            if (safetyProjectFilter && safetyProjectFilter.value) {
                document.getElementById('safety-project-id').value = safetyProjectFilter.value;
            }
            safetyModal.classList.remove('hidden');
        });
    }

    if (safetyForm) {
        safetyForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = document.getElementById('safety-id').value;
            const payload = {
                projectId: Number(document.getElementById('safety-project-id').value),
                incidentDate: document.getElementById('safety-date').value,
                severity: document.getElementById('safety-severity').value,
                description: document.getElementById('safety-desc').value.trim(),
                actionTaken: document.getElementById('safety-action').value.trim() || null,
                status: document.getElementById('safety-status').value
            };

            try {
                if (id) {
                    await api.put(`/safety/${id}`, payload);
                    showToast('Success', 'Safety report updated', 'success');
                } else {
                    await api.post('/safety', payload);
                    showToast('Success', 'Safety report recorded', 'success');
                }
                safetyModal.classList.add('hidden');
                loadSafetyIncidents();
            } catch (err) {
                showToast('Error', err.message || 'Failed to submit safety incident', 'error');
            }
        });
    }

    async function loadSafetyIncidents(projectId) {
        projectId = projectId || (safetyProjectFilter ? safetyProjectFilter.value : '');
        if (loadingSafety) loadingSafety.classList.remove('hidden');
        if (emptySafety) emptySafety.classList.add('hidden');
        if (safetyTableBody) safetyTableBody.innerHTML = '';
        try {
            const endpoint = projectId ? `/safety/project/${projectId}` : '/safety';
            allSafetyIncidents = await api.get(endpoint) || [];
            renderSafetyTable();
        } catch (err) {
            showToast('Error', 'Failed to load safety incidents: ' + err.message, 'error');
            renderSafetyTable();
        } finally {
            if (loadingSafety) loadingSafety.classList.add('hidden');
        }
    }

    function renderSafetyTable() {
        if (!safetyTableBody) return;
        safetyTableBody.innerHTML = '';
        const total = allSafetyIncidents.length;
        const open = allSafetyIncidents.filter(i => i.status === 'open').length;
        const resolved = allSafetyIncidents.filter(i => i.status === 'closed').length;
        const high = allSafetyIncidents.filter(i => i.severity && i.severity.toLowerCase() === 'high').length;

        const elTotal = document.getElementById('stat-safety-total');
        const elOpen = document.getElementById('stat-safety-open');
        const elHigh = document.getElementById('stat-safety-high');
        const elResolved = document.getElementById('stat-safety-resolved');

        if (elTotal) elTotal.textContent = total;
        if (elOpen) elOpen.textContent = open;
        if (elHigh) elHigh.textContent = high;
        if (elResolved) elResolved.textContent = resolved;

        if (total === 0) {
            if (emptySafety) emptySafety.classList.remove('hidden');
            return;
        }
        if (emptySafety) emptySafety.classList.add('hidden');

        allSafetyIncidents.forEach(inc => {
            const proj = projects.find(pr => pr.id === inc.projectId);
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td style="font-weight: 600;">${inc.incidentDate}</td>
                <td>${proj ? escapeHtml(proj.name) : 'Project #' + inc.projectId}</td>
                <td>
                    <span class="status-badge status-${(inc.severity || 'low').toLowerCase()}">
                        ${(inc.severity || 'low').toUpperCase()}
                    </span>
                </td>
                <td style="max-width: 250px;">
                    <div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${escapeHtml(inc.description)}">
                        ${escapeHtml(inc.description)}
                    </div>
                </td>
                <td style="max-width: 200px; color: var(--text-secondary);">
                    <div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${escapeHtml(inc.actionTaken || 'None')}">
                        ${escapeHtml(inc.actionTaken || 'None')}
                    </div>
                </td>
                <td>
                    <span class="status-badge status-${inc.status}">
                        ${inc.status === 'closed' ? 'RESOLVED' : 'OPEN'}
                    </span>
                </td>
                <td style="text-align: right;">
                    ${inc.status === 'open' ? `<button class="btn btn-sm btn-primary" onclick="resolveIncident(${inc.id})" title="Resolve Incident" style="padding:4px 8px; font-size:11px; margin-right:4px;"><i class="fa-solid fa-shield-check"></i> Resolve</button>` : ''}
                    <button class="btn-icon" onclick="editSafetyIncident(${inc.id})" title="Edit Incident"><i class="fa-solid fa-pen-to-square"></i></button>
                    <button class="btn-icon danger" onclick="deleteSafetyIncident(${inc.id})" title="Delete"><i class="fa-solid fa-trash"></i></button>
                </td>
            `;
            safetyTableBody.appendChild(tr);
        });
        applyRoleRestrictions();
    }

    window.resolveIncident = async function(id) {
        const action = prompt('Enter corrective action taken to mitigate hazard and prevent recurrence:');
        if (action === null) return;
        try {
            await api.put(`/safety/${id}`, {
                status: 'closed',
                actionTaken: action.trim() || 'Corrective action completed and verified by Project Manager.'
            });
            showToast('Resolved', 'Safety incident marked resolved', 'success');
            loadSafetyIncidents();
        } catch (err) {
            showToast('Error', 'Failed to resolve incident: ' + err.message, 'error');
        }
    };

    window.editSafetyIncident = function(id) {
        const inc = allSafetyIncidents.find(i => i.id === id);
        if (!inc) return;
        document.getElementById('safety-id').value = inc.id;
        document.getElementById('safety-modal-title').textContent = 'Edit Safety Incident';
        document.getElementById('safety-project-id').value = inc.projectId;
        document.getElementById('safety-date').value = inc.incidentDate || '';
        document.getElementById('safety-severity').value = (inc.severity || 'low').toLowerCase();
        document.getElementById('safety-desc').value = inc.description || '';
        document.getElementById('safety-action').value = inc.actionTaken || '';
        document.getElementById('safety-status').value = inc.status || 'open';
        safetyModal.classList.remove('hidden');
    };

    window.deleteSafetyIncident = async function(id) {
        if (!confirm('Are you sure you want to delete this incident report?')) return;
        try {
            await api.delete(`/safety/${id}`);
            showToast('Success', 'Safety incident deleted', 'success');
            loadSafetyIncidents();
        } catch (err) {
            showToast('Error', 'Failed to delete incident: ' + err.message, 'error');
        }
    };

    // ──────────────────────────────────────────────────────────────────────
    // 5. RFIs & SUBMITTALS (FULL CRUD & FORMAL REVIEW: POST, GET, PUT, DELETE)
    // ──────────────────────────────────────────────────────────────────────
    setupModalClose(rfiModal, btnCloseRfiModal, btnCancelRfiModal);
    setupModalClose(rfiResponseModal, btnCloseRfiResponseModal, btnCancelRfiResponseModal);
    setupModalClose(submittalModal, btnCloseSubmittalModal, btnCancelSubmittalModal);

    if (rfisProjectFilter) {
        rfisProjectFilter.addEventListener('change', () => loadRfisAndSubmittals());
    }

    if (btnTabRfis && btnTabSubmittals) {
        btnTabRfis.addEventListener('click', () => {
            btnTabRfis.classList.add('active');
            btnTabSubmittals.classList.remove('active');
            rfisSubview.classList.remove('hidden');
            submittalsSubview.classList.add('hidden');
        });
        btnTabSubmittals.addEventListener('click', () => {
            btnTabSubmittals.classList.add('active');
            btnTabRfis.classList.remove('active');
            submittalsSubview.classList.remove('hidden');
            rfisSubview.classList.add('hidden');
        });
    }

    if (btnAddRfi) {
        btnAddRfi.addEventListener('click', () => {
            rfiForm.reset();
            document.getElementById('rfi-id').value = '';
            document.getElementById('rfi-modal-title').textContent = 'New Request for Information (RFI)';
            document.getElementById('rfi-number').value = 'RFI-' + String(allRfis.length + 1).padStart(3, '0');
            if (rfisProjectFilter && rfisProjectFilter.value) {
                document.getElementById('rfi-project-id').value = rfisProjectFilter.value;
            }
            rfiModal.classList.remove('hidden');
        });
    }

    if (rfiForm) {
        rfiForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = document.getElementById('rfi-id').value;
            const payload = {
                projectId: Number(document.getElementById('rfi-project-id').value),
                rfiNumber: document.getElementById('rfi-number').value.trim(),
                subject: document.getElementById('rfi-subject').value.trim(),
                ballInCourt: document.getElementById('rfi-ball').value.trim() || null,
                assignedTo: document.getElementById('rfi-assigned').value.trim() || null,
                dueDate: document.getElementById('rfi-due-date').value || null,
                status: document.getElementById('rfi-status').value
            };

            try {
                if (id) {
                    await api.put(`/rfis/${id}`, payload);
                    showToast('Success', 'RFI updated', 'success');
                } else {
                    await api.post('/rfis', payload);
                    showToast('Success', 'RFI created', 'success');
                }
                rfiModal.classList.add('hidden');
                loadRfisAndSubmittals();
            } catch (err) {
                showToast('Error', err.message || 'Failed to save RFI', 'error');
            }
        });
    }

    if (rfiResponseForm) {
        rfiResponseForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = document.getElementById('rfi-response-id').value;
            const responseText = document.getElementById('rfi-response-text').value.trim();
            const status = document.getElementById('rfi-response-status').value;
            try {
                await api.put(`/rfis/${id}`, {
                    response: responseText,
                    status: status
                });
                showToast('Success', 'RFI response recorded', 'success');
                rfiResponseModal.classList.add('hidden');
                loadRfisAndSubmittals();
            } catch (err) {
                showToast('Error', err.message || 'Failed to record response', 'error');
            }
        });
    }

    if (btnAddSubmittal) {
        btnAddSubmittal.addEventListener('click', () => {
            submittalForm.reset();
            document.getElementById('submittal-id').value = '';
            document.getElementById('submittal-modal-title').textContent = 'New Submittal';
            document.getElementById('submittal-number').value = 'SUB-' + String(allSubmittals.length + 1).padStart(3, '0');
            if (rfisProjectFilter && rfisProjectFilter.value) {
                document.getElementById('submittal-project-id').value = rfisProjectFilter.value;
            }
            submittalModal.classList.remove('hidden');
        });
    }

    if (submittalForm) {
        submittalForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = document.getElementById('submittal-id').value;
            const payload = {
                projectId: Number(document.getElementById('submittal-project-id').value),
                submittalNumber: document.getElementById('submittal-number').value.trim(),
                specSection: document.getElementById('submittal-spec').value.trim(),
                description: document.getElementById('submittal-desc').value.trim(),
                submittedByName: document.getElementById('submittal-submitted-by').value.trim() || currentUser?.name,
                status: document.getElementById('submittal-status').value
            };

            try {
                if (id) {
                    await api.put(`/submittals/${id}`, payload);
                    showToast('Success', 'Submittal updated', 'success');
                } else {
                    await api.post('/submittals', payload);
                    showToast('Success', 'Submittal registered', 'success');
                }
                submittalModal.classList.add('hidden');
                loadRfisAndSubmittals();
            } catch (err) {
                showToast('Error', err.message || 'Failed to save submittal', 'error');
            }
        });
    }

    async function loadRfisAndSubmittals(projectId) {
        projectId = projectId || (rfisProjectFilter ? rfisProjectFilter.value : '');
        if (loadingRfis) loadingRfis.classList.remove('hidden');
        if (loadingSubmittals) loadingSubmittals.classList.remove('hidden');
        if (rfisTableBody) rfisTableBody.innerHTML = '';
        if (submittalsTableBody) submittalsTableBody.innerHTML = '';
        try {
            const [rfis, subs] = await Promise.all([
                api.get(projectId ? `/rfis/project/${projectId}` : '/rfis'),
                api.get(projectId ? `/submittals/project/${projectId}` : '/submittals')
            ]);
            allRfis = rfis || [];
            allSubmittals = subs || [];
            renderRfisTable();
            renderSubmittalsTable();
        } catch (err) {
            showToast('Error', 'Failed to load RFIs/Submittals: ' + err.message, 'error');
            renderRfisTable();
            renderSubmittalsTable();
        } finally {
            if (loadingRfis) loadingRfis.classList.add('hidden');
            if (loadingSubmittals) loadingSubmittals.classList.add('hidden');
        }
    }

    function renderRfisTable() {
        if (!rfisTableBody) return;
        rfisTableBody.innerHTML = '';
        const total = allRfis.length;
        const open = allRfis.filter(r => r.status === 'open').length;
        const responded = allRfis.filter(r => r.status === 'responded').length;
        const closed = allRfis.filter(r => r.status === 'closed').length;

        const elTotal = document.getElementById('stat-rfi-total');
        const elOpen = document.getElementById('stat-rfi-open');
        const elResponded = document.getElementById('stat-rfi-responded');
        const elClosed = document.getElementById('stat-rfi-closed');

        if (elTotal) elTotal.textContent = total;
        if (elOpen) elOpen.textContent = open;
        if (elResponded) elResponded.textContent = responded;
        if (elClosed) elClosed.textContent = closed;

        if (total === 0) {
            if (emptyRfis) emptyRfis.classList.remove('hidden');
            return;
        }
        if (emptyRfis) emptyRfis.classList.add('hidden');

        allRfis.forEach(r => {
            const proj = projects.find(pr => pr.id === r.projectId);
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td style="font-weight: 600;">${escapeHtml(r.rfiNumber || 'RFI-' + r.id)}</td>
                <td>${proj ? escapeHtml(proj.name) : 'Project #' + r.projectId}</td>
                <td style="max-width: 250px;">
                    <div style="font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${escapeHtml(r.subject)}">
                        ${escapeHtml(r.subject)}
                    </div>
                    ${r.response ? `<div style="font-size:11px; color:var(--status-active-text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${escapeHtml(r.response)}">Ans: ${escapeHtml(r.response)}</div>` : ''}
                </td>
                <td>${escapeHtml(r.ballInCourt || '—')}</td>
                <td>${escapeHtml(r.assignedTo || '—')}</td>
                <td>${r.dueDate || '—'}</td>
                <td>
                    <span class="status-badge status-${r.status}">
                        ${r.status.toUpperCase()}
                    </span>
                </td>
                <td style="text-align: right;">
                    <button class="btn btn-sm btn-secondary" onclick="openRespondRfiModal(${r.id})" title="Respond / Resolve RFI" style="padding:4px 8px; font-size:11px; margin-right:4px;"><i class="fa-solid fa-reply"></i> Respond</button>
                    <button class="btn-icon" onclick="editRfi(${r.id})" title="Edit RFI"><i class="fa-solid fa-pen-to-square"></i></button>
                    <button class="btn-icon danger" onclick="deleteRfi(${r.id})" title="Delete RFI"><i class="fa-solid fa-trash"></i></button>
                </td>
            `;
            rfisTableBody.appendChild(tr);
        });
        applyRoleRestrictions();
    }

    function renderSubmittalsTable() {
        if (!submittalsTableBody) return;
        submittalsTableBody.innerHTML = '';
        const total = allSubmittals.length;
        const pending = allSubmittals.filter(s => s.status === 'pending').length;
        const approved = allSubmittals.filter(s => s.status === 'approved').length;
        const rejected = allSubmittals.filter(s => s.status === 'rejected').length;

        const elTotal = document.getElementById('stat-sub-total');
        const elPending = document.getElementById('stat-sub-pending');
        const elApproved = document.getElementById('stat-sub-approved');
        const elRejected = document.getElementById('stat-sub-rejected');

        if (elTotal) elTotal.textContent = total;
        if (elPending) elPending.textContent = pending;
        if (elApproved) elApproved.textContent = approved;
        if (elRejected) elRejected.textContent = rejected;

        if (total === 0) {
            if (emptySubmittals) emptySubmittals.classList.remove('hidden');
            return;
        }
        if (emptySubmittals) emptySubmittals.classList.add('hidden');

        allSubmittals.forEach(s => {
            const proj = projects.find(pr => pr.id === s.projectId);
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td style="font-weight: 600;">${escapeHtml(s.submittalNumber || 'SUB-' + s.id)}</td>
                <td>${proj ? escapeHtml(proj.name) : 'Project #' + s.projectId}</td>
                <td><span class="stat-pill">${escapeHtml(s.specSection || '—')}</span></td>
                <td style="max-width: 250px;">
                    <div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${escapeHtml(s.description)}">
                        ${escapeHtml(s.description)}
                    </div>
                </td>
                <td>${escapeHtml(s.submittedByName || s.submittedBy || '—')}</td>
                <td>${escapeHtml(s.reviewedBy || 'Pending')}</td>
                <td>
                    <span class="status-badge status-${s.status}">
                        ${s.status.toUpperCase()}
                    </span>
                </td>
                <td style="text-align: right;">
                    ${s.status === 'pending' ? `
                        <button class="btn btn-sm btn-primary" onclick="reviewSubmittal(${s.id}, 'approved')" title="Approve Submittal" style="padding:4px 8px; font-size:11px; margin-right:4px;"><i class="fa-solid fa-check"></i> Approve</button>
                        <button class="btn btn-sm btn-secondary" onclick="reviewSubmittal(${s.id}, 'rejected')" title="Reject Submittal" style="padding:4px 8px; font-size:11px; margin-right:4px; color:#f87171;"><i class="fa-solid fa-xmark"></i> Reject</button>
                    ` : ''}
                    <button class="btn-icon" onclick="editSubmittal(${s.id})" title="Edit Submittal"><i class="fa-solid fa-pen-to-square"></i></button>
                    <button class="btn-icon danger" onclick="deleteSubmittal(${s.id})" title="Delete Submittal"><i class="fa-solid fa-trash"></i></button>
                </td>
            `;
            submittalsTableBody.appendChild(tr);
        });
        applyRoleRestrictions();
    }

    window.openRespondRfiModal = function(id) {
        const rfi = allRfis.find(r => r.id === id);
        if (!rfi) return;
        document.getElementById('rfi-response-id').value = rfi.id;
        document.getElementById('rfi-response-subject-display').textContent = `${rfi.rfiNumber || 'RFI'}: ${rfi.subject}`;
        document.getElementById('rfi-response-text').value = rfi.response || '';
        document.getElementById('rfi-response-status').value = rfi.status === 'closed' ? 'closed' : 'responded';
        rfiResponseModal.classList.remove('hidden');
    };

    window.editRfi = function(id) {
        const rfi = allRfis.find(r => r.id === id);
        if (!rfi) return;
        document.getElementById('rfi-id').value = rfi.id;
        document.getElementById('rfi-modal-title').textContent = 'Edit RFI';
        document.getElementById('rfi-project-id').value = rfi.projectId;
        document.getElementById('rfi-number').value = rfi.rfiNumber || '';
        document.getElementById('rfi-subject').value = rfi.subject || '';
        document.getElementById('rfi-ball').value = rfi.ballInCourt || '';
        document.getElementById('rfi-assigned').value = rfi.assignedTo || '';
        document.getElementById('rfi-due-date').value = rfi.dueDate || '';
        document.getElementById('rfi-status').value = rfi.status || 'open';
        rfiModal.classList.remove('hidden');
    };

    window.deleteRfi = async function(id) {
        if (!confirm('Are you sure you want to delete this RFI?')) return;
        try {
            await api.delete(`/rfis/${id}`);
            showToast('Success', 'RFI deleted successfully', 'success');
            loadRfisAndSubmittals();
        } catch (err) {
            showToast('Error', 'Failed to delete RFI: ' + err.message, 'error');
        }
    };

    window.reviewSubmittal = async function(id, status) {
        try {
            await api.put(`/submittals/${id}`, {
                status: status,
                reviewedBy: currentUser?.name || 'Project Manager'
            });
            showToast('Success', `Submittal marked as ${status}`, 'success');
            loadRfisAndSubmittals();
        } catch (err) {
            showToast('Error', 'Failed to review submittal: ' + err.message, 'error');
        }
    };

    window.editSubmittal = function(id) {
        const sub = allSubmittals.find(s => s.id === id);
        if (!sub) return;
        document.getElementById('submittal-id').value = sub.id;
        document.getElementById('submittal-modal-title').textContent = 'Edit Submittal';
        document.getElementById('submittal-project-id').value = sub.projectId;
        document.getElementById('submittal-number').value = sub.submittalNumber || '';
        document.getElementById('submittal-spec').value = sub.specSection || '';
        document.getElementById('submittal-desc').value = sub.description || '';
        document.getElementById('submittal-submitted-by').value = sub.submittedByName || sub.submittedBy || '';
        document.getElementById('submittal-status').value = sub.status || 'pending';
        submittalModal.classList.remove('hidden');
    };

    window.deleteSubmittal = async function(id) {
        if (!confirm('Are you sure you want to delete this submittal?')) return;
        try {
            await api.delete(`/submittals/${id}`);
            showToast('Success', 'Submittal deleted successfully', 'success');
            loadRfisAndSubmittals();
        } catch (err) {
            showToast('Error', 'Failed to delete submittal: ' + err.message, 'error');
        }
    };

});


