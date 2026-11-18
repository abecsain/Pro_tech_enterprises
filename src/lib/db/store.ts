import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import {
  AdminProfile,
  ApplicationSettings,
  Booking,
  BookingItem,
  BookingStatus,
  BuyerProduct,
  Category,
  InventoryBalance,
  Product,
  ProductVariant,
  Recipient,
  RecipientCredentials,
  RecipientProductPrice,
  ShareLink,
  StockMovement,
  StockMovementType,
  StockReservation,
  ActivityLog,
} from "@/types";

interface PTEDataStore {
  profiles: AdminProfile[];
  categories: Category[];
  products: Product[];
  variants: ProductVariant[];
  inventory: InventoryBalance[];
  movements: StockMovement[];
  recipients: Recipient[];
  credentials: RecipientCredentials[];
  shareLinks: ShareLink[];
  recipientPrices: RecipientProductPrice[];
  bookings: Booking[];
  reservations: StockReservation[];
  activityLogs: ActivityLog[];
  settings: ApplicationSettings;
}

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "pte_database.json");

// Ensure data folder exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// In-memory cache + persistent file synchronization
let memoryStore: PTEDataStore | null = null;

function getInitialSettings(): ApplicationSettings {
  return {
    company_name: "Pro Tech Enterprises",
    company_tagline: "Electronics & LED Lighting Assembly",
    company_description:
      "Premier OEM/ODM manufacturer and assembler of commercial & domestic LED lighting, electronic drivers, and precision electrical assemblies.",
    company_whatsapp: "919876543210",
    company_email: "contact@protechenterprises.com",
    company_phone: "+91 11 2345 6789",
    company_address: "Plot 42, Electronics Manufacturing Cluster, Sector 58, Faridabad, Haryana, India - 121004",
    website_url: "https://protechenterprises.com",
    default_unit: "Pcs",
    default_min_stock: 50,
    allow_negative_stock: false,
    default_link_expiry_days: 30,
    session_duration_hours: 24,
    low_stock_notification: true,
    new_booking_notification: true,
  };
}

