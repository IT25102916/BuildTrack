-- ============================================================
--  ConstructIQ — Microsoft SQL Server Schema
--  All tables use BIGINT IDENTITY PKs, proper DATE/DECIMAL/BIT
--  columns, and FOREIGN KEY constraints.
--  Safe to re-run: uses IF OBJECT_ID guards before each DROP.
-- ============================================================

-- ── Drop tables in FK-safe reverse order ─────────────────
IF OBJECT_ID('notifications',    'U') IS NOT NULL DROP TABLE notifications;
IF OBJECT_ID('incidents',        'U') IS NOT NULL DROP TABLE incidents;
IF OBJECT_ID('punch_items',      'U') IS NOT NULL DROP TABLE punch_items;
IF OBJECT_ID('daily_logs',       'U') IS NOT NULL DROP TABLE daily_logs;
IF OBJECT_ID('submittals',       'U') IS NOT NULL DROP TABLE submittals;
IF OBJECT_ID('rfis',             'U') IS NOT NULL DROP TABLE rfis;
IF OBJECT_ID('purchase_orders',  'U') IS NOT NULL DROP TABLE purchase_orders;
IF OBJECT_ID('material_requests','U') IS NOT NULL DROP TABLE material_requests;
IF OBJECT_ID('change_orders',    'U') IS NOT NULL DROP TABLE change_orders;
IF OBJECT_ID('budget_lines',     'U') IS NOT NULL DROP TABLE budget_lines;
IF OBJECT_ID('tasks',            'U') IS NOT NULL DROP TABLE tasks;
IF OBJECT_ID('subcontractors',   'U') IS NOT NULL DROP TABLE subcontractors;
IF OBJECT_ID('suppliers',        'U') IS NOT NULL DROP TABLE suppliers;
IF OBJECT_ID('projects',         'U') IS NOT NULL DROP TABLE projects;
IF OBJECT_ID('users',            'U') IS NOT NULL DROP TABLE users;

-- ── 1. users ─────────────────────────────────────────────
CREATE TABLE users (
    id               BIGINT          IDENTITY(1,1) PRIMARY KEY,
    name             NVARCHAR(150)   NOT NULL,
    email            NVARCHAR(255)   NOT NULL UNIQUE,
    role             NVARCHAR(50)    NOT NULL,   -- admin | pm | supervisor | subcontractor | procurement | finance | client
    phone            NVARCHAR(30)    NULL,
    avatar_initials  NVARCHAR(5)     NOT NULL,
    password_hash    NVARCHAR(255)   NOT NULL DEFAULT 'demo',
    is_active        BIT             NOT NULL DEFAULT 1,
    created_at       DATETIME2       NOT NULL DEFAULT GETDATE()
);

-- ── 2. projects ──────────────────────────────────────────
CREATE TABLE projects (
    id               BIGINT          IDENTITY(1,1) PRIMARY KEY,
    name             NVARCHAR(255)   NOT NULL,
    type             NVARCHAR(50)    NOT NULL,   -- Commercial | Residential | Infrastructure
    status           NVARCHAR(30)    NOT NULL,   -- active | planning | completed | on_hold
    address          NVARCHAR(500)   NULL,
    client_id        BIGINT          NULL REFERENCES users(id),
    client_name      NVARCHAR(255)   NULL,
    start_date       DATE            NULL,
    end_date         DATE            NULL,
    contract_value   DECIMAL(18,2)   NOT NULL DEFAULT 0,
    approved_budget  DECIMAL(18,2)   NOT NULL DEFAULT 0,
    percent_complete INT             NOT NULL DEFAULT 0,
    budget_health    NVARCHAR(20)    NOT NULL DEFAULT 'good',  -- good | warning | critical
    manpower_today   INT             NOT NULL DEFAULT 0,
    open_rfis        INT             NOT NULL DEFAULT 0,
    open_punch       INT             NOT NULL DEFAULT 0,
    color            NVARCHAR(10)    NOT NULL DEFAULT '#00d4b4',
    created_at       DATETIME2       NOT NULL DEFAULT GETDATE()
);

-- ── 3. tasks ─────────────────────────────────────────────
CREATE TABLE tasks (
    id               BIGINT          IDENTITY(1,1) PRIMARY KEY,
    project_id       BIGINT          NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name             NVARCHAR(255)   NOT NULL,
    parent_id        BIGINT          NULL REFERENCES tasks(id),
    is_milestone     BIT             NOT NULL DEFAULT 0,
    is_critical      BIT             NOT NULL DEFAULT 0,
    start_date       DATE            NULL,
    end_date         DATE            NULL,
    percent_complete INT             NOT NULL DEFAULT 0,
    status           NVARCHAR(30)    NOT NULL DEFAULT 'pending', -- pending | in_progress | completed
    assigned_user_id BIGINT          NULL REFERENCES users(id),
    assigned_name    NVARCHAR(150)   NULL,
    created_at       DATETIME2       NOT NULL DEFAULT GETDATE()
);

