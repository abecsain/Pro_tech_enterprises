# PRO TECH ENTERPRISES
## Inventory Management & Private Wholesale Product Sharing System

A lightweight, secure, and responsive web application designed for **Pro Tech Enterprises**, an electronics manufacturing and assembly plant producing commercial and domestic LED bulbs, downlights, constant current drivers, electrical components, and lighting fixtures.

---

## 🏛️ System Architecture & Access Roles

The platform enforces three strictly separated interfaces:

1. **Public Front View (`/`)**
   - Clean, corporate industrial branding showcasing manufacturing infrastructure, automated SMT lines, burn-in chambers, and plant contact information.
   - **Zero Leaks**: Strictly omits product catalogs, pricing, inventory numbers, and admin panel links.
   - General **"Contact on WhatsApp"** button for business inquiries.

2. **Secret Admin Portal (`/admin/login` & `/pte-admin`)**
   - Protected by email/password authentication with Role-Based Access Control (**Super Admin** and **Manager**).
   - Real-time KPI Dashboard (Products, Warehouse Units, Low Stock Alerts, Active Links, Pending WhatsApp Orders).
   - Category Management (LED Bulbs, Drivers, Housings, PCB Arrays, Downlights).
   - Product Management with Variants (5W, 9W, 12W, 15W, 20W), Low Stock Alert Thresholds, and Unit/Box specifications.
   - Fast inline `+` / `-` quick stock adjustments and modal audit entries logging all 11 movement classifications.
   - Private Share Link Generator provisioning unique buyer tokens (`/catalog/[unique-token]`) with custom wholesale pricing, category access restrictions, and discrete login credentials.
   - WhatsApp Bulk Bookings Management (Approve & Reserve Stock, Reject/Release, Dispatch & Deduct Stock).
   - Full 9-module Reporting Engine with CSV, Excel (.xlsx), and PDF exports.
   - Application Settings (Official WhatsApp Business number, plant profile, inventory rules).

3. **Private Recipient Product Catalogue (`/catalog/[token]` or `/catalogue/[token]`)**
   - Cryptographically tokenized distributor portal checking active status and expiration.
   - Requires recipient **Login ID** and **Password** created for that specific link.
   - Displays authorized products and assigned wholesale selling prices.
   - **CRITICAL ZERO-LEAKAGE PRIVACY RULE**:
     - Database queries sanitize objects server-side.
     - Displays only a green **"Available"** badge if stock > 0, or **"Out of Stock"** if stock &le; 0.
     - **NEVER** discloses exact warehouse stock numbers or internal costs anywhere in frontend UI or network API payloads.
   - **WhatsApp Bulk Booking Cart**:
     - Calculates order lines and estimated totals based on assigned wholesale prices and MOQ.
     - Submits booking request to the backend and opens official WhatsApp (`https://wa.me/<NUMBER>?text=...`) with a neatly pre-filled booking draft.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom industrial Slate/Navy/Emerald palette
- **Icons**: Lucide React
- **Export Engines**: jsPDF + jspdf-autotable (PDF), SheetJS xlsx (Excel), Native CSV stream
- **Security & Auth**: bcryptjs, JSON Web Tokens (JWT), HTTP-only Secure Cookies, Server-Side Route Sanitization
- **Database & Storage**:
  - Production: Supabase PostgreSQL (Full SQL Schema & Migrations in `supabase/schema.sql`)
  - Standalone / Local: Zero-configuration persistent file engine (`data/pte_database.json`)

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+ or v20+)
- npm or pnpm

### 2. Installation
```bash
git clone https://github.com/your-org/pro-tech-enterprises.git
cd pro-tech-enterprises
npm install
```

### 3. Environment Variables
Copy the example environment file:
```bash
cp .env.example .env.local
```

Configure your parameters:
```env
NEXT_PUBLIC_APP_URL="http://localhost:3000"
JWT_SECRET="your-secure-jwt-secret"
NEXT_PUBLIC_DEFAULT_WHATSAPP="919876543210"

# Optional: Supabase PostgreSQL (For Cloud Database)
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🔑 Default Factory Accounts & Testing Credentials

### 1. Admin Portal (`/admin/login` or `/pte-admin`)
- **Super Admin**:
  - Email: `admin@protechenterprises.com`
  - Password: `admin123`
- **Production Manager**:
  - Email: `manager@protechenterprises.com`
  - Password: `manager123`

### 2. Demo Wholesaler Access Link (`/catalog/pte-metro-auth-8f2c9`)
- **Distributor**: Metro Electrical Wholesale Corp
- **Login ID**: `metro_wholesale`
- **Password**: `buyer123`

---

## 📦 Database Schema & Supabase Setup

All 21 normalized PostgreSQL tables, indexes, constraints, and Row Level Security (RLS) policies are provided in:
- `supabase/schema.sql` (Full DDL)
- `supabase/migrations/001_initial_schema.sql` (Initial Roles, Permissions & Seeds)

### Core Tables:
1. `profiles` - Admin users & roles
2. `roles` & `permissions` - RBAC access control
3. `categories` - Product classifications & markups
4. `products` - Specifications, default prices, SKU, thresholds
5. `product_variants` - Wattage / model variants (5W, 9W, 12W, etc.)
6. `inventory_balances` - Real-time stock, reserved stock, available stock
7. `stock_movements` - Full audit trail of every stock change
8. `recipients` - Wholesaler accounts & contact info
9. `recipient_credentials` - Hashed credentials and lockout controls
10. `share_links` - Cryptographic access tokens & expiry
11. `recipient_product_prices` - Custom distributor price overrides
12. `bookings` & `booking_items` - WhatsApp bulk orders
13. `stock_reservations` - Order reserve tracking
14. `activity_logs` - Administrative audit logs
15. `application_settings` - Global company profile & WhatsApp number

---

## 🔒 Security Best Practices Implemented

- **Server-Side Sanitation**: Buyer endpoints query the database and sanitize objects on the server before transmitting JSON. Warehouse quantity balances and internal costs are stripped.
- **Atomic Stock Reservations**: Approving a booking reserves physical units in `inventory_balances.reserved_stock` preventing over-allocation.
- **Fulfillment Deduction**: Marking a booking as fulfilled permanently deducts stock from inventory and logs a `booking_fulfilment` movement exactly once.
- **Account Lockout**: 5 failed distributor login attempts lock the credential record.
- **Immutable Movement Audit**: Stock cannot be altered without creating an accompanying `stock_movements` record.

---

## 📄 License
Commercial License &copy; Pro Tech Enterprises. All Rights Reserved.
