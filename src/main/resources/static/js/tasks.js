/* ============================================================
   ConstructIQ — Tasks / Gantt Module
   Interactive Gantt Chart with Drag-to-Resize + Task List
   All data from REST API. No Data.* calls.
   ============================================================ */

const TasksModule = {
  async render(container, pid) {
    if (!pid) { container.innerHTML = '<div class="empty-state"><h3>Select a project</h3></div>'; return; }
    renderLoading(container);

    let tasks, project;
    try {
      [tasks, project] = await Promise.all([
        Api.tasks(pid),
        Api.project(pid),
      ]);
    } catch (e) {
      renderError(container, 'Failed to load tasks: ' + e.message);
      return;
    }

    container.innerHTML = `
      <div class="page-header">
        <div class="page-header-left">
          <h1 class="page-title">Schedule & Tasks</h1>
          <p class="page-subtitle">${project.name} — Gantt View</p>
        </div>
        <div class="page-header-actions">
          <div class="segmented" id="gantt-view-seg">
            <span class="seg-btn active" data-view="gantt">Gantt</span>
            <span class="seg-btn" data-view="list">List</span>
          </div>
          <button class="btn btn-secondary">${icon('filter')} Filter</button>
          <button class="btn btn-primary" id="add-task-btn">${icon('plus')} Add Task</button>
        </div>
      </div>

      <!-- Legend -->
      <div class="flex items-center gap-6 mb-4 text-xs text-secondary">
        <span style="display:flex;align-items:center;gap:6px">
          <span style="width:16px;height:8px;border-radius:4px;background:linear-gradient(90deg,var(--brand-primary),var(--brand-primary-dark));display:inline-block"></span> Task
        </span>
        <span class="ml-auto text-muted">💡 Drag bars to reschedule (Coming soon)</span>
      </div>

      <div id="gantt-view-container"></div>
      <div id="list-view-container" class="hidden"></div>
    `;

    // View switch
    container.querySelectorAll('#gantt-view-seg .seg-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        container.querySelectorAll('#gantt-view-seg .seg-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        const v = this.dataset.view;
        document.getElementById('gantt-view-container').classList.toggle('hidden', v !== 'gantt');
        document.getElementById('list-view-container').classList.toggle('hidden', v !== 'list');
      });
    });

    this.renderGantt(document.getElementById('gantt-view-container'), tasks, project);
    this.renderList(document.getElementById('list-view-container'), tasks, pid);

    document.getElementById('add-task-btn')?.addEventListener('click', () => this.showAddTaskModal(pid, container));
  },

  renderGantt(container, tasks, project) {
    if (tasks.length === 0) {
      container.innerHTML = '<div class="empty-state"><h3>No tasks scheduled</h3><p>Add tasks to see the Gantt chart.</p></div>';
      return;
    }

    // Find date range
    let minDate = new Date(); minDate.setFullYear(2099);
    let maxDate = new Date(); maxDate.setFullYear(1970);
    tasks.forEach(t => {
      const s = new Date(t.startDate);
      const e = new Date(t.endDate);
      if (s < minDate) minDate = s;
      if (e > maxDate) maxDate = e;
    });

    minDate.setDate(minDate.getDate() - 5);
    maxDate.setDate(maxDate.getDate() + 10);
    
    const dayMs = 86400000;
    const totalDays = Math.ceil((maxDate - minDate) / dayMs);
    const dayWidth = 32;
    const todayStr = new Date().toISOString().split('T')[0];

    let headerHTML = '';
    for (let i = 0; i < totalDays; i++) {
      const d = new Date(minDate.getTime() + i * dayMs);
      const ds = d.toISOString().split('T')[0];
      const isToday = ds === todayStr;
      headerHTML += `<div class="gantt-day ${isToday?'today':''}" style="width:${dayWidth}px">
        <span class="gantt-day-name">${d.toLocaleDateString('en-US',{weekday:'short'})[0]}</span>
        <span class="gantt-day-num">${d.getDate()}</span>
      </div>`;
    }

    let rowsHTML = tasks.map(t => {
      const s = new Date(t.startDate);
      const e = new Date(t.endDate);
      const left = Math.max(0, Math.ceil((s - minDate) / dayMs) * dayWidth);
      const width = Math.max(dayWidth, Math.ceil((e - s) / dayMs) * dayWidth);

      return `
        <div class="gantt-row" data-id="${t.id}">
          <div class="gantt-bar-wrapper" style="left:${left}px;width:${width}px">
            <div class="gantt-bar ${t.status === 'completed' ? 'completed' : ''}" style="width:100%" title="${t.name} (${t.percentComplete}%)">
              <div class="gantt-bar-progress" style="width:${t.percentComplete}%"></div>
              <span class="gantt-bar-label">${t.name}</span>
            </div>
          </div>
        </div>
      `;
    }).join('');

    container.innerHTML = `
      <div class="card p-0" style="display:flex;height:500px;overflow:hidden">
        <!-- Task List Sidebar -->
        <div class="gantt-task-panel" style="width:300px;border-right:1px solid var(--border-subtle);display:flex;flex-direction:column">
          <div class="gantt-header-row" style="height:60px;border-bottom:1px solid var(--border-subtle);display:flex;align-items:center;padding:0 16px;font-weight:600;font-size:13px;color:var(--text-secondary)">
            Task Name
          </div>
          <div style="flex:1;overflow-y:auto" id="gantt-sidebar-scroll">
            ${tasks.map(t => `
              <div class="gantt-task-item" style="height:48px;border-bottom:1px solid var(--border-subtle);display:flex;align-items:center;padding:0 16px;font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis" title="${t.name}">
                ${t.status === 'completed' ? `<span style="color:var(--status-success);margin-right:8px">✓</span>` : `<span style="width:8px;height:8px;border-radius:50%;background:var(--brand-primary);display:inline-block;margin-right:8px"></span>`}
                ${t.name}
              </div>
            `).join('')}
          </div>
        </div>
        <!-- Chart Area -->
        <div class="gantt-chart-panel" style="flex:1;overflow:auto;position:relative" id="gantt-chart-scroll">
          <div style="min-width:${totalDays * dayWidth}px">
            <div class="gantt-header-row" style="height:60px;border-bottom:1px solid var(--border-subtle);display:flex;background:var(--bg-elevated);position:sticky;top:0;z-index:2">
              ${headerHTML}
            </div>
            <div style="position:relative">
              ${rowsHTML}
            </div>
          </div>
        </div>
      </div>
    `;

    // Sync scroll
    const side = container.querySelector('#gantt-sidebar-scroll');
    const main = container.querySelector('#gantt-chart-scroll');
    if (side && main) {
      main.addEventListener('scroll', () => { side.scrollTop = main.scrollTop; });
      side.addEventListener('scroll', () => { main.scrollTop = side.scrollTop; });
    }
  },

  renderList(container, tasks, pid) {
    container.innerHTML = `
      <div class="card p-0">
        <table class="data-table">
          <thead><tr><th>Task Name</th><th>Assigned To</th><th>Start Date</th><th>End Date</th><th>Progress</th><th>Status</th><th></th></tr></thead>
          <tbody>
            ${tasks.length === 0 ? '<tr><td colspan="7" class="text-center py-6 text-muted">No tasks.</td></tr>' : ''}
            ${tasks.map(t => `
              <tr>
                <td class="primary fw-medium">${t.name}</td>
                <td>${t.assignedName || 'Unassigned'}</td>
                <td class="nowrap">${formatDate(t.startDate)}</td>
                <td class="nowrap">${formatDate(t.endDate)}</td>
                <td>
                  <div style="display:flex;align-items:center;gap:8px">
                    <div class="progress-bar" style="width:60px"><div class="progress-fill" style="width:${t.percentComplete}%"></div></div>
                    <span class="text-xs text-muted">${t.percentComplete}%</span>
                  </div>
                </td>
                <td>${statusBadge(t.status)}</td>
                <td>
                  <button class="btn btn-ghost btn-sm del-task-btn" data-id="${t.id}">Delete</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;

    container.querySelectorAll('.del-task-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        if (!confirm('Delete this task?')) return;
        try {
          await Api.deleteTask(btn.dataset.id);
          showToast('Task deleted', 'success');
          TasksModule.render(document.getElementById('view-tasks') || document.getElementById('page-content'), pid);
        } catch (e) { showToast('Error: ' + e.message, 'error'); }
      });
    });
  },

  showAddTaskModal(pid, container) {
    const today = new Date().toISOString().split('T')[0];
    const nextWeek = new Date(); nextWeek.setDate(nextWeek.getDate() + 7);
    createModal('add-task-modal', 'Add Task', `
      <div class="form-group">
        <label class="form-label">Task Name <span class="required">*</span></label>
        <input type="text" class="form-control" id="task-name" placeholder="e.g., Pour Foundation">
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Start Date</label>
          <input type="date" class="form-control" id="task-start" value="${today}">
        </div>
        <div class="form-group">
          <label class="form-label">End Date</label>
          <input type="date" class="form-control" id="task-end" value="${nextWeek.toISOString().split('T')[0]}">
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Assigned To</label>
          <input type="text" class="form-control" id="task-assigned" placeholder="e.g., Subcontractor Name">
        </div>
        <div class="form-group">
          <label class="form-label">Percent Complete</label>
          <input type="number" class="form-control" id="task-pct" value="0" min="0" max="100">
        </div>
      </div>
    `, `
      <button class="btn btn-secondary" onclick="document.getElementById('add-task-modal').remove()">Cancel</button>
      <button class="btn btn-primary" id="save-task-btn">Add Task</button>
    `);
    
    document.getElementById('save-task-btn')?.addEventListener('click', async () => {
      const name = document.getElementById('task-name')?.value.trim();
      if (!name) { showToast('Task name is required', 'warning'); return; }
      
      const pct = parseInt(document.getElementById('task-pct')?.value) || 0;
      let status = 'pending';
      if (pct > 0 && pct < 100) status = 'in_progress';
      if (pct === 100) status = 'completed';

      try {
        await Api.createTask({
          projectId:       pid,
          name:            name,
          startDate:       document.getElementById('task-start')?.value || null,
          endDate:         document.getElementById('task-end')?.value || null,
          percentComplete: pct,
          status:          status,
          assignedName:    document.getElementById('task-assigned')?.value.trim() || null
        });
        showToast('Task added', 'success');
        document.getElementById('add-task-modal')?.remove();
        this.render(container, pid);
      } catch (e) { showToast('Error: ' + e.message, 'error'); }
    });
  }
};
