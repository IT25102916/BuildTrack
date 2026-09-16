/* ============================================================
   ConstructIQ — Procurement & Inventory Module
   All data from REST API. No hardcoded data.
   ============================================================ */

const ProcurementModule = {
  async render(container, pid) {
    if (!pid) { container.innerHTML = '<div class="empty-state"><h3>Select a project</h3></div>'; return; }
    renderLoading(container);

    let project, requests, pos, suppliers;
    try {
      [project, requests, pos, suppliers] = await Promise.all([
        Api.project(pid),
        Api.materialRequests(pid),
        Api.purchaseOrders(pid),
        Api.suppliers(),
      ]);
    } catch (e) {
      renderError(container, 'Failed to load procurement data: ' + e.message);
      return;
    }

    const totalPOValue  = pos.reduce((s, p) => s + parseFloat(p.amount || 0), 0);
    const deliveredCount = pos.filter(p => p.status === 'delivered').length;
    const pendingMRs    = requests.filter(r => r.status === 'pending').length;

    container.innerHTML = `
      <div class="page-header">
        <div class="page-header-left">
          <h1 class="page-title">Procurement & Inventory</h1>
          <p class="page-subtitle">${project.name} — Materials & Supply Chain</p>
        </div>
        <div class="page-header-actions">
          <button class="btn btn-secondary">${icon('download')} Export</button>
          <button class="btn btn-primary" id="new-mr-btn">${icon('plus')} Material Request</button>
        </div>
      </div>

      <!-- Stats -->
      <div class="stats-grid stats-grid-4 mb-6">
        <div class="stat-card">
          <div class="stat-card-header"><span class="stat-label">Material Requests</span><div class="stat-icon teal">${ICONS['package']}</div></div>
          <div class="stat-value">${requests.length}</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-header"><span class="stat-label">Purchase Orders</span><div class="stat-icon blue">${ICONS['dollar-sign']}</div></div>
          <div class="stat-value">${pos.length}</div>
          <div class="stat-change neutral">Total: ${formatCurrency(totalPOValue, true)}</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-header"><span class="stat-label">Delivered</span><div class="stat-icon green">${ICONS['check-circle']}</div></div>
          <div class="stat-value">${deliveredCount}</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-header"><span class="stat-label">Pending Requests</span><div class="stat-icon orange">${ICONS['package']}</div></div>
          <div class="stat-value">${pendingMRs}</div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="tabs">
        <span class="tab active" data-tab="mr">Material Requests</span>
        <span class="tab" data-tab="po">Purchase Orders</span>
        <span class="tab" data-tab="suppliers">Suppliers</span>
      </div>

      <!-- Material Requests -->
      <div id="tab-mr">
        <div class="table-toolbar mb-4">
          <span class="text-sm text-secondary">${requests.length} requests</span>
        </div>
        <div class="table-wrapper">
          <table class="data-table">
            <thead><tr><th>Material</th><th>Qty</th><th>Unit</th><th>Requested By</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              ${requests.length === 0 ? '<tr><td colspan="7" class="text-center text-muted py-6">No material requests yet.</td></tr>' : ''}
              ${requests.map(r => `
                <tr>
                  <td class="primary">${r.materialDescription}</td>
                  <td>${r.quantity}</td>
                  <td>${r.unit}</td>
                  <td>${r.requestedByName || '—'}</td>
                  <td class="nowrap">${formatDate(r.requestDate)}</td>
                  <td>${statusBadge(r.status)}</td>
                  <td>
                    <div class="flex gap-2">
                      ${r.status === 'pending' ? `<button class="btn btn-primary btn-sm create-po-btn" data-id="${r.id}" data-desc="${r.materialDescription}">Create PO</button>` : ''}
                      ${r.status === 'approved' ? `<button class="btn btn-info btn-sm mr-order-btn" data-id="${r.id}">Mark Ordered</button>` : ''}
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Purchase Orders -->
      <div id="tab-po" class="hidden">
        <div class="table-toolbar mb-4">
          <span class="text-sm text-secondary">${pos.length} POs — ${formatCurrency(totalPOValue, true)} total</span>
          <button class="btn btn-primary btn-sm ml-auto" id="new-po-btn">${icon('plus')} New PO</button>
        </div>
        <div class="table-wrapper">
          <table class="data-table">
            <thead><tr><th>Supplier</th><th>Description</th><th>Amount</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              ${pos.length === 0 ? '<tr><td colspan="6" class="text-center text-muted py-6">No purchase orders yet.</td></tr>' : ''}
              ${pos.map(po => `
                <tr>
                  <td class="primary">${po.supplierName || '—'}</td>
                  <td class="text-sm text-secondary">${po.description}</td>
                  <td class="nowrap fw-semibold">${formatCurrency(po.amount)}</td>
                  <td class="nowrap">${formatDate(po.orderDate)}</td>
                  <td>${statusBadge(po.status)}</td>
                  <td>
                    <div class="flex gap-2">
                      ${po.status === 'ordered' ? `<button class="btn btn-success btn-sm po-deliver-btn" data-id="${po.id}">Mark Delivered</button>` : ''}
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Suppliers -->
      <div id="tab-suppliers" class="hidden">
        <div class="table-toolbar mb-4">
          <input type="text" class="search-input" id="supplier-search" placeholder="Search suppliers…">
          <button class="btn btn-primary btn-sm ml-auto" id="add-supplier-btn">${icon('plus')} Add Supplier</button>
        </div>
        <div class="table-wrapper">
          <table class="data-table">
            <thead><tr><th>Supplier Name</th><th>Contact</th><th>Type</th><th>Rating</th><th>On-Time %</th></tr></thead>
            <tbody id="supplier-tbody">
              ${suppliers.length === 0 ? '<tr><td colspan="5" class="text-center text-muted py-6">No suppliers yet.</td></tr>' : ''}
              ${suppliers.map(s => `
                <tr>
                  <td class="primary">${s.name}</td>
                  <td>${s.contactName || '—'}<br><span class="text-xs text-muted">${s.phone || ''}</span></td>
                  <td><span class="chip">${s.type || '—'}</span></td>
                  <td><div class="rating-stars text-sm">${ratingStars(s.rating)}</div><div class="text-xs text-muted">${s.rating}/5</div></td>
                  <td>
                    <div class="flex items-center gap-2">
                      <div class="progress-bar" style="width:80px"><div class="progress-fill ${s.onTimePercent < 80 ? 'warning' : ''}" style="width:${s.onTimePercent}%"></div></div>
                      <span class="text-xs">${s.onTimePercent}%</span>
                    </div>
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
        ['mr','po','suppliers'].forEach(id => {
          document.getElementById(`tab-${id}`)?.classList.toggle('hidden', id !== this.dataset.tab);
        });
      });
    });

    // New material request
    document.getElementById('new-mr-btn')?.addEventListener('click', () => this.showNewMRModal(pid));

    // New PO
    document.getElementById('new-po-btn')?.addEventListener('click', () => this.showNewPOModal(pid, suppliers));

    // Add supplier
    document.getElementById('add-supplier-btn')?.addEventListener('click', () => this.showAddSupplierModal(pid, container));

    // Create PO from MR
    container.querySelectorAll('.create-po-btn').forEach(btn => {
      btn.addEventListener('click', () => this.showNewPOModal(pid, suppliers, btn.dataset.id, btn.dataset.desc));
    });

    // Mark MR ordered
    container.querySelectorAll('.mr-order-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        try {
          await Api.updateMR(btn.dataset.id, { status: 'ordered' });
          showToast('Marked as ordered', 'success');
          this.render(container, pid);
        } catch (e) { showToast('Error: ' + e.message, 'error'); }
      });
    });

    // Mark PO delivered
    container.querySelectorAll('.po-deliver-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        try {
          await Api.updatePO(btn.dataset.id, { status: 'delivered' });
          showToast('PO marked delivered', 'success');
          this.render(container, pid);
        } catch (e) { showToast('Error: ' + e.message, 'error'); }
      });
    });

    // Supplier search
    document.getElementById('supplier-search')?.addEventListener('input', function() {
      const q = this.value.toLowerCase();
      document.querySelectorAll('#supplier-tbody tr').forEach(row => {
        row.style.display = !q || row.textContent.toLowerCase().includes(q) ? '' : 'none';
      });
    });
  },

  showNewMRModal(pid) {
    createModal('new-mr-modal', 'New Material Request', `
      <div class="form-group">
        <label class="form-label">Material Description <span class="required">*</span></label>
        <input type="text" class="form-control" id="mr-material" placeholder="e.g., 3000 PSI Concrete — 40 CY">
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Quantity</label>
          <input type="number" class="form-control" id="mr-qty" placeholder="0">
        </div>
        <div class="form-group">
          <label class="form-label">Unit</label>
          <select class="form-control" id="mr-unit">
            <option>CY</option><option>SF</option><option>LF</option><option>ton</option><option>EA</option><option>LS</option>
          </select>
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Notes</label>
        <textarea class="form-control" id="mr-notes" placeholder="Special requirements…"></textarea>
      </div>
    `, `
      <button class="btn btn-secondary" onclick="document.getElementById('new-mr-modal').remove()">Cancel</button>
      <button class="btn btn-primary" id="save-mr-btn">Submit Request</button>
    `);
    document.getElementById('save-mr-btn')?.addEventListener('click', async () => {
      const mat = document.getElementById('mr-material')?.value.trim();
      if (!mat) { showToast('Please describe the material', 'warning'); return; }
      const user = Auth.currentUser();
      try {
        await Api.createMR({
          projectId:           pid,
          materialDescription: mat,
          quantity:            parseFloat(document.getElementById('mr-qty')?.value) || 0,
          unit:                document.getElementById('mr-unit')?.value || 'EA',
          notes:               document.getElementById('mr-notes')?.value.trim() || null,
          requestedByUserId:   user?.id || null,
          requestedByName:     user?.name || null,
        });
        showToast('Material request submitted', 'success');
        document.getElementById('new-mr-modal')?.remove();
        this.render(document.getElementById('view-procurement') || document.getElementById('page-content'), pid);
      } catch (e) { showToast('Error: ' + e.message, 'error'); }
    });
  },

  showNewPOModal(pid, suppliers, mrId = null, mrDesc = '') {
    createModal('new-po-modal', 'New Purchase Order', `
      <div class="form-group">
        <label class="form-label">Supplier <span class="required">*</span></label>
        <select class="form-control" id="po-supplier">
          <option value="">— Select supplier —</option>
          ${suppliers.map(s => `<option value="${s.id}" data-name="${s.name}">${s.name}</option>`).join('')}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Description <span class="required">*</span></label>
        <input type="text" class="form-control" id="po-desc" value="${mrDesc}" placeholder="Items to purchase">
      </div>
      <div class="form-group">
        <label class="form-label">Amount (Rs.) <span class="required">*</span></label>
        <input type="number" class="form-control" id="po-amount" placeholder="0">
      </div>
    `, `
      <button class="btn btn-secondary" onclick="document.getElementById('new-po-modal').remove()">Cancel</button>
      <button class="btn btn-primary" id="save-po-btn">Create PO</button>
    `);
    document.getElementById('save-po-btn')?.addEventListener('click', async () => {
      const supplierEl = document.getElementById('po-supplier');
      const supplierId = supplierEl?.value;
      const supplierName = supplierEl?.options[supplierEl.selectedIndex]?.dataset.name || '';
      const desc   = document.getElementById('po-desc')?.value.trim();
      const amount = parseFloat(document.getElementById('po-amount')?.value) || 0;
      if (!supplierId || !desc) { showToast('Supplier and description required', 'warning'); return; }
      try {
        await Api.createPO({ projectId: pid, supplierId, supplierName, description: desc, amount, materialRequestId: mrId });
        if (mrId) await Api.updateMR(mrId, { status: 'ordered' });
        showToast('Purchase order created', 'success');
        document.getElementById('new-po-modal')?.remove();
        this.render(document.getElementById('view-procurement') || document.getElementById('page-content'), pid);
      } catch (e) { showToast('Error: ' + e.message, 'error'); }
    });
  },

  showAddSupplierModal(pid, container) {
    createModal('add-supplier-modal', 'Add Supplier', `
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Company Name <span class="required">*</span></label>
          <input type="text" class="form-control" id="sup-name">
        </div>
        <div class="form-group">
          <label class="form-label">Type</label>
          <input type="text" class="form-control" id="sup-type" placeholder="e.g., Concrete, Steel">
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Contact Name</label>
          <input type="text" class="form-control" id="sup-contact">
        </div>
        <div class="form-group">
          <label class="form-label">Phone</label>
          <input type="tel" class="form-control" id="sup-phone">
        </div>
      </div>
    `, `
      <button class="btn btn-secondary" onclick="document.getElementById('add-supplier-modal').remove()">Cancel</button>
      <button class="btn btn-primary" id="save-sup-btn">Add Supplier</button>
    `);
    document.getElementById('save-sup-btn')?.addEventListener('click', async () => {
      const name = document.getElementById('sup-name')?.value.trim();
      if (!name) { showToast('Name required', 'warning'); return; }
      try {
        await Api.createSupplier({
          name,
          type:        document.getElementById('sup-type')?.value.trim() || null,
          contactName: document.getElementById('sup-contact')?.value.trim() || null,
          phone:       document.getElementById('sup-phone')?.value.trim() || null,
        });
        showToast('Supplier added', 'success');
        document.getElementById('add-supplier-modal')?.remove();
        this.render(container, pid);
      } catch (e) { showToast('Error: ' + e.message, 'error'); }
    });
  }
};


