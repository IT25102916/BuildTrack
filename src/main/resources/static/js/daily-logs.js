/* ============================================================
   ConstructIQ — Daily Field Logs Module
   All data from REST API. No Data.* calls.
   ============================================================ */

const LogsModule = {
  async render(container, pid) {
    if (!pid) { container.innerHTML = '<div class="empty-state"><h3>Select a project</h3></div>'; return; }
    renderLoading(container);

    let project, logs;
    try {
      [project, logs] = await Promise.all([Api.project(pid), Api.dailyLogs(pid)]);
    } catch (e) {
      renderError(container, 'Failed to load daily logs: ' + e.message);
      return;
    }

    const weatherEmoji = { sunny:'☀️', partly_cloudy:'⛅', rainy:'🌧️', cloudy:'☁️', stormy:'⛈️', windy:'🌬️' };
    const signed    = logs.filter(l => l.signed).length;
    const avgMan    = logs.length ? Math.round(logs.reduce((s, l) => s + (l.manpowerCount || 0), 0) / logs.length) : 0;
    const delayDays = logs.filter(l => l.delays && l.delays.toLowerCase() !== 'none' && l.delays.trim()).length;

    container.innerHTML = `
      <div class="page-header">
        <div class="page-header-left">
          <h1 class="page-title">Daily Field Logs</h1>
          <p class="page-subtitle">${project.name} — Field Reports</p>
        </div>
        <div class="page-header-actions">
          <button class="btn btn-secondary">${icon('download')} Export Logs</button>
          <button class="btn btn-primary" id="new-log-btn">${icon('plus')} New Daily Log</button>
        </div>
      </div>

      <!-- Stats -->
      <div class="stats-grid stats-grid-4 mb-6">
        <div class="stat-card">
          <div class="stat-card-header"><span class="stat-label">Total Logs</span><div class="stat-icon teal">${ICONS['clipboard-list']}</div></div>
          <div class="stat-value">${logs.length}</div>
          <div class="stat-change neutral">This project</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-header"><span class="stat-label">Signed Off</span><div class="stat-icon green">${ICONS['check-circle']}</div></div>
          <div class="stat-value">${signed}</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-header"><span class="stat-label">Avg Manpower</span><div class="stat-icon blue">${ICONS['hard-hat']}</div></div>
          <div class="stat-value">${avgMan}</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-header"><span class="stat-label">Days with Delays</span><div class="stat-icon orange">${ICONS['alert-triangle']}</div></div>
          <div class="stat-value">${delayDays}</div>
          <div class="stat-change neutral">Logs with delays noted</div>
        </div>
      </div>

      <div class="section-header mb-4">
        <span class="section-title">Log History</span>
      </div>

      <div class="flex-col gap-4" id="logs-list">
        ${logs.length === 0 ? '<div class="empty-state"><div class="empty-state-icon">📋</div><h3>No logs yet</h3><p>Click "New Daily Log" to create the first entry.</p></div>' : ''}
        ${logs.map(l => `
          <div class="log-card">
            <div class="log-card-header">
              <div class="flex items-center gap-3">
                <div style="font-size:28px">${weatherEmoji[l.weather] || '☀️'}</div>
                <div>
                  <div class="log-date">${formatDate(l.logDate)}</div>
                  <div class="log-meta">
                    <span>${ICONS['hard-hat']} ${l.manpowerCount} workers on-site</span>
                    <span>•</span>
                    <span>${l.temperature || '—'}</span>
                    <span>•</span>
                    <span>${l.weather?.replace('_', ' ') || '—'}</span>
                  </div>
                </div>
              </div>
              <div class="flex items-center gap-3">
                ${l.signed
                  ? `<span class="badge badge-success">${ICONS['check-circle']} Signed — ${l.signedByName || 'Unknown'}</span>`
                  : `<button class="btn btn-primary btn-sm sign-btn" data-id="${l.id}">Sign Off</button>`}
              </div>
            </div>
            <div class="log-card-body">
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--sp-4)">
                <div>
                  <div class="text-xs text-muted fw-semibold mb-2">WORK PERFORMED</div>
                  <div class="text-sm">${l.workPerformed || 'No description recorded.'}</div>
                </div>
                <div>
                  <div class="text-xs text-muted fw-semibold mb-2">DELAYS / ISSUES</div>
                  <div class="text-sm ${l.delays && l.delays.toLowerCase() !== 'none' ? 'text-warning' : 'text-muted'}">
                    ${l.delays || 'None reported.'}
                  </div>
                </div>
              </div>
              ${l.photoCount > 0 ? `<div class="text-xs text-muted mt-3">📷 ${l.photoCount} photo(s) attached</div>` : ''}
            </div>
          </div>
        `).join('')}
      </div>
    `;

    document.getElementById('new-log-btn')?.addEventListener('click', () => this.showNewLogModal(pid, container));

    container.querySelectorAll('.sign-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const user = Auth.currentUser();
        try {
          await Api.updateDailyLog(btn.dataset.id, { isSigned: true, signedByName: user?.name || 'Unknown' });
          showToast('Log signed off', 'success');
          this.render(container, pid);
        } catch (e) { showToast('Error: ' + e.message, 'error'); }
      });
    });
  },

  showNewLogModal(pid, container) {
    const today = new Date().toISOString().split('T')[0];
    createModal('new-log-modal', 'New Daily Log', `
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Log Date <span class="required">*</span></label>
          <input type="date" class="form-control" id="log-date" value="${today}">
        </div>
        <div class="form-group">
          <label class="form-label">Weather</label>
          <select class="form-control" id="log-weather">
            <option value="sunny">☀️ Sunny</option>
            <option value="partly_cloudy">⛅ Partly Cloudy</option>
            <option value="cloudy">☁️ Cloudy</option>
            <option value="rainy">🌧️ Rainy</option>
            <option value="stormy">⛈️ Stormy</option>
          </select>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Temperature</label>
          <input type="text" class="form-control" id="log-temp" placeholder="e.g., 88°F">
        </div>
        <div class="form-group">
          <label class="form-label">Manpower Count</label>
          <input type="number" class="form-control" id="log-manpower" placeholder="0">
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Work Performed <span class="required">*</span></label>
        <textarea class="form-control" id="log-work" rows="3" placeholder="Describe work performed today…"></textarea>
      </div>
      <div class="form-group">
        <label class="form-label">Delays / Issues</label>
        <textarea class="form-control" id="log-delays" rows="2" placeholder="None, or describe any delays…"></textarea>
      </div>
    `, `
      <button class="btn btn-secondary" onclick="document.getElementById('new-log-modal').remove()">Cancel</button>
      <button class="btn btn-primary" id="save-log-btn">Save Log</button>
    `);
    document.getElementById('save-log-btn')?.addEventListener('click', async () => {
      const work = document.getElementById('log-work')?.value.trim();
      if (!work) { showToast('Work performed description is required', 'warning'); return; }
      const user = Auth.currentUser();
      try {
        await Api.createDailyLog({
          projectId:     pid,
          logDate:       document.getElementById('log-date')?.value || today,
          weather:       document.getElementById('log-weather')?.value || 'sunny',
          temperature:   document.getElementById('log-temp')?.value.trim() || null,
          manpowerCount: parseInt(document.getElementById('log-manpower')?.value) || 0,
          workPerformed: work,
          delays:        document.getElementById('log-delays')?.value.trim() || null,
          isSigned:      false,
          signedByUserId: user?.id || null,
          signedByName:   null,
          photoCount:     0,
        });
        showToast('Daily log saved', 'success');
        document.getElementById('new-log-modal')?.remove();
        this.render(container, pid);
      } catch (e) { showToast('Error: ' + e.message, 'error'); }
    });
  }
};
