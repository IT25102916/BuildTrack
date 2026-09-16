/* ============================================================
   ConstructIQ — Budget & Finance Module
   All data from REST API. No localStorage, no hardcoded data.
   ============================================================ */

const BudgetModule = {
  async render(container, pid) {
    if (!pid) { container.innerHTML = '<div class="empty-state"><h3>Select a project</h3></div>'; return; }
    renderLoading(container);

    let project, lines, changeOrders;
    try {
      [project, lines, changeOrders] = await Promise.all([
        Api.project(pid),
        Api.budgetLines(pid),
        Api.changeOrders(pid),
      ]);
    } catch (e) {
      renderError(container, 'Failed to load budget data: ' + e.message);
      return;
    }

    const totalBudgeted  = lines.reduce((s, l) => s + parseFloat(l.budgetedAmount || 0), 0);
    const totalCommitted = lines.reduce((s, l) => s + parseFloat(l.committedAmount || 0), 0);
    const totalActual    = lines.reduce((s, l) => s + parseFloat(l.actualAmount || 0), 0);
    const totalRemaining = totalBudgeted - totalActual;
    const budgetPct      = totalBudgeted ? Math.round((totalActual / totalBudgeted) * 100) : 0;
    const approvedCOs    = changeOrders.filter(co => co.status === 'approved').reduce((s, co) => s + parseFloat(co.costImpact || 0), 0);
    const pendingCOs     = changeOrders.filter(co => co.status === 'pending').reduce((s, co) => s + parseFloat(co.costImpact || 0), 0);

    container.innerHTML = `
      <div class="page-header">
        <div class="page-header-left">
          <h1 class="page-title">Budget & Finance</h1>
          <p class="page-subtitle">${project.name}</p>
        </div>
        <div class="page-header-actions">
          <button class="btn btn-secondary">${icon('download')} Export</button>
          <button class="btn btn-primary" id="add-line-btn">${icon('plus')} Add Budget Line</button>
        </div>
      </div>

      <!-- KPI Row -->
      <div class="stats-grid stats-grid-4 mb-6">
        <div class="stat-card">
          <div class="stat-card-header"><span class="stat-label">Total Budget</span><div class="stat-icon teal">${ICONS['dollar-sign']}</div></div>
          <div class="stat-value stat-value-sm">${formatCurrency(totalBudgeted, true)}</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-header"><span class="stat-label">Actual Spent</span><div class="stat-icon ${budgetPct > 90 ? 'red' : budgetPct > 75 ? 'orange' : 'green'}">${ICONS['dollar-sign']}</div></div>
          <div class="stat-value stat-value-sm ${budgetPct > 90 ? 'text-danger' : ''}">${formatCurrency(totalActual, true)}</div>
          <div class="stat-change ${budgetPct > 90 ? 'down' : 'neutral'}">${budgetPct}% utilized</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-header"><span class="stat-label">Remaining Budget</span><div class="stat-icon blue">${ICONS['dollar-sign']}</div></div>
          <div class="stat-value stat-value-sm ${totalRemaining < 0 ? 'text-danger' : ''}">${formatCurrency(totalRemaining, true)}</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-header"><span class="stat-label">Pending COs</span><div class="stat-icon orange">${ICONS['alert-triangle']}</div></div>
          <div class="stat-value stat-value-sm">${formatCurrency(pendingCOs, true)}</div>
          <div class="stat-change neutral">${changeOrders.filter(c => c.status === 'pending').length} change orders</div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="tabs">
        <span class="tab active" data-tab="lines">Cost Codes</span>
        <span class="tab" data-tab="change-orders">Change Orders</span>
      </div>

      <!-- Cost Code Lines -->
      <div id="tab-lines">
        <div class="table-wrapper">
          <table class="data-table">
            <thead><tr><th>Cost Code</th><th>Description</th><th>Budgeted</th><th>Committed</th><th>Actual</th><th>Remaining</th><th>Status</th><th></th></tr></thead>
            <tbody id="budget-tbody">
              ${lines.length === 0 ? '<tr><td colspan="8" class="text-center text-muted py-6">No budget lines. Click "+ Add Budget Line" to start.</td></tr>' : ''}
              ${lines.map(l => this.lineRow(l)).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Change Orders -->
      <div id="tab-change-orders" class="hidden">
        <div class="table-toolbar mb-4">
          <span class="text-sm text-secondary">${changeOrders.length} change orders — ${formatCurrency(approvedCOs, true)} approved</span>
          <button class="btn btn-primary btn-sm ml-auto" id="add-co-btn">${icon('plus')} New Change Order</button>
        </div>
        <div class="table-wrapper">
          <table class="data-table">
            <thead><tr><th>Description</th><th>Cost Impact</th><th>Schedule Impact</th><th>Submitted By</th><th>Date</th><th>Status</th><th></th></tr></thead>
            <tbody>
              ${changeOrders.length === 0 ? '<tr><td colspan="7" class="text-center text-muted py-6">No change orders yet.</td></tr>' : ''}
              ${changeOrders.map(co => `
                <tr>
                  <td class="primary">${co.description}</td>
                  <td class="nowrap fw-semibold ${parseFloat(co.costImpact) < 0 ? 'text-success' : 'text-warning'}">${parseFloat(co.costImpact) >= 0 ? '+' : ''}${formatCurrency(co.costImpact)}</td>
                  <td>${co.scheduleImpactDays ? `+${co.scheduleImpactDays} days` : '—'}</td>
                  <td>${co.submittedByName || '—'}</td>
                  <td class="nowrap">${formatDate(co.submittedDate)}</td>
                  <td>${statusBadge(co.status)}</td>
                  <td>
                    ${co.status === 'pending' ? `
                      <div class="flex gap-2">
                        <button class="btn btn-success btn-sm co-approve-btn" data-id="${co.id}">Approve</button>
                        <button class="btn btn-danger btn-sm co-reject-btn" data-id="${co.id}">Reject</button>
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
        ['lines','change-orders'].forEach(id => {
          document.getElementById(`tab-${id}`)?.classList.toggle('hidden', id !== this.dataset.tab);
        });
      });
    });

    // Add budget line
    document.getElementById('add-line-btn')?.addEventListener('click', () => this.showAddLineModal(pid));

    // Add change order
    document.getElementById('add-co-btn')?.addEventListener('click', () => this.showAddCOModal(pid));

    // Approve/reject CO
    container.querySelectorAll('.co-approve-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        try {
          await Api.updateChangeOrder(btn.dataset.id, { status: 'approved' });
          showToast('Change order approved', 'success');
          this.render(container, pid);
        } catch (e) { showToast('Error: ' + e.message, 'error'); }
      });
    });
    container.querySelectorAll('.co-reject-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        try {
          await Api.updateChangeOrder(btn.dataset.id, { status: 'rejected' });
          showToast('Change order rejected', 'warning');
          this.render(container, pid);
        } catch (e) { showToast('Error: ' + e.message, 'error'); }
      });
    });

    // Delete budget line
    container.querySelectorAll('.del-line-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        if (!confirm('Delete this budget line?')) return;
        try {
          await Api.deleteBudgetLine(btn.dataset.id);
          showToast('Budget line deleted', 'success');
          this.render(container, pid);
        } catch (e) { showToast('Error: ' + e.message, 'error'); }
      });
    });
  },

  lineRow(l) {
    const budgeted  = parseFloat(l.budgetedAmount  || 0);
    const actual    = parseFloat(l.actualAmount    || 0);
    const remaining = budgeted - actual;
    const pct       = budgeted ? Math.round((actual / budgeted) * 100) : 0;
    const health    = actual > budgeted ? 'over' : actual / budgeted > 0.85 ? 'watch' : 'ok';
    return `
      <tr>
        <td><span class="cost-code-badge">${l.costCode}</span></td>
        <td class="primary">${l.description}</td>
        <td class="nowrap">${formatCurrency(budgeted)}</td>
        <td class="nowrap text-secondary">${formatCurrency(parseFloat(l.committedAmount || 0))}</td>
        <td class="nowrap fw-semibold">${formatCurrency(actual)}</td>
        <td class="nowrap ${remaining < 0 ? 'text-danger' : ''}">${formatCurrency(remaining)}</td>
        <td>
          <div style="display:flex;align-items:center;gap:8px">
            <div class="progress-bar" style="width:60px"><div class="progress-fill ${actual > budgeted ? 'danger' : pct > 85 ? 'warning' : ''}" style="width:${Math.min(100,pct)}%"></div></div>
            <span class="text-xs text-muted">${pct}%</span>
          </div>
        </td>
        <td>
          <button class="btn btn-ghost btn-icon btn-sm del-line-btn" data-id="${l.id}" title="Delete">${ICONS['x']}</button>
        </td>
      </tr>
    `;
  },

  showAddLineModal(pid) {
    createModal('add-line-modal', 'Add Budget Line', `
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Cost Code <span class="required">*</span></label>
          <input type="text" class="form-control" id="bl-code" placeholder="e.g., 03000">
        </div>
        <div class="form-group">
          <label class="form-label">Description <span class="required">*</span></label>
          <input type="text" class="form-control" id="bl-desc" placeholder="e.g., Concrete">
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Budgeted Amount (Rs.)</label>
          <input type="number" class="form-control" id="bl-budgeted" placeholder="0">
        </div>
        <div class="form-group">
          <label class="form-label">Actual Spent (Rs.)</label>
          <input type="number" class="form-control" id="bl-actual" placeholder="0">
        </div>
      </div>
    `, `
      <button class="btn btn-secondary" onclick="document.getElementById('add-line-modal').remove()">Cancel</button>
      <button class="btn btn-primary" id="save-line-btn">Add Line</button>
    `);
    document.getElementById('save-line-btn')?.addEventListener('click', async () => {
      const code = document.getElementById('bl-code')?.value.trim();
      const desc = document.getElementById('bl-desc')?.value.trim();
      if (!code || !desc) { showToast('Code and description required', 'warning'); return; }
      try {
        await Api.createBudgetLine({
          projectId:      pid,
          costCode:       code,
          description:    desc,
          budgetedAmount: parseFloat(document.getElementById('bl-budgeted')?.value) || 0,
          actualAmount:   parseFloat(document.getElementById('bl-actual')?.value) || 0,
        });
        showToast('Budget line added', 'success');
        document.getElementById('add-line-modal')?.remove();
        this.render(document.getElementById('view-budget') || document.getElementById('page-content'), pid);
      } catch (e) { showToast('Error: ' + e.message, 'error'); }
    });
  },

  showAddCOModal(pid) {
    createModal('add-co-modal', 'New Change Order', `
      <div class="form-group">
        <label class="form-label">Description <span class="required">*</span></label>
        <textarea class="form-control" id="co-desc" rows="3" placeholder="Describe the change..."></textarea>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Cost Impact (Rs.)</label>
          <input type="number" class="form-control" id="co-cost" placeholder="0 (negative = credit)">
        </div>
        <div class="form-group">
          <label class="form-label">Schedule Impact (days)</label>
          <input type="number" class="form-control" id="co-days" placeholder="0">
        </div>
      </div>
    `, `
      <button class="btn btn-secondary" onclick="document.getElementById('add-co-modal').remove()">Cancel</button>
      <button class="btn btn-primary" id="save-co-btn">Submit Change Order</button>
    `);
    document.getElementById('save-co-btn')?.addEventListener('click', async () => {
      const desc = document.getElementById('co-desc')?.value.trim();
      if (!desc) { showToast('Description required', 'warning'); return; }
      const user = Auth.currentUser();
      try {
        await Api.createChangeOrder({
          projectId:          pid,
          description:        desc,
          costImpact:         parseFloat(document.getElementById('co-cost')?.value) || 0,
          scheduleImpactDays: parseInt(document.getElementById('co-days')?.value) || 0,
          submittedByUserId:  user?.id || null,
          submittedByName:    user?.name || null,
          status:             'pending',
        });
        showToast('Change order submitted', 'success');
        document.getElementById('add-co-modal')?.remove();
        this.render(document.getElementById('view-budget') || document.getElementById('page-content'), pid);
      } catch (e) { showToast('Error: ' + e.message, 'error'); }
    });
  }
};
