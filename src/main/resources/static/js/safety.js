/* ============================================================
   ConstructIQ — Safety & Incidents Module
   All data from REST API. No Data.* calls.
   ============================================================ */

const SafetyModule = {
  async render(container, pid) {
    if (!pid) { container.innerHTML = '<div class="empty-state"><h3>Select a project</h3></div>'; return; }
    renderLoading(container);

    let project, incidents;
    try {
      [project, incidents] = await Promise.all([Api.project(pid), Api.incidents(pid)]);
    } catch (e) {
      renderError(container, 'Failed to load safety data: ' + e.message);
      return;
    }

    const openInc    = incidents.filter(i => i.status === 'open').length;
    const highSev    = incidents.filter(i => i.severity === 'high').length;
    const closedInc  = incidents.filter(i => i.status === 'closed').length;

    // Calculate days since last open incident
    const lastOpen = incidents.find(i => i.status === 'open');
    const lastClosed = incidents
      .filter(i => i.status === 'closed')
      .sort((a, b) => new Date(b.incidentDate) - new Date(a.incidentDate))[0];
    const daysClean = lastClosed
      ? Math.max(0, Math.ceil((new Date() - new Date(lastClosed.incidentDate)) / 86400000))
      : incidents.length === 0 ? 0 : 14;

    container.innerHTML = `
      <div class="page-header">
        <div class="page-header-left">
          <h1 class="page-title">Safety & Incident Management</h1>
          <p class="page-subtitle">${project.name}</p>
        </div>
        <div class="page-header-actions">
          <button class="btn btn-danger" id="report-inc-btn">${icon('alert-triangle')} Report Incident</button>
        </div>
      </div>

      <!-- Safety KPIs -->
      <div class="stats-grid stats-grid-4 mb-6">
        <div class="stat-card">
          <div class="stat-card-header"><span class="stat-label">Days Without Incident</span><div class="stat-icon green">${ICONS['shield-alert']}</div></div>
          <div class="stat-value text-brand">${openInc > 0 ? 0 : daysClean}</div>
          <div class="stat-change ${openInc > 0 ? 'down' : 'up'}">${openInc > 0 ? '⚠ Open incident exists' : '↑ Current streak'}</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-header"><span class="stat-label">Total Incidents</span><div class="stat-icon orange">${ICONS['alert-triangle']}</div></div>
          <div class="stat-value">${incidents.length}</div>
          <div class="stat-change neutral">This project</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-header"><span class="stat-label">Open / Unresolved</span><div class="stat-icon red">${ICONS['alert-triangle']}</div></div>
          <div class="stat-value ${openInc > 0 ? 'text-danger' : ''}">${openInc}</div>
          <div class="stat-change ${openInc > 0 ? 'down' : 'up'}">${openInc > 0 ? 'Corrective action required' : '✓ All resolved'}</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-header"><span class="stat-label">High Severity</span><div class="stat-icon red">${ICONS['alert-triangle']}</div></div>
          <div class="stat-value ${highSev > 0 ? 'text-danger' : ''}">${highSev}</div>
          <div class="stat-change neutral">Total this project</div>
        </div>
      </div>

      <!-- Incident Log -->
      <div class="section-header mb-4">
        <span class="section-title">Incident Log</span>
        <div class="flex gap-2">
          <button class="filter-btn active" data-inc-filter="all">All</button>
          <button class="filter-btn" data-inc-filter="open">Open</button>
          <button class="filter-btn" data-inc-filter="closed">Closed</button>
        </div>
      </div>

      <div id="incidents-list">
        ${incidents.length === 0 ? '<div class="empty-state"><div class="empty-state-icon">🛡️</div><h3>No incidents recorded</h3><p>All clear! Report any incidents using the button above.</p></div>' : ''}
        ${incidents.map(i => `
          <div class="card mb-4 incident-card" data-status="${i.status}">
            <div class="card-body">
              <div class="flex items-start gap-4">
                <div style="width:40px;height:40px;border-radius:50%;background:${i.severity==='high'?'rgba(239,68,68,0.15)':i.severity==='medium'?'rgba(245,158,11,0.15)':'rgba(59,130,246,0.15)'};display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:18px">
                  ${i.severity==='high'?'🔴':i.severity==='medium'?'🟡':'🔵'}
                </div>
                <div class="flex-1">
                  <div class="flex items-center gap-3 mb-2">
                    <span class="fw-semibold">${formatDate(i.incidentDate)}</span>
                    <span class="badge ${i.severity==='high'?'badge-danger':i.severity==='medium'?'badge-warning':'badge-info'}">${i.severity?.toUpperCase()}</span>
                    ${statusBadge(i.status)}
                  </div>
                  <div class="text-sm mb-2">${i.description}</div>
                  ${i.actionTaken ? `<div class="text-xs text-muted"><strong>Action Taken:</strong> ${i.actionTaken}</div>` : ''}
                  <div class="text-xs text-muted mt-2">Reported by: ${i.reportedByName || 'Unknown'}</div>
                </div>
                ${i.status === 'open' ? `
                  <button class="btn btn-success btn-sm close-inc-btn" data-id="${i.id}">Close Incident</button>
                ` : ''}
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    // Report incident
    document.getElementById('report-inc-btn')?.addEventListener('click', () => this.showReportModal(pid, container));

    // Close incident
    container.querySelectorAll('.close-inc-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const action = prompt('Describe corrective action taken:');
        if (action === null) return;
        try {
          await Api.updateIncident(btn.dataset.id, { status: 'closed', actionTaken: action });
          showToast('Incident closed', 'success');
          this.render(container, pid);
        } catch (e) { showToast('Error: ' + e.message, 'error'); }
      });
    });

    // Filter
    container.querySelectorAll('[data-inc-filter]').forEach(btn => {
      btn.addEventListener('click', function() {
        container.querySelectorAll('[data-inc-filter]').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        const f = this.dataset.incFilter;
        container.querySelectorAll('.incident-card').forEach(card => {
          card.style.display = f === 'all' || card.dataset.status === f ? '' : 'none';
        });
      });
    });
  },

  showReportModal(pid, container) {
    const today = new Date().toISOString().split('T')[0];
    createModal('report-inc-modal', 'Report Safety Incident', `
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Incident Date <span class="required">*</span></label>
          <input type="date" class="form-control" id="inc-date" value="${today}">
        </div>
        <div class="form-group">
          <label class="form-label">Severity <span class="required">*</span></label>
          <select class="form-control" id="inc-severity">
            <option value="low">🔵 Low</option>
            <option value="medium">🟡 Medium</option>
            <option value="high">🔴 High</option>
          </select>
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Description <span class="required">*</span></label>
        <textarea class="form-control" id="inc-desc" rows="4" placeholder="Describe what happened…"></textarea>
      </div>
      <div class="form-group">
        <label class="form-label">Immediate Action Taken</label>
        <textarea class="form-control" id="inc-action" rows="2" placeholder="What was done immediately…"></textarea>
      </div>
    `, `
      <button class="btn btn-secondary" onclick="document.getElementById('report-inc-modal').remove()">Cancel</button>
      <button class="btn btn-danger" id="save-inc-btn">Submit Report</button>
    `);
    document.getElementById('save-inc-btn')?.addEventListener('click', async () => {
      const desc = document.getElementById('inc-desc')?.value.trim();
      if (!desc) { showToast('Description is required', 'warning'); return; }
      const user = Auth.currentUser();
      try {
        await Api.createIncident({
          projectId:          pid,
          incidentDate:       document.getElementById('inc-date')?.value || today,
          severity:           document.getElementById('inc-severity')?.value || 'low',
          description:        desc,
          actionTaken:        document.getElementById('inc-action')?.value.trim() || null,
          status:             'open',
          reportedByUserId:   user?.id || null,
          reportedByName:     user?.name || null,
        });
        showToast('Incident reported', 'success');
        document.getElementById('report-inc-modal')?.remove();
        this.render(container, pid);
      } catch (e) { showToast('Error: ' + e.message, 'error'); }
    });
  }
};
