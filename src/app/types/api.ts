// API Structure and Endpoints

export interface APIEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  description: string;
  auth: boolean;
  roles?: string[];
  params?: Record<string, string>;
  body?: Record<string, string>;
  response: string;
}

export interface APIModule {
  name: string;
  baseUrl: string;
  endpoints: APIEndpoint[];
}

export const API_STRUCTURE: APIModule[] = [
  {
    name: 'Authentication',
    baseUrl: '/api/v1/auth',
    endpoints: [
      {
        method: 'POST',
        path: '/register',
        description: 'Register new user',
        auth: false,
        body: { email: 'string', password: 'string', full_name: 'string' },
        response: '{ user, token }'
      },
      {
        method: 'POST',
        path: '/login',
        description: 'User login',
        auth: false,
        body: { email: 'string', password: 'string' },
        response: '{ user, token }'
      },
      {
        method: 'POST',
        path: '/logout',
        description: 'User logout',
        auth: true,
        response: '{ success: true }'
      },
      {
        method: 'POST',
        path: '/refresh',
        description: 'Refresh access token',
        auth: true,
        response: '{ token }'
      }
    ]
  },
  {
    name: 'Users',
    baseUrl: '/api/v1/users',
    endpoints: [
      {
        method: 'GET',
        path: '/',
        description: 'List all users',
        auth: true,
        roles: ['super_user', 'it_administrator'],
        params: { page: 'number', limit: 'number', role: 'string' },
        response: '{ users[], total, page, limit }'
      },
      {
        method: 'GET',
        path: '/:id',
        description: 'Get user by ID',
        auth: true,
        response: '{ user }'
      },
      {
        method: 'POST',
        path: '/',
        description: 'Create new user',
        auth: true,
        roles: ['super_user', 'it_administrator'],
        body: { email: 'string', full_name: 'string', role_id: 'uuid' },
        response: '{ user }'
      },
      {
        method: 'PUT',
        path: '/:id',
        description: 'Update user',
        auth: true,
        body: { full_name: 'string', phone: 'string' },
        response: '{ user }'
      },
      {
        method: 'DELETE',
        path: '/:id',
        description: 'Delete user',
        auth: true,
        roles: ['super_user', 'it_administrator'],
        response: '{ success: true }'
      },
      {
        method: 'POST',
        path: '/:id/assign-role',
        description: 'Assign role to user',
        auth: true,
        roles: ['super_user', 'it_administrator'],
        body: { role_id: 'uuid' },
        response: '{ user }'
      }
    ]
  },
  {
    name: 'Products',
    baseUrl: '/api/v1/products',
    endpoints: [
      {
        method: 'GET',
        path: '/',
        description: 'List products with filtering',
        auth: false,
        params: { category: 'string', page: 'number', limit: 'number', search: 'string' },
        response: '{ products[], total, page, limit }'
      },
      {
        method: 'GET',
        path: '/trending',
        description: 'Get trending products',
        auth: false,
        response: '{ products[] }'
      },
      {
        method: 'GET',
        path: '/bestsellers',
        description: 'Get best selling products',
        auth: false,
        response: '{ products[] }'
      },
      {
        method: 'GET',
        path: '/:id',
        description: 'Get product details',
        auth: false,
        response: '{ product, tier_pricing[] }'
      },
      {
        method: 'POST',
        path: '/',
        description: 'Create product',
        auth: true,
        roles: ['super_user', 'procurement'],
        body: { name: 'string', sku: 'string', base_price: 'number', category: 'string' },
        response: '{ product }'
      },
      {
        method: 'PUT',
        path: '/:id',
        description: 'Update product',
        auth: true,
        roles: ['super_user', 'procurement', 'inventory_admin'],
        response: '{ product }'
      },
      {
        method: 'DELETE',
        path: '/:id',
        description: 'Delete product',
        auth: true,
        roles: ['super_user', 'procurement'],
        response: '{ success: true }'
      }
    ]
  },
  {
    name: 'Inventory',
    baseUrl: '/api/v1/inventory',
    endpoints: [
      {
        method: 'GET',
        path: '/',
        description: 'List inventory items',
        auth: true,
        roles: ['super_user', 'inventory_admin'],
        params: { warehouse: 'string', low_stock: 'boolean' },
        response: '{ inventory[] }'
      },
      {
        method: 'POST',
        path: '/add-stock',
        description: 'Add stock',
        auth: true,
        roles: ['super_user', 'inventory_admin'],
        body: { product_id: 'uuid', quantity: 'number', warehouse_location: 'string' },
        response: '{ inventory, movement }'
      },
      {
        method: 'POST',
        path: '/release-stock',
        description: 'Release stock',
        auth: true,
        roles: ['super_user', 'inventory_admin'],
        body: { product_id: 'uuid', quantity: 'number' },
        response: '{ inventory, movement }'
      },
      {
        method: 'POST',
        path: '/adjust-stock',
        description: 'Adjust stock levels',
        auth: true,
        roles: ['super_user', 'inventory_admin'],
        body: { inventory_id: 'uuid', quantity: 'number', notes: 'string' },
        response: '{ inventory, movement }'
      },
      {
        method: 'GET',
        path: '/movements',
        description: 'Get stock movement history',
        auth: true,
        roles: ['super_user', 'inventory_admin'],
        params: { product_id: 'uuid', start_date: 'date', end_date: 'date' },
        response: '{ movements[] }'
      }
    ]
  },
  {
    name: 'Orders',
    baseUrl: '/api/v1/orders',
    endpoints: [
      {
        method: 'GET',
        path: '/',
        description: 'List orders',
        auth: true,
        params: { status: 'string', customer_id: 'uuid', page: 'number' },
        response: '{ orders[], total, page }'
      },
      {
        method: 'GET',
        path: '/:id',
        description: 'Get order details',
        auth: true,
        response: '{ order, items[], delivery }'
      },
      {
        method: 'POST',
        path: '/',
        description: 'Create order',
        auth: true,
        body: { items: 'array', shipping_address: 'object' },
        response: '{ order }'
      },
      {
        method: 'PUT',
        path: '/:id',
        description: 'Update order',
        auth: true,
        roles: ['super_user', 'order_processor'],
        body: { status: 'string', items: 'array' },
        response: '{ order }'
      },
      {
        method: 'DELETE',
        path: '/:id',
        description: 'Cancel order',
        auth: true,
        roles: ['super_user', 'order_processor'],
        response: '{ success: true }'
      },
      {
        method: 'POST',
        path: '/:id/assign-delivery',
        description: 'Assign delivery person',
        auth: true,
        roles: ['super_user', 'order_processor'],
        body: { delivery_person_id: 'uuid', scheduled_date: 'date' },
        response: '{ delivery }'
      }
    ]
  },
  {
    name: 'Deliveries',
    baseUrl: '/api/v1/deliveries',
    endpoints: [
      {
        method: 'GET',
        path: '/my-deliveries',
        description: 'Get assigned deliveries',
        auth: true,
        roles: ['delivery_person'],
        response: '{ deliveries[] }'
      },
      {
        method: 'PUT',
        path: '/:id/status',
        description: 'Update delivery status',
        auth: true,
        roles: ['super_user', 'delivery_person'],
        body: { status: 'string', notes: 'string' },
        response: '{ delivery }'
      },
      {
        method: 'POST',
        path: '/:id/upload-proof',
        description: 'Upload delivery proof',
        auth: true,
        roles: ['super_user', 'delivery_person'],
        body: { proof_image: 'file', signature: 'string' },
        response: '{ delivery }'
      }
    ]
  },
  {
    name: 'Invoices',
    baseUrl: '/api/v1/invoices',
    endpoints: [
      {
        method: 'GET',
        path: '/',
        description: 'List invoices',
        auth: true,
        roles: ['super_user', 'accounting'],
        params: { status: 'string', customer_id: 'uuid' },
        response: '{ invoices[] }'
      },
      {
        method: 'POST',
        path: '/generate',
        description: 'Generate invoice',
        auth: true,
        roles: ['super_user', 'accounting'],
        body: { order_id: 'uuid', due_date: 'date' },
        response: '{ invoice }'
      },
      {
        method: 'GET',
        path: '/:id/pdf',
        description: 'Download invoice PDF',
        auth: true,
        response: 'PDF file'
      }
    ]
  },
  {
    name: 'Payments',
    baseUrl: '/api/v1/payments',
    endpoints: [
      {
        method: 'POST',
        path: '/confirm',
        description: 'Confirm payment',
        auth: true,
        roles: ['super_user', 'accounting'],
        body: { invoice_id: 'uuid', amount: 'number', payment_method: 'string', transaction_id: 'string' },
        response: '{ payment }'
      },
      {
        method: 'POST',
        path: '/:id/cancel',
        description: 'Cancel payment',
        auth: true,
        roles: ['super_user', 'accounting'],
        body: { reason: 'string' },
        response: '{ payment }'
      },
      {
        method: 'POST',
        path: '/:id/reverse',
        description: 'Reverse payment',
        auth: true,
        roles: ['super_user', 'accounting'],
        body: { reason: 'string' },
        response: '{ payment }'
      }
    ]
  },
  {
    name: 'Leads',
    baseUrl: '/api/v1/leads',
    endpoints: [
      {
        method: 'GET',
        path: '/',
        description: 'List leads',
        auth: true,
        roles: ['super_user', 'salesperson'],
        params: { status: 'string', assigned_to: 'uuid' },
        response: '{ leads[] }'
      },
      {
        method: 'POST',
        path: '/',
        description: 'Create lead',
        auth: true,
        roles: ['super_user', 'salesperson'],
        body: { company_name: 'string', contact_person: 'string', email: 'string', phone: 'string' },
        response: '{ lead }'
      },
      {
        method: 'PUT',
        path: '/:id',
        description: 'Update lead',
        auth: true,
        roles: ['super_user', 'salesperson'],
        body: { status: 'string', notes: 'string' },
        response: '{ lead }'
      }
    ]
  },
  {
    name: 'Meetings',
    baseUrl: '/api/v1/meetings',
    endpoints: [
      {
        method: 'GET',
        path: '/',
        description: 'List meetings',
        auth: true,
        roles: ['super_user', 'salesperson'],
        params: { lead_id: 'uuid', start_date: 'date' },
        response: '{ meetings[] }'
      },
      {
        method: 'POST',
        path: '/',
        description: 'Schedule meeting',
        auth: true,
        roles: ['super_user', 'salesperson'],
        body: { lead_id: 'uuid', title: 'string', scheduled_at: 'datetime', duration_minutes: 'number' },
        response: '{ meeting }'
      },
      {
        method: 'PUT',
        path: '/:id/outcome',
        description: 'Update meeting outcome',
        auth: true,
        roles: ['super_user', 'salesperson'],
        body: { outcome: 'enum(landed,no,requires_info)', notes: 'string' },
        response: '{ meeting }'
      }
    ]
  },
  {
    name: 'Contracts',
    baseUrl: '/api/v1/contracts',
    endpoints: [
      {
        method: 'GET',
        path: '/',
        description: 'List contracts',
        auth: true,
        roles: ['super_user', 'finance_contracts'],
        params: { party_type: 'string', status: 'string', expiring_soon: 'boolean' },
        response: '{ contracts[] }'
      },
      {
        method: 'POST',
        path: '/',
        description: 'Create contract',
        auth: true,
        roles: ['super_user', 'finance_contracts'],
        body: { party_type: 'enum', party_id: 'uuid', title: 'string', start_date: 'date', end_date: 'date' },
        response: '{ contract }'
      },
      {
        method: 'PUT',
        path: '/:id',
        description: 'Update contract',
        auth: true,
        roles: ['super_user', 'finance_contracts'],
        response: '{ contract }'
      },
      {
        method: 'POST',
        path: '/:id/upload-document',
        description: 'Upload contract document',
        auth: true,
        roles: ['super_user', 'finance_contracts'],
        body: { document: 'file' },
        response: '{ contract }'
      }
    ]
  },
  {
    name: 'Vendors',
    baseUrl: '/api/v1/vendors',
    endpoints: [
      {
        method: 'GET',
        path: '/',
        description: 'List vendors',
        auth: true,
        roles: ['super_user', 'procurement'],
        params: { status: 'string' },
        response: '{ vendors[] }'
      },
      {
        method: 'POST',
        path: '/',
        description: 'Onboard vendor',
        auth: true,
        roles: ['super_user', 'procurement'],
        body: { name: 'string', contact_person: 'string', email: 'string', phone: 'string' },
        response: '{ vendor }'
      },
      {
        method: 'PUT',
        path: '/:id',
        description: 'Update vendor',
        auth: true,
        roles: ['super_user', 'procurement'],
        response: '{ vendor }'
      },
      {
        method: 'POST',
        path: '/:id/pricing',
        description: 'Add/update vendor pricing',
        auth: true,
        roles: ['super_user', 'procurement'],
        body: { product_id: 'uuid', cost_price: 'number', moq: 'number' },
        response: '{ vendor_pricing }'
      }
    ]
  },
  {
    name: 'Analytics',
    baseUrl: '/api/v1/analytics',
    endpoints: [
      {
        method: 'GET',
        path: '/dashboard',
        description: 'Get dashboard analytics',
        auth: true,
        roles: ['super_user', 'accounting'],
        params: { start_date: 'date', end_date: 'date' },
        response: '{ revenue, orders, customers, growth }'
      },
      {
        method: 'GET',
        path: '/sales-report',
        description: 'Generate sales report',
        auth: true,
        roles: ['super_user', 'accounting'],
        params: { period: 'string', group_by: 'string' },
        response: '{ report_data[] }'
      },
      {
        method: 'GET',
        path: '/inventory-report',
        description: 'Generate inventory report',
        auth: true,
        roles: ['super_user', 'inventory_admin'],
        response: '{ report_data[] }'
      }
    ]
  },
  {
    name: 'Audit Logs',
    baseUrl: '/api/v1/audit',
    endpoints: [
      {
        method: 'GET',
        path: '/logs',
        description: 'Get audit logs',
        auth: true,
        roles: ['super_user', 'it_administrator'],
        params: { user_id: 'uuid', entity_type: 'string', start_date: 'date', page: 'number' },
        response: '{ logs[], total, page }'
      },
      {
        method: 'GET',
        path: '/logs/:id',
        description: 'Get detailed log entry',
        auth: true,
        roles: ['super_user', 'it_administrator'],
        response: '{ log }'
      }
    ]
  }
];
