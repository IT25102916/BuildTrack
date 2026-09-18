-- ============================================================
-- ConstructIQ Complete Clean Seeding Script
-- Removes unwanted/duplicate accounts and populates rich seed data
-- for all modules and entities.
-- ============================================================

-- ── 1. Clear existing data in FK-safe reverse order ──────────
DELETE FROM attendance;
DELETE FROM notifications;
DELETE FROM messages;
DELETE FROM issues;
DELETE FROM quotations;
DELETE FROM inventory_transactions;
DELETE FROM inventory_items;
DELETE FROM transactions;
DELETE FROM invoices;
DELETE FROM incidents;
DELETE FROM punch_items;
DELETE FROM daily_logs;
DELETE FROM submittals;
DELETE FROM rfis;
DELETE FROM purchase_orders;
DELETE FROM material_requests;
DELETE FROM change_orders;
DELETE FROM budget_lines;
DELETE FROM tasks;
DELETE FROM documents;
DELETE FROM project_assignments;
DELETE FROM projects;
DELETE FROM subcontractors;
DELETE FROM suppliers;
DELETE FROM users;

-- ── 2. Reseed Identities to Start Cleanly at 1 ──────────────
DBCC CHECKIDENT ('users', RESEED, 0);
DBCC CHECKIDENT ('projects', RESEED, 0);
DBCC CHECKIDENT ('project_assignments', RESEED, 0);
DBCC CHECKIDENT ('tasks', RESEED, 0);
DBCC CHECKIDENT ('budget_lines', RESEED, 0);
DBCC CHECKIDENT ('change_orders', RESEED, 0);
DBCC CHECKIDENT ('suppliers', RESEED, 0);
DBCC CHECKIDENT ('subcontractors', RESEED, 0);
DBCC CHECKIDENT ('material_requests', RESEED, 0);
DBCC CHECKIDENT ('purchase_orders', RESEED, 0);
DBCC CHECKIDENT ('rfis', RESEED, 0);
DBCC CHECKIDENT ('submittals', RESEED, 0);
DBCC CHECKIDENT ('daily_logs', RESEED, 0);
DBCC CHECKIDENT ('punch_items', RESEED, 0);
DBCC CHECKIDENT ('incidents', RESEED, 0);
DBCC CHECKIDENT ('invoices', RESEED, 0);
DBCC CHECKIDENT ('transactions', RESEED, 0);
DBCC CHECKIDENT ('inventory_items', RESEED, 0);
DBCC CHECKIDENT ('inventory_transactions', RESEED, 0);
DBCC CHECKIDENT ('attendance', RESEED, 0);
DBCC CHECKIDENT ('documents', RESEED, 0);
DBCC CHECKIDENT ('notifications', RESEED, 0);
DBCC CHECKIDENT ('issues', RESEED, 0);
DBCC CHECKIDENT ('messages', RESEED, 0);
DBCC CHECKIDENT ('quotations', RESEED, 0);

-- ── 3. Seed Users (8 Standard Roles, Password: demo) ────────
-- 1: Admin
INSERT INTO users (name, email, role, phone, avatar_initials, password_hash, is_active, created_at)
VALUES ('Alexander Vance', 'admin@constructiq.com', 'admin', '+1 (555) 010-1001', 'AV', 'demo', 1, GETDATE());

-- 2: Project Manager
INSERT INTO users (name, email, role, phone, avatar_initials, password_hash, is_active, created_at)
VALUES ('Marcus Brody', 'pm@constructiq.com', 'pm', '+1 (555) 010-1002', 'MB', 'demo', 1, GETDATE());

-- 3: Site Engineer
INSERT INTO users (name, email, role, phone, avatar_initials, password_hash, is_active, created_at)
VALUES ('Elena Rostova', 'site_eng@constructiq.com', 'site_engineer', '+1 (555) 010-1003', 'ER', 'demo', 1, GETDATE());

-- 4: Finance Executive
INSERT INTO users (name, email, role, phone, avatar_initials, password_hash, is_active, created_at)
VALUES ('Sarah Jenkins', 'finance@constructiq.com', 'finance', '+1 (555) 010-1004', 'SJ', 'demo', 1, GETDATE());

-- 5: Procurement Specialist
INSERT INTO users (name, email, role, phone, avatar_initials, password_hash, is_active, created_at)
VALUES ('David Chen', 'procurement@constructiq.com', 'procurement', '+1 (555) 010-1005', 'DC', 'demo', 1, GETDATE());

-- 6: Inventory Manager
INSERT INTO users (name, email, role, phone, avatar_initials, password_hash, is_active, created_at)
VALUES ('Carlos Mendez', 'inventory@constructiq.com', 'inventory_manager', '+1 (555) 010-1006', 'CM', 'demo', 1, GETDATE());

-- 7: Subcontractor
INSERT INTO users (name, email, role, phone, avatar_initials, password_hash, is_active, created_at)
VALUES ('Liam O''Connor', 'subcontractor@constructiq.com', 'subcontractor', '+1 (555) 010-1007', 'LO', 'demo', 1, GETDATE());

-- 8: Client Representative
INSERT INTO users (name, email, role, phone, avatar_initials, password_hash, is_active, created_at)
VALUES ('Victoria Sterling', 'client@constructiq.com', 'client', '+1 (555) 010-1008', 'VS', 'demo', 1, GETDATE());

-- ── 4. Seed Projects ─────────────────────────────────────────
-- 1: Skyline Tower (Active, Commercial)
INSERT INTO projects (name, type, status, address, client_id, client_name, start_date, end_date, contract_value, approved_budget, percent_complete, budget_health, manpower_today, open_rfis, open_punch, color, created_at)
VALUES ('Skyline Tower & Residences', 'Commercial', 'active', '742 Evergreen Terrace, Downtown Metro', 8, 'Sterling Global Developments', '2025-06-01', '2027-04-30', 14500000.00, 12800000.00, 64, 'good', 86, 3, 4, '#3b82f6', GETDATE());

-- 2: Harborview Logistics Hub (Active, Infrastructure)
INSERT INTO projects (name, type, status, address, client_id, client_name, start_date, end_date, contract_value, approved_budget, percent_complete, budget_health, manpower_today, open_rfis, open_punch, color, created_at)
VALUES ('Harborview Logistics Hub', 'Infrastructure', 'active', 'Pier 14 Terminal Way, Harbor Gateway', 8, 'Pacific Coastal Freight Corp', '2025-09-15', '2026-12-20', 9800000.00, 8400000.00, 42, 'warning', 52, 2, 1, '#10b981', GETDATE());