-- ── 4. budget_lines ──────────────────────────────────────
CREATE TABLE budget_lines (
    id               BIGINT          IDENTITY(1,1) PRIMARY KEY,
    project_id       BIGINT          NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    cost_code        NVARCHAR(20)    NOT NULL,
    description      NVARCHAR(255)   NOT NULL,
    budgeted_amount  DECIMAL(18,2)   NOT NULL DEFAULT 0,
    committed_amount DECIMAL(18,2)   NOT NULL DEFAULT 0,
    actual_amount    DECIMAL(18,2)   NOT NULL DEFAULT 0,
    created_at       DATETIME2       NOT NULL DEFAULT GETDATE()
);

-- ── 5. change_orders ─────────────────────────────────────
CREATE TABLE change_orders (
    id                  BIGINT        IDENTITY(1,1) PRIMARY KEY,
    project_id          BIGINT        NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    description         NVARCHAR(1000) NOT NULL,
    cost_impact         DECIMAL(18,2) NOT NULL DEFAULT 0,
    schedule_impact_days INT          NOT NULL DEFAULT 0,
    status              NVARCHAR(30)  NOT NULL DEFAULT 'pending', -- pending | approved | rejected
    submitted_by_user_id BIGINT       NULL REFERENCES users(id),
    submitted_by_name   NVARCHAR(150) NULL,
    submitted_date      DATE          NOT NULL DEFAULT CAST(GETDATE() AS DATE),
    created_at          DATETIME2     NOT NULL DEFAULT GETDATE()
);

-- ── 6. suppliers ─────────────────────────────────────────
CREATE TABLE suppliers (
    id               BIGINT          IDENTITY(1,1) PRIMARY KEY,
    name             NVARCHAR(255)   NOT NULL,
    contact_name     NVARCHAR(150)   NULL,
    phone            NVARCHAR(30)    NULL,
    email            NVARCHAR(255)   NULL,
    type             NVARCHAR(100)   NULL,        -- Concrete | Steel/Rebar | Lumber | etc.
    rating           DECIMAL(3,1)    NOT NULL DEFAULT 0,
    on_time_percent  INT             NOT NULL DEFAULT 0,
    is_active        BIT             NOT NULL DEFAULT 1,
    created_at       DATETIME2       NOT NULL DEFAULT GETDATE()
);

-- ── 7. subcontractors ────────────────────────────────────
CREATE TABLE subcontractors (
    id               BIGINT          IDENTITY(1,1) PRIMARY KEY,
    name             NVARCHAR(255)   NOT NULL,
    contact_name     NVARCHAR(150)   NULL,
    phone            NVARCHAR(30)    NULL,
    email            NVARCHAR(255)   NULL,
    license_number   NVARCHAR(100)   NULL,
    insurance_expiry DATE            NULL,
    rating           DECIMAL(3,1)    NOT NULL DEFAULT 0,
    status           NVARCHAR(20)    NOT NULL DEFAULT 'active',  -- active | inactive
    created_at       DATETIME2       NOT NULL DEFAULT GETDATE()
);

-- ── 8. material_requests ─────────────────────────────────
CREATE TABLE material_requests (
    id                   BIGINT       IDENTITY(1,1) PRIMARY KEY,
    project_id           BIGINT       NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    material_description NVARCHAR(500) NOT NULL,
    quantity             DECIMAL(12,2) NOT NULL DEFAULT 0,
    unit                 NVARCHAR(20)  NOT NULL DEFAULT 'EA',
    requested_by_user_id BIGINT        NULL REFERENCES users(id),
    requested_by_name    NVARCHAR(150) NULL,
    status               NVARCHAR(30)  NOT NULL DEFAULT 'pending',  -- pending | approved | ordered | delivered
    request_date         DATE          NOT NULL DEFAULT CAST(GETDATE() AS DATE),
    notes                NVARCHAR(1000) NULL,
    created_at           DATETIME2     NOT NULL DEFAULT GETDATE()
);

-- ── 9. purchase_orders ───────────────────────────────────
CREATE TABLE purchase_orders (
    id                   BIGINT       IDENTITY(1,1) PRIMARY KEY,
    project_id           BIGINT       NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    supplier_id          BIGINT       NULL REFERENCES suppliers(id),
    supplier_name        NVARCHAR(255) NULL,
    material_request_id  BIGINT       NULL REFERENCES material_requests(id),
    description          NVARCHAR(500) NOT NULL,
    amount               DECIMAL(18,2) NOT NULL DEFAULT 0,
    status               NVARCHAR(30)  NOT NULL DEFAULT 'ordered',  -- ordered | delivered | cancelled
    order_date           DATE          NOT NULL DEFAULT CAST(GETDATE() AS DATE),
    created_at           DATETIME2     NOT NULL DEFAULT GETDATE()
);

