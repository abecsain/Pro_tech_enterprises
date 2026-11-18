-- Migration: 001_initial_schema.sql
-- Description: Create all 21 tables, constraints, indexes, and initial default permissions for Pro Tech Enterprises

-- Import schema
\i ../schema.sql

-- Insert default roles
INSERT INTO roles (id, name, slug, description) VALUES
    ('00000000-0000-0000-0000-000000000001', 'Super Admin', 'super_admin', 'Complete system access, permissions management, and configuration control.'),
    ('00000000-0000-0000-0000-000000000002', 'Manager', 'manager', 'Operational inventory, product management, and booking fulfillment.')
ON CONFLICT (slug) DO NOTHING;

-- Insert core permissions
INSERT INTO permissions (name, code, module, description) VALUES
    ('View Dashboard', 'dashboard.view', 'dashboard', 'Access high-level metrics and summaries'),
    ('Manage Products', 'products.manage', 'products', 'Add, edit, archive and delete products'),
    ('Manage Categories', 'categories.manage', 'categories', 'Create and modify product categories'),
    ('Manage Inventory', 'inventory.manage', 'inventory', 'Adjust inventory, record movements'),
    ('Manage Share Links', 'share_links.manage', 'share_links', 'Create and revoke recipient access portals'),
    ('Manage Recipient Pricing', 'pricing.manage', 'pricing', 'Customize buyer wholesale prices'),
    ('Manage Bookings', 'bookings.manage', 'bookings', 'Review, approve, and fulfill WhatsApp bookings'),
    ('View Reports', 'reports.view', 'reports', 'Generate and export stock & activity reports'),
    ('Manage Settings', 'settings.manage', 'settings', 'Configure company profile and WhatsApp contact')
ON CONFLICT (code) DO NOTHING;

-- Assign all permissions to Super Admin
INSERT INTO role_permissions (role_id, permission_id)
SELECT '00000000-0000-0000-0000-000000000001', id FROM permissions
ON CONFLICT DO NOTHING;

-- Assign operational permissions to Manager
INSERT INTO role_permissions (role_id, permission_id)
SELECT '00000000-0000-0000-0000-000000000002', id FROM permissions
WHERE code IN ('dashboard.view', 'products.manage', 'categories.manage', 'inventory.manage', 'bookings.manage', 'reports.view')
ON CONFLICT DO NOTHING;
