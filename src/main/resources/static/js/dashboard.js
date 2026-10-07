/* ============================================================
   ConstructIQ — Dashboard Module
   All data from REST API via Api.*
   ============================================================ */

const Dashboard = {
  async renderPortfolio(container) {
    renderLoading(container);
    let projects;
    try {
      projects = await Api.projects();
      AppState.projects = projects;
    } catch (e) {
      renderError(container, 'Failed to load projects. Is the server running?');
      return;
    }

    const totalBudget   = projects.reduce((s, p) => s + parseFloat(p.contractValue || 0), 0);
    const totalManpower = projects.reduce((s, p) => s + (p.manpowerToday || 0), 0);
    const activeCount   = projects.filter(p => p.status === 'active').length;
    const totalRFIs     = projects.reduce((s, p) => s + (p.openRfis || 0), 0);

    container.innerHTML = `
      <div class="page-header">
        <div class="page-header-left">
          <h1 class="page-title">Portfolio Overview</h1>
          <p class="page-subtitle">Apex General Contractors — ${new Date().toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric',year:'numeric'})}</p>
        </div>
        <div class="page-header-actions">
          <button class="btn btn-secondary">${icon('download')} Export</button>
          <button class="btn btn-primary" id="new-project-btn">${icon('plus')} New Project</button>
        </div>
      </div>

      <!-- KPI Row -->
      <div class="stats-grid stats-grid-4 mb-6">
        <div class="stat-card">
          <div class="stat-card-header"><span class="stat-label">Active Projects</span><div class="stat-icon teal">${ICONS['building-2']}</div></div>
          <div class="stat-value">${activeCount}</div>
          <div class="stat-change neutral">of ${projects.length} total</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-header"><span class="stat-label">Portfolio Value</span><div class="stat-icon green">${ICONS['dollar-sign']}</div></div>
          <div class="stat-value stat-value-sm">${formatCurrency(totalBudget, true)}</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-header"><span class="stat-label">Workers On-Site Today</span><div class="stat-icon blue">${ICONS['hard-hat']}</div></div>
          <div class="stat-value">${totalManpower}</div>
          <div class="stat-change neutral">across all sites</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-header"><span class="stat-label">Open RFIs</span><div class="stat-icon orange">${ICONS['message-circle']}</div></div>
          <div class="stat-value">${totalRFIs}</div>
        </div>
      </div>

      <!-- Project Cards -->
      <div class="section">
        <div class="section-header">
          <span class="section-title">Projects</span>
          <div class="segmented">
            <span class="seg-btn active" data-filter="all">All</span>
            <span class="seg-btn" data-filter="active">Active</span>
            <span class="seg-btn" data-filter="planning">Planning</span>
          </div>
        </div>
        <div class="grid" id="project-cards-grid" style="grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:var(--sp-4)">
          ${projects.map(p => this.projectCard(p)).join('')}
        </div>
      </div>

      <!-- Bottom row -->
      <div class="content-grid mt-6">
        <div class="card">
          <div class="card-header"><span class="card-title">${ICONS['bar-chart-2']} Portfolio Health</span></div>
          <div class="card-body">
            ${projects.map(p => `
              <div class="progress-labeled mb-4">
                <div class="progress-label-row">
                  <span class="progress-label">${p.name.split(' ').slice(0,3).join(' ')}</span>
                  <span class="progress-value">${p.percentComplete}%</span>
                </div>
                <div class="progress-bar lg">
                  <div class="progress-fill ${p.budgetHealth === 'critical' ? 'danger' : p.budgetHealth === 'warning' ? 'warning' : ''}"
                       style="width:${p.percentComplete}%"></div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    // Project card clicks
    container.querySelectorAll('.project-card').forEach(card => {
      card.addEventListener('click', () => {
        AppState.currentProjectId = Number(card.dataset.pid);
        App.renderTopbar();
        App.navigate('project');
      });
    });

    // Segment filter
    container.querySelectorAll('.seg-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        container.querySelectorAll('.seg-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        const f = this.dataset.filter;
        const grid = document.getElementById('project-cards-grid');
        grid.querySelectorAll('.project-card').forEach((card, i) => {
          card.style.display = (f === 'all' || projects[i]?.status === f) ? '' : 'none';
        });
      });
    });

    // New project button
    document.getElementById('new-project-btn')?.addEventListener('click', () => this.showNewProjectModal());
  },

  projectCard(p) {
    const daysLeft = daysUntil(p.endDate);
    return `
      <div class="project-card" data-pid="${p.id}">
        <div class="project-card-header">
          <div>
            <div class="project-card-name">${p.name}</div>
            <div class="project-card-type">${p.type} • ${p.address?.split(',')[1]?.trim() || ''}</div>
          </div>
          <div>${statusBadge(p.status)}</div>
        </div>
        <div style="margin-bottom:var(--sp-3)">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
            <span class="text-xs text-muted">Overall Progress</span>
            <span class="text-xs fw-semibold">${p.percentComplete}%</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill ${p.budgetHealth === 'critical' ? 'danger' : p.budgetHealth === 'warning' ? 'warning' : ''}"
                 style="width:${p.percentComplete}%"></div>
          </div>
        </div>
        <div class="project-card-stats">
          <div class="project-stat">
            <span class="project-stat-value">${formatCurrency(p.contractValue, true)}</span>
            <span class="project-stat-label">Contract Value</span>
          </div>
          <div class="project-stat">
            <span class="project-stat-value">${p.openRfis}</span>
            <span class="project-stat-label">Open RFIs</span>
          </div>
          <div class="project-stat">
            <span class="project-stat-value ${daysLeft < 30 ? 'text-danger' : daysLeft < 60 ? 'text-warning' : ''}">${daysLeft > 0 ? daysLeft+'d' : 'Overdue'}</span>
            <span class="project-stat-label">Days Left</span>
          </div>
          <div class="project-stat">
            <span class="project-stat-value">${p.manpowerToday}</span>
            <span class="project-stat-label">On-Site Today</span>
          </div>
        </div>
        <div style="margin-top:var(--sp-3);padding-top:var(--sp-3);border-top:1px solid var(--border-subtle);display:flex;align-items:center;justify-content:space-between">
          <div style="display:flex;align-items:center;gap:var(--sp-2)">
            <div class="health-dot ${p.budgetHealth}"></div>
            <span class="text-xs text-secondary">${statusBadge(p.budgetHealth)}</span>
          </div>
          <span class="text-xs text-muted">Client: ${p.clientName || '—'}</span>
        </div>
      </div>
    `;
  },

  showNewProjectModal() {
    createModal('new-project-modal', 'Create New Project', `
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Project Name <span class="required">*</span></label>
          <input type="text" class="form-control" id="np-name" placeholder="e.g., Downtown Office Tower">
        </div>
        <div class="form-group">
          <label class="form-label">Type</label>
          <select class="form-control" id="np-type">
            <option>Commercial</option><option>Residential</option><option>Infrastructure</option><option>Industrial</option>
          </select>
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Address</label>
        <input type="text" class="form-control" id="np-address" placeholder="123 Main St, City, TX">
      </div>
      <div class="form-group">
        <label class="form-label">Client Name</label>
        <input type="text" class="form-control" id="np-client" placeholder="Client organization">
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Start Date</label>
          <input type="date" class="form-control" id="np-start">
        </div>
        <div class="form-group">
          <label class="form-label">End Date</label>
          <input type="date" class="form-control" id="np-end">
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Contract Value (Rs.)</label>
        <input type="number" class="form-control" id="np-value" placeholder="0">
      </div>
    `, `
      <button class="btn btn-secondary" onclick="document.getElementById('new-project-modal').remove()">Cancel</button>
      <button class="btn btn-primary" id="save-np-btn">Create Project</button>
    `);

    document.getElementById('save-np-btn')?.addEventListener('click', async () => {
      const name = document.getElementById('np-name')?.value.trim();
      if (!name) { showToast('Project name is required', 'warning'); return; }
      const startDate = document.getElementById('np-start')?.value || null;
      const endDate = document.getElementById('np-end')?.value || null;
      if (startDate && endDate && endDate < startDate) {
        showToast('Project end date cannot be earlier than start date.', 'warning');
        return;
      }
      try {
        const project = await Api.createProject({
          name,
          type:          document.getElementById('np-type')?.value || 'Commercial',
          status:        'planning',
          address:       document.getElementById('np-address')?.value.trim() || null,
          clientName:    document.getElementById('np-client')?.value.trim() || null,
          startDate,
          endDate,
          contractValue: parseFloat(document.getElementById('np-value')?.value) || 0,
          approvedBudget: parseFloat(document.getElementById('np-value')?.value) || 0,
        });
        showToast(`Project "${project.name}" created`, 'success');
        document.getElementById('new-project-modal')?.remove();
        Dashboard.renderPortfolio(document.getElementById('view-dashboard') || document.getElementById('page-content'));
      } catch (e) {
        showToast('Failed to create project: ' + e.message, 'error');
      }
    });
  },

  async renderProject(container, pid) {
    if (!pid) { container.innerHTML = '<div class="empty-state"><h3>Select a project first</h3></div>'; return; }
    renderLoading(container);

    let project, tasks, budgetLines, logs, punch, rfis, incidents;
    try {
      [project, tasks, budgetLines, logs, punch, rfis, incidents] = await Promise.all([
        Api.project(pid),
        Api.tasks(pid),
        Api.budgetLines(pid),
        Api.dailyLogs(pid),
        Api.punchItems(pid),
        Api.rfis(pid),
        Api.incidents(pid),
      ]);
    } catch (e) {
      renderError(container, 'Failed to load project data. ' + e.message);
      return;
    }

    const totalBudgeted  = budgetLines.reduce((s, l) => s + parseFloat(l.budgetedAmount || 0), 0);
    const totalActual    = budgetLines.reduce((s, l) => s + parseFloat(l.actualAmount || 0), 0);
    const budgetPct      = totalBudgeted ? Math.round((totalActual / totalBudgeted) * 100) : 0;
    const openPunch      = punch.filter(i => i.status !== 'closed').length;
    const openRFIs       = rfis.filter(r => r.status === 'open' || r.status === 'pending').length;
    const openIncidents  = incidents.filter(i => i.status === 'open').length;
    const inProgressTasks= tasks.filter(t => t.status === 'in_progress').length;
    const weathers       = { sunny:'☀️', partly_cloudy:'⛅', rainy:'🌧️', cloudy:'☁️', stormy:'⛈️' };
    const lastLog        = logs[0];

    container.innerHTML = `
      <div class="page-header">
        <div class="page-header-left">
          <h1 class="page-title">${project.name}</h1>
          <p class="page-subtitle">${project.type} • ${project.address || ''} • ${statusBadge(project.status)}</p>
        </div>
        <div class="page-header-actions">
          <button class="btn btn-secondary" onclick="App.navigate('reports')">${icon('bar-chart-2')} Reports</button>
          <button class="btn btn-primary" onclick="App.navigate('logs')">${icon('clipboard-list')} New Log</button>
        </div>
      </div>

      <!-- KPI Row -->
      <div class="stats-grid stats-grid-4 mb-6">
        <div class="kpi-ring-card" style="cursor:pointer" onclick="App.navigate('tasks')">
          ${ringProgress(project.percentComplete)}
          <div class="kpi-ring-info">
            <div class="kpi-ring-value text-brand">${project.percentComplete}%</div>
            <div class="kpi-ring-label">Overall Complete</div>
            <div class="text-xs text-muted mt-2">${inProgressTasks} tasks in progress</div>
          </div>
        </div>
        <div class="kpi-ring-card" style="cursor:pointer" onclick="App.navigate('budget')">
          ${ringProgress(budgetPct, 60, budgetPct > 90 ? 'danger' : budgetPct > 75 ? 'warning' : 'success')}
          <div class="kpi-ring-info">
            <div class="kpi-ring-value ${budgetPct > 90 ? 'text-danger' : budgetPct > 75 ? 'text-warning' : 'text-success'}">${formatCurrency(totalActual, true)}</div>
            <div class="kpi-ring-label">Spent of ${formatCurrency(totalBudgeted, true)}</div>
            <div class="text-xs text-muted mt-2">Budget utilization</div>
          </div>
        </div>
        <div class="stat-card" style="cursor:pointer" onclick="App.navigate('rfis')">
          <div class="stat-card-header"><span class="stat-label">Open RFIs</span><div class="stat-icon ${openRFIs > 5 ? 'orange' : 'teal'}">${ICONS['message-circle']}</div></div>
          <div class="stat-value ${openRFIs > 5 ? 'text-warning' : ''}">${openRFIs}</div>
          <div class="stat-change ${openRFIs > 0 ? 'down' : 'up'}">${openRFIs > 0 ? `↑ ${openRFIs} awaiting response` : '✓ All resolved'}</div>
        </div>
        <div class="stat-card" style="cursor:pointer" onclick="App.navigate('punch')">
          <div class="stat-card-header"><span class="stat-label">Open Punch Items</span><div class="stat-icon ${openPunch > 10 ? 'red' : 'orange'}">${ICONS['check-circle']}</div></div>
          <div class="stat-value ${openPunch > 10 ? 'text-danger' : ''}">${openPunch}</div>
          <div class="stat-change ${openPunch > 0 ? 'down' : 'up'}">${openPunch > 0 ? `${openPunch} need attention` : '✓ Clear'}</div>
        </div>
      </div>

      <!-- Content grid -->
      <div class="content-grid-sidebar content-grid mb-6">
        <!-- Left column -->
        <div class="flex-col gap-6">
          <div class="card">
            <div class="card-header">
              <span class="card-title">${ICONS['gantt-chart']} Active Tasks</span>
              <button class="btn btn-ghost btn-sm" onclick="App.navigate('tasks')">View Gantt</button>
            </div>
            <div class="card-body" style="padding:0">
              ${tasks.filter(t => t.status !== 'completed' && !t.parentId).slice(0, 6).map(t => `
                <div style="display:flex;align-items:center;gap:var(--sp-3);padding:var(--sp-3) var(--sp-5);border-bottom:1px solid var(--border-subtle)">
                  <div style="width:8px;height:8px;border-radius:50%;background:${t.status==='in_progress'?'var(--brand-primary)':t.status==='pending'?'var(--text-muted)':'var(--status-success)'};flex-shrink:0"></div>
                  <div style="flex:1">
                    <div class="text-sm fw-medium">${t.name}</div>
                    <div class="text-xs text-muted">${t.assignedName || 'Unassigned'} • Due ${formatDate(t.endDate)}</div>
                  </div>
                  <div style="width:50px;text-align:right">
                    <span class="text-xs fw-semibold">${t.percentComplete}%</span>
                    <div class="progress-bar sm mt-1"><div class="progress-fill" style="width:${t.percentComplete}%"></div></div>
                  </div>
                </div>
              `).join('')}
              ${tasks.length === 0 ? '<div class="p-4 text-sm text-muted">No tasks yet. <a style="color:var(--brand-primary);cursor:pointer" onclick="App.navigate(\'tasks\')">Add tasks</a></div>' : ''}
            </div>
          </div>

          <div class="card">
            <div class="card-header">
              <span class="card-title">${ICONS['dollar-sign']} Budget Summary</span>
              <button class="btn btn-ghost btn-sm" onclick="App.navigate('budget')">Full Detail</button>
            </div>
            <div class="card-body">
              ${budgetLines.slice(0, 5).map(l => `
                <div class="progress-labeled mb-3">
                  <div class="progress-label-row">
                    <span class="progress-label"><span class="cost-code-badge">${l.costCode}</span> ${l.description}</span>
                    <span class="progress-value text-xs">${formatCurrency(l.actualAmount, true)} / ${formatCurrency(l.budgetedAmount, true)}</span>
                  </div>
                  <div class="progress-bar">
                    <div class="progress-fill ${parseFloat(l.actualAmount) > parseFloat(l.budgetedAmount) ? 'danger' : parseFloat(l.actualAmount)/parseFloat(l.budgetedAmount) > 0.85 ? 'warning' : ''}"
                         style="width:${Math.min(100, Math.round((parseFloat(l.actualAmount)/parseFloat(l.budgetedAmount))*100)) || 0}%"></div>
                  </div>
                </div>
              `).join('')}
              ${budgetLines.length === 0 ? '<div class="text-sm text-muted">No budget lines. <a style="color:var(--brand-primary);cursor:pointer" onclick="App.navigate(\'budget\')">Add budget</a></div>' : ''}
            </div>
          </div>
        </div>

        <!-- Right column -->
        <div class="flex-col gap-6">
          <div class="card">
            <div class="card-header"><span class="card-title">Site Conditions — Today</span></div>
            <div class="card-body">
              <div class="weather-widget mb-4">
                <div class="weather-emoji">${weathers[lastLog?.weather] || '☀️'}</div>
                <div>
                  <div class="weather-temp">${lastLog?.temperature || '—'}</div>
                  <div class="weather-desc">${lastLog?.weather?.replace('_',' ') || 'No log today'}</div>
                  <div class="weather-loc">${project.address?.split(',')[1]?.trim() || ''}</div>
                </div>
              </div>
              <div class="section-title text-sm mb-3">Manpower Today — ${project.manpowerToday} workers</div>
            </div>
          </div>

          <div class="card">
            <div class="card-header">
              <span class="card-title">${ICONS['shield-alert']} Safety</span>
              <button class="btn btn-ghost btn-sm" onclick="App.navigate('safety')">View All</button>
            </div>
            <div class="card-body">
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--sp-3);text-align:center;margin-bottom:var(--sp-4)">
                <div><div style="font-size:2rem;font-weight:800;color:var(--brand-primary)">14</div><div class="text-xs text-muted">Days Without Incident</div></div>
                <div><div style="font-size:2rem;font-weight:800;color:${openIncidents>0?'var(--status-danger)':'var(--status-success)'}">${openIncidents}</div><div class="text-xs text-muted">Open Incidents</div></div>
              </div>
              <button class="btn btn-danger btn-sm w-full" onclick="App.navigate('safety')">${ICONS['alert-triangle']} Report Incident</button>
            </div>
          </div>

          <div class="card">
            <div class="card-header"><span class="card-title">Project Info</span></div>
            <div class="card-body">
              <div class="info-grid">
                <div class="info-item"><span class="info-label">Client</span><span class="info-value">${project.clientName || '—'}</span></div>
                <div class="info-item"><span class="info-label">Type</span><span class="info-value">${project.type}</span></div>
                <div class="info-item"><span class="info-label">Start Date</span><span class="info-value">${formatDate(project.startDate)}</span></div>
                <div class="info-item"><span class="info-label">End Date</span><span class="info-value">${formatDate(project.endDate)}</span></div>
                <div class="info-item"><span class="info-label">Contract Value</span><span class="info-value">${formatCurrency(project.contractValue, true)}</span></div>
                <div class="info-item"><span class="info-label">Days Remaining</span><span class="info-value ${daysUntil(project.endDate) < 60 ? 'text-warning' : ''}">${daysUntil(project.endDate) ?? '—'}</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
};
