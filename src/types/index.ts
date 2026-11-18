// ========================================================================
// PRO TECH ENTERPRISES - Core Domain Models & Types
// ========================================================================

export type RoleSlug = 'super_admin' | 'manager';

export interface Role {
  id: string;
  name: string;
  slug: RoleSlug;
  description?: string;
  created_at: string;
}

export interface Permission {
  id: string;
  name: string;
  code: string;
  module: string;
  description?: string;
}

export interface AdminProfile {
  id: string;
  user_id?: string;
  email: string;
  full_name: string;
  role_id: string;
  role?: Role;
  phone?: string;
  status: 'active' | 'suspended' | 'inactive';
  last_login_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  default_markup_percent?: number;
  is_archived: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  variant_name: string; // e.g. "5W", "9W", "12W", "15W", "20W"
  sku: string;
  internal_cost?: number;
  default_selling_price: number;
  min_stock_threshold: number;
  moq: number;
  unit: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
  current_stock?: number;
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  is_primary: boolean;
  display_order: number;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  category_id: string;
  category?: Category;
  subcategory?: string;
  description?: string;
  image_url?: string;
  unit: string;
  internal_cost?: number;
  default_selling_price: number;
  min_stock_threshold: number;
  moq: number;
  status: 'active' | 'draft' | 'archived';
  is_archived: boolean;
  created_at: string;
  updated_at: string;
  variants?: ProductVariant[];
  images?: ProductImage[];
  current_stock?: number;
  reserved_stock?: number;
  available_stock?: number;
}

export type StockMovementType =
  | 'initial_stock'
  | 'production_addition'
  | 'manual_addition'
  | 'manual_reduction'
  | 'damaged_stock'
  | 'rejected_stock'
  | 'returned_stock'
  | 'booking_reservation'
  | 'booking_release'
  | 'booking_fulfilment'
  | 'stock_correction';

export interface StockMovement {
  id: string;
  product_id: string;
  product_name?: string;
  product_sku?: string;
  variant_id?: string;
  variant_name?: string;
  previous_stock: number;
  quantity_changed: number; // positive for addition, negative for reduction
  new_stock: number;
  movement_type: StockMovementType;
  admin_user_id?: string;
  admin_user_name: string;
  note?: string;
  created_at: string;
}

export interface InventoryBalance {
  id: string;
  product_id: string;
  variant_id?: string;
  current_stock: number;
  reserved_stock: number;
  available_stock: number;
  updated_at: string;
}

export interface Recipient {
  id: string;
  name: string;
  company_name?: string;
  phone?: string;
  email?: string;
  whatsapp_number?: string;
  portal_display_name?: string;
  status: 'active' | 'suspended' | 'revoked';
  notes?: string;
  created_at: string;
  updated_at: string;
  credentials?: {
    login_id: string;
    plain_preview?: string;
    last_login_at?: string;
    is_locked: boolean;
  };
  share_link?: {
    id: string;
    token: string;
    status: 'active' | 'disabled' | 'expired';
    expires_at?: string;
  };
}

export interface RecipientCredentials {
  id: string;
  recipient_id: string;
  login_id: string;
  password_hash: string;
  plain_preview?: string;
  last_login_at?: string;
  failed_login_attempts: number;
  is_locked: boolean;
  updated_at: string;
}

export interface ShareLink {
  id: string;
  recipient_id: string;
  recipient?: Recipient;
  token: string;
  expires_at?: string;
  status: 'active' | 'disabled' | 'expired';
  last_accessed_at?: string;
  notes?: string;
  category_ids?: string[];
  product_ids?: string[];
  created_at: string;
  updated_at: string;
}

export interface RecipientProductPrice {
  id: string;
  recipient_id: string;
  product_id: string;
  variant_id?: string;
  custom_selling_price: number;
  custom_moq?: number;
  is_active: boolean;
  updated_at: string;
}

export type BookingStatus =
  | 'draft'
  | 'pending'
  | 'under_review'
  | 'approved'
  | 'rejected'
  | 'cancelled'
  | 'fulfilled';

export interface BookingItem {
  id: string;
  booking_id: string;
  product_id: string;
  variant_id?: string;
  product_name: string;
  sku: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface Booking {
  id: string;
  booking_reference: string;
  recipient_id: string;
  recipient_name?: string;
  company_name?: string;
  share_link_id?: string;
  status: BookingStatus;
  total_estimated_amount: number;
  admin_remarks?: string;
  whatsapp_message_payload?: string;
  items?: BookingItem[];
  created_at: string;
  updated_at: string;
}

export interface StockReservation {
  id: string;
  booking_id: string;
  product_id: string;
  variant_id?: string;
  reserved_quantity: number;
  status: 'reserved' | 'released' | 'fulfilled';
  created_at: string;
  released_at?: string;
}

export interface ActivityLog {
  id: string;
  user_id?: string;
  user_name: string;
  user_role: string;
  action: string;
  module: string;
  details?: Record<string, any>;
  ip_address?: string;
  created_at: string;
}

export interface ApplicationSettings {
  company_name: string;
  company_logo?: string;
  company_tagline: string;
  company_description: string;
  company_whatsapp: string;
  company_email: string;
  company_phone: string;
  company_address: string;
  website_url?: string;
  default_unit: string;
  default_min_stock: number;
  allow_negative_stock: boolean;
  default_link_expiry_days: number;
  session_duration_hours: number;
  low_stock_notification: boolean;
  new_booking_notification: boolean;
}

// ========================================================================
// BUYER / RECIPIENT SANITIZED VIEW (CRITICAL: ZERO STOCK LEAKAGE)
// ========================================================================
export interface BuyerProduct {
  id: string;
  name: string;
  sku?: string;
  category_id: string;
  category_name?: string;
  description?: string;
  image_url?: string;
  unit: string;
  selling_price: number;
  moq: number;
  is_available: boolean; // boolean ONLY - never discloses remaining stock number
  variants?: {
    id: string;
    variant_name: string;
    sku?: string;
    selling_price: number;
    moq: number;
    unit: string;
    is_available: boolean;
  }[];
}

export interface CartItem {
  productId: string;
  variantId?: string;
  name: string;
  variantName?: string;
  sku?: string;
  unit: string;
  price: number;
  quantity: number;
  moq: number;
}
