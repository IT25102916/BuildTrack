/* ============================================================
   ConstructIQ — Auth
   All credentials validated against the backend API.
   No hardcoded DEMO_ACCOUNTS. No localStorage for user data.
   ============================================================ */

// Nav config per role — pure UI config, not data
const NAV_CONFIG = {
  admin: [
    { section: 'Overview', items: [
      { route:'dashboard',  label:'Portfolio',        icon:'layout-dashboard', badge:null },
      { route:'project',    label:'Project Dashboard', icon:'building-2',       badge:null },
    ]},
    { section: 'Project', items: [
      { route:'tasks',      label:'Schedule & Tasks',  icon:'gantt-chart',      badge:null },
      { route:'budget',     label:'Budget & Finance',  icon:'dollar-sign',      badge:null },
      { route:'documents',  label:'Documents',         icon:'folder-open',      badge:null },
      { route:'rfis',       label:'RFIs & Submittals', icon:'message-circle',   badge:null },
      { route:'logs',       label:'Daily Field Logs',  icon:'clipboard-list',   badge:null },
      { route:'punch',      label:'Punch List & QC',   icon:'check-circle',     badge:null },
    ]},
    { section: 'Operations', items: [
      { route:'safety',        label:'Safety & Incidents', icon:'shield-alert', badge:null },
      { route:'procurement',   label:'Procurement',        icon:'package',      badge:null },
      { route:'subcontractors',label:'Subcontractors',     icon:'hard-hat',     badge:null },
    ]},
    { section: 'Analytics', items: [
      { route:'reports',       label:'Reports & Analytics', icon:'bar-chart-2', badge:null },
      { route:'client-portal', label:'Client Portal',       icon:'users',       badge:null },
    ]},
  ],
  pm: [
    { section: 'Overview', items: [
      { route:'dashboard', label:'Portfolio',         icon:'layout-dashboard', badge:null },
      { route:'project',   label:'Project Dashboard', icon:'building-2',       badge:null },
    ]},
    { section: 'Project', items: [
      { route:'tasks',    label:'Schedule & Tasks',  icon:'gantt-chart',    badge:null },
      { route:'budget',   label:'Budget & Finance',  icon:'dollar-sign',    badge:null },
      { route:'documents',label:'Documents',         icon:'folder-open',    badge:null },
      { route:'rfis',     label:'RFIs & Submittals', icon:'message-circle', badge:null },
      { route:'punch',    label:'Punch List & QC',   icon:'check-circle',   badge:null },
    ]},
    { section: 'Operations', items: [
      { route:'safety',        label:'Safety & Incidents', icon:'shield-alert', badge:null },
      { route:'subcontractors',label:'Subcontractors',     icon:'hard-hat',     badge:null },
    ]},
    { section: 'Analytics', items: [
      { route:'reports',       label:'Reports & Analytics', icon:'bar-chart-2', badge:null },
      { route:'client-portal', label:'Client Portal',       icon:'users',       badge:null },
    ]},
  ],
  supervisor: [
    { section: 'Overview', items: [
      { route:'project', label:'Project Dashboard', icon:'building-2', badge:null },
    ]},
    { section: 'Field', items: [
      { route:'tasks',    label:'Schedule & Tasks',  icon:'gantt-chart',    badge:null },
      { route:'documents',label:'Documents',         icon:'folder-open',    badge:null },
      { route:'rfis',     label:'RFIs',              icon:'message-circle', badge:null },
      { route:'logs',     label:'Daily Field Logs',  icon:'clipboard-list', badge:null },
      { route:'punch',    label:'Punch List',        icon:'check-circle',   badge:null },
      { route:'safety',   label:'Safety & Incidents',icon:'shield-alert',   badge:null },
    ]},
    { section: 'Other', items: [
      { route:'procurement', label:'Procurement', icon:'package', badge:null },
    ]},
  ],
  subcontractor: [
    { section: 'My Work', items: [
      { route:'tasks',    label:'My Tasks',  icon:'gantt-chart',   badge:null },
      { route:'documents',label:'Documents', icon:'folder-open',   badge:null },
      { route:'rfis',     label:'RFIs',      icon:'message-circle',badge:null },
    ]},
  ],
  procurement: [
    { section: 'Overview', items: [
      { route:'project', label:'Projects', icon:'building-2', badge:null },
    ]},
    { section: 'Supply', items: [
      { route:'procurement',   label:'Procurement',    icon:'package',  badge:null },
      { route:'subcontractors',label:'Subcontractors', icon:'hard-hat', badge:null },
    ]},
  ],
  finance: [
    { section: 'Overview', items: [
      { route:'dashboard', label:'Portfolio',         icon:'layout-dashboard', badge:null },
      { route:'project',   label:'Project Dashboard', icon:'building-2',       badge:null },
    ]},
    { section: 'Finance', items: [
      { route:'budget',        label:'Budget & Finance', icon:'dollar-sign', badge:null },
      { route:'subcontractors',label:'Subcontractors',   icon:'hard-hat',    badge:null },
    ]},
    { section: 'Analytics', items: [
      { route:'reports', label:'Reports', icon:'bar-chart-2', badge:null },
    ]},
  ],
  client: [
    { section: 'My Project', items: [
      { route:'client-portal', label:'Project Portal', icon:'users', badge:null },
    ]},
  ],
};