-- 3: Aura Luxury Oceanfront Villas (Active, Residential)
INSERT INTO projects (name, type, status, address, client_id, client_name, start_date, end_date, contract_value, approved_budget, percent_complete, budget_health, manpower_today, open_rfis, open_punch, color, created_at)
VALUES ('Aura Luxury Oceanfront Villas', 'Residential', 'active', '12 Ocean Ridge Way, Palm Cove', 8, 'Aura Hospitality Group', '2026-01-10', '2027-08-15', 6500000.00, 5600000.00, 22, 'good', 34, 1, 0, '#8b5cf6', GETDATE());

-- 4: Metro Transit Central Station (Planning, Infrastructure)
INSERT INTO projects (name, type, status, address, client_id, client_name, start_date, end_date, contract_value, approved_budget, percent_complete, budget_health, manpower_today, open_rfis, open_punch, color, created_at)
VALUES ('Metro Transit Central Station', 'Infrastructure', 'planning', 'Cross-Island Line Station 4B, Transit Corridor', 8, 'Metropolitan Transit Authority', '2026-11-01', '2029-03-31', 28000000.00, 25000000.00, 5, 'good', 0, 0, 0, '#f59e0b', GETDATE());

-- 5: Apex Corporate Center (Completed, Commercial)
INSERT INTO projects (name, type, status, address, client_id, client_name, start_date, end_date, contract_value, approved_budget, percent_complete, budget_health, manpower_today, open_rfis, open_punch, color, created_at)
VALUES ('Apex Corporate Center', 'Commercial', 'completed', '100 Financial Square, City Center', 8, 'Vanguard Real Estate REIT', '2024-03-01', '2026-02-15', 18200000.00, 17500000.00, 100, 'good', 0, 0, 0, '#06b6d4', GETDATE());

-- ── 5. Seed Project Assignments ──────────────────────────────
-- Assign PM (Marcus Brody, user 2) to active projects
INSERT INTO project_assignments (project_id, user_id, assigned_date) VALUES (1, 2, '2025-06-01');
INSERT INTO project_assignments (project_id, user_id, assigned_date) VALUES (2, 2, '2025-09-15');
INSERT INTO project_assignments (project_id, user_id, assigned_date) VALUES (3, 2, '2026-01-10');

-- Assign Site Engineer (Elena Rostova, user 3)
INSERT INTO project_assignments (project_id, user_id, assigned_date) VALUES (1, 3, '2025-06-01');
INSERT INTO project_assignments (project_id, user_id, assigned_date) VALUES (2, 3, '2025-09-15');

-- Assign Procurement (David Chen, user 5)
INSERT INTO project_assignments (project_id, user_id, assigned_date) VALUES (1, 5, '2025-06-01');
INSERT INTO project_assignments (project_id, user_id, assigned_date) VALUES (2, 5, '2025-09-15');

-- Assign Inventory Manager (Carlos Mendez, user 6)
INSERT INTO project_assignments (project_id, user_id, assigned_date) VALUES (1, 6, '2025-06-01');
INSERT INTO project_assignments (project_id, user_id, assigned_date) VALUES (2, 6, '2025-09-15');

