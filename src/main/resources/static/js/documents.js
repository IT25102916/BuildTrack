/* ============================================================
   ConstructIQ — Documents Module
   Currently static / placeholder as we don't have a documents API.
   ============================================================ */

const DocumentsModule = {
  async render(container, pid) {
    if (!pid) { container.innerHTML = '<div class="empty-state"><h3>Select a project</h3></div>'; return; }
    
    // As we didn't build a Document entity in phase 5, we'll render a placeholder.
    container.innerHTML = `
      <div class="page-header">
        <div class="page-header-left">
          <h1 class="page-title">Documents</h1>
          <p class="page-subtitle">File Management & Plans</p>
        </div>
        <div class="page-header-actions">
          <button class="btn btn-primary" disabled>${icon('upload')} Upload File</button>
        </div>
      </div>
      
      <div class="empty-state">
        <div class="empty-state-icon">📁</div>
        <h3>Document Management Coming Soon</h3>
        <p>This module requires the next phase of database expansion.</p>
      </div>
    `;
  }
};