const ROLE_LABELS = {
  admin:'Admin / Owner', pm:'Project Manager', supervisor:'Site Supervisor',
  subcontractor:'Subcontractor', procurement:'Procurement', finance:'Finance',
  client:'Client'
};

// Role options for login select (matches seeded users)
const ROLE_ACCOUNTS = [
  { role:'admin',        email:'admin@apex.com',       label:'Admin / Owner — Alex Rivera' },
  { role:'pm',           email:'pm@apex.com',          label:'Project Manager — Sam Nguyen' },
  { role:'supervisor',   email:'supervisor@apex.com',  label:'Site Supervisor — Jordan Lee' },
  { role:'subcontractor',email:'sub@drywall.com',      label:'Subcontractor — Prime Drywall' },
  { role:'procurement',  email:'procurement@apex.com', label:'Procurement — Maria Santos' },
  { role:'finance',      email:'finance@apex.com',     label:'Finance — Chris Bloom' },
  { role:'client',       email:'client@greenfield.com',label:'Client — Greenfield Dev' },
];

// ── Auth State ────────────────────────────────────────────
const Auth = {
  _user: null,   // set after successful login or /api/auth/me

  currentUser()   { return this._user; },
  isLoggedIn()    { return !!this._user; },
  role()          { return this._user?.role; },
  nav()           { return NAV_CONFIG[this.role()] || []; },
  roleLabel()     { return ROLE_LABELS[this.role()] || this.role(); },

  setUser(user)   { this._user = user; },
  clearUser()     { this._user = null; },

  async checkSession() {
    try {
      const user = await Api.me();
      if (user?.id) { this._user = user; return true; }
    } catch (_) {}
    return false;
  },

  async logout() {
    try { await Api.logout(); } catch (_) {}
    this._user = null;
  },

  can(permission) {
    const role = this.role();
    const perms = {
      viewBudget:    ['admin','pm','finance'],
      editBudget:    ['admin','finance'],
      approveCO:     ['admin','pm'],
      viewAll:       ['admin'],
      submitLog:     ['admin','pm','supervisor'],
      viewReports:   ['admin','pm','finance'],
      viewPortfolio: ['admin','pm','finance'],
    };
    return (perms[permission] || []).includes(role);
  }
};

// ── Login UI ─────────────────────────────────────────────
function initLogin() {
  const screen     = document.getElementById('login-screen');
  if (!screen) return;

  const roleSelect = document.getElementById('demo-select');
  const emailInput = document.getElementById('login-email');
  const passInput  = document.getElementById('login-password');
  const loginBtn   = document.getElementById('login-btn');
  const loginError = document.getElementById('login-error');

  // Pre-fill based on select
  if (roleSelect) {
    roleSelect.addEventListener('change', () => {
      const acct = ROLE_ACCOUNTS.find(a => a.role === roleSelect.value);
      if (acct) { emailInput.value = acct.email; passInput.value = 'demo'; loginError.textContent = ''; }
    });
    // Default selection
    const defaultAcct = ROLE_ACCOUNTS[0];
    roleSelect.value = defaultAcct.role;
    emailInput.value = defaultAcct.email;
    passInput.value  = 'demo';
  }

  const doLogin = async () => {
    loginError.textContent = '';
    loginBtn.disabled = true;
    loginBtn.textContent = 'Signing in…';
    try {
      const user = await Api.login(emailInput.value.trim(), passInput.value.trim());
      Auth.setUser(user);
      screen.style.animation = 'fadeOut 200ms ease forwards';
      setTimeout(() => { screen.remove(); App.boot(); }, 200);
    } catch (err) {
      loginError.textContent = err.message || 'Login failed. Check your credentials.';
      loginBtn.disabled = false;
      loginBtn.textContent = 'Sign In to ConstructIQ';
    }
  };

  loginBtn?.addEventListener('click', doLogin);
  passInput?.addEventListener('keydown',  e => { if (e.key === 'Enter') doLogin(); });
  emailInput?.addEventListener('keydown', e => { if (e.key === 'Enter') doLogin(); });
}