-- ── 10. rfis ─────────────────────────────────────────────
CREATE TABLE rfis (
    id                    BIGINT       IDENTITY(1,1) PRIMARY KEY,
    project_id            BIGINT       NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    rfi_number            NVARCHAR(20)  NOT NULL,
    subject               NVARCHAR(500) NOT NULL,
    status                NVARCHAR(30)  NOT NULL DEFAULT 'open',  -- open | pending | responded | closed
    submitted_by_user_id  BIGINT        NULL REFERENCES users(id),
    submitted_by_name     NVARCHAR(150) NULL,
    assigned_to           NVARCHAR(255) NULL,
    due_date              DATE          NULL,
    ball_in_court         NVARCHAR(255) NULL,
    response              NVARCHAR(2000) NULL,
    submitted_date        DATE          NOT NULL DEFAULT CAST(GETDATE() AS DATE),
    task_id               BIGINT        NULL REFERENCES tasks(id),
    created_at            DATETIME2     NOT NULL DEFAULT GETDATE()
);

-- ── 11. submittals ───────────────────────────────────────
CREATE TABLE submittals (
    id                    BIGINT       IDENTITY(1,1) PRIMARY KEY,
    project_id            BIGINT       NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    submittal_number      NVARCHAR(20)  NOT NULL,
    spec_section          NVARCHAR(10)  NOT NULL,
    description           NVARCHAR(500) NOT NULL,
    status                NVARCHAR(30)  NOT NULL DEFAULT 'pending',  -- pending | approved | approved_noted | revise_resubmit | rejected
    submitted_by_user_id  BIGINT        NULL REFERENCES users(id),
    submitted_by_name     NVARCHAR(150) NULL,
    reviewed_by           NVARCHAR(255) NULL,
    submitted_date        DATE          NOT NULL DEFAULT CAST(GETDATE() AS DATE),
    created_at            DATETIME2     NOT NULL DEFAULT GETDATE()
);

-- ── 12. daily_logs ───────────────────────────────────────
CREATE TABLE daily_logs (
    id                  BIGINT        IDENTITY(1,1) PRIMARY KEY,
    project_id          BIGINT        NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    log_date            DATE          NOT NULL,
    weather             NVARCHAR(30)  NULL,         -- sunny | partly_cloudy | rainy | cloudy | stormy
    temperature         NVARCHAR(20)  NULL,
    manpower_count      INT           NOT NULL DEFAULT 0,
    work_performed      NVARCHAR(2000) NULL,
    delays              NVARCHAR(1000) NULL,
    is_signed           BIT           NOT NULL DEFAULT 0,
    signed_by_user_id   BIGINT        NULL REFERENCES users(id),
    signed_by_name      NVARCHAR(150) NULL,
    photo_count         INT           NOT NULL DEFAULT 0,
    created_at          DATETIME2     NOT NULL DEFAULT GETDATE()
);

-- ── 13. punch_items ──────────────────────────────────────
CREATE TABLE punch_items (
    id                  BIGINT        IDENTITY(1,1) PRIMARY KEY,
    project_id          BIGINT        NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    location            NVARCHAR(255) NOT NULL,
    description         NVARCHAR(1000) NOT NULL,
    has_photo           BIT           NOT NULL DEFAULT 0,
    responsible_party   NVARCHAR(255) NULL,
    status              NVARCHAR(30)  NOT NULL DEFAULT 'open',  -- open | in_progress | ready_review | closed
    due_date            DATE          NULL,
    opened_date         DATE          NOT NULL DEFAULT CAST(GETDATE() AS DATE),
    closed_date         DATE          NULL,
    created_at          DATETIME2     NOT NULL DEFAULT GETDATE()
);

-- ── 14. incidents ────────────────────────────────────────
CREATE TABLE incidents (
    id                    BIGINT       IDENTITY(1,1) PRIMARY KEY,
    project_id            BIGINT       NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    incident_date         DATE         NOT NULL,
    severity              NVARCHAR(20) NOT NULL,   -- low | medium | high
    description           NVARCHAR(2000) NOT NULL,
    action_taken          NVARCHAR(2000) NULL,
    status                NVARCHAR(20) NOT NULL DEFAULT 'open',  -- open | closed
    reported_by_user_id   BIGINT       NULL REFERENCES users(id),
    reported_by_name      NVARCHAR(150) NULL,
    created_at            DATETIME2    NOT NULL DEFAULT GETDATE()
);

-- ── 15. notifications ────────────────────────────────────
CREATE TABLE notifications (
      id          BIGINT          IDENTITY(1,1) PRIMARY KEY,
      user_id     BIGINT          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      message     NVARCHAR(MAX)   NOT NULL,
      is_read     BIT             NOT NULL DEFAULT 0,
      created_at  DATETIME        DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE project_assignments (
      id               BIGINT          IDENTITY(1,1) PRIMARY KEY,
      project_id       BIGINT          NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
      user_id          BIGINT          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      assigned_date    DATE            DEFAULT CAST(GETDATE() AS DATE),
      UNIQUE(project_id, user_id)
);

CREATE TABLE attendance (
      id               BIGINT          IDENTITY(1,1) PRIMARY KEY,
      user_id          BIGINT          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      work_date        DATE            NOT NULL,
      clock_in         DATETIME        NOT NULL,
      clock_out        DATETIME,
      status           NVARCHAR(50)    NOT NULL DEFAULT 'Present',
      UNIQUE(user_id, work_date)
);