-- Assign Subcontractor (Liam O'Connor, user 7)
INSERT INTO project_assignments (project_id, user_id, assigned_date) VALUES (1, 7, '2025-07-01');

-- ── 6. Seed Suppliers ────────────────────────────────────────
INSERT INTO suppliers (name, contact_name, phone, email, type, rating, on_time_percent, is_active, created_at)
VALUES ('Titan Cement & Concrete Corp', 'Robert Hayes', '+1 (555) 234-5678', 'orders@titancement.com', 'Concrete & Aggregates', 4.8, 96, 1, GETDATE());

INSERT INTO suppliers (name, contact_name, phone, email, type, rating, on_time_percent, is_active, created_at)
VALUES ('BlueScope Structural Steel Ltd', 'Amanda Miller', '+1 (555) 345-6789', 'sales@bluescopesteel.com', 'Structural Steel & Rebar', 4.9, 98, 1, GETDATE());

INSERT INTO suppliers (name, contact_name, phone, email, type, rating, on_time_percent, is_active, created_at)
VALUES ('Carrier Mechanical Solutions', 'Frank Robinson', '+1 (555) 456-7890', 'hvac-commercial@carrier.com', 'Mechanical & HVAC Equipment', 4.7, 92, 1, GETDATE());

INSERT INTO suppliers (name, contact_name, phone, email, type, rating, on_time_percent, is_active, created_at)
VALUES ('Pilkington Architectural Glass', 'Sophia Taylor', '+1 (555) 567-8901', 'glazing@pilkington.com', 'Curtain Wall & Glazing', 4.6, 94, 1, GETDATE());

INSERT INTO suppliers (name, contact_name, phone, email, type, rating, on_time_percent, is_active, created_at)
VALUES ('Schneider Electric Industrial', 'Alan Cooper', '+1 (555) 678-9012', 'industrial@schneider.com', 'Electrical Switchgear & Power', 4.9, 97, 1, GETDATE());

-- ── 7. Seed Subcontractors ───────────────────────────────────
INSERT INTO subcontractors (name, contact_name, phone, email, license_number, insurance_expiry, rating, status, created_at)
VALUES ('Apex Electrical Systems', 'Liam O''Connor', '+1 (555) 789-0123', 'contact@apexelectrical.com', 'EC-94821', '2027-12-31', 4.9, 'active', GETDATE());

INSERT INTO subcontractors (name, contact_name, phone, email, license_number, insurance_expiry, rating, status, created_at)
VALUES ('Pinnacle Mechanical & Piping', 'George Miller', '+1 (555) 890-1234', 'george@pinnaclemep.com', 'MC-44910', '2027-08-30', 4.7, 'active', GETDATE());

INSERT INTO subcontractors (name, contact_name, phone, email, license_number, insurance_expiry, rating, status, created_at)
VALUES ('Titan Steel Erector Corp', 'Sergei Petrov', '+1 (555) 901-2345', 'spetrov@titanerectors.com', 'SE-12948', '2028-03-15', 4.8, 'active', GETDATE());

INSERT INTO subcontractors (name, contact_name, phone, email, license_number, insurance_expiry, rating, status, created_at)
VALUES ('Vertex Drywall & Acoustic', 'Marco Rossi', '+1 (555) 012-3456', 'mrossi@vertexdrywall.com', 'DC-88129', '2027-06-30', 4.6, 'active', GETDATE());

INSERT INTO subcontractors (name, contact_name, phone, email, license_number, insurance_expiry, rating, status, created_at)
VALUES ('Elite Waterproofing & Roofing', 'Brenda Walsh', '+1 (555) 123-4567', 'brenda@elitewaterproof.com', 'WP-55102', '2027-11-15', 4.8, 'active', GETDATE());

-- ── 8. Seed Tasks (WBS for Skyline Tower) ────────────────────
INSERT INTO tasks (project_id, name, parent_id, is_milestone, is_critical, start_date, end_date, percent_complete, status, assigned_user_id, assigned_name, created_at)
VALUES (1, 'Site Earthwork & Deep Foundation Piling', NULL, 0, 0, '2025-06-01', '2025-08-15', 100, 'completed', 3, 'Elena Rostova', GETDATE());

INSERT INTO tasks (project_id, name, parent_id, is_milestone, is_critical, start_date, end_date, percent_complete, status, assigned_user_id, assigned_name, created_at)
VALUES (1, 'Cast-in-Place Mat Foundation & Retaining Walls', NULL, 1, 1, '2025-08-16', '2025-10-31', 100, 'completed', 3, 'Elena Rostova', GETDATE());

INSERT INTO tasks (project_id, name, parent_id, is_milestone, is_critical, start_date, end_date, percent_complete, status, assigned_user_id, assigned_name, created_at)
VALUES (1, 'Superstructure Concrete Slabs & Core L01 to L10', NULL, 1, 1, '2025-11-01', '2026-03-31', 100, 'completed', 3, 'Elena Rostova', GETDATE());

INSERT INTO tasks (project_id, name, parent_id, is_milestone, is_critical, start_date, end_date, percent_complete, status, assigned_user_id, assigned_name, created_at)
VALUES (1, 'Superstructure Pour - Levels 11 to 18', NULL, 0, 1, '2026-04-01', '2026-09-30', 65, 'in_progress', 3, 'Elena Rostova', GETDATE());

INSERT INTO tasks (project_id, name, parent_id, is_milestone, is_critical, start_date, end_date, percent_complete, status, assigned_user_id, assigned_name, created_at)
VALUES (1, 'MEP Rough-ins (HVAC, Electrical, Plumbing) L05-L10', NULL, 0, 0, '2026-05-15', '2026-11-15', 45, 'in_progress', 7, 'Liam O''Connor', GETDATE());

INSERT INTO tasks (project_id, name, parent_id, is_milestone, is_critical, start_date, end_date, percent_complete, status, assigned_user_id, assigned_name, created_at)
VALUES (1, 'Curtain Wall & Double-Glazed Facade Installation', NULL, 1, 1, '2026-07-01', '2026-12-31', 18, 'in_progress', 3, 'Elena Rostova', GETDATE());

INSERT INTO tasks (project_id, name, parent_id, is_milestone, is_critical, start_date, end_date, percent_complete, status, assigned_user_id, assigned_name, created_at)
VALUES (1, 'Interior Partitioning & Acoustic Drywall L01-L08', NULL, 0, 0, '2026-08-01', '2027-01-31', 10, 'pending', 7, 'Liam O''Connor', GETDATE());

INSERT INTO tasks (project_id, name, parent_id, is_milestone, is_critical, start_date, end_date, percent_complete, status, assigned_user_id, assigned_name, created_at)
VALUES (1, 'Elevator Machine Room & High-Speed Cab Installation', NULL, 0, 0, '2026-06-01', '2026-11-30', 35, 'in_progress', 7, 'Liam O''Connor', GETDATE());

INSERT INTO tasks (project_id, name, parent_id, is_milestone, is_critical, start_date, end_date, percent_complete, status, assigned_user_id, assigned_name, created_at)
VALUES (1, 'Fire Suppression, Life Safety & Alarm Commissioning', NULL, 1, 1, '2027-01-15', '2027-03-31', 0, 'pending', 3, 'Elena Rostova', GETDATE());

INSERT INTO tasks (project_id, name, parent_id, is_milestone, is_critical, start_date, end_date, percent_complete, status, assigned_user_id, assigned_name, created_at)
VALUES (1, 'Final Authority Inspection & Certificate of Occupancy', NULL, 1, 1, '2027-04-01', '2027-04-30', 0, 'pending', 2, 'Marcus Brody', GETDATE());

-- Tasks for Harborview Logistics
INSERT INTO tasks (project_id, name, parent_id, is_milestone, is_critical, start_date, end_date, percent_complete, status, assigned_user_id, assigned_name, created_at)
VALUES (2, 'Grading, Earthwork & Heavy Pavement Sub-base', NULL, 0, 0, '2025-09-15', '2025-12-15', 100, 'completed', 3, 'Elena Rostova', GETDATE());

INSERT INTO tasks (project_id, name, parent_id, is_milestone, is_critical, start_date, end_date, percent_complete, status, assigned_user_id, assigned_name, created_at)
VALUES (2, 'Pre-Engineered Structural Steel Frame Erection', NULL, 1, 1, '2026-01-05', '2026-06-30', 80, 'in_progress', 3, 'Elena Rostova', GETDATE());

INSERT INTO tasks (project_id, name, parent_id, is_milestone, is_critical, start_date, end_date, percent_complete, status, assigned_user_id, assigned_name, created_at)
VALUES (2, 'Insulated Metal Roof & Wall Cladding System', NULL, 0, 1, '2026-05-01', '2026-09-30', 40, 'in_progress', 3, 'Elena Rostova', GETDATE());

-- ── 9. Seed Budget Lines ──────────────────────────────────────
INSERT INTO budget_lines (project_id, cost_code, description, budgeted_amount, committed_amount, actual_amount, created_at)
VALUES (1, '03-3000', 'Cast-in-Place Concrete & Reinforcement', 3200000.00, 3100000.00, 2450000.00, GETDATE());

INSERT INTO budget_lines (project_id, cost_code, description, budgeted_amount, committed_amount, actual_amount, created_at)
VALUES (1, '05-1200', 'Structural Steel Framing & Decking', 2400000.00, 2350000.00, 2100000.00, GETDATE());

INSERT INTO budget_lines (project_id, cost_code, description, budgeted_amount, committed_amount, actual_amount, created_at)
VALUES (1, '08-4400', 'Curtain Wall & Architectural Glazed Systems', 1850000.00, 1800000.00, 950000.00, GETDATE());

INSERT INTO budget_lines (project_id, cost_code, description, budgeted_amount, committed_amount, actual_amount, created_at)
VALUES (1, '23-0000', 'HVAC Mechanical Systems & Chillers', 2100000.00, 1950000.00, 1200000.00, GETDATE());

INSERT INTO budget_lines (project_id, cost_code, description, budgeted_amount, committed_amount, actual_amount, created_at)
VALUES (1, '26-0000', 'Electrical Distribution & Switchgear', 1650000.00, 1580000.00, 980000.00, GETDATE());

INSERT INTO budget_lines (project_id, cost_code, description, budgeted_amount, committed_amount, actual_amount, created_at)
VALUES (1, '09-2200', 'Interior Finishes, Partitions & Ceilings', 1300000.00, 1100000.00, 320000.00, GETDATE());

INSERT INTO budget_lines (project_id, cost_code, description, budgeted_amount, committed_amount, actual_amount, created_at)
VALUES (1, '31-2000', 'Site Earthwork & Deep Piling', 300000.00, 290000.00, 290000.00, GETDATE());

-- Budget Lines for Harborview Logistics
INSERT INTO budget_lines (project_id, cost_code, description, budgeted_amount, committed_amount, actual_amount, created_at)
VALUES (2, '05-1200', 'Pre-Engineered Portal Frame Structure', 4200000.00, 4100000.00, 3100000.00, GETDATE());

INSERT INTO budget_lines (project_id, cost_code, description, budgeted_amount, committed_amount, actual_amount, created_at)
VALUES (2, '32-1200', 'Heavy Industrial Asphalt & Concrete Paving', 2200000.00, 2050000.00, 950000.00, GETDATE());

INSERT INTO budget_lines (project_id, cost_code, description, budgeted_amount, committed_amount, actual_amount, created_at)
VALUES (2, '21-0000', 'ESFR High-Density Fire Sprinkler System', 1200000.00, 1150000.00, 400000.00, GETDATE());

-- ── 10. Seed Change Orders ───────────────────────────────────
INSERT INTO change_orders (project_id, description, cost_impact, schedule_impact_days, status, submitted_by_user_id, submitted_by_name, submitted_date, created_at)
VALUES (1, 'Additional deep rock socketing for foundation piles due to geotechnical bedrock variance', 85000.00, 10, 'approved', 3, 'Elena Rostova', '2025-07-12', GETDATE());

INSERT INTO change_orders (project_id, description, cost_impact, schedule_impact_days, status, submitted_by_user_id, submitted_by_name, submitted_date, created_at)
VALUES (1, 'Upgrade central rooftop chiller plant to high-efficiency VRF inverter system', 145000.00, 4, 'pending', 2, 'Marcus Brody', '2026-08-20', GETDATE());

INSERT INTO change_orders (project_id, description, cost_impact, schedule_impact_days, status, submitted_by_user_id, submitted_by_name, submitted_date, created_at)
VALUES (1, 'Architectural modification to Level 5 executive terrace and structural canopy', 62000.00, 0, 'approved', 3, 'Elena Rostova', '2026-04-18', GETDATE());

INSERT INTO change_orders (project_id, description, cost_impact, schedule_impact_days, status, submitted_by_user_id, submitted_by_name, submitted_date, created_at)
VALUES (1, 'Dual EV fast-charging infrastructure additions in parking basement B1', 38000.00, 2, 'pending', 7, 'Liam O''Connor', '2026-09-02', GETDATE());

INSERT INTO change_orders (project_id, description, cost_impact, schedule_impact_days, status, submitted_by_user_id, submitted_by_name, submitted_date, created_at)
VALUES (2, 'Reinforced subgrade stabilization for heavy container crane travel corridor', 95000.00, 6, 'approved', 3, 'Elena Rostova', '2026-02-14', GETDATE());

-- ── 11. Seed Material Requests & Purchase Orders ─────────────
INSERT INTO material_requests (project_id, material_description, quantity, unit, requested_by_user_id, requested_by_name, status, request_date, notes, created_at)
VALUES (1, 'Ready-Mix High-Strength Concrete Grade 40', 600.00, 'm3', 3, 'Elena Rostova', 'delivered', '2026-08-10', 'For Level 13-14 slab pour', GETDATE());

INSERT INTO material_requests (project_id, material_description, quantity, unit, requested_by_user_id, requested_by_name, status, request_date, notes, created_at)
VALUES (1, 'Deformed High-Yield Steel Rebar Grade 60 (16mm/25mm)', 120.00, 'Tons', 3, 'Elena Rostova', 'delivered', '2026-08-15', 'Structural column & slab cages', GETDATE());

INSERT INTO material_requests (project_id, material_description, quantity, unit, requested_by_user_id, requested_by_name, status, request_date, notes, created_at)
VALUES (1, 'VRF Commercial Rooftop Heat Recovery Condenser Units', 8.00, 'Units', 7, 'Liam O''Connor', 'ordered', '2026-08-28', 'Long lead equipment package', GETDATE());

INSERT INTO material_requests (project_id, material_description, quantity, unit, requested_by_user_id, requested_by_name, status, request_date, notes, created_at)
VALUES (1, 'Architectural Low-E Double Glazed Spandrel Panels', 240.00, 'Panels', 3, 'Elena Rostova', 'approved', '2026-09-05', 'Façade installation zone 2', GETDATE());

INSERT INTO material_requests (project_id, material_description, quantity, unit, requested_by_user_id, requested_by_name, status, request_date, notes, created_at)
VALUES (1, 'Portland Cement Grade 53 (50kg Bags)', 500.00, 'Bags', 6, 'Carlos Mendez', 'delivered', '2026-09-08', 'Masonry mortar & screed batching', GETDATE());

-- Purchase Orders (matching material request IDs)
INSERT INTO purchase_orders (project_id, supplier_id, supplier_name, material_request_id, description, amount, status, order_date, expected_delivery_date, actual_delivery_date, created_at)
SELECT 1, 1, 'Titan Cement & Concrete Corp', mr.id, 'Ready-Mix Concrete Grade 40 batch delivery', 72000.00, 'delivered', '2026-08-12', '2026-08-20', '2026-08-19', GETDATE()
FROM material_requests mr WHERE mr.material_description LIKE '%Concrete Grade 40%';

INSERT INTO purchase_orders (project_id, supplier_id, supplier_name, material_request_id, description, amount, status, order_date, expected_delivery_date, actual_delivery_date, created_at)
SELECT 1, 2, 'BlueScope Structural Steel Ltd', mr.id, '120 Tons Deformed Rebar Grade 60 with mill certificates', 108000.00, 'delivered', '2026-08-16', '2026-08-25', '2026-08-24', GETDATE()
FROM material_requests mr WHERE mr.material_description LIKE '%Rebar Grade 60%';

INSERT INTO purchase_orders (project_id, supplier_id, supplier_name, material_request_id, description, amount, status, order_date, expected_delivery_date, actual_delivery_date, created_at)
SELECT 1, 3, 'Carrier Mechanical Solutions', mr.id, '8x Commercial VRF Rooftop Condensers', 94000.00, 'ordered', '2026-08-30', '2026-10-15', NULL, GETDATE()
FROM material_requests mr WHERE mr.material_description LIKE '%VRF Commercial%';

INSERT INTO purchase_orders (project_id, supplier_id, supplier_name, material_request_id, description, amount, status, order_date, expected_delivery_date, actual_delivery_date, created_at)
SELECT 1, 1, 'Titan Cement & Concrete Corp', mr.id, '500 Bags Portland Cement Grade 53 palletized', 5500.00, 'delivered', '2026-09-09', '2026-09-12', '2026-09-11', GETDATE()
FROM material_requests mr WHERE mr.material_description LIKE '%Portland Cement Grade 53%';

-- ── 12. Seed RFIs ────────────────────────────────────────────
INSERT INTO rfis (project_id, rfi_number, subject, status, submitted_by_user_id, submitted_by_name, assigned_to, due_date, ball_in_court, response, submitted_date, task_id, created_at)
VALUES (1, 'RFI-001', 'Clarification on shear wall SW-4 rebar lap splice length at Level 12', 'responded', 3, 'Elena Rostova', 'Structural Consultant', '2026-08-25', 'Site Engineer', 'Lap length verified as 58db (1450mm). Stagger alternate splices by 600mm.', '2026-08-18', 4, GETDATE());

INSERT INTO rfis (project_id, rfi_number, subject, status, submitted_by_user_id, submitted_by_name, assigned_to, due_date, ball_in_court, response, submitted_date, task_id, created_at)
VALUES (1, 'RFI-002', 'Main HVAC fresh air supply duct clash with primary steel transfer girder G-12', 'open', 7, 'Liam O''Connor', 'MEP Coordinator', '2026-09-22', 'MEP Coordinator', NULL, '2026-09-10', 5, GETDATE());

INSERT INTO rfis (project_id, rfi_number, subject, status, submitted_by_user_id, submitted_by_name, assigned_to, due_date, ball_in_court, response, submitted_date, task_id, created_at)
VALUES (1, 'RFI-003', 'Curtain wall bracket embed plate tolerance for precast concrete spandrels', 'open', 3, 'Elena Rostova', 'Façade Consultant', '2026-09-25', 'Façade Consultant', NULL, '2026-09-12', 6, GETDATE());

INSERT INTO rfis (project_id, rfi_number, subject, status, submitted_by_user_id, submitted_by_name, assigned_to, due_date, ball_in_court, response, submitted_date, task_id, created_at)
VALUES (1, 'RFI-004', 'Emergency generator exhaust riser wall penetration fire damper rating', 'closed', 2, 'Marcus Brody', 'Fire Life Safety Eng', '2026-08-15', 'Closed', 'Damper rating must be minimum 3-hour UL555 with automatic heat-release link.', '2026-08-05', 5, GETDATE());

INSERT INTO rfis (project_id, rfi_number, subject, status, submitted_by_user_id, submitted_by_name, assigned_to, due_date, ball_in_court, response, submitted_date, task_id, created_at)
VALUES (2, 'RFI-H01', 'High-bay warehouse loading dock leveling pit edge angle anchorage details', 'open', 3, 'Elena Rostova', 'Dock Equipment Vendor', '2026-09-28', 'Structural Engineer', NULL, '2026-09-14', 12, GETDATE());

-- ── 13. Seed Submittals ──────────────────────────────────────
INSERT INTO submittals (project_id, submittal_number, spec_section, description, status, submitted_by_user_id, submitted_by_name, reviewed_by, submitted_date, created_at)
VALUES (1, 'SUB-001', '03-3000', 'Concrete Mix Design Grade 40 with 8% silica fume and water reducer', 'approved', 3, 'Elena Rostova', 'Principal Structural Engineer', '2026-07-10', GETDATE());

INSERT INTO submittals (project_id, submittal_number, spec_section, description, status, submitted_by_user_id, submitted_by_name, reviewed_by, submitted_date, created_at)
VALUES (1, 'SUB-002', '08-4400', 'Low-E Double Glazed Vision Glass & Thermal Break Aluminum Extrusions', 'approved', 3, 'Elena Rostova', 'Architectural Lead', '2026-07-25', GETDATE());

INSERT INTO submittals (project_id, submittal_number, spec_section, description, status, submitted_by_user_id, submitted_by_name, reviewed_by, submitted_date, created_at)
VALUES (1, 'SUB-003', '23-0000', 'Rooftop AHU Vibration Spring Isolator calculations and wind shear restraints', 'pending', 7, 'Liam O''Connor', 'Acoustics & Vibration Eng', '2026-09-08', GETDATE());

INSERT INTO submittals (project_id, submittal_number, spec_section, description, status, submitted_by_user_id, submitted_by_name, reviewed_by, submitted_date, created_at)
VALUES (1, 'SUB-004', '26-0000', '1250kVA Dry-Type Transformer factory acceptance and dielectric test certificates', 'approved', 7, 'Liam O''Connor', 'Electrical Consultant', '2026-08-30', GETDATE());

-- ── 14. Seed Daily Logs ──────────────────────────────────────
INSERT INTO daily_logs (project_id, log_date, weather, temperature, manpower_count, work_performed, delays, is_signed, signed_by_user_id, signed_by_name, photo_count, created_at)
VALUES (1, CAST(GETDATE() AS DATE), 'sunny', '29°C', 86, 'Continued structural concrete pour for Level 14 floor slab. MEP trades active on L09-L11 rough-in. Glazing brackets installed on North elevation. No safety issues.', 'None. Crane operations normal throughout day.', 1, 3, 'Elena Rostova', 8, GETDATE());

INSERT INTO daily_logs (project_id, log_date, weather, temperature, manpower_count, work_performed, delays, is_signed, signed_by_user_id, signed_by_name, photo_count, created_at)
VALUES (1, DATEADD(DAY, -1, CAST(GETDATE() AS DATE)), 'partly_cloudy', '28°C', 82, 'Completed rebar cage inspection for Level 14. Placed conduit runs for power & data. Delivery of structural steel beams accepted at loading dock.', '30 min crane delay during morning wind gust.', 1, 3, 'Elena Rostova', 5, GETDATE());

INSERT INTO daily_logs (project_id, log_date, weather, temperature, manpower_count, work_performed, delays, is_signed, signed_by_user_id, signed_by_name, photo_count, created_at)
VALUES (2, CAST(GETDATE() AS DATE), 'clear', '26°C', 52, 'Erected portal frame bays 7 to 10. Completed high-strength bolt torque testing. Poured dock apron slab section 2.', 'None.', 1, 3, 'Elena Rostova', 6, GETDATE());

-- ── 15. Seed Punch Items ─────────────────────────────────────
INSERT INTO punch_items (project_id, location, description, has_photo, responsible_party, status, due_date, opened_date, closed_date, created_at)
VALUES (1, 'Level 9 - East Corridor', 'Missing intumescent fire stopping sealant around cable tray penetration sleeve', 1, 'Apex Electrical Systems', 'open', DATEADD(DAY, 3, CAST(GETDATE() AS DATE)), DATEADD(DAY, -2, CAST(GETDATE() AS DATE)), NULL, GETDATE());

INSERT INTO punch_items (project_id, location, description, has_photo, responsible_party, status, due_date, opened_date, closed_date, created_at)
VALUES (1, 'Level 10 - Room 1004', 'Hairline plaster shrinkage crack above ensuite bathroom door lintel', 1, 'Vertex Drywall & Acoustic', 'in_progress', DATEADD(DAY, 5, CAST(GETDATE() AS DATE)), DATEADD(DAY, -4, CAST(GETDATE() AS DATE)), NULL, GETDATE());

INSERT INTO punch_items (project_id, location, description, has_photo, responsible_party, status, due_date, opened_date, closed_date, created_at)
VALUES (1, 'Level 8 - Electrical Main Room', 'Clean metal filings and conduit debris inside distribution switchboard enclosure', 0, 'Apex Electrical Systems', 'ready_review', DATEADD(DAY, 1, CAST(GETDATE() AS DATE)), DATEADD(DAY, -3, CAST(GETDATE() AS DATE)), NULL, GETDATE());

INSERT INTO punch_items (project_id, location, description, has_photo, responsible_party, status, due_date, opened_date, closed_date, created_at)
VALUES (1, 'Basement 1 - Sump Pit', 'Test automatic backup float switch pump cutoff sensor', 0, 'Pinnacle Mechanical & Piping', 'closed', DATEADD(DAY, -1, CAST(GETDATE() AS DATE)), DATEADD(DAY, -7, CAST(GETDATE() AS DATE)), CAST(GETDATE() AS DATE), GETDATE());

INSERT INTO punch_items (project_id, location, description, has_photo, responsible_party, status, due_date, opened_date, closed_date, created_at)
VALUES (2, 'Bay 4 Dock Gate', 'Re-align overhead sectional door track seal bracket', 1, 'Titan Steel Erector Corp', 'open', DATEADD(DAY, 4, CAST(GETDATE() AS DATE)), CAST(GETDATE() AS DATE), NULL, GETDATE());

-- ── 16. Seed Safety Incidents ────────────────────────────────
INSERT INTO incidents (project_id, incident_date, severity, description, action_taken, status, reported_by_user_id, reported_by_name, created_at)
VALUES (1, DATEADD(DAY, -3, CAST(GETDATE() AS DATE)), 'medium', 'A scaffold wedge clamp slipped during dismantling on Level 11 and was arrested by the safety debris netting. No personnel in perimeter.', 'Safety net certified intact. All scaffolders attended mandatory harness and tethering stand-down briefing.', 'closed', 3, 'Elena Rostova', GETDATE());

INSERT INTO incidents (project_id, incident_date, severity, description, action_taken, status, reported_by_user_id, reported_by_name, created_at)
VALUES (1, DATEADD(DAY, -8, CAST(GETDATE() AS DATE)), 'low', 'Ironworker experienced minor palm wire pinch abrasion while tying column cage. Worker was wearing standard gloves.', 'First aid antiseptic wash applied on-site. Upgraded to ANSI Level 4 cut-resistant Kevlar palm gloves.', 'closed', 3, 'Elena Rostova', GETDATE());

-- ── 17. Seed Invoices ────────────────────────────────────────
INSERT INTO invoices (project_id, supplier_id, invoice_number, amount, due_date, status, created_at)
VALUES (1, 1, 'INV-2026-001', 72000.00, CAST(GETDATE() AS DATE), 'Paid', GETDATE());

INSERT INTO invoices (project_id, supplier_id, invoice_number, amount, due_date, status, created_at)
VALUES (1, 2, 'INV-2026-002', 108000.00, CAST(GETDATE() AS DATE), 'Paid', GETDATE());

INSERT INTO invoices (project_id, supplier_id, invoice_number, amount, due_date, status, created_at)
VALUES (1, NULL, 'INV-2026-003', 45000.00, DATEADD(DAY, 14, CAST(GETDATE() AS DATE)), 'Pending', GETDATE());

INSERT INTO invoices (project_id, supplier_id, invoice_number, amount, due_date, status, created_at)
VALUES (1, 3, 'INV-2026-004', 94000.00, DATEADD(DAY, 21, CAST(GETDATE() AS DATE)), 'Pending', GETDATE());

INSERT INTO invoices (project_id, supplier_id, invoice_number, amount, due_date, status, created_at)
VALUES (1, 4, 'INV-2026-005', 52500.00, DATEADD(DAY, 30, CAST(GETDATE() AS DATE)), 'Approved', GETDATE());

INSERT INTO invoices (project_id, supplier_id, invoice_number, amount, due_date, status, created_at)
VALUES (2, NULL, 'INV-2026-006', 64000.00, DATEADD(DAY, 10, CAST(GETDATE() AS DATE)), 'Pending', GETDATE());

-- ── 18. Seed Transactions ────────────────────────────────────
INSERT INTO transactions (project_id, type, category, amount, transaction_date, description, reference_id, created_at)
VALUES (1, 'Expense', 'Materials', 72000.00, DATEADD(DAY, -20, CAST(GETDATE() AS DATE)), 'Ready-Mix Concrete Pour L12-L13', 1, GETDATE());

INSERT INTO transactions (project_id, type, category, amount, transaction_date, description, reference_id, created_at)
VALUES (1, 'Expense', 'Materials', 108000.00, DATEADD(DAY, -15, CAST(GETDATE() AS DATE)), 'Structural Rebar Grade 60 Mill Delivery', 2, GETDATE());

INSERT INTO transactions (project_id, type, category, amount, transaction_date, description, reference_id, created_at)
VALUES (1, 'Payroll', 'Direct Labor', 28500.00, DATEADD(DAY, -7, CAST(GETDATE() AS DATE)), 'Site Engineering & Trades Payroll Week 37', NULL, GETDATE());

INSERT INTO transactions (project_id, type, category, amount, transaction_date, description, reference_id, created_at)
VALUES (1, 'Income', 'Progress Billing', 750000.00, DATEADD(DAY, -5, CAST(GETDATE() AS DATE)), 'Owner Milestone 3 Draw Request Payment', NULL, GETDATE());

INSERT INTO transactions (project_id, type, category, amount, transaction_date, description, reference_id, created_at)
VALUES (1, 'Expense', 'Equipment Rental', 18200.00, DATEADD(DAY, -3, CAST(GETDATE() AS DATE)), 'Liebherr Tower Crane Monthly Lease', NULL, GETDATE());

INSERT INTO transactions (project_id, type, category, amount, transaction_date, description, reference_id, created_at)
VALUES (1, 'Expense', 'Utilities', 4150.00, DATEADD(DAY, -2, CAST(GETDATE() AS DATE)), 'Site Water & High-Voltage Temporary Power', NULL, GETDATE());

INSERT INTO transactions (project_id, type, category, amount, transaction_date, description, reference_id, created_at)
VALUES (2, 'Expense', 'Subcontractor', 64000.00, DATEADD(DAY, -6, CAST(GETDATE() AS DATE)), 'Harborview Portal Frame Erection Draw 1', NULL, GETDATE());

INSERT INTO transactions (project_id, type, category, amount, transaction_date, description, reference_id, created_at)
VALUES (2, 'Income', 'Progress Billing', 420000.00, DATEADD(DAY, -4, CAST(GETDATE() AS DATE)), 'Harborview Client Progress Draw 2', NULL, GETDATE());

-- ── 19. Seed Inventory Items ─────────────────────────────────
INSERT INTO inventory_items (name, description, unit, category, quantity_on_hand, reorder_level, unit_cost, supplier_id, is_active, created_at)
VALUES ('Portland Cement Grade 53', 'Standard 50kg bags for concrete batching and mortar', 'Bags', 'Raw Materials', 450.00, 100.00, 9.50, 1, 1, GETDATE());

INSERT INTO inventory_items (name, description, unit, category, quantity_on_hand, reorder_level, unit_cost, supplier_id, is_active, created_at)
VALUES ('Deformed Rebar 16mm', 'Grade 60 high-yield reinforcing steel bars (12m length)', 'Tons', 'Structural Steel', 42.00, 15.00, 820.00, 2, 1, GETDATE());

-- Low stock item!
INSERT INTO inventory_items (name, description, unit, category, quantity_on_hand, reorder_level, unit_cost, supplier_id, is_active, created_at)
VALUES ('Deformed Rebar 25mm', 'Grade 60 heavy column reinforcement bars', 'Tons', 'Structural Steel', 8.00, 12.00, 850.00, 2, 1, GETDATE());

INSERT INTO inventory_items (name, description, unit, category, quantity_on_hand, reorder_level, unit_cost, supplier_id, is_active, created_at)
VALUES ('Safety Hard Hats ANSI Z89', 'Type 1 Class E industrial safety helmets with ratchet suspension', 'EA', 'PPE & Safety', 85.00, 20.00, 18.00, NULL, 1, GETDATE());

INSERT INTO inventory_items (name, description, unit, category, quantity_on_hand, reorder_level, unit_cost, supplier_id, is_active, created_at)
VALUES ('High-Visibility Safety Vests', 'ANSI/ISEA 107-2020 Class 2 reflective vests', 'EA', 'PPE & Safety', 120.00, 30.00, 12.00, NULL, 1, GETDATE());

INSERT INTO inventory_items (name, description, unit, category, quantity_on_hand, reorder_level, unit_cost, supplier_id, is_active, created_at)
VALUES ('Rigid PVC Conduit 25mm', 'Heavy-duty electrical conduit (3m lengths)', 'Bundles', 'Electrical', 180.00, 50.00, 28.00, 5, 1, GETDATE());

INSERT INTO inventory_items (name, description, unit, category, quantity_on_hand, reorder_level, unit_cost, supplier_id, is_active, created_at)
VALUES ('Heavy Duty Scaffolding Clamps', 'Drop-forged galvanized right-angle couplers', 'EA', 'Equipment', 350.00, 100.00, 6.50, NULL, 1, GETDATE());

-- Low stock item!
INSERT INTO inventory_items (name, description, unit, category, quantity_on_hand, reorder_level, unit_cost, supplier_id, is_active, created_at)
VALUES ('SBS Waterproofing Membrane', '4mm elastomeric bitumen waterproofing torch-on rolls (10m x 1m)', 'Rolls', 'Building Envelope', 14.00, 25.00, 140.00, NULL, 1, GETDATE());

-- ── 20. Seed Inventory Transactions ──────────────────────────
INSERT INTO inventory_transactions (inventory_item_id, project_id, type, quantity, transaction_date, notes, performed_by_user_id, performed_by_name, created_at)
VALUES (1, 1, 'RECEIPT', 500.00, DATEADD(DAY, -7, CAST(GETDATE() AS DATE)), 'PO-2026-104 delivery batch from Titan Cement', 6, 'Carlos Mendez', GETDATE());

INSERT INTO inventory_transactions (inventory_item_id, project_id, type, quantity, transaction_date, notes, performed_by_user_id, performed_by_name, created_at)
VALUES (1, 1, 'ISSUE', 50.00, DATEADD(DAY, -2, CAST(GETDATE() AS DATE)), 'Issued for Level 13 column patching & screed', 6, 'Carlos Mendez', GETDATE());

INSERT INTO inventory_transactions (inventory_item_id, project_id, type, quantity, transaction_date, notes, performed_by_user_id, performed_by_name, created_at)
VALUES (2, 1, 'RECEIPT', 50.00, DATEADD(DAY, -14, CAST(GETDATE() AS DATE)), 'PO-2026-102 batch delivery from BlueScope Steel', 6, 'Carlos Mendez', GETDATE());

INSERT INTO inventory_transactions (inventory_item_id, project_id, type, quantity, transaction_date, notes, performed_by_user_id, performed_by_name, created_at)
VALUES (2, 1, 'ISSUE', 8.00, DATEADD(DAY, -3, CAST(GETDATE() AS DATE)), 'Issued for Level 14 beam cage fabrication', 6, 'Carlos Mendez', GETDATE());

INSERT INTO inventory_transactions (inventory_item_id, project_id, type, quantity, transaction_date, notes, performed_by_user_id, performed_by_name, created_at)
VALUES (3, 1, 'ISSUE', 4.00, DATEADD(DAY, -1, CAST(GETDATE() AS DATE)), 'Issued for Level 14 core shear wall cage', 6, 'Carlos Mendez', GETDATE());

-- ── 21. Seed Attendance ──────────────────────────────────────
INSERT INTO attendance (user_id, work_date, clock_in, clock_out, status)
VALUES (2, CAST(GETDATE() AS DATE), CAST(CONCAT(CAST(GETDATE() AS DATE), ' 07:45:00') AS DATETIME), NULL, 'Present');

INSERT INTO attendance (user_id, work_date, clock_in, clock_out, status)
VALUES (3, CAST(GETDATE() AS DATE), CAST(CONCAT(CAST(GETDATE() AS DATE), ' 07:15:00') AS DATETIME), NULL, 'Present');

INSERT INTO attendance (user_id, work_date, clock_in, clock_out, status)
VALUES (5, CAST(GETDATE() AS DATE), CAST(CONCAT(CAST(GETDATE() AS DATE), ' 08:30:00') AS DATETIME), NULL, 'Present');

INSERT INTO attendance (user_id, work_date, clock_in, clock_out, status)
VALUES (6, CAST(GETDATE() AS DATE), CAST(CONCAT(CAST(GETDATE() AS DATE), ' 07:30:00') AS DATETIME), NULL, 'Present');

-- Attendance for Yesterday
INSERT INTO attendance (user_id, work_date, clock_in, clock_out, status)
VALUES (2, DATEADD(DAY, -1, CAST(GETDATE() AS DATE)), CAST(CONCAT(CAST(DATEADD(DAY, -1, GETDATE()) AS DATE), ' 07:50:00') AS DATETIME), CAST(CONCAT(CAST(DATEADD(DAY, -1, GETDATE()) AS DATE), ' 17:30:00') AS DATETIME), 'Present');

INSERT INTO attendance (user_id, work_date, clock_in, clock_out, status)
VALUES (3, DATEADD(DAY, -1, CAST(GETDATE() AS DATE)), CAST(CONCAT(CAST(DATEADD(DAY, -1, GETDATE()) AS DATE), ' 07:10:00') AS DATETIME), CAST(CONCAT(CAST(DATEADD(DAY, -1, GETDATE()) AS DATE), ' 18:00:00') AS DATETIME), 'Present');

INSERT INTO attendance (user_id, work_date, clock_in, clock_out, status)
VALUES (6, DATEADD(DAY, -1, CAST(GETDATE() AS DATE)), CAST(CONCAT(CAST(DATEADD(DAY, -1, GETDATE()) AS DATE), ' 07:35:00') AS DATETIME), CAST(CONCAT(CAST(DATEADD(DAY, -1, GETDATE()) AS DATE), ' 17:15:00') AS DATETIME), 'Present');

-- ── 22. Seed Documents ───────────────────────────────────────
INSERT INTO documents (project_id, file_name, file_type, file_url, uploaded_by_user_id, created_at)
VALUES (1, 'Skyline_Tower_Architectural_Drawings_RevD.pdf', 'drawing', '/documents/Skyline_Tower_Architectural_Drawings_RevD.pdf', 3, GETDATE());

INSERT INTO documents (project_id, file_name, file_type, file_url, uploaded_by_user_id, created_at)
VALUES (1, 'Structural_Foundation_Package_Calculations.pdf', 'calculation', '/documents/Structural_Foundation_Package_Calculations.pdf', 3, GETDATE());

INSERT INTO documents (project_id, file_name, file_type, file_url, uploaded_by_user_id, created_at)
VALUES (1, 'MEP_Coordination_BIM_Report_L01-L15.pdf', 'specification', '/documents/MEP_Coordination_BIM_Report_L01-L15.pdf', 7, GETDATE());

INSERT INTO documents (project_id, file_name, file_type, file_url, uploaded_by_user_id, created_at)
VALUES (1, 'Health_Safety_Environmental_Manual_2026.pdf', 'policy', '/documents/Health_Safety_Environmental_Manual_2026.pdf', 2, GETDATE());

INSERT INTO documents (project_id, file_name, file_type, file_url, uploaded_by_user_id, created_at)
VALUES (2, 'Harborview_Warehouse_Structural_Steel_Shop_Drawings.pdf', 'drawing', '/documents/Harborview_Warehouse_Structural_Steel_Shop_Drawings.pdf', 3, GETDATE());

-- ── 23. Seed Notifications ───────────────────────────────────
INSERT INTO notifications (user_id, type, message, is_read, created_at)
VALUES (2, 'log', 'Elena Rostova submitted today''s Daily Field Log for Skyline Tower & Residences.', 0, GETDATE());

INSERT INTO notifications (user_id, type, message, is_read, created_at)
VALUES (2, 'change_order', 'Change Order CO-002 ($145,000.00) is pending executive review.', 0, GETDATE());

INSERT INTO notifications (user_id, type, message, is_read, created_at)
VALUES (4, 'invoice', 'Invoice INV-2026-003 from Apex Electrical Systems ($45,000.00) is awaiting payment approval.', 0, GETDATE());

INSERT INTO notifications (user_id, type, message, is_read, created_at)
VALUES (6, 'low_stock', 'Low Stock Alert: Deformed Rebar 25mm has reached 8 Tons (Reorder level: 12 Tons).', 0, GETDATE());

INSERT INTO notifications (user_id, type, message, is_read, created_at)
VALUES (6, 'low_stock', 'Low Stock Alert: SBS Waterproofing Membrane has reached 14 Rolls (Reorder level: 25 Rolls).', 0, GETDATE());

-- ── 24. Seed Issues & Messages ───────────────────────────────
INSERT INTO issues (project_id, description, status, reported_by_user_id, created_at)
VALUES (1, 'Tower crane delivery access lane blocked during morning peak hours', 'resolved', 3, DATEADD(DAY, -4, GETDATE()));

INSERT INTO issues (project_id, description, status, reported_by_user_id, created_at)
VALUES (1, 'Temporary batch plant water pressure drop during morning mix', 'open', 3, GETDATE());

INSERT INTO messages (project_id, sender_id, receiver_id, content, is_read, sent_at)
VALUES (1, 2, 3, 'Please verify the rebar spacing on grid C-4 before the 2 PM concrete pour.', 1, DATEADD(HOUR, -4, GETDATE()));

INSERT INTO messages (project_id, sender_id, receiver_id, content, is_read, sent_at)
VALUES (1, 3, 2, 'Inspection completed at 11:30 AM, test cylinders taken. All cleared for pour.', 1, DATEADD(HOUR, -2, GETDATE()));

-- ── 25. Seed Quotations ──────────────────────────────────────
INSERT INTO quotations (material_request_id, supplier_id, price, delivery_lead_time_days, valid_until, status, created_at)
SELECT mr.id, 1, 72000.00, 3, '2026-10-31', 'accepted', GETDATE()
FROM material_requests mr WHERE mr.material_description LIKE '%Concrete Grade 40%';

INSERT INTO quotations (material_request_id, supplier_id, price, delivery_lead_time_days, valid_until, status, created_at)
SELECT mr.id, 2, 108000.00, 5, '2026-10-31', 'accepted', GETDATE()
FROM material_requests mr WHERE mr.material_description LIKE '%Rebar Grade 60%';

INSERT INTO quotations (material_request_id, supplier_id, price, delivery_lead_time_days, valid_until, status, created_at)
SELECT mr.id, 3, 94000.00, 14, '2026-11-15', 'under_review', GETDATE()
FROM material_requests mr WHERE mr.material_description LIKE '%VRF Commercial%';