/* ============================================================
   ConstructIQ — Subcontractors Module
   All data from REST API.
   ============================================================ */

const SubsModule = {
  async render(container) {
    renderLoading(container);
    let subs;
    try {
      subs = await Api.subcontractors();
    } catch (e) {
      renderError(container, 'Failed to load subcontractors: ' + e.message);
      return;
    }

    const today = new Date();

    container.innerHTML = `
      <div class="page-header">
        <div class="page-header-left">
          <h1 class="page-title">Subcontractor Management</h1>
          <p class="page-subtitle">Directory & Compliance Tracking</p>
        </div>
        <div class="page-header-actions">
          <button class="btn btn-secondary">${icon('download')} Export</button>
          <button class="btn btn-primary" id="add-sub-btn">${icon('plus')} Add Subcontractor</button>
        </div>
      </div>

      <!-- Stats -->
      <div class="stats-grid stats-grid-4 mb-6">
        <div class="stat-card">
          <div class="stat-card-header"><span class="stat-label">Total Subs</span><div class="stat-icon teal">${ICONS['hard-hat']}</div></div>
          <div class="stat-value">${subs.length}</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-header"><span class="stat-label">Active</span><div class="stat-icon green">${ICONS['check-circle']}</div></div>
          <div class="stat-value">${subs.filter(s => s.status === 'active').length}</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-header"><span class="stat-label">Insurance Expiring Soon</span><div class="stat-icon orange">${ICONS['shield-alert']}</div></div>
          <div class="stat-value text-warning">${subs.filter(s => {
            if (!s.insuranceExpiry) return false;
            const days = Math.ceil((new Date(s.insuranceExpiry) - today) / 86400000);
            return days > 0 && days <= 60;
          }).length}</div>
          <div class="stat-change down">Within 60 days</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-header"><span class="stat-label">Expired Insurance</span><div class="stat-icon red">${ICONS['alert-triangle']}</div></div>
          <div class="stat-value text-danger">${subs.filter(s => s.insuranceExpiry && new Date(s.insuranceExpiry) < today).length}</div>
        </div>
      </div>

      <!-- Table -->
      <div class="table-toolbar mb-4">
        <input type="text" class="search-input" id="sub-search" placeholder="Search subcontractors…">
        <button class="filter-btn active" data-sub-status="all">All</button>
        <button class="filter-btn" data-sub-status="active">Active</button>
        <button class="filter-btn" data-sub-status="inactive">Inactive</button>
      </div>
      <div class="table-wrapper">
        <table class="data-table">
          <thead><tr><th>Company Name</th><th>Contact</th><th>License #</th><th>Insurance Expiry</th><th>Rating</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody id="sub-tbody">
            ${subs.length === 0 ? '<tr><td colspan="7" class="text-center text-muted py-6">No subcontractors yet.</td></tr>' : ''}
            ${subs.map(s => this.subRow(s, today)).join('')}
          </tbody>
        </table>
      </div>
    `;

    // Search
    document.getElementById('sub-search')?.addEventListener('input', function() {
      const q = this.value.toLowerCase();
      document.querySelectorAll('#sub-tbody tr').forEach(row => {
        row.style.display = !q || row.textContent.toLowerCase().includes(q) ? '' : 'none';
      });
    });

    // Status filter
    container.querySelectorAll('[data-sub-status]').forEach(btn => {
      btn.addEventListener('click', function() {
        container.querySelectorAll('[data-sub-status]').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        const f = this.dataset.subStatus;
        document.querySelectorAll('#sub-tbody tr').forEach((row, i) => {
          row.style.display = f === 'all' || subs[i]?.status === f ? '' : 'none';
        });
      });
    });

    // Add sub
    document.getElementById('add-sub-btn')?.addEventListener('click', () => this.showAddSubModal(container));
  },

  subRow(s, today) {
    const expiry = s.insuranceExpiry ? new Date(s.insuranceExpiry) : null;
    const daysToExpiry = expiry ? Math.ceil((expiry - today) / 86400000) : null;
    let insClass = 'insurance-ok';
    let insLabel = expiry ? `Valid until ${formatDate(s.insuranceExpiry)}` : '—';
    if (daysToExpiry !== null && daysToExpiry < 0)   { insClass = 'insurance-expired';  insLabel = `⚠ Expired ${Math.abs(daysToExpiry)}d ago`; }
    else if (daysToExpiry !== null && daysToExpiry <= 60) { insClass = 'insurance-expiring'; insLabel = `⚠ Expires in ${daysToExpiry}d`; }

    return `
      <tr>
        <td class="primary">${s.name}</td>
        <td>${s.contactName || '—'}<br><span class="text-xs text-muted">${s.phone || ''}</span></td>
        <td><span class="cost-code-badge">${s.licenseNumber || '—'}</span></td>
        <td><div class="insurance-status ${insClass}"><span>●</span><span>${insLabel}</span></div></td>
        <td><div class="rating-stars">${ratingStars(s.rating)}</div><div class="text-xs text-muted">${s.rating}/5</div></td>
        <td>${statusBadge(s.status)}</td>
        <td>
          <div class="flex gap-2">
            <button class="btn btn-ghost btn-sm sub-toggle-btn" data-id="${s.id}" data-status="${s.status}">
              ${s.status === 'active' ? 'Deactivate' : 'Activate'}
            </button>
          </div>
        </td>
      </tr>
    `;
  },

  showAddSubModal(container) {
    createModal('add-sub-modal', 'Add Subcontractor', `
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Company Name <span class="required">*</span></label>
          <input type="text" class="form-control" id="sub-name" placeholder="e.g., ABC Plumbing LLC">
        </div>
        <div class="form-group">
          <label class="form-label">Contact Name</label>
          <input type="text" class="form-control" id="sub-contact" placeholder="Primary contact">
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">License Number</label>
          <input type="text" class="form-control" id="sub-license" placeholder="e.g., TX-P-12345">
        </div>
        <div class="form-group">
          <label class="form-label">Insurance Expiry</label>
          <input type="date" class="form-control" id="sub-ins">
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Phone</label>
        <input type="tel" class="form-control" id="sub-phone" placeholder="555-0000">
      </div>
    `, `
      <button class="btn btn-secondary" onclick="document.getElementById('add-sub-modal').remove()">Cancel</button>
      <button class="btn btn-primary" id="save-sub-btn">Add Subcontractor</button>
    `);
    document.getElementById('save-sub-btn')?.addEventListener('click', async () => {
      const name = document.getElementById('sub-name')?.value.trim();
      if (!name) { showToast('Company name required', 'warning'); return; }
      try {
        await Api.createSubcontractor({
          name,
          contactName:     document.getElementById('sub-contact')?.value.trim() || null,
          licenseNumber:   document.getElementById('sub-license')?.value.trim() || null,
          insuranceExpiry: document.getElementById('sub-ins')?.value || null,
          phone:           document.getElementById('sub-phone')?.value.trim() || null,
        });
        showToast('Subcontractor added', 'success');
        document.getElementById('add-sub-modal')?.remove();
        this.render(container);
      } catch (e) { showToast('Error: ' + e.message, 'error'); }
    });
  }
};