function seedDatabase(): PTEDataStore {
  const salt = bcrypt.genSaltSync(10);
  const adminPasswordHash = bcrypt.hashSync("admin123", salt);
  const managerPasswordHash = bcrypt.hashSync("manager123", salt);
  const buyerPasswordHash = bcrypt.hashSync("buyer123", salt);

  const categories: Category[] = [
    {
      id: "cat_led_bulbs",
      name: "LED Bulbs & Lamps",
      slug: "led-bulbs-and-lamps",
      description: "High-efficacy, surge-protected LED lamps for residential and retail applications.",
      image_url: "https://images.unsplash.com/photo-1550524514-9b60459521ef?w=400&auto=format&fit=crop&q=80",
      default_markup_percent: 15,
      is_archived: false,
      sort_order: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "cat_led_panels",
      name: "LED Panels & Downlights",
      slug: "led-panels-and-downlights",
      description: "Slimline edge-lit & backlit ceiling panels engineered for commercial offices and showrooms.",
      image_url: "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=400&auto=format&fit=crop&q=80",
      default_markup_percent: 20,
      is_archived: false,
      sort_order: 2,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "cat_drivers",
      name: "LED Drivers & Power Supplies",
      slug: "led-drivers-and-power-supplies",
      description: "Isolated constant-current and constant-voltage drivers with 4kV surge protection.",
      image_url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&auto=format&fit=crop&q=80",
      default_markup_percent: 25,
      is_archived: false,
      sort_order: 3,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "cat_electrical",
      name: "Electrical Components & PCBAs",
      slug: "electrical-components-and-pcbas",
      description: "SMD MCPCB arrays, capacitors, bridge rectifiers, and custom PCB assemblies.",
      image_url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400&auto=format&fit=crop&q=80",
      default_markup_percent: 18,
      is_archived: false,
      sort_order: 4,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "cat_housings",
      name: "Housings & Raw Materials",
      slug: "housings-and-raw-materials",
      description: "Die-cast aluminium fixtures, thermal conductive plastic housings, and polycarbonate diffusers.",
      image_url: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=400&auto=format&fit=crop&q=80",
      default_markup_percent: 15,
      is_archived: false,
      sort_order: 5,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  const products: Product[] = [
    {
      id: "prod_001",
      name: "Pro Eco LED Bulb - High Lumen (B22/E27)",
      sku: "PTE-BLB-ECO-01",
      category_id: "cat_led_bulbs",
      subcategory: "Domestic Bulbs",
      description:
        "High lumen efficiency (>105 lm/W) domestic LED bulb featuring high surge endurance up to 3.5kV. Designed for extreme voltage fluctuation tolerance.",
      image_url: "https://images.unsplash.com/photo-1550524514-9b60459521ef?w=600&auto=format&fit=crop&q=80",
      unit: "Box (50 Pcs)",
      internal_cost: 32.0,
      default_selling_price: 46.0,
      min_stock_threshold: 150,
      moq: 10,
      status: "active",
      is_archived: false,
      created_at: new Date(Date.now() - 3600000 * 24 * 10).toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "prod_002",
      name: "Pro Lumen Slim Square LED Panel (15W)",
      sku: "PTE-PNL-SQ15",
      category_id: "cat_led_panels",
      subcategory: "Recessed Downlights",
      description:
        "Ultra-slim 12mm recessed ceiling panel with optical grade PMMA light guide plate for uniform glare-free luminescence (6500K Cool Daylight).",
      image_url: "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=600&auto=format&fit=crop&q=80",
      unit: "Box (20 Pcs)",
      internal_cost: 135.0,
      default_selling_price: 195.0,
      min_stock_threshold: 60,
      moq: 5,
      status: "active",
      is_archived: false,
      created_at: new Date(Date.now() - 3600000 * 24 * 9).toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "prod_003",
      name: "Industrial Constant Current LED Driver 40W (Isolated)",
      sku: "PTE-DRV-CC40W",
      category_id: "cat_drivers",
      subcategory: "Commercial Drivers",
      description:
        "Heavy-duty isolated LED driver with active Power Factor Correction (PF > 0.98), THD < 10%, 4.5kV surge immunity and potted thermal epoxy encapsulation.",
      image_url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80",
      unit: "Box (40 Pcs)",
      internal_cost: 88.0,
      default_selling_price: 132.0,
      min_stock_threshold: 100,
      moq: 10,
      status: "active",
      is_archived: false,
      created_at: new Date(Date.now() - 3600000 * 24 * 8).toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "prod_004",
      name: "Aluminium Die-Cast Street Light Housing 60W",
      sku: "PTE-HSG-SL60",
      category_id: "cat_housings",
      subcategory: "Outdoor Fixtures",
      description:
        "IP66 rated aerodynamic die-cast ADC12 aluminium fixture housing with toughened glass cover and anti-corrosion electrostatic powder coat.",
      image_url: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=600&auto=format&fit=crop&q=80",
      unit: "Carton (10 Pcs)",
      internal_cost: 320.0,
      default_selling_price: 460.0,
      min_stock_threshold: 30,
      moq: 2,
      status: "active",
      is_archived: false,
      created_at: new Date(Date.now() - 3600000 * 24 * 7).toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "prod_005",
      name: "High Power MCPCB LED Module 9W (130 lm/W)",
      sku: "PTE-PCB-MCP9W",
      category_id: "cat_electrical",
      subcategory: "PCB Arrays",
      description:
        "High thermal conductivity aluminium substrate fitted with premium Seoul/Edison 2835 SMD chips. CRI > 82 for crisp natural illumination.",
      image_url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80",
      unit: "Pack (500 Pcs)",
      internal_cost: 11.5,
      default_selling_price: 17.5,
      min_stock_threshold: 200,
      moq: 1,
      status: "active",
      is_archived: false,
      created_at: new Date(Date.now() - 3600000 * 24 * 6).toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "prod_006",
      name: "Pro Commercial Downlight Fixture 18W (Round)",
      sku: "PTE-DWN-RD18",
      category_id: "cat_led_panels",
      subcategory: "Downlights",
      description:
        "Spring-loaded ceiling architectural downlight with deep reflector recess minimizing UGR glare for high-end retail and corporate spaces.",
      image_url: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&auto=format&fit=crop&q=80",
      unit: "Box (24 Pcs)",
      internal_cost: 165.0,
      default_selling_price: 245.0,
      min_stock_threshold: 40,
      moq: 5,
      status: "active",
      is_archived: false,
      created_at: new Date(Date.now() - 3600000 * 24 * 5).toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  const variants: ProductVariant[] = [
    {
      id: "var_001_5w",
      product_id: "prod_001",
      variant_name: "5 Watt",
      sku: "PTE-BLB-ECO-05W",
      internal_cost: 26.0,
      default_selling_price: 38.0,
      min_stock_threshold: 100,
      moq: 10,
      unit: "Box (50 Pcs)",
      status: "active",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "var_001_9w",
      product_id: "prod_001",
      variant_name: "9 Watt",
      sku: "PTE-BLB-ECO-09W",
      internal_cost: 32.0,
      default_selling_price: 46.0,
      min_stock_threshold: 150,
      moq: 10,
      unit: "Box (50 Pcs)",
      status: "active",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "var_001_12w",
      product_id: "prod_001",
      variant_name: "12 Watt",
      sku: "PTE-BLB-ECO-12W",
      internal_cost: 41.0,
      default_selling_price: 58.0,
      min_stock_threshold: 120,
      moq: 10,
      unit: "Box (50 Pcs)",
      status: "active",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "var_001_15w",
      product_id: "prod_001",
      variant_name: "15 Watt",
      sku: "PTE-BLB-ECO-15W",
      internal_cost: 52.0,
      default_selling_price: 74.0,
      min_stock_threshold: 80,
      moq: 10,
      unit: "Box (50 Pcs)",
      status: "active",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  const inventory: InventoryBalance[] = [
    {
      id: "inv_prod_001",
      product_id: "prod_001",
      current_stock: 450,
      reserved_stock: 0,
      available_stock: 450,
      updated_at: new Date().toISOString(),
    },
    {
      id: "inv_prod_002",
      product_id: "prod_002",
      current_stock: 35, // Low stock: min threshold is 60
      reserved_stock: 0,
      available_stock: 35,
      updated_at: new Date().toISOString(),
    },
    {
      id: "inv_prod_003",
      product_id: "prod_003",
      current_stock: 220,
      reserved_stock: 20,
      available_stock: 200,
      updated_at: new Date().toISOString(),
    },
    {
      id: "inv_prod_004",
      product_id: "prod_004",
      current_stock: 65,
      reserved_stock: 0,
      available_stock: 65,
      updated_at: new Date().toISOString(),
    },
    {
      id: "inv_prod_005",
      product_id: "prod_005",
      current_stock: 1200,
      reserved_stock: 100,
      available_stock: 1100,
      updated_at: new Date().toISOString(),
    },
    {
      id: "inv_prod_006",
      product_id: "prod_006",
      current_stock: 0, // Out of stock
      reserved_stock: 0,
      available_stock: 0,
      updated_at: new Date().toISOString(),
    },
  ];

  const movements: StockMovement[] = [
    {
      id: "mov_001",
      product_id: "prod_001",
      product_name: "Pro Eco LED Bulb - High Lumen (B22/E27)",
      product_sku: "PTE-BLB-ECO-01",
      previous_stock: 0,
      quantity_changed: 450,
      new_stock: 450,
      movement_type: "production_addition",
      admin_user_name: "Super Admin",
      note: "Batch #2026-B11 assembly line output received",
      created_at: new Date(Date.now() - 3600000 * 24 * 3).toISOString(),
    },
    {
      id: "mov_002",
      product_id: "prod_002",
      product_name: "Pro Lumen Slim Square LED Panel (15W)",
      product_sku: "PTE-PNL-SQ15",
      previous_stock: 85,
      quantity_changed: -50,
      new_stock: 35,
      movement_type: "manual_reduction",
      admin_user_name: "Production Manager",
      note: "Dispatched order #PO-8812 to Delhi Distributor Hub",
      created_at: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
    },
    {
      id: "mov_003",
      product_id: "prod_003",
      product_name: "Industrial Constant Current LED Driver 40W (Isolated)",
      product_sku: "PTE-DRV-CC40W",
      previous_stock: 120,
      quantity_changed: 100,
      new_stock: 220,
      movement_type: "production_addition",
      admin_user_name: "Super Admin",
      note: "Wave soldering & potting station completion",
      created_at: new Date(Date.now() - 3600000 * 24 * 1).toISOString(),
    },
    {
      id: "mov_004",
      product_id: "prod_006",
      product_name: "Pro Commercial Downlight Fixture 18W (Round)",
      product_sku: "PTE-DWN-RD18",
      previous_stock: 40,
      quantity_changed: -40,
      new_stock: 0,
      movement_type: "booking_fulfilment",
      admin_user_name: "Super Admin",
      note: "Fulfilled institutional order for Commercial Plaza project",
      created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
    },
  ];

  const recipients: Recipient[] = [
    {
      id: "rec_metro",
      name: "Metro Electrical Distributors",
      company_name: "Metro Wholesale Electricals Pvt Ltd",
      phone: "+91 98110 99881",
      email: "orders@metrowholesale.in",
      whatsapp_number: "919811099881",
      portal_display_name: "Metro Electricals Private Wholesale Portal",
      status: "active",
      notes: "Tier-1 Wholesaler covering North India Region. Bulk payment terms net 15.",
      created_at: new Date(Date.now() - 3600000 * 24 * 15).toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "rec_bright",
      name: "Bright Lightings Corp",
      company_name: "Bright Lightings & Components",
      phone: "+91 97223 44556",
      email: "procurement@brightlightings.com",
      whatsapp_number: "919722344556",
      portal_display_name: "Bright Lightings B2B Catalog",
      status: "active",
      notes: "OEM Lighting Assembler sourcing our LED Drivers and Housings.",
      created_at: new Date(Date.now() - 3600000 * 24 * 12).toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  const credentials: RecipientCredentials[] = [
    {
      id: "cred_metro",
      recipient_id: "rec_metro",
      login_id: "metro_wholesale",
      password_hash: buyerPasswordHash,
      plain_preview: "buyer123",
      last_login_at: new Date(Date.now() - 3600000 * 4).toISOString(),
      failed_login_attempts: 0,
      is_locked: false,
      updated_at: new Date().toISOString(),
    },
    {
      id: "cred_bright",
      recipient_id: "rec_bright",
      login_id: "bright_corp",
      password_hash: buyerPasswordHash,
      plain_preview: "buyer123",
      last_login_at: new Date(Date.now() - 3600000 * 30).toISOString(),
      failed_login_attempts: 0,
      is_locked: false,
      updated_at: new Date().toISOString(),
    },
  ];

  const shareLinks: ShareLink[] = [
    {
      id: "link_metro",
      recipient_id: "rec_metro",
      token: "pte-metro-auth-8f2c9",
      expires_at: new Date(Date.now() + 3600000 * 24 * 45).toISOString(),
      status: "active",
      last_accessed_at: new Date(Date.now() - 3600000 * 4).toISOString(),
      notes: "Exclusive wholesale link for Metro Electrical Distributors",
      category_ids: ["cat_led_bulbs", "cat_led_panels", "cat_drivers", "cat_electrical"],
      product_ids: ["prod_001", "prod_002", "prod_003", "prod_004", "prod_005", "prod_006"],
      created_at: new Date(Date.now() - 3600000 * 24 * 15).toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "link_bright",
      recipient_id: "rec_bright",
      token: "pte-bright-token-3a7d1",
      expires_at: new Date(Date.now() + 3600000 * 24 * 30).toISOString(),
      status: "active",
      last_accessed_at: new Date(Date.now() - 3600000 * 30).toISOString(),
      notes: "Special pricing for Drivers and Housings only",
      category_ids: ["cat_drivers", "cat_housings", "cat_electrical"],
      product_ids: ["prod_003", "prod_004", "prod_005"],
      created_at: new Date(Date.now() - 3600000 * 24 * 12).toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  const recipientPrices: RecipientProductPrice[] = [
    {
      id: "rpp_001",
      recipient_id: "rec_metro",
      product_id: "prod_001",
      custom_selling_price: 43.5, // Discounted from 46.0
      custom_moq: 15,
      is_active: true,
      updated_at: new Date().toISOString(),
    },
    {
      id: "rpp_002",
      recipient_id: "rec_metro",
      product_id: "prod_003",
      custom_selling_price: 125.0, // Discounted from 132.0
      custom_moq: 20,
      is_active: true,
      updated_at: new Date().toISOString(),
    },
  ];

  const bookings: Booking[] = [
    {
      id: "bkg_001",
      booking_reference: "PTE-BKG-202611-001",
      recipient_id: "rec_metro",
      recipient_name: "Metro Electrical Distributors",
      company_name: "Metro Wholesale Electricals Pvt Ltd",
      share_link_id: "link_metro",
      status: "approved",
      total_estimated_amount: 87500.0,
      admin_remarks: "Stock reserved. Expected dispatch in 48 hours via Delhi Cargo.",
      whatsapp_message_payload:
        "Hello Pro Tech Enterprises,\nI would like to request the following bulk products:\n1. Product: Pro Eco LED Bulb (9W)\n   Quantity: 1000 Pcs\n   Price: ₹43.50/Pcs\n   Total: ₹43,500\n\nEstimated Total: ₹87,500\nRecipient ID: metro_wholesale\nBooking Reference: PTE-BKG-202611-001",
      items: [
        {
          id: "item_001",
          booking_id: "bkg_001",
          product_id: "prod_001",
          product_name: "Pro Eco LED Bulb - High Lumen (B22/E27)",
          sku: "PTE-BLB-ECO-01",
          quantity: 20,
          unit_price: 2175.0, // 50 pcs * 43.50
          total_price: 43500.0,
        },
        {
          id: "item_002",
          booking_id: "bkg_001",
          product_id: "prod_003",
          product_name: "Industrial Constant Current LED Driver 40W (Isolated)",
          sku: "PTE-DRV-CC40W",
          quantity: 20,
          unit_price: 2200.0,
          total_price: 44000.0,
        },
      ],
      created_at: new Date(Date.now() - 3600000 * 18).toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  const reservations: StockReservation[] = [
    {
      id: "res_001",
      booking_id: "bkg_001",
      product_id: "prod_003",
      reserved_quantity: 20,
      status: "reserved",
      created_at: new Date(Date.now() - 3600000 * 18).toISOString(),
    },
  ];

  const activityLogs: ActivityLog[] = [
    {
      id: "act_001",
      user_name: "Super Admin",
      user_role: "super_admin",
      action: "Created Private Share Link",
      module: "share_links",
      details: { recipient: "Metro Electrical Distributors", token: "pte-metro-auth-8f2c9" },
      created_at: new Date(Date.now() - 3600000 * 24 * 15).toISOString(),
    },
    {
      id: "act_002",
      user_name: "Super Admin",
      user_role: "super_admin",
      action: "Stock Production Addition",
      module: "inventory",
      details: { product: "PTE-BLB-ECO-01", quantity: 450 },
      created_at: new Date(Date.now() - 3600000 * 24 * 3).toISOString(),
    },
    {
      id: "act_003",
      user_name: "Super Admin",
      user_role: "super_admin",
      action: "Approved WhatsApp Booking",
      module: "bookings",
      details: { reference: "PTE-BKG-202611-001", total: 87500 },
      created_at: new Date(Date.now() - 3600000 * 18).toISOString(),
    },
  ];

  const profiles: AdminProfile[] = [
    {
      id: "admin_super",
      email: "admin@protechenterprises.com",
      full_name: "Super Admin (Pro Tech)",
      role_id: "role_super_admin",
      role: {
        id: "role_super_admin",
        name: "Super Admin",
        slug: "super_admin",
        description: "Full access to all modules, inventory, pricing, and system configuration",
        created_at: new Date().toISOString(),
      },
      phone: "+91 98765 43210",
      status: "active",
      last_login_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "admin_manager",
      email: "manager@protechenterprises.com",
      full_name: "Production Manager",
      role_id: "role_manager",
      role: {
        id: "role_manager",
        name: "Manager",
        slug: "manager",
        description: "Factory floor stock entry, product updates, and booking review",
        created_at: new Date().toISOString(),
      },
      phone: "+91 98765 43211",
      status: "active",
      last_login_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  return {
    profiles,
    categories,
    products,
    variants,
    inventory,
    movements,
    recipients,
    credentials,
    shareLinks,
    recipientPrices,
    bookings,
    reservations,
    activityLogs,
    settings: getInitialSettings(),
  };
}

function loadStore(): PTEDataStore {
  if (memoryStore) {
    return memoryStore;
  }

  if (fs.existsSync(DATA_FILE)) {
    try {
      const content = fs.readFileSync(DATA_FILE, "utf-8");
      memoryStore = JSON.parse(content);
      return memoryStore!;
    } catch (e) {
      console.error("Failed to parse persistent data file, re-seeding:", e);
    }
  }

  // Initial Seed
  memoryStore = seedDatabase();
  saveStore();
  return memoryStore;
}

function saveStore() {
  if (!memoryStore) return;
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(memoryStore, null, 2), "utf-8");
  } catch (e) {
    console.error("Failed to write persistent data file:", e);
  }
}

// ========================================================================
// PUBLIC DATA ACCESS METHODS
// ========================================================================

export const db = {
  // Activity Logging
  logActivity(userName: string, userRole: string, action: string, module: string, details?: any) {
    const store = loadStore();
    const log: ActivityLog = {
      id: "act_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
      user_name: userName,
      user_role: userRole,
      action,
      module,
      details,
      created_at: new Date().toISOString(),
    };
    store.activityLogs.unshift(log);
    saveStore();
    return log;
  },

  getActivityLogs(limit = 100): ActivityLog[] {
    const store = loadStore();
    return store.activityLogs.slice(0, limit);
  },

  // Settings
  getSettings(): ApplicationSettings {
    const store = loadStore();
    return store.settings;
  },

  updateSettings(settings: Partial<ApplicationSettings>, adminName = "Super Admin"): ApplicationSettings {
    const store = loadStore();
    store.settings = { ...store.settings, ...settings };
    this.logActivity(adminName, "super_admin", "Updated Application Settings", "settings", settings);
    saveStore();
    return store.settings;
  },

  // Categories
  getCategories(includeArchived = false): Category[] {
    const store = loadStore();
    return store.categories
      .filter((c) => includeArchived || !c.is_archived)
      .sort((a, b) => a.sort_order - b.sort_order);
  },

  getCategoryById(id: string): Category | undefined {
    const store = loadStore();
    return store.categories.find((c) => c.id === id);
  },

  createCategory(data: Omit<Category, "id" | "created_at" | "updated_at">, adminName = "Admin"): Category {
    const store = loadStore();
    const cat: Category = {
      ...data,
      id: "cat_" + Date.now(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    store.categories.push(cat);
    this.logActivity(adminName, "admin", `Created Category: ${cat.name}`, "categories", { id: cat.id });
    saveStore();
    return cat;
  },

  updateCategory(id: string, data: Partial<Category>, adminName = "Admin"): Category | null {
    const store = loadStore();
    const idx = store.categories.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    store.categories[idx] = {
      ...store.categories[idx],
      ...data,
      updated_at: new Date().toISOString(),
    };
    this.logActivity(adminName, "admin", `Updated Category: ${store.categories[idx].name}`, "categories", { id });
    saveStore();
    return store.categories[idx];
  },

  deleteCategory(id: string, adminName = "Admin"): { success: boolean; error?: string } {
    const store = loadStore();
    // Safety check: prevent deleting category with active products
    const hasProducts = store.products.some((p) => p.category_id === id && !p.is_archived);
    if (hasProducts) {
      return { success: false, error: "Cannot delete category containing active products. Reassign products first." };
    }
    const cat = store.categories.find((c) => c.id === id);
    store.categories = store.categories.filter((c) => c.id !== id);
    this.logActivity(adminName, "admin", `Deleted Category: ${cat?.name || id}`, "categories", { id });
    saveStore();
    return { success: true };
  },

  // Products
  getProducts(includeArchived = false): Product[] {
    const store = loadStore();
    return store.products
      .filter((p) => includeArchived || !p.is_archived)
      .map((p) => {
        const cat = store.categories.find((c) => c.id === p.category_id);
        const inv = store.inventory.find((i) => i.product_id === p.id);
        const prodVariants = store.variants.filter((v) => v.product_id === p.id);
        return {
          ...p,
          category: cat,
          current_stock: inv ? inv.current_stock : 0,
          reserved_stock: inv ? inv.reserved_stock : 0,
          available_stock: inv ? inv.available_stock : 0,
          variants: prodVariants,
        };
      });
  },

  getProductById(id: string): Product | null {
    const store = loadStore();
    const p = store.products.find((prod) => prod.id === id);
    if (!p) return null;
    const cat = store.categories.find((c) => c.id === p.category_id);
    const inv = store.inventory.find((i) => i.product_id === p.id);
    const prodVariants = store.variants.filter((v) => v.product_id === p.id);
    return {
      ...p,
      category: cat,
      current_stock: inv ? inv.current_stock : 0,
      reserved_stock: inv ? inv.reserved_stock : 0,
      available_stock: inv ? inv.available_stock : 0,
      variants: prodVariants,
    };
  },

  createProduct(
    data: Omit<Product, "id" | "created_at" | "updated_at"> & { initial_stock?: number; variants?: any[] },
    adminName = "Admin"
  ): Product {
    const store = loadStore();
    const id = "prod_" + Date.now();
    const initialStock = data.initial_stock || 0;

    const newProd: Product = {
      id,
      name: data.name,
      sku: data.sku,
      category_id: data.category_id,
      subcategory: data.subcategory,
      description: data.description,
      image_url: data.image_url,
      unit: data.unit || "Pcs",
      internal_cost: Number(data.internal_cost) || 0,
      default_selling_price: Number(data.default_selling_price) || 0,
      min_stock_threshold: Number(data.min_stock_threshold) || 10,
      moq: Number(data.moq) || 1,
      status: data.status || "active",
      is_archived: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    store.products.unshift(newProd);

    // Initial Inventory Balance
    const inv: InventoryBalance = {
      id: "inv_" + id,
      product_id: id,
      current_stock: initialStock,
      reserved_stock: 0,
      available_stock: initialStock,
      updated_at: new Date().toISOString(),
    };
    store.inventory.push(inv);

    // Initial Stock Movement Record if stock > 0
    if (initialStock > 0) {
      store.movements.unshift({
        id: "mov_" + Date.now(),
        product_id: id,
        product_name: newProd.name,
        product_sku: newProd.sku,
        previous_stock: 0,
        quantity_changed: initialStock,
        new_stock: initialStock,
        movement_type: "initial_stock",
        admin_user_name: adminName,
        note: "Initial stock entered on product creation",
        created_at: new Date().toISOString(),
      });
    }

    // Save Variants if provided
    if (data.variants && Array.isArray(data.variants)) {
      for (const v of data.variants) {
        if (!v.variant_name || !v.sku) continue;
        store.variants.push({
          id: "var_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
          product_id: id,
          variant_name: v.variant_name,
          sku: v.sku,
          internal_cost: Number(v.internal_cost) || 0,
          default_selling_price: Number(v.default_selling_price) || newProd.default_selling_price,
          min_stock_threshold: Number(v.min_stock_threshold) || newProd.min_stock_threshold,
          moq: Number(v.moq) || newProd.moq,
          unit: v.unit || newProd.unit,
          status: "active",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      }
    }

    this.logActivity(adminName, "admin", `Created Product: ${newProd.name} (${newProd.sku})`, "products", {
      id,
      initialStock,
    });
    saveStore();
    return this.getProductById(id)!;
  },

  updateProduct(id: string, data: Partial<Product> & { variants?: any[] }, adminName = "Admin"): Product | null {
    const store = loadStore();
    const idx = store.products.findIndex((p) => p.id === id);
    if (idx === -1) return null;

    store.products[idx] = {
      ...store.products[idx],
      ...data,
      internal_cost: data.internal_cost !== undefined ? Number(data.internal_cost) : store.products[idx].internal_cost,
      default_selling_price:
        data.default_selling_price !== undefined
          ? Number(data.default_selling_price)
          : store.products[idx].default_selling_price,
      min_stock_threshold:
        data.min_stock_threshold !== undefined
          ? Number(data.min_stock_threshold)
          : store.products[idx].min_stock_threshold,
      moq: data.moq !== undefined ? Number(data.moq) : store.products[idx].moq,
      updated_at: new Date().toISOString(),
    };

    // Replace or update variants if supplied
    if (data.variants && Array.isArray(data.variants)) {
      store.variants = store.variants.filter((v) => v.product_id !== id);
      for (const v of data.variants) {
        store.variants.push({
          id: v.id || "var_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
          product_id: id,
          variant_name: v.variant_name,
          sku: v.sku,
          internal_cost: Number(v.internal_cost) || 0,
          default_selling_price: Number(v.default_selling_price) || store.products[idx].default_selling_price,
          min_stock_threshold: Number(v.min_stock_threshold) || store.products[idx].min_stock_threshold,
          moq: Number(v.moq) || store.products[idx].moq,
          unit: v.unit || store.products[idx].unit,
          status: v.status || "active",
          created_at: v.created_at || new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      }
    }

    this.logActivity(adminName, "admin", `Updated Product: ${store.products[idx].name}`, "products", { id });
    saveStore();
    return this.getProductById(id);
  },

  archiveProduct(id: string, isArchived = true, adminName = "Admin"): boolean {
    const store = loadStore();
    const prod = store.products.find((p) => p.id === id);
    if (!prod) return false;
    prod.is_archived = isArchived;
    prod.status = isArchived ? "archived" : "active";
    prod.updated_at = new Date().toISOString();
    this.logActivity(
      adminName,
      "admin",
      `${isArchived ? "Archived" : "Restored"} Product: ${prod.name}`,
      "products",
      { id }
    );
    saveStore();
    return true;
  },

  deleteProduct(id: string, adminName = "Admin"): { success: boolean; error?: string } {
    const store = loadStore();
    const prod = store.products.find((p) => p.id === id);
    if (!prod) return { success: false, error: "Product not found" };

    // Check if there are movements or bookings associated
    const hasMovements = store.movements.some((m) => m.product_id === id);
    const hasBookings = store.bookings.some((b) => b.items?.some((item) => item.product_id === id));

    if (hasMovements || hasBookings) {
      // Soft-delete/Archive to preserve audit integrity
      prod.is_archived = true;
      prod.status = "archived";
      saveStore();
      return {
        success: true,
        error: "Product has associated stock or booking records and has been safely archived instead of permanently deleted to preserve audit trails.",
      };
    }

    store.products = store.products.filter((p) => p.id !== id);
    store.inventory = store.inventory.filter((i) => i.product_id !== id);
    store.variants = store.variants.filter((v) => v.product_id !== id);
    this.logActivity(adminName, "admin", `Deleted Product: ${prod.name}`, "products", { id });
    saveStore();
    return { success: true };
  },

  // Stock Adjustment & Movement System (Core Part 8)
  adjustStock(params: {
    productId: string;
    variantId?: string;
    quantityChange: number;
    movementType: StockMovementType;
    adminUserName: string;
    adminUserId?: string;
    note?: string;
  }): { success: boolean; newStock: number; error?: string } {
    const store = loadStore();
    const prod = store.products.find((p) => p.id === params.productId);
    if (!prod) return { success: false, newStock: 0, error: "Product not found" };

    let inv = store.inventory.find(
      (i) => i.product_id === params.productId && (params.variantId ? i.variant_id === params.variantId : true)
    );

    if (!inv) {
      inv = {
        id: "inv_" + Date.now(),
        product_id: params.productId,
        variant_id: params.variantId,
        current_stock: 0,
        reserved_stock: 0,
        available_stock: 0,
        updated_at: new Date().toISOString(),
      };
      store.inventory.push(inv);
    }

    const previousStock = inv.current_stock;
    const newStock = previousStock + params.quantityChange;

    if (newStock < 0 && !store.settings.allow_negative_stock) {
      return {
        success: false,
        newStock: previousStock,
        error: `Insufficient stock! Current stock is ${previousStock}, adjustment of ${params.quantityChange} would result in negative stock (${newStock}).`,
      };
    }

    // Apply change atomically
    inv.current_stock = newStock;
    inv.available_stock = Math.max(0, inv.current_stock - inv.reserved_stock);
    inv.updated_at = new Date().toISOString();

    // Record Stock Movement with full audit trail
    const movement: StockMovement = {
      id: "mov_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
      product_id: params.productId,
      product_name: prod.name,
      product_sku: prod.sku,
      variant_id: params.variantId,
      previous_stock: previousStock,
      quantity_changed: params.quantityChange,
      new_stock: newStock,
      movement_type: params.movementType,
      admin_user_id: params.adminUserId,
      admin_user_name: params.adminUserName,
      note: params.note || `Adjusted stock by ${params.quantityChange > 0 ? "+" : ""}${params.quantityChange}`,
      created_at: new Date().toISOString(),
    };
    store.movements.unshift(movement);

    this.logActivity(
      params.adminUserName,
      "admin",
      `Stock Adjustment: ${prod.name} (${params.quantityChange > 0 ? "+" : ""}${params.quantityChange})`,
      "inventory",
      { productId: prod.id, previousStock, newStock, movementType: params.movementType }
    );

    saveStore();
    return { success: true, newStock };
  },

  getStockMovements(limit = 200): StockMovement[] {
    const store = loadStore();
    return store.movements.slice(0, limit);
  },

  // Recipient & Share Link Management (Part 10)
  getRecipients(): Recipient[] {
    const store = loadStore();
    return store.recipients.map((rec) => {
      const cred = store.credentials.find((c) => c.recipient_id === rec.id);
      const link = store.shareLinks.find((l) => l.recipient_id === rec.id);
      return {
        ...rec,
        credentials: cred
          ? {
              login_id: cred.login_id,
              plain_preview: cred.plain_preview,
              last_login_at: cred.last_login_at,
              is_locked: cred.is_locked,
            }
          : undefined,
        share_link: link
          ? {
              id: link.id,
              token: link.token,
              status: link.status,
              expires_at: link.expires_at,
            }
          : undefined,
      };
    });
  },

  getRecipientById(id: string): (Recipient & { prices?: RecipientProductPrice[] }) | null {
    const store = loadStore();
    const rec = store.recipients.find((r) => r.id === id);
    if (!rec) return null;
    const cred = store.credentials.find((c) => c.recipient_id === rec.id);
    const link = store.shareLinks.find((l) => l.recipient_id === rec.id);
    const prices = store.recipientPrices.filter((p) => p.recipient_id === rec.id);
    return {
      ...rec,
      credentials: cred
        ? {
            login_id: cred.login_id,
            plain_preview: cred.plain_preview,
            last_login_at: cred.last_login_at,
            is_locked: cred.is_locked,
          }
        : undefined,
      share_link: link
        ? {
            id: link.id,
            token: link.token,
            status: link.status,
            expires_at: link.expires_at,
          }
        : undefined,
      prices,
    };
  },

  getShareLinks(): (ShareLink & { recipient_name?: string; company_name?: string; login_id?: string })[] {
    const store = loadStore();
    return store.shareLinks.map((l) => {
      const rec = store.recipients.find((r) => r.id === l.recipient_id);
      const cred = store.credentials.find((c) => c.recipient_id === l.recipient_id);
      return {
        ...l,
        recipient_name: rec?.name,
        company_name: rec?.company_name,
        login_id: cred?.login_id,
      };
    });
  },

  getShareLinkByToken(token: string): ShareLink | null {
    const store = loadStore();
    return store.shareLinks.find((l) => l.token === token) || null;
  },

  createShareLink(
    data: {
      recipientName: string;
      companyName?: string;
      loginId: string;
      password?: string;
      whatsappNumber?: string;
      email?: string;
      phone?: string;
      portalDisplayName?: string;
      categoryIds?: string[];
      productIds?: string[];
      customPrices?: { productId: string; customPrice: number; customMoq?: number }[];
      expiresInDays?: number;
      notes?: string;
    },
    adminName = "Admin"
  ): { recipient: Recipient; shareLink: ShareLink; credentials: { loginId: string; plainPassword: string } } {
    const store = loadStore();

    // Check duplicate loginId
    const existingCred = store.credentials.find((c) => c.login_id.toLowerCase() === data.loginId.toLowerCase());
    if (existingCred) {
      throw new Error(`Login ID "${data.loginId}" is already assigned to another recipient.`);
    }

    const recipientId = "rec_" + Date.now();
    const token = "pte-" + Math.random().toString(36).substring(2, 8) + "-" + Date.now().toString(36);
    const plainPassword = data.password && data.password.trim().length > 0 ? data.password : "pte@" + Math.floor(1000 + Math.random() * 9000);
    const passwordHash = bcrypt.hashSync(plainPassword, 10);

    const expiryDays = data.expiresInDays || store.settings.default_link_expiry_days;
    const expiresAt = expiryDays > 0 ? new Date(Date.now() + 3600000 * 24 * expiryDays).toISOString() : undefined;

    const recipient: Recipient = {
      id: recipientId,
      name: data.recipientName,
      company_name: data.companyName,
      phone: data.phone,
      email: data.email,
      whatsapp_number: data.whatsappNumber,
      portal_display_name: data.portalDisplayName || `${data.companyName || data.recipientName} - Private Wholesale Portal`,
      status: "active",
      notes: data.notes,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    store.recipients.push(recipient);

    const cred: RecipientCredentials = {
      id: "cred_" + recipientId,
      recipient_id: recipientId,
      login_id: data.loginId,
      password_hash: passwordHash,
      plain_preview: plainPassword,
      failed_login_attempts: 0,
      is_locked: false,
      updated_at: new Date().toISOString(),
    };
    store.credentials.push(cred);

    const shareLink: ShareLink = {
      id: "link_" + recipientId,
      recipient_id: recipientId,
      token,
      expires_at: expiresAt,
      status: "active",
      notes: data.notes,
      category_ids: data.categoryIds && data.categoryIds.length > 0 ? data.categoryIds : store.categories.map((c) => c.id),
      product_ids: data.productIds && data.productIds.length > 0 ? data.productIds : store.products.map((p) => p.id),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    store.shareLinks.push(shareLink);

    // Save custom wholesale prices if supplied
    if (data.customPrices && Array.isArray(data.customPrices)) {
      for (const cp of data.customPrices) {
        if (!cp.productId || !cp.customPrice) continue;
        store.recipientPrices.push({
          id: "rpp_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
          recipient_id: recipientId,
          product_id: cp.productId,
          custom_selling_price: Number(cp.customPrice),
          custom_moq: cp.customMoq ? Number(cp.customMoq) : undefined,
          is_active: true,
          updated_at: new Date().toISOString(),
        });
      }
    }

    this.logActivity(
      adminName,
      "admin",
      `Generated Share Link for ${recipient.name} (${cred.login_id})`,
      "share_links",
      { recipientId, token }
    );

    saveStore();
    return { recipient, shareLink, credentials: { loginId: cred.login_id, plainPassword } };
  },

  updateShareLinkStatus(linkId: string, status: "active" | "disabled" | "expired", adminName = "Admin"): boolean {
    const store = loadStore();
    const link = store.shareLinks.find((l) => l.id === linkId);
    if (!link) return false;
    link.status = status;
    link.updated_at = new Date().toISOString();
    this.logActivity(adminName, "admin", `Updated Share Link status to "${status}"`, "share_links", { linkId });
    saveStore();
    return true;
  },

  deleteShareLink(linkId: string, adminName = "Admin"): boolean {
    const store = loadStore();
    const link = store.shareLinks.find((l) => l.id === linkId);
    if (!link) return false;
    store.shareLinks = store.shareLinks.filter((l) => l.id !== linkId);
    this.logActivity(adminName, "admin", `Deleted Share Link`, "share_links", { linkId });
    saveStore();
    return true;
  },

  updateRecipientPricing(
    recipientId: string,
    prices: { productId: string; variantId?: string; customPrice: number; customMoq?: number }[],
    adminName = "Admin"
  ) {
    const store = loadStore();
    // remove existing prices for this recipient
    store.recipientPrices = store.recipientPrices.filter((p) => p.recipient_id !== recipientId);
    for (const cp of prices) {
      if (!cp.productId || cp.customPrice === undefined) continue;
      store.recipientPrices.push({
        id: "rpp_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
        recipient_id: recipientId,
        product_id: cp.productId,
        variant_id: cp.variantId,
        custom_selling_price: Number(cp.customPrice),
        custom_moq: cp.customMoq ? Number(cp.customMoq) : undefined,
        is_active: true,
        updated_at: new Date().toISOString(),
      });
    }
    this.logActivity(adminName, "admin", `Updated Wholesale Pricing for Recipient`, "pricing", {
      recipientId,
      count: prices.length,
    });
    saveStore();
  },

  // Recipient / Buyer Authentication Verification (Part 10 & 11)
  authenticateBuyer(token: string, loginId: string, passwordPlain: string): {
    success: boolean;
    error?: string;
    recipient?: Recipient;
    shareLink?: ShareLink;
  } {
    const store = loadStore();
    const link = store.shareLinks.find((l) => l.token === token);
    if (!link) {
      return { success: false, error: "Access Revoked or Invalid Link. Please contact Pro Tech Enterprises." };
    }

    if (link.status !== "active") {
      return { success: false, error: "This private wholesale portal has been disabled or expired." };
    }

    if (link.expires_at && new Date(link.expires_at) < new Date()) {
      link.status = "expired";
      saveStore();
      return { success: false, error: "This access link has expired. Please request a new link." };
    }

    const recipient = store.recipients.find((r) => r.id === link.recipient_id);
    if (!recipient || recipient.status !== "active") {
      return { success: false, error: "Buyer account is suspended or inactive." };
    }

    const cred = store.credentials.find((c) => c.recipient_id === link.recipient_id);
    if (!cred) {
      return { success: false, error: "Credentials not configured for this portal." };
    }

    if (cred.is_locked) {
      return { success: false, error: "Account locked due to excessive failed attempts. Please contact Admin." };
    }

    if (cred.login_id.toLowerCase() !== loginId.trim().toLowerCase()) {
      cred.failed_login_attempts += 1;
      if (cred.failed_login_attempts >= 5) cred.is_locked = true;
      saveStore();
      return { success: false, error: "Invalid Login ID or Password." };
    }

    const matches = bcrypt.compareSync(passwordPlain, cred.password_hash);
    if (!matches) {
      cred.failed_login_attempts += 1;
      if (cred.failed_login_attempts >= 5) cred.is_locked = true;
      saveStore();
      return { success: false, error: "Invalid Login ID or Password." };
    }

    // Success: reset failed attempts, update last login
    cred.failed_login_attempts = 0;
    cred.last_login_at = new Date().toISOString();
    link.last_accessed_at = new Date().toISOString();
    saveStore();

    return { success: true, recipient, shareLink: link };
  },

  // ========================================================================
  // BUYER CATALOG VIEW - CRITICAL SECURITY REQUIREMENT (PART 11)
  // NEVER RETURN EXACT STOCK, INTERNAL COSTS, OR PROFIT MARGINS
  // ONLY RETURN: is_available (boolean), ASSIGNED SELLING PRICE, MOQ, UNIT, IMAGE
  // ========================================================================
  getBuyerCatalog(token: string): {
    portalName: string;
    recipientName: string;
    companyName?: string;
    whatsappNumber: string;
    categories: { id: string; name: string }[];
    products: BuyerProduct[];
  } | null {
    const store = loadStore();
    const link = store.shareLinks.find((l) => l.token === token);
    if (!link || link.status !== "active") return null;

    const recipient = store.recipients.find((r) => r.id === link.recipient_id);
    if (!recipient || recipient.status !== "active") return null;

    // Filter permitted categories
    const permittedCatIds = link.category_ids || store.categories.map((c) => c.id);
    const permittedCategories = store.categories
      .filter((c) => !c.is_archived && permittedCatIds.includes(c.id))
      .map((c) => ({ id: c.id, name: c.name }));

    // Filter permitted products
    const permittedProdIds = link.product_ids || store.products.map((p) => p.id);
    const rawProducts = store.products.filter(
      (p) => !p.is_archived && p.status === "active" && permittedProdIds.includes(p.id) && permittedCatIds.includes(p.category_id)
    );

    // Recipient specific custom prices
    const customPrices = store.recipientPrices.filter((cp) => cp.recipient_id === recipient.id && cp.is_active);

    const buyerProducts: BuyerProduct[] = rawProducts.map((p) => {
      const cat = store.categories.find((c) => c.id === p.category_id);
      const inv = store.inventory.find((i) => i.product_id === p.id);
      const customPrice = customPrices.find((cp) => cp.product_id === p.id && !cp.variant_id);

      // Determine availability strictly without leaking remaining count
      const currentStock = inv ? inv.current_stock : 0;
      const isAvailable = currentStock > 0;

      const sellingPrice = customPrice ? customPrice.custom_selling_price : p.default_selling_price;
      const moq = customPrice?.custom_moq || p.moq || 1;

      // Variants
      const prodVariants = store.variants
        .filter((v) => v.product_id === p.id && v.status === "active")
        .map((v) => {
          const vCustomPrice = customPrices.find((cp) => cp.product_id === p.id && cp.variant_id === v.id);
          const vPrice = vCustomPrice ? vCustomPrice.custom_selling_price : v.default_selling_price;
          const vMoq = vCustomPrice?.custom_moq || v.moq || 1;
          return {
            id: v.id,
            variant_name: v.variant_name,
            sku: v.sku,
            selling_price: vPrice,
            moq: vMoq,
            unit: v.unit,
            is_available: isAvailable, // inherit availability securely
          };
        });

      return {
        id: p.id,
        name: p.name,
        sku: p.sku,
        category_id: p.category_id,
        category_name: cat?.name || "General Electronics",
        description: p.description,
        image_url: p.image_url,
        unit: p.unit,
        selling_price: sellingPrice,
        moq,
        is_available: isAvailable,
        variants: prodVariants.length > 0 ? prodVariants : undefined,
      };
    });

    return {
      portalName: recipient.portal_display_name || "Pro Tech Enterprises Wholesale Portal",
      recipientName: recipient.name,
      companyName: recipient.company_name,
      whatsappNumber: store.settings.company_whatsapp,
      categories: permittedCategories,
      products: buyerProducts,
    };
  },

  // WhatsApp Bulk Booking System (Part 12 & 13)
  createBooking(data: {
    token: string;
    items: { productId: string; variantId?: string; quantity: number }[];
  }): { success: boolean; booking?: Booking; whatsappUrl?: string; error?: string } {
    const store = loadStore();
    const link = store.shareLinks.find((l) => l.token === data.token);
    if (!link || link.status !== "active") return { success: false, error: "Invalid or inactive session." };

    const recipient = store.recipients.find((r) => r.id === link.recipient_id);
    if (!recipient) return { success: false, error: "Recipient not found." };

    const cred = store.credentials.find((c) => c.recipient_id === recipient.id);

    // Verify and calculate order items using assigned selling prices
    const customPrices = store.recipientPrices.filter((cp) => cp.recipient_id === recipient.id && cp.is_active);
    const bookingId = "bkg_" + Date.now();
    const refNumber = `PTE-BKG-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, "0")}-${Math.floor(
      100 + Math.random() * 900
    )}`;

    let totalAmount = 0;
    const bookingItems: BookingItem[] = [];
    const messageLines: string[] = [];

    let itemIndex = 1;
    for (const item of data.items) {
      const prod = store.products.find((p) => p.id === item.productId);
      if (!prod) continue;

      const customPrice = customPrices.find((cp) => cp.product_id === prod.id && (!item.variantId || cp.variant_id === item.variantId));
      let unitPrice = customPrice ? customPrice.custom_selling_price : prod.default_selling_price;
      let variantName = "";

      if (item.variantId) {
        const v = store.variants.find((vr) => vr.id === item.variantId);
        if (v) {
          variantName = ` (${v.variant_name})`;
          if (!customPrice) unitPrice = v.default_selling_price;
        }
      }

      const lineTotal = item.quantity * unitPrice;
      totalAmount += lineTotal;

      bookingItems.push({
        id: "bitem_" + Date.now() + "_" + itemIndex,
        booking_id: bookingId,
        product_id: prod.id,
        variant_id: item.variantId,
        product_name: prod.name + variantName,
        sku: prod.sku,
        quantity: item.quantity,
        unit_price: unitPrice,
        total_price: lineTotal,
      });

      messageLines.push(
        `${itemIndex}. Product: ${prod.name}${variantName}\n   Quantity: ${item.quantity} ${prod.unit}\n   Price: ₹${unitPrice}/${prod.unit}\n   Total: ₹${lineTotal.toLocaleString("en-IN")}`
      );
      itemIndex++;
    }

    if (bookingItems.length === 0) {
      return { success: false, error: "No valid items selected for bulk booking." };
    }

    // Build the formatted WhatsApp message as specified in Part 12
    const whatsappText = `Hello Pro Tech Enterprises,

I would like to request the following bulk products:

${messageLines.join("\n\n")}

Estimated Total: ₹${totalAmount.toLocaleString("en-IN")}

Buyer Name: ${recipient.name}
Login ID: ${cred?.login_id || "N/A"}
Booking Reference: ${refNumber}

Please confirm product availability and dispatch timeline.

Thank you.`;

    const booking: Booking = {
      id: bookingId,
      booking_reference: refNumber,
      recipient_id: recipient.id,
      recipient_name: recipient.name,
      company_name: recipient.company_name,
      share_link_id: link.id,
      status: "pending",
      total_estimated_amount: totalAmount,
      whatsapp_message_payload: whatsappText,
      items: bookingItems,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    store.bookings.unshift(booking);

    // Save activity
    this.logActivity(recipient.name, "recipient", `Submitted Booking Request: ${refNumber}`, "bookings", {
      bookingId,
      totalAmount,
      itemsCount: bookingItems.length,
    });

    saveStore();

    // Construct official WhatsApp URL (wa.me)
    const cleanPhone = store.settings.company_whatsapp.replace(/[^0-9]/g, "");
    const encodedMsg = encodeURIComponent(whatsappText);
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMsg}`;

    return { success: true, booking, whatsappUrl };
  },

  getBookings(statusFilter?: BookingStatus): Booking[] {
    const store = loadStore();
    return store.bookings.filter((b) => (statusFilter ? b.status === statusFilter : true));
  },

  getBookingById(id: string): Booking | null {
    const store = loadStore();
    return store.bookings.find((b) => b.id === id) || null;
  },

  // Admin Booking Decision & Inventory Reservation / Fulfilment (Part 12 & 13)
  updateBookingStatus(
    bookingId: string,
    newStatus: BookingStatus,
    adminRemarks?: string,
    adminName = "Admin"
  ): { success: boolean; error?: string } {
    const store = loadStore();
    const booking = store.bookings.find((b) => b.id === bookingId);
    if (!booking) return { success: false, error: "Booking not found" };

    const oldStatus = booking.status;
    if (oldStatus === newStatus) return { success: true };

    // Prevent re-processing fulfilled bookings
    if (oldStatus === "fulfilled") {
      return { success: false, error: "Booking is already fulfilled and stock has been permanently deducted." };
    }

    // 1. APPROVAL -> RESERVE STOCK ATOMICALLY
    if (newStatus === "approved" && oldStatus !== "approved") {
      if (booking.items) {
        for (const item of booking.items) {
          const inv = store.inventory.find((i) => i.product_id === item.product_id);
          if (inv) {
            inv.reserved_stock += item.quantity;
            inv.available_stock = Math.max(0, inv.current_stock - inv.reserved_stock);
            inv.updated_at = new Date().toISOString();

            store.reservations.push({
              id: "res_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
              booking_id: booking.id,
              product_id: item.product_id,
              variant_id: item.variant_id,
              reserved_quantity: item.quantity,
              status: "reserved",
              created_at: new Date().toISOString(),
            });
          }
        }
      }
    }

    // 2. REJECTED OR CANCELLED -> RELEASE RESERVED STOCK
    if ((newStatus === "rejected" || newStatus === "cancelled") && oldStatus === "approved") {
      if (booking.items) {
        for (const item of booking.items) {
          const inv = store.inventory.find((i) => i.product_id === item.product_id);
          if (inv) {
            inv.reserved_stock = Math.max(0, inv.reserved_stock - item.quantity);
            inv.available_stock = Math.max(0, inv.current_stock - inv.reserved_stock);
            inv.updated_at = new Date().toISOString();
          }
        }
        // Mark reservations released
        store.reservations
          .filter((r) => r.booking_id === booking.id && r.status === "reserved")
          .forEach((r) => {
            r.status = "released";
            r.released_at = new Date().toISOString();
          });
      }
    }

    // 3. FULFILLED -> DEDUCT ACTUAL STOCK EXACTLY ONCE
    if (newStatus === "fulfilled") {
      if (booking.items) {
        for (const item of booking.items) {
          const inv = store.inventory.find((i) => i.product_id === item.product_id);
          if (inv) {
            const previousStock = inv.current_stock;
            // Deduct from current stock
            inv.current_stock = Math.max(0, inv.current_stock - item.quantity);
            // If previously reserved, release reservation
            if (oldStatus === "approved") {
              inv.reserved_stock = Math.max(0, inv.reserved_stock - item.quantity);
            }
            inv.available_stock = Math.max(0, inv.current_stock - inv.reserved_stock);
            inv.updated_at = new Date().toISOString();

            // Record official Stock Movement
            store.movements.unshift({
              id: "mov_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
              product_id: item.product_id,
              product_name: item.product_name,
              product_sku: item.sku,
              variant_id: item.variant_id,
              previous_stock: previousStock,
              quantity_changed: -item.quantity,
              new_stock: inv.current_stock,
              movement_type: "booking_fulfilment",
              admin_user_name: adminName,
              note: `Order fulfilled: Reference #${booking.booking_reference} for ${booking.recipient_name}`,
              created_at: new Date().toISOString(),
            });
          }
        }
        // Mark reservations fulfilled
        store.reservations
          .filter((r) => r.booking_id === booking.id && r.status === "reserved")
          .forEach((r) => {
            r.status = "fulfilled";
          });
      }
    }

    booking.status = newStatus;
    if (adminRemarks) booking.admin_remarks = adminRemarks;
    booking.updated_at = new Date().toISOString();

    this.logActivity(adminName, "admin", `Updated Booking ${booking.booking_reference} to ${newStatus}`, "bookings", {
      bookingId: booking.id,
      oldStatus,
      newStatus,
    });

    saveStore();
    return { success: true };
  },

  // Dashboard Metrics & Reports (Part 5 & 14)
  getDashboardMetrics() {
    const store = loadStore();
    const activeProducts = store.products.filter((p) => !p.is_archived && p.status === "active");
    const totalCategories = store.categories.filter((c) => !c.is_archived).length;

    let totalStockUnits = 0;
    let lowStockCount = 0;
    let outOfStockCount = 0;

    for (const prod of activeProducts) {
      const inv = store.inventory.find((i) => i.product_id === prod.id);
      const stock = inv ? inv.current_stock : 0;
      totalStockUnits += stock;
      if (stock === 0) {
        outOfStockCount++;
      } else if (stock <= prod.min_stock_threshold) {
        lowStockCount++;
      }
    }

    const activeLinksCount = store.shareLinks.filter((l) => l.status === "active").length;
    const pendingBookingsCount = store.bookings.filter((b) => b.status === "pending").length;

    // Category-wise inventory counts
    const categoryDistribution = store.categories
      .filter((c) => !c.is_archived)
      .map((cat) => {
        const catProds = store.products.filter((p) => p.category_id === cat.id && !p.is_archived);
        const catUnits = catProds.reduce((sum, p) => {
          const inv = store.inventory.find((i) => i.product_id === p.id);
          return sum + (inv ? inv.current_stock : 0);
        }, 0);
        return {
          categoryName: cat.name,
          productsCount: catProds.length,
          totalUnits: catUnits,
        };
      });

    return {
      totalProducts: activeProducts.length,
      activeProducts: activeProducts.length,
      totalCategories,
      totalStockUnits,
      lowStockProducts: lowStockCount,
      outOfStockProducts: outOfStockCount,
      activeSharingLinks: activeLinksCount,
      pendingBookingRequests: pendingBookingsCount,
      categoryDistribution,
      recentMovements: store.movements.slice(0, 10),
      recentBookings: store.bookings.slice(0, 5),
      recentActivities: store.activityLogs.slice(0, 8),
    };
  },
};
