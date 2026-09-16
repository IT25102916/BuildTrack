/* ============================================================
   ConstructIQ — Punch List & QC Module
   All data from REST API. No Data.* calls.
   ============================================================ */

const PunchModule = {
  async render(container, pid) {
    if (!pid) { container.innerHTML = '<div class="empty-state"><h3>Select a project</h3></div>'; return; }
    renderLoading(container);

    let project, punchItems;
    try {
      [project, punchItems] = await Promise.all([
        Api.project(pid),
        Api.punchItems(pid)
      ]);
    } catch (e) {
      renderError(container, 'Failed to load punch list: ' + e.message);
      return;
    }

    const openItems = punchItems.filter(p => p.status === 'open').length;
    const readyItems = punchItems.filter(p => p.status === 'ready_review').length;

    container.innerHTML = `
      <div class="page-header">
        <div class="page-header-left">
          <h1 class="page-title">Punch List & Quality Control</h1>
          <p class="page-subtitle">${project.name}</p>
        </div>
        <div class="page-header-actions">
          <button class="btn btn-secondary">${icon('download')} Export Log</button>
          <button class="btn btn-primary" id="new-punch-btn">${icon('plus')} Add Punch Item</button>
        </div>
      </div>

      <!-- Stats -->
      <div class="stats-grid stats-grid-4 mb-6">
        <div class="stat-card">
          <div class="stat-card-header"><span class="stat-label">Total Items</span><div class="stat-icon blue">${ICONS['clipboard-list']}</div></div>
          <div class="stat-value">${punchItems.length}</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-header"><span class="stat-label">Open</span><div class="stat-icon orange">${ICONS['alert-triangle']}</div></div>
          <div class="stat-value ${openItems > 0 ? 'text-warning' : ''}">${openItems}</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-header"><span class="stat-label">Ready for Review</span><div class="stat-icon purple">${ICONS['check-circle']}</div></div>
          <div class="stat-value">${readyItems}</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-header"><span class="stat-label">Closed</span><div class="stat-icon green">${ICONS['check-circle']}</div></div>
          <div class="stat-value text-success">${punchItems.filter(p => p.status === 'closed').length}</div>
        </div>
      </div>

      <!-- Table -->
      <div class="table-toolbar mb-4">
        <input type="text" class="search-input" id="punch-search" placeholder="Search punch list…">
        <button class="filter-btn active" data-punch-filter="all">All</button>
        <button class="filter-btn" data-punch-filter="open">Open</button>
        <button class="filter-btn" data-punch-filter="ready_review">Ready Review</button>
        <button class="filter-btn" data-punch-filter="closed">Closed</button>
      </div>
      
      <div class="table-wrapper">
        <table class="data-table">
          <thead><tr><th>Item #</th><th>Location</th><th>Description</th><th>Assigned To</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody id="punch-tbody">
            ${punchItems.length === 0 ? '<tr><td colspan="6" class="text-center text-muted py-6">No punch items.</td></tr>' : ''}
            ${punchItems.map(p => `
              <tr class="punch-row" data-status="${p.status}">
                <td class="primary fw-semibold">P-${String(p.id).padStart(3, '0')}</td>
                <td><span class="cost-code-badge">${p.location || 'Site'}</span></td>
                <td>${p.description}</td>
                <td>${p.assignedName || 'Unassigned'}</td>
                <td>${statusBadge(p.status)}</td>
                <td>
                  <div class="flex gap-2">
                    ${p.status === 'open' ? `<button class="btn btn-primary btn-sm punch-ready-btn" data-id="${p.id}">Mark Ready</button>` : ''}
                    ${p.status === 'ready_review' ? `<button class="btn btn-success btn-sm punch-close-btn" data-id="${p.id}">Approve & Close</button>` : ''}
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;

    document.getElementById('new-punch-btn')?.addEventListener('click', () => this.showAddPunchModal(pid, container));

    // Search
    document.getElementById('punch-search')?.addEventListener('input', function() {
      const q = this.value.toLowerCase();
      container.querySelectorAll('.punch-row').forEach(row => {
        row.style.display = !q || row.textContent.toLowerCase().includes(q) ? '' : 'none';
      });
    });

    // Filter
    container.querySelectorAll('[data-punch-filter]').forEach(btn => {
      btn.addEventListener('click', function() {
        container.querySelectorAll('[data-punch-filter]').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        const f = this.dataset.punchFilter;
        container.querySelectorAll('.punch-row').forEach(row => {
          row.style.display = f === 'all' || row.dataset.status === f ? '' : 'none';
        });
      });
    });

    container.querySelectorAll('.punch-ready-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        try {
          await Api.updatePunchItem(btn.dataset.id, { status: 'ready_review' });
          showToast('Marked ready for review', 'success');
          this.render(container, pid);
        } catch (e) { showToast('Error: ' + e.message, 'error'); }
      });
    });

    container.querySelectorAll('.punch-close-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        try {
          await Api.updatePunchItem(btn.dataset.id, { status: 'closed' });
          showToast('Item closed', 'success');
          this.render(container, pid);
        } catch (e) { showToast('Error: ' + e.message, 'error'); }
      });
    });
  },

  showAddPunchModal(pid, container) {
    createModal('add-punch-modal', 'Add Punch Item', `
      <div class="form-group">
        <label class="form-label">Location <span class="required">*</span></label>
        <input type="text" class="form-control" id="punch-loc" placeholder="e.g., Level 1 Lobby">
      </div>
      <div class="form-group">
        <label class="form-label">Description <span class="required">*</span></label>
        <input type="text" class="form-control" id="punch-desc" placeholder="e.g., Touch up paint around door frame">
      </div>
      <div class="form-group">
        <label class="form-label">Assign To</label>
        <input type="text" class="form-control" id="punch-assign" placeholder="e.g., Primary Painting Inc.">
      </div>
    `, `
      <button class="btn btn-secondary" onclick="document.getElementById('add-punch-modal').remove()">Cancel</button>
      <button class="btn btn-primary" id="save-punch-btn">Add Item</button>
    `);
    
    document.getElementById('save-punch-btn')?.addEventListener('click', async () => {
      const loc = document.getElementById('punch-loc')?.value.trim();
      const desc = document.getElementById('punch-desc')?.value.trim();
      
      if (!loc || !desc) { showToast('Location and description are required', 'warning'); return; }

      const user = Auth.currentUser();
      try {
        await Api.createPunchItem({
          projectId: pid,
          location: loc,
          description: desc,
          assignedName: document.getElementById('punch-assign')?.value.trim() || null,
          status: 'open',
          createdByUserId: user?.id,
          createdByName: user?.name
        });
        showToast('Punch item added', 'success');
        document.getElementById('add-punch-modal')?.remove();
        this.render(container, pid);
      } catch (e) { showToast('Error: ' + e.message, 'error'); }
    });
  }
};
