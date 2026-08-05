import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Users, Shield, Key, Activity, AlertTriangle, CheckCircle, Menu, Loader2 } from 'lucide-react';
import { StatsCard } from './StatsCard';
import { ROLES_CONFIG } from '../types/roles';

interface ITAdministratorDashboardProps {
  onMenuClick?: () => void;
}

export function ITAdministratorDashboard({ onMenuClick }: ITAdministratorDashboardProps) {
  const [usersList, setUsersList] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const systemActivity = [
    { id: 1, event: 'User database loaded', user: 'System', timestamp: new Date().toLocaleTimeString(), status: 'success' },
    { id: 2, event: 'Audit session started', user: 'Admin', timestamp: new Date().toLocaleTimeString(), status: 'success' },
  ];

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/v1/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setUsersList(data.data);
      } else {
        setError(data.error || 'Failed to fetch users.');
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to fetch users. Is the backend server running?');
    } finally {
      setLoading(false);
    }
  };

  // Products for admin to choose when sending preview approval
  const [products, setProducts] = useState<any[]>([]);
  const [approvalModalOpen, setApprovalModalOpen] = useState(false);
  const [selectedUserForApproval, setSelectedUserForApproval] = useState<any | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [sendingApproval, setSendingApproval] = useState(false);
  const [approvalUrl, setApprovalUrl] = useState<string | null>(null);
  const [approvalError, setApprovalError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/v1/products');
      const data = await res.json();
      if (res.ok && data.success) setProducts(data.data);
    } catch (err) {
      console.error('Failed to load products for approval modal:', err);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchProducts();
  }, []);

  const handleApproveAndSend = async () => {
    if (!selectedUserForApproval) return;
    setSendingApproval(true);
    setApprovalError(null);

    try {
      const token = localStorage.getItem('token');

      // Ensure user is activated
      const activateRes = await fetch(`/api/v1/users/${selectedUserForApproval._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'active' })
      });
      const activateData = await activateRes.json();
      if (!activateRes.ok || !activateData.success) {
        throw new Error(activateData.error || 'Failed to activate user');
      }

      // find selected product
      const product = products.find(p => p._id === selectedProductId) || products[0];
      const sku = product?.sku || '';
      let designType = 'business_card';
      if (sku.startsWith('LH')) designType = 'letterhead';
      else if (sku.startsWith('EV')) designType = 'envelope';
      else if (sku.startsWith('NP')) designType = 'notepad';
      else if (sku.startsWith('FL')) designType = 'folder';
      else if (sku.startsWith('CS')) designType = 'slip';

      const designDetails = {
        productId: product?._id,
        productName: product?.name,
        sku: product?.sku
      };

      // Send approval email to the user by creating a CardApproval
      const sendRes = await fetch('/api/v1/customize-config/send-approval-to-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ userId: selectedUserForApproval._id, userEmail: selectedUserForApproval.email, designDetails, designType })
      });
      const sendData = await sendRes.json();
      if (!sendRes.ok || !sendData.success) {
        throw new Error(sendData.error || 'Failed to send approval email');
      }

      setApprovalUrl(sendData.approvalUrl || null);
      // Update local users list status
      setUsersList(prev => prev.map(u => u._id === selectedUserForApproval._id ? { ...u, status: 'active' } : u));
    } catch (err: any) {
      console.error('Error in approve-and-send:', err);
      setApprovalError(err?.message || 'Approval send failed');
    } finally {
      setSendingApproval(false);
    }
  };

  const handleUpdateStatus = async (userId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/v1/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setUsersList(prev => prev.map(u => u._id === userId ? { ...u, status: newStatus } : u));
      } else {
        alert(data.error || 'Failed to update user status.');
      }
    } catch (err) {
      console.error('Error updating user status:', err);
      alert('Error updating user status.');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/v1/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setUsersList(prev => prev.filter(u => u._id !== userId));
      } else {
        alert(data.error || 'Failed to delete user.');
      }
    } catch (err) {
      console.error('Error deleting user:', err);
      alert('Error deleting user.');
    }
  };

  const activeUsersCount = usersList.filter(u => u.status === 'active').length;
  const pendingUsersCount = usersList.filter(u => u.status === 'pending').length;

  return (
    <div className="flex-1 overflow-auto bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b border-border">
        <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={onMenuClick}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-semibold">IT Administration</h1>
              <p className="text-sm text-muted-foreground">User management and access control</p>
            </div>
          </div>
          <Button onClick={fetchUsers} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Users className="h-4 w-4 mr-2" />}
            Refresh List
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Users"
            value={usersList.length.toString()}
            icon={Users}
          />
          <StatsCard
            title="Active Users"
            value={activeUsersCount.toString()}
            icon={CheckCircle}
            iconColor="text-green-500"
          />
          <StatsCard
            title="Pending Approval"
            value={pendingUsersCount.toString()}
            icon={AlertTriangle}
            iconColor="text-yellow-500"
          />
          <StatsCard
            title="Total Roles"
            value={ROLES_CONFIG.length.toString()}
            icon={Shield}
            iconColor="text-blue-500"
          />
        </div>

        <Tabs defaultValue="users" className="space-y-4">
          <TabsList>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
            <TabsTrigger value="activity">System Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>User Directory</CardTitle>
                <CardDescription>Manage system users and their access</CardDescription>
              </CardHeader>
              <CardContent>
                {loading && usersList.length === 0 ? (
                  <div className="flex items-center justify-center p-12">
                    <Loader2 className="h-8 w-8 text-primary animate-spin mr-2" />
                    <span className="text-muted-foreground text-sm font-medium">Loading user data...</span>
                  </div>
                ) : error ? (
                  <div className="p-4 text-center text-sm text-destructive bg-destructive/10 border border-destructive/25 rounded-md">
                    {error}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Joined Date</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {usersList.map((user) => {
                          const roleConfig = ROLES_CONFIG.find(r => r.id === user.role);
                          return (
                            <TableRow key={user._id}>
                              <TableCell className="font-medium">{user.fullName}</TableCell>
                              <TableCell className="text-sm">{user.email}</TableCell>
                              <TableCell>
                                <Badge className={(roleConfig?.color || 'bg-slate-500') + ' text-white'}>
                                  {roleConfig?.name || user.role}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {user.status === 'active' ? (
                                  <Badge className="bg-green-500/10 text-green-700 dark:text-green-400">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Active
                                  </Badge>
                                ) : user.status === 'pending' ? (
                                  <Badge className="bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 animate-pulse">
                                    <AlertTriangle className="h-3 w-3 mr-1" />
                                    Pending
                                  </Badge>
                                ) : user.status === 'suspended' ? (
                                  <Badge className="bg-red-500/10 text-red-700 dark:text-red-400">
                                    <AlertTriangle className="h-3 w-3 mr-1" />
                                    Suspended
                                  </Badge>
                                ) : (
                                  <Badge className="bg-gray-500/10 text-gray-700 dark:text-gray-400">
                                    {user.status}
                                  </Badge>
                                )}
                              </TableCell>
                              <TableCell className="text-sm text-muted-foreground">
                                {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  {user.status === 'pending' && (
                                    <>
                                      <Button 
                                        size="sm" 
                                        className="bg-green-600 hover:bg-green-700 text-white font-medium shadow-sm transition-colors"
                                        onClick={() => handleUpdateStatus(user._id, 'active')}
                                      >
                                        Approve
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="ml-1 font-medium"
                                        onClick={() => {
                                          setSelectedUserForApproval(user);
                                          setApprovalModalOpen(true);
                                          setApprovalUrl(null);
                                          setSelectedProductId(products?.[0]?._id || null);
                                          setApprovalError(null);
                                        }}
                                      >
                                        Approve & Send
                                      </Button>
                                    </>
                                  )}
                                  {user.status === 'active' && (
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      className="text-yellow-600 border-yellow-600/30 hover:bg-yellow-50 dark:hover:bg-yellow-950/20 font-medium"
                                      onClick={() => handleUpdateStatus(user._id, 'suspended')}
                                    >
                                      Suspend
                                    </Button>
                                  )}
                                  {(user.status === 'suspended' || user.status === 'inactive') && (
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      className="text-green-600 border-green-600/30 hover:bg-green-50 dark:hover:bg-green-950/20 font-medium"
                                      onClick={() => handleUpdateStatus(user._id, 'active')}
                                    >
                                      Activate
                                    </Button>
                                  )}
                                  <Button 
                                    size="sm" 
                                    variant="destructive"
                                    className="font-medium"
                                    onClick={() => handleDeleteUser(user._id)}
                                  >
                                    Delete
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="roles" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Role-Permission Matrix</CardTitle>
                <CardDescription>System roles and their access permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {ROLES_CONFIG.map((role) => (
                    <div key={role.id} className="border border-border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Shield className="h-5 w-5" />
                            <span className="font-semibold">{role.name}</span>
                            <Badge className={role.color + ' text-white'}>
                              {role.id}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{role.description}</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-sm font-medium">Permissions:</div>
                        <div className="flex flex-wrap gap-2">
                          {role.permissions.map((perm, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {perm.module}: {perm.actions.join(', ')}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>System Activity Log</CardTitle>
                <CardDescription>Recent system events and user actions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {systemActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start justify-between p-4 border border-border rounded-lg">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${
                          activity.status === 'success' ? 'bg-green-500/10' : 'bg-red-500/10'
                        }`}>
                          {activity.status === 'success' ? (
                            <Activity className="h-5 w-5 text-green-600" />
                          ) : (
                            <AlertTriangle className="h-5 w-5 text-red-600" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{activity.event}</div>
                          <div className="text-sm text-muted-foreground">
                            User: {activity.user}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        {activity.status === 'success' ? (
                          <Badge className="bg-green-500/10 text-green-700 dark:text-green-400 mb-2">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Success
                          </Badge>
                        ) : (
                          <Badge className="bg-red-500/10 text-red-700 dark:text-red-400 mb-2">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Failed
                          </Badge>
                        )}
                        <div className="text-sm text-muted-foreground">{activity.timestamp}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>Current system health and performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Server Uptime</span>
                  <Badge className="bg-green-500/10 text-green-700 dark:text-green-400">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Healthy
                  </Badge>
                </div>
                <div className="text-2xl font-semibold">99.9%</div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-green-500" style={{ width: '99.9%' }}></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Database Health</span>
                  <Badge className="bg-green-500/10 text-green-700 dark:text-green-400">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Good
                  </Badge>
                </div>
                <div className="text-2xl font-semibold">97.5%</div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-green-500" style={{ width: '97.5%' }}></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">API Response Time</span>
                  <Badge className="bg-blue-500/10 text-blue-700 dark:text-blue-400">
                    Optimal
                  </Badge>
                </div>
                <div className="text-2xl font-semibold">145ms</div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500" style={{ width: '85%' }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {approvalModalOpen && selectedUserForApproval && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-md bg-background border border-border rounded-lg shadow-xl p-6">
            <h3 className="text-lg font-bold">Approve & Send Preview</h3>
            <p className="text-sm text-muted-foreground mt-1">Send a product preview approval link to <span className="font-semibold">{selectedUserForApproval.email}</span></p>

            <div className="mt-4">
              <label className="block text-sm font-medium text-muted-foreground">Select Product</label>
              <select
                className="w-full mt-2 p-2 border border-border rounded"
                value={selectedProductId || ''}
                onChange={(e) => setSelectedProductId(e.target.value)}
              >
                {products.map((p) => (
                  <option key={p._id} value={p._id}>{p.name} — {p.sku}</option>
                ))}
              </select>
            </div>

            {approvalError && <div className="text-sm text-destructive mt-3">{approvalError}</div>}

            <div className="mt-6 flex items-center justify-end gap-2">
              <Button variant="outline" onClick={() => { setApprovalModalOpen(false); setSelectedUserForApproval(null); setApprovalUrl(null); }}>
                Close
              </Button>
              {approvalUrl ? (
                <a href={approvalUrl} target="_blank" rel="noreferrer">
                  <Button>
                    Go To Approval
                  </Button>
                </a>
              ) : (
                <Button onClick={handleApproveAndSend} disabled={sendingApproval}>
                  {sendingApproval ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                  Approve & Send
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}