/* ============================================================
   ConstructIQ — RFIs & Submittals Module
   All data from REST API. No Data.* calls.
   ============================================================ */

const RFIsModule = {
  async render(container, pid) {
    if (!pid) { container.innerHTML = '<div class="empty-state"><h3>Select a project</h3></div>'; return; }
    renderLoading(container);

    let project, rfis, submittals;
    try {
      [project, rfis, submittals] = await Promise.all([
        Api.project(pid),
        Api.rfis(pid),
        Api.submittals(pid),
      ]);
    } catch (e) {
      renderError(container, 'Failed to load RFI data: ' + e.message);
      return;
    }

    const openRFIs    = rfis.filter(r => r.status === 'open' || r.status === 'pending').length;
    const closedRFIs  = rfis.filter(r => r.status === 'closed' || r.status === 'responded').length;
    const pendingSubs = submittals.filter(s => s.status === 'pending').length;
    const approvedSubs= submittals.filter(s => s.status === 'approved' || s.status === 'approved_noted').length;

    container.innerHTML = `
      <div class="page-header">
        <div class="page-header-left">
          <h1 class="page-title">RFIs & Submittals</h1>
          <p class="page-subtitle">${project.name}</p>
        </div>
        <div class="page-header-actions">
          <button class="btn btn-secondary">${icon('download')} Export Log</button>
          <button class="btn btn-primary" id="new-rfi-btn">${icon('plus')} New RFI</button>
        </div>
      </div>

      <!-- Stats -->
      <div class="stats-grid stats-grid-4 mb-6">
        <div class="stat-card">
          <div class="stat-card-header"><span class="stat-label">Total RFIs</span><div class="stat-icon blue">${ICONS['message-circle']}</div></div>
          <div class="stat-value">${rfis.length}</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-header"><span class="stat-label">Open RFIs</span><div class="stat-icon orange">${ICONS['alert-triangle']}</div></div>
          <div class="stat-value ${openRFIs > 0 ? 'text-warning' : ''}">${openRFIs}</div>
          <div class="stat-change ${openRFIs > 0 ? 'down' : 'up'}">${openRFIs > 0 ? `${openRFIs} awaiting response` : '✓ All responded'}</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-header"><span class="stat-label">Pending Submittals</span><div class="stat-icon orange">${ICONS['folder-open']}</div></div>
          <div class="stat-value">${pendingSubs}</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-header"><span class="stat-label">Approved Submittals</span><div class="stat-icon green">${ICONS['check-circle']}</div></div>
          <div class="stat-value text-success">${approvedSubs}</div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="tabs">
        <span class="tab active" data-tab="rfis">RFIs (${rfis.length})</span>
        <span class="tab" data-tab="submittals">Submittals (${submittals.length})</span>
      </div>

      <!-- RFI Table -->
      <div id="tab-rfis">
        <div class="table-toolbar mb-4">
          <input type="text" class="search-input" id="rfi-search" placeholder="Search RFIs…">
          <button class="filter-btn active" data-rfi-filter="all">All</button>
          <button class="filter-btn" data-rfi-filter="open">Open</button>
          <button class="filter-btn" data-rfi-filter="pending">Pending</button>
          <button class="filter-btn" data-rfi-filter="responded">Responded</button>
          <button class="filter-btn" data-rfi-filter="closed">Closed</button>
        </div>
        <div class="table-wrapper">
          <table class="data-table">
            <thead><tr><th>RFI #</th><th>Subject</th><th>Submitted By</th><th>Ball In Court</th><th>Due Date</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody id="rfi-tbody">
              ${rfis.length === 0 ? '<tr><td colspan="7" class="text-center text-muted py-6">No RFIs yet.</td></tr>' : ''}
              ${rfis.map(r => `
                <tr class="rfi-row" data-status="${r.status}">
                  <td class="primary">${r.rfiNumber}</td>
                  <td>${r.subject}</td>
                  <td>${r.submittedByName || '—'}</td>
                  <td>${r.ballInCourt || '—'}</td>
                  <td class="nowrap ${r.dueDate && new Date(r.dueDate) < new Date() && r.status !== 'closed' && r.status !== 'responded' ? 'text-danger' : ''}">${formatDate(r.dueDate)}</td>
                  <td>${statusBadge(r.status)}</td>
                  <td>
                    <div class="flex gap-2">
                      ${r.status !== 'closed' && r.status !== 'responded' ? `<button class="btn btn-success btn-sm rfi-respond-btn" data-id="${r.id}">Respond</button>` : ''}
                      ${r.status !== 'closed' ? `<button class="btn btn-ghost btn-sm rfi-close-btn" data-id="${r.id}">Close</button>` : ''}
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Submittals Table -->
      <div id="tab-submittals" class="hidden">
        <div class="table-toolbar mb-4">
          <span class="text-sm text-secondary">${submittals.length} submittals</span>
          <button class="btn btn-primary btn-sm ml-auto" id="new-sub-btn">${icon('plus')} New Submittal</button>
        </div>
        <div class="table-wrapper">
          <table class="data-table">
            <thead><tr><th>Sub #</th><th>Spec Section</th><th>Description</th><th>Submitted By</th><th>Reviewed By</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              ${submittals.length === 0 ? '<tr><td colspan="8" class="text-center text-muted py-6">No submittals yet.</td></tr>' : ''}
              ${submittals.map(s => `
                <tr>
                  <td class="primary">${s.submittalNumber}</td>
                  <td><span class="cost-code-badge">${s.specSection}</span></td>
                  <td>${s.description}</td>
                  <td>${s.submittedByName || '—'}</td>
                  <td>${s.reviewedBy || '—'}</td>
                  <td class="nowrap">${formatDate(s.submittedDate)}</td>
                  <td>${statusBadge(s.status)}</td>
                  <td>
                    ${s.status === 'pending' ? `
                      <div class="flex gap-2">
                        <button class="btn btn-success btn-sm sub-approve-btn" data-id="${s.id}">Approve</button>
                        <button class="btn btn-danger btn-sm sub-reject-btn" data-id="${s.id}">Reject</button>
                      </div>` : ''}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    // Tabs
    container.querySelectorAll('.tab').forEach(tab => {
      tab.addEventListener('click', function() {
        container.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        ['rfis','submittals'].forEach(id => {
          document.getElementById(`tab-${id}`)?.classList.toggle('hidden', id !== this.dataset.tab);
        });
      });
    });

    // New RFI
    document.getElementById('new-rfi-btn')?.addEventListener('click', () => this.showNewRFIModal(pid, container, rfis.length));

    // New Submittal
    document.getElementById('new-sub-btn')?.addEventListener('click', () => this.showNewSubmittalModal(pid, container, submittals.length));

    // RFI filter
    container.querySelectorAll('[data-rfi-filter]').forEach(btn => {
      btn.addEventListener('click', function() {
        container.querySelectorAll('[data-rfi-filter]').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        const f = this.dataset.rfiFilter;
        container.querySelectorAll('.rfi-row').forEach(row => {
          row.style.display = f === 'all' || row.dataset.status === f ? '' : 'none';
        });
      });
    });

    // RFI search
    document.getElementById('rfi-search')?.addEventListener('input', function() {
      const q = this.value.toLowerCase();
      container.querySelectorAll('.rfi-row').forEach(row => {
        row.style.display = !q || row.textContent.toLowerCase().includes(q) ? '' : 'none';
      });
    });

    // Respond to RFI
    container.querySelectorAll('.rfi-respond-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const resp = prompt('Enter response:');
        if (resp === null) return;
        try {
          await Api.updateRfi(btn.dataset.id, { status: 'responded', response: resp });
          showToast('RFI response recorded', 'success');
          this.render(container, pid);
        } catch (e) { showToast('Error: ' + e.message, 'error'); }
      });
    });

    // Close RFI
    container.querySelectorAll('.rfi-close-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        try {
          await Api.updateRfi(btn.dataset.id, { status: 'closed' });
          showToast('RFI closed', 'success');
          this.render(container, pid);
        } catch (e) { showToast('Error: ' + e.message, 'error'); }
      });
    });

    // Approve/reject submittal
    container.querySelectorAll('.sub-approve-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const reviewer = Auth.currentUser()?.name || 'Unknown';
        try {
          await Api.updateSubmittal(btn.dataset.id, { status: 'approved', reviewedBy: reviewer });
          showToast('Submittal approved', 'success');
          this.render(container, pid);
        } catch (e) { showToast('Error: ' + e.message, 'error'); }
      });
    });
    container.querySelectorAll('.sub-reject-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const reviewer = Auth.currentUser()?.name || 'Unknown';
        try {
          await Api.updateSubmittal(btn.dataset.id, { status: 'rejected', reviewedBy: reviewer });
          showToast('Submittal rejected', 'warning');
          this.render(container, pid);
        } catch (e) { showToast('Error: ' + e.message, 'error'); }
      });
    });
  },

  showNewRFIModal(pid, container, existingCount) {
    const user = Auth.currentUser();
    const rfiNum = `RFI-${String(existingCount + 1).padStart(3, '0')}`;
    const dueDate = new Date(); dueDate.setDate(dueDate.getDate() + 14);
    createModal('new-rfi-modal', 'New RFI', `
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">RFI Number</label>
          <input type="text" class="form-control" id="rfi-num" value="${rfiNum}" readonly>
        </div>
        <div class="form-group">
          <label class="form-label">Due Date</label>
          <input type="date" class="form-control" id="rfi-due" value="${dueDate.toISOString().split('T')[0]}">
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Subject <span class="required">*</span></label>
        <input type="text" class="form-control" id="rfi-subject" placeholder="Brief description of the question">
      </div>
      <div class="form-group">
        <label class="form-label">Assigned To</label>
        <input type="text" class="form-control" id="rfi-assigned" placeholder="e.g., Architect, Structural Engineer">
      </div>
    `, `
      <button class="btn btn-secondary" onclick="document.getElementById('new-rfi-modal').remove()">Cancel</button>
      <button class="btn btn-primary" id="save-rfi-btn">Submit RFI</button>
    `);
    document.getElementById('save-rfi-btn')?.addEventListener('click', async () => {
      const subject = document.getElementById('rfi-subject')?.value.trim();
      if (!subject) { showToast('Subject is required', 'warning'); return; }
      try {
        await Api.createRfi({
          projectId:          pid,
          rfiNumber:          document.getElementById('rfi-num')?.value || rfiNum,
          subject,
          status:             'open',
          submittedByUserId:  user?.id || null,
          submittedByName:    user?.name || null,
          assignedTo:         document.getElementById('rfi-assigned')?.value.trim() || null,
          dueDate:            document.getElementById('rfi-due')?.value || null,
          ballInCourt:        document.getElementById('rfi-assigned')?.value.trim() || null,
        });
        showToast('RFI submitted', 'success');
        document.getElementById('new-rfi-modal')?.remove();
        this.render(container, pid);
      } catch (e) { showToast('Error: ' + e.message, 'error'); }
    });
  },

  showNewSubmittalModal(pid, container, existingCount) {
    const user = Auth.currentUser();
    const subNum = `SUB-${String(existingCount + 1).padStart(3, '0')}`;
    createModal('new-sub-modal', 'New Submittal', `
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Submittal Number</label>
          <input type="text" class="form-control" id="sub-num" value="${subNum}" readonly>
        </div>
        <div class="form-group">
          <label class="form-label">Spec Section <span class="required">*</span></label>
          <input type="text" class="form-control" id="sub-spec" placeholder="e.g., 03300">
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Description <span class="required">*</span></label>
        <input type="text" class="form-control" id="sub-desc" placeholder="e.g., Ready-Mix Concrete Mix Design">
      </div>
    `, `
      <button class="btn btn-secondary" onclick="document.getElementById('new-sub-modal').remove()">Cancel</button>
      <button class="btn btn-primary" id="save-sub-btn">Submit</button>
    `);
    document.getElementById('save-sub-btn')?.addEventListener('click', async () => {
      const spec = document.getElementById('sub-spec')?.value.trim();
      const desc = document.getElementById('sub-desc')?.value.trim();
      if (!spec || !desc) { showToast('Spec section and description required', 'warning'); return; }
      try {
        await Api.createSubmittal({
          projectId:          pid,
          submittalNumber:    document.getElementById('sub-num')?.value || subNum,
          specSection:        spec,
          description:        desc,
          status:             'pending',
          submittedByUserId:  user?.id || null,
          submittedByName:    user?.name || null,
        });
        showToast('Submittal submitted', 'success');
        document.getElementById('new-sub-modal')?.remove();
        this.render(container, pid);
      } catch (e) { showToast('Error: ' + e.message, 'error'); }
    });
  }
};
