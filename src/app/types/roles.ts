// Role Types and Permissions

export type UserRole = 
  | 'super_user'
  | 'inventory_admin'
  | 'order_processor'
  | 'delivery_person'
  | 'accounting'
  | 'salesperson'
  | 'finance_contracts'
  | 'procurement'
  | 'it_administrator'
  | 'user';

export interface Permission {
  module: string;
  actions: string[];
}

export interface RoleConfig {
  id: UserRole;
  name: string;
  description: string;
  permissions: Permission[];
  color: string;
}

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  super_user: [
    { module: 'all', actions: ['create', 'read', 'update', 'delete', 'manage'] }
  ],
  inventory_admin: [
    { module: 'inventory', actions: ['create', 'read', 'update', 'delete'] },
    { module: 'stock', actions: ['add', 'release', 'track', 'adjust'] },
    { module: 'products', actions: ['read', 'update'] }
  ],
  order_processor: [
    { module: 'orders', actions: ['create', 'read', 'update', 'delete'] },
    { module: 'delivery', actions: ['assign', 'track'] },
    { module: 'customers', actions: ['read', 'update'] }
  ],
  delivery_person: [
    { module: 'deliveries', actions: ['read', 'update'] },
    { module: 'delivery_status', actions: ['update'] },
    { module: 'proof_upload', actions: ['create', 'update'] }
  ],
  accounting: [
    { module: 'invoices', actions: ['create', 'read', 'update'] },
    { module: 'payments', actions: ['confirm', 'cancel', 'reverse'] },
    { module: 'financial_reports', actions: ['read', 'generate'] }
  ],
  salesperson: [
    { module: 'leads', actions: ['create', 'read', 'update'] },
    { module: 'meetings', actions: ['schedule', 'update'] },
    { module: 'postmortem', actions: ['create', 'update'] },
    { module: 'customers', actions: ['read', 'contact'] }
  ],
  finance_contracts: [
    { module: 'contracts', actions: ['create', 'read', 'update', 'delete'] },
    { module: 'contract_tracking', actions: ['track', 'notify'] },
    { module: 'clients', actions: ['read', 'update'] }
  ],
  procurement: [
    { module: 'vendors', actions: ['create', 'read', 'update', 'delete'] },
    { module: 'products', actions: ['create', 'read', 'update'] },
    { module: 'pricing', actions: ['manage'] },
    { module: 'vendor_contracts', actions: ['create', 'read', 'update'] }
  ],
  it_administrator: [
    { module: 'users', actions: ['create', 'read', 'update', 'delete'] },
    { module: 'roles', actions: ['assign', 'manage'] },
    { module: 'permissions', actions: ['manage'] },
    { module: 'system', actions: ['configure', 'monitor'] }
  ],
  user: [
    { module: 'products', actions: ['read', 'browse'] },
    { module: 'cart', actions: ['create', 'read', 'update', 'delete'] },
    { module: 'orders', actions: ['create', 'read', 'track'] },
    { module: 'profile', actions: ['read', 'update'] }
  ]
};

export const ROLES_CONFIG: RoleConfig[] = [
  {
    id: 'super_user',
    name: 'Super User',
    description: 'Full access to all modules and permissions',
    permissions: ROLE_PERMISSIONS.super_user,
    color: 'bg-red-500'
  },
  {
    id: 'inventory_admin',
    name: 'Inventory Admin',
    description: 'Manage stock add/release and stock tracking',
    permissions: ROLE_PERMISSIONS.inventory_admin,
    color: 'bg-purple-500'
  },
  {
    id: 'order_processor',
    name: 'Order Processor',
    description: 'Add, modify, delete orders and assign delivery',
    permissions: ROLE_PERMISSIONS.order_processor,
    color: 'bg-blue-500'
  },
  {
    id: 'delivery_person',
    name: 'Delivery Person',
    description: 'Update delivery status and upload proof',
    permissions: ROLE_PERMISSIONS.delivery_person,
    color: 'bg-green-500'
  },
  {
    id: 'accounting',
    name: 'Accounting',
    description: 'Generate invoices, confirm payments, cancel and reverse payments',
    permissions: ROLE_PERMISSIONS.accounting,
    color: 'bg-yellow-500'
  },
  {
    id: 'salesperson',
    name: 'Salesperson',
    description: 'Add new leads, meeting scheduling, postmortem tracking',
    permissions: ROLE_PERMISSIONS.salesperson,
    color: 'bg-pink-500'
  },
  {
    id: 'finance_contracts',
    name: 'Finance Contracts',
    description: 'Store and manage client contracts with expiry tracking',
    permissions: ROLE_PERMISSIONS.finance_contracts,
    color: 'bg-indigo-500'
  },
  {
    id: 'procurement',
    name: 'Procurement (Buyer)',
    description: 'Vendor onboarding, product and pricing management, vendor contracts',
    permissions: ROLE_PERMISSIONS.procurement,
    color: 'bg-orange-500'
  },
  {
    id: 'it_administrator',
    name: 'IT Administrator',
    description: 'User management, role assignment, access control',
    permissions: ROLE_PERMISSIONS.it_administrator,
    color: 'bg-cyan-500'
  },
  {
    id: 'user',
    name: 'User',
    description: 'Browse products, place orders, track deliveries',
    permissions: ROLE_PERMISSIONS.user,
    color: 'bg-gray-500'
  }
];
