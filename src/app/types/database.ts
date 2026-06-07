// Database Schema Types

export interface DatabaseSchema {
  name: string;
  tables: Table[];
}

export interface Table {
  name: string;
  description: string;
  columns: Column[];
  relationships?: Relationship[];
}

export interface Column {
  name: string;
  type: string;
  nullable: boolean;
  primaryKey?: boolean;
  foreignKey?: string;
  default?: string;
}

export interface Relationship {
  type: 'one-to-one' | 'one-to-many' | 'many-to-many' | 'many-to-one';
  table: string;
  via?: string;
}

// Complete Database Schema
export const DATABASE_SCHEMA: DatabaseSchema = {
  name: 'stationery_management_system',
  tables: [
    {
      name: 'users',
      description: 'System users with authentication and profile information',
      columns: [
        { name: 'id', type: 'UUID', nullable: false, primaryKey: true },
        { name: 'email', type: 'VARCHAR(255)', nullable: false },
        { name: 'password_hash', type: 'VARCHAR(255)', nullable: false },
        { name: 'full_name', type: 'VARCHAR(255)', nullable: false },
        { name: 'phone', type: 'VARCHAR(50)', nullable: true },
        { name: 'role_id', type: 'UUID', nullable: false, foreignKey: 'roles.id' },
        { name: 'status', type: 'ENUM(active,inactive,suspended)', nullable: false, default: 'active' },
        { name: 'created_at', type: 'TIMESTAMP', nullable: false },
        { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
      ],
      relationships: [
        { type: 'many-to-one', table: 'roles' }
      ]
    },
    {
      name: 'roles',
      description: 'User roles and permissions',
      columns: [
        { name: 'id', type: 'UUID', nullable: false, primaryKey: true },
        { name: 'name', type: 'VARCHAR(100)', nullable: false },
        { name: 'description', type: 'TEXT', nullable: true },
        { name: 'permissions', type: 'JSONB', nullable: false },
        { name: 'created_at', type: 'TIMESTAMP', nullable: false }
      ]
    },
    {
      name: 'products',
      description: 'Product catalog with pricing and specifications',
      columns: [
        { name: 'id', type: 'UUID', nullable: false, primaryKey: true },
        { name: 'sku', type: 'VARCHAR(100)', nullable: false },
        { name: 'name', type: 'VARCHAR(255)', nullable: false },
        { name: 'description', type: 'TEXT', nullable: true },
        { name: 'category', type: 'VARCHAR(100)', nullable: false },
        { name: 'base_price', type: 'DECIMAL(10,2)', nullable: false },
        { name: 'image_url', type: 'VARCHAR(500)', nullable: true },
        { name: 'status', type: 'ENUM(active,inactive)', nullable: false, default: 'active' },
        { name: 'vendor_id', type: 'UUID', nullable: true, foreignKey: 'vendors.id' },
        { name: 'created_at', type: 'TIMESTAMP', nullable: false },
        { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
      ],
      relationships: [
        { type: 'many-to-one', table: 'vendors' },
        { type: 'one-to-many', table: 'tier_pricing' }
      ]
    },
    {
      name: 'tier_pricing',
      description: 'Volume-based pricing tiers',
      columns: [
        { name: 'id', type: 'UUID', nullable: false, primaryKey: true },
        { name: 'product_id', type: 'UUID', nullable: false, foreignKey: 'products.id' },
        { name: 'min_quantity', type: 'INT', nullable: false },
        { name: 'max_quantity', type: 'INT', nullable: false },
        { name: 'price', type: 'DECIMAL(10,2)', nullable: false },
        { name: 'discount_percentage', type: 'DECIMAL(5,2)', nullable: true }
      ]
    },
    {
      name: 'inventory',
      description: 'Stock levels and warehouse management',
      columns: [
        { name: 'id', type: 'UUID', nullable: false, primaryKey: true },
        { name: 'product_id', type: 'UUID', nullable: false, foreignKey: 'products.id' },
        { name: 'warehouse_location', type: 'VARCHAR(100)', nullable: false },
        { name: 'quantity_available', type: 'INT', nullable: false, default: '0' },
        { name: 'quantity_reserved', type: 'INT', nullable: false, default: '0' },
        { name: 'reorder_point', type: 'INT', nullable: false },
        { name: 'last_stocked_at', type: 'TIMESTAMP', nullable: true },
        { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
      ]
    },
    {
      name: 'stock_movements',
      description: 'Audit trail for stock changes',
      columns: [
        { name: 'id', type: 'UUID', nullable: false, primaryKey: true },
        { name: 'inventory_id', type: 'UUID', nullable: false, foreignKey: 'inventory.id' },
        { name: 'type', type: 'ENUM(add,release,adjust,reserve,unreserve)', nullable: false },
        { name: 'quantity', type: 'INT', nullable: false },
        { name: 'reference_type', type: 'VARCHAR(50)', nullable: true },
        { name: 'reference_id', type: 'UUID', nullable: true },
        { name: 'notes', type: 'TEXT', nullable: true },
        { name: 'performed_by', type: 'UUID', nullable: false, foreignKey: 'users.id' },
        { name: 'created_at', type: 'TIMESTAMP', nullable: false }
      ]
    },
    {
      name: 'orders',
      description: 'Customer orders and order management',
      columns: [
        { name: 'id', type: 'UUID', nullable: false, primaryKey: true },
        { name: 'order_number', type: 'VARCHAR(50)', nullable: false },
        { name: 'customer_id', type: 'UUID', nullable: false, foreignKey: 'users.id' },
        { name: 'status', type: 'ENUM(draft,pending,processing,ready,shipped,delivered,cancelled)', nullable: false },
        { name: 'subtotal', type: 'DECIMAL(10,2)', nullable: false },
        { name: 'tax', type: 'DECIMAL(10,2)', nullable: false },
        { name: 'shipping', type: 'DECIMAL(10,2)', nullable: false },
        { name: 'total', type: 'DECIMAL(10,2)', nullable: false },
        { name: 'payment_status', type: 'ENUM(pending,paid,refunded)', nullable: false },
        { name: 'assigned_to', type: 'UUID', nullable: true, foreignKey: 'users.id' },
        { name: 'created_at', type: 'TIMESTAMP', nullable: false },
        { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
      ],
      relationships: [
        { type: 'one-to-many', table: 'order_items' },
        { type: 'one-to-one', table: 'delivery' }
      ]
    },
    {
      name: 'order_items',
      description: 'Individual items in orders',
      columns: [
        { name: 'id', type: 'UUID', nullable: false, primaryKey: true },
        { name: 'order_id', type: 'UUID', nullable: false, foreignKey: 'orders.id' },
        { name: 'product_id', type: 'UUID', nullable: false, foreignKey: 'products.id' },
        { name: 'quantity', type: 'INT', nullable: false },
        { name: 'unit_price', type: 'DECIMAL(10,2)', nullable: false },
        { name: 'customization', type: 'JSONB', nullable: true },
        { name: 'subtotal', type: 'DECIMAL(10,2)', nullable: false }
      ]
    },
    {
      name: 'deliveries',
      description: 'Delivery tracking and proof',
      columns: [
        { name: 'id', type: 'UUID', nullable: false, primaryKey: true },
        { name: 'order_id', type: 'UUID', nullable: false, foreignKey: 'orders.id' },
        { name: 'delivery_person_id', type: 'UUID', nullable: true, foreignKey: 'users.id' },
        { name: 'status', type: 'ENUM(pending,assigned,in_transit,delivered,failed)', nullable: false },
        { name: 'scheduled_date', type: 'DATE', nullable: true },
        { name: 'delivered_at', type: 'TIMESTAMP', nullable: true },
        { name: 'proof_image_url', type: 'VARCHAR(500)', nullable: true },
        { name: 'signature', type: 'TEXT', nullable: true },
        { name: 'notes', type: 'TEXT', nullable: true },
        { name: 'created_at', type: 'TIMESTAMP', nullable: false },
        { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
      ]
    },
    {
      name: 'invoices',
      description: 'Financial invoices',
      columns: [
        { name: 'id', type: 'UUID', nullable: false, primaryKey: true },
        { name: 'invoice_number', type: 'VARCHAR(50)', nullable: false },
        { name: 'order_id', type: 'UUID', nullable: false, foreignKey: 'orders.id' },
        { name: 'issue_date', type: 'DATE', nullable: false },
        { name: 'due_date', type: 'DATE', nullable: false },
        { name: 'amount', type: 'DECIMAL(10,2)', nullable: false },
        { name: 'status', type: 'ENUM(draft,sent,paid,overdue,cancelled)', nullable: false },
        { name: 'generated_by', type: 'UUID', nullable: false, foreignKey: 'users.id' },
        { name: 'created_at', type: 'TIMESTAMP', nullable: false }
      ]
    },
    {
      name: 'payments',
      description: 'Payment transactions',
      columns: [
        { name: 'id', type: 'UUID', nullable: false, primaryKey: true },
        { name: 'invoice_id', type: 'UUID', nullable: false, foreignKey: 'invoices.id' },
        { name: 'payment_method', type: 'VARCHAR(50)', nullable: false },
        { name: 'transaction_id', type: 'VARCHAR(100)', nullable: true },
        { name: 'amount', type: 'DECIMAL(10,2)', nullable: false },
        { name: 'status', type: 'ENUM(pending,confirmed,failed,refunded,reversed)', nullable: false },
        { name: 'confirmed_by', type: 'UUID', nullable: true, foreignKey: 'users.id' },
        { name: 'payment_date', type: 'TIMESTAMP', nullable: false },
        { name: 'created_at', type: 'TIMESTAMP', nullable: false }
      ]
    },
    {
      name: 'leads',
      description: 'Sales leads and opportunities',
      columns: [
        { name: 'id', type: 'UUID', nullable: false, primaryKey: true },
        { name: 'company_name', type: 'VARCHAR(255)', nullable: false },
        { name: 'contact_person', type: 'VARCHAR(255)', nullable: false },
        { name: 'email', type: 'VARCHAR(255)', nullable: false },
        { name: 'phone', type: 'VARCHAR(50)', nullable: true },
        { name: 'source', type: 'VARCHAR(100)', nullable: true },
        { name: 'status', type: 'ENUM(new,contacted,qualified,proposal,negotiation,landed,lost)', nullable: false },
        { name: 'estimated_value', type: 'DECIMAL(10,2)', nullable: true },
        { name: 'assigned_to', type: 'UUID', nullable: false, foreignKey: 'users.id' },
        { name: 'created_at', type: 'TIMESTAMP', nullable: false },
        { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
      ]
    },
    {
      name: 'meetings',
      description: 'Sales meetings and follow-ups',
      columns: [
        { name: 'id', type: 'UUID', nullable: false, primaryKey: true },
        { name: 'lead_id', type: 'UUID', nullable: false, foreignKey: 'leads.id' },
        { name: 'title', type: 'VARCHAR(255)', nullable: false },
        { name: 'scheduled_at', type: 'TIMESTAMP', nullable: false },
        { name: 'duration_minutes', type: 'INT', nullable: false },
        { name: 'location', type: 'VARCHAR(255)', nullable: true },
        { name: 'attendees', type: 'TEXT', nullable: true },
        { name: 'notes', type: 'TEXT', nullable: true },
        { name: 'outcome', type: 'ENUM(landed,no,requires_info)', nullable: true },
        { name: 'created_by', type: 'UUID', nullable: false, foreignKey: 'users.id' },
        { name: 'created_at', type: 'TIMESTAMP', nullable: false }
      ]
    },
    {
      name: 'contracts',
      description: 'Client and vendor contracts',
      columns: [
        { name: 'id', type: 'UUID', nullable: false, primaryKey: true },
        { name: 'contract_number', type: 'VARCHAR(50)', nullable: false },
        { name: 'party_type', type: 'ENUM(client,vendor)', nullable: false },
        { name: 'party_id', type: 'UUID', nullable: false },
        { name: 'title', type: 'VARCHAR(255)', nullable: false },
        { name: 'start_date', type: 'DATE', nullable: false },
        { name: 'end_date', type: 'DATE', nullable: false },
        { name: 'value', type: 'DECIMAL(10,2)', nullable: true },
        { name: 'document_url', type: 'VARCHAR(500)', nullable: true },
        { name: 'status', type: 'ENUM(draft,active,expiring,expired,terminated)', nullable: false },
        { name: 'managed_by', type: 'UUID', nullable: false, foreignKey: 'users.id' },
        { name: 'created_at', type: 'TIMESTAMP', nullable: false },
        { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
      ]
    },
    {
      name: 'vendors',
      description: 'Supplier and vendor information',
      columns: [
        { name: 'id', type: 'UUID', nullable: false, primaryKey: true },
        { name: 'name', type: 'VARCHAR(255)', nullable: false },
        { name: 'contact_person', type: 'VARCHAR(255)', nullable: false },
        { name: 'email', type: 'VARCHAR(255)', nullable: false },
        { name: 'phone', type: 'VARCHAR(50)', nullable: false },
        { name: 'address', type: 'TEXT', nullable: true },
        { name: 'status', type: 'ENUM(active,inactive)', nullable: false, default: 'active' },
        { name: 'rating', type: 'DECIMAL(3,2)', nullable: true },
        { name: 'payment_terms', type: 'VARCHAR(100)', nullable: true },
        { name: 'created_at', type: 'TIMESTAMP', nullable: false },
        { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
      ]
    },
    {
      name: 'vendor_pricing',
      description: 'Vendor product pricing',
      columns: [
        { name: 'id', type: 'UUID', nullable: false, primaryKey: true },
        { name: 'vendor_id', type: 'UUID', nullable: false, foreignKey: 'vendors.id' },
        { name: 'product_id', type: 'UUID', nullable: false, foreignKey: 'products.id' },
        { name: 'cost_price', type: 'DECIMAL(10,2)', nullable: false },
        { name: 'moq', type: 'INT', nullable: true },
        { name: 'lead_time_days', type: 'INT', nullable: true },
        { name: 'effective_from', type: 'DATE', nullable: false },
        { name: 'effective_to', type: 'DATE', nullable: true }
      ]
    },
    {
      name: 'audit_logs',
      description: 'System-wide audit trail',
      columns: [
        { name: 'id', type: 'UUID', nullable: false, primaryKey: true },
        { name: 'user_id', type: 'UUID', nullable: false, foreignKey: 'users.id' },
        { name: 'action', type: 'VARCHAR(100)', nullable: false },
        { name: 'entity_type', type: 'VARCHAR(100)', nullable: false },
        { name: 'entity_id', type: 'UUID', nullable: true },
        { name: 'changes', type: 'JSONB', nullable: true },
        { name: 'ip_address', type: 'VARCHAR(45)', nullable: true },
        { name: 'user_agent', type: 'TEXT', nullable: true },
        { name: 'created_at', type: 'TIMESTAMP', nullable: false }
      ]
    }
  ]
};
