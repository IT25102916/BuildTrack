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
    const navTeam = document.getElementById('nav-team');
    const navDocuments = document.getElementById('nav-documents');
    const navAnalytics = document.getElementById('nav-analytics');
    const navContractors = document.getElementById('nav-contractors');
    const navReports = document.getElementById('nav-reports');
    const navSettings = document.getElementById('nav-settings');
    const navFinance = document.getElementById('nav-finance');
    
    const viewDashboard = document.getElementById('view-dashboard');
    const viewProjects = document.getElementById('view-projects');
    const viewTeam = document.getElementById('view-team');
    const viewDocuments = document.getElementById('view-documents');
    const viewAnalytics = document.getElementById('view-analytics');
    const viewContractors = document.getElementById('view-contractors');
    const viewReports = document.getElementById('view-reports');
    const viewSettings = document.getElementById('view-settings');
    const viewFinance = document.getElementById('finance-section');

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
        if (role === 'subcontractor' || role === 'client') {
            navProjects.parentElement.style.display = 'none';
            navTeam.parentElement.style.display = 'none';
            navAnalytics.parentElement.style.display = 'none';
        } else {
            navProjects.parentElement.style.display = 'block';
            navTeam.parentElement.style.display = 'block';
            navAnalytics.parentElement.style.display = 'block';
        }
        
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
    navTeam.addEventListener('click', (e) => { e.preventDefault(); switchView('team'); loadTeam(); });
    navDocuments.addEventListener('click', (e) => { e.preventDefault(); switchView('documents'); loadDocuments(); });
    navAnalytics.addEventListener('click', (e) => { e.preventDefault(); switchView('analytics'); renderAnalytics(); });
    navContractors.addEventListener('click', (e) => { e.preventDefault(); switchView('contractors'); });
    navReports.addEventListener('click', (e) => { e.preventDefault(); switchView('reports'); });
    navSettings.addEventListener('click', (e) => { e.preventDefault(); switchView('settings'); renderSettings(); });
    navFinance.addEventListener('click', (e) => { e.preventDefault(); switchView('finance'); loadFinanceData(); });

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
        } else if (viewName === 'team') {
            navTeam.parentElement.classList.add('active');
            viewTeam.classList.remove('hidden');
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
        document.querySelectorAll('#finance-section .tab-btn').forEach(btn => btn.classList.remove('active'));
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
            projects.forEach(p => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${p.name}</td>
                    <td>$500,000.00</td>
                    <td>$250,000.00</td>
                    <td>$250,000.00</td>
                    <td><span class="badge badge-success">On Budget</span></td>
                `;
                tbody.appendChild(tr);
            });
        } catch (error) {
            console.error('Failed to load budgets', error);
        }
    }

    async function loadInvoices() {
        try {
            const invoices = await api.get('/finance/invoices');
            const tbody = document.getElementById('finance-invoices-body');
            tbody.innerHTML = '';
            invoices.forEach(inv => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${inv.invoiceNumber}</td>
                    <td>Project ${inv.projectId}</td>
                    <td>$${inv.amount.toFixed(2)}</td>
                    <td>${inv.dueDate}</td>
                    <td><span class="badge ${inv.status === 'Pending' ? 'badge-warning' : 'badge-success'}">${inv.status}</span></td>
                    <td>
                        ${inv.status === 'Pending' ? `<button class="btn btn-sm btn-primary" onclick="approveInvoice(${inv.id})">Approve</button>` : ''}
                    </td>
                `;
                tbody.appendChild(tr);
            });
        } catch (error) {
            console.error('Failed to load invoices', error);
        }
    }

    async function loadTransactions() {
        try {
            const transactions = await api.get('/finance/transactions');
            const tbody = document.getElementById('finance-transactions-body');
            tbody.innerHTML = '';
            transactions.forEach(tx => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${tx.transactionDate}</td>
                    <td>Project ${tx.projectId}</td>
                    <td>${tx.category}</td>
                    <td>$${tx.amount.toFixed(2)}</td>
                    <td>${tx.description || ''}</td>
                `;
                tbody.appendChild(tr);
            });
        } catch (error) {
            console.error('Failed to load transactions', error);
        }
    }

    async function loadPayroll() {
        try {
            const tbody = document.getElementById('finance-payroll-body');
            tbody.innerHTML = '<tr><td colspan="5">No payroll data yet.</td></tr>';
        } catch (error) {
            console.error('Failed to load payroll', error);
        }
    }

    window.approveInvoice = async function(id) {
        try {
            await api.put('/finance/invoices/' + id, { status: 'Approved' });
            showToast('Success', 'Invoice approved.', 'success');
            loadInvoices();
        } catch (error) {
            showToast('Error', 'Could not approve invoice', 'error');
        }
    };
    
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
                        <button class="btn-icon" onclick="editProject(${project.id})" title="Edit"><i class="fa-solid fa-pen"></i></button>
                        <button class="btn-icon danger" onclick="deleteProject(${project.id})" title="Delete"><i class="fa-solid fa-trash"></i></button>
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
              type: document.getElementById('projectType').value
        };
        try {
            if (id) {
                await api.put(`/projects/${id}`, projectData);
                showToast('Success', 'Project updated successfully', 'success');
            } else {
                const newProj = await api.post('/projects', projectData);
                  const assignSelect = document.getElementById('projectAssignments');
                  const assignedUserIds = Array.from(assignSelect.selectedOptions).map(opt => opt.value);
                  for(const uId of assignedUserIds) {
                      await api.post(`/projects/${newProj.id}/assignments/${uId}`);
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
                            <div style="width: 32px; height: 32px; border-radius: 50%; background-color: var(--brand-primary); color: white; display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 12px;">
                                ${user.avatarInitials}
                            </div>
                            <div style="font-weight: 600;">${user.name}</div>
                        </div>
                    </td>
                    <td>${user.role}</td>
                    <td>
                        <div>${user.email}</div>
                        <div style="font-size: 12px; color: var(--text-secondary)">${user.phone || 'No phone'}</div>
                    </td>
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
            documentsList = await api.get('/rfis');
            renderDocumentsTable();
        } catch (error) {
            showToast('Failed to load documents', error.message, 'error');
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
                    <td>
                        <div style="font-weight: 600;">${doc.rfiNumber || ('RFI-' + doc.id)}</div>
                        <div style="font-size: 12px; color: var(--text-secondary)">RFI</div>
                    </td>
                    <td>${doc.subject}</td>
                    <td>
                        <span class="status-badge status-${(doc.status || 'open').toLowerCase().replace(' ', '-')}">
                            ${doc.status || 'Open'}
                        </span>
                    </td>
                    <td>${doc.submittedDate || 'N/A'}</td>
                `;
                documentsTableBody.appendChild(tr);
            });
        }
    }

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

});


