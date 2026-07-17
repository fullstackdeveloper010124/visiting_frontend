import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import React, { useState, useEffect, Suspense, lazy } from 'react';
import type { UserRole } from './types/roles';

const AppSidebar = lazy(() => import('./components/AppSidebar').then(mod => ({ default: (mod as any).AppSidebar } as any)));
const EnhancedUserDashboard = lazy(() => import('./components/EnhancedUserDashboard').then(mod => ({ default: (mod as any).EnhancedUserDashboard } as any)));
const AdminDashboard = lazy(() => import('./components/AdminDashboard').then(mod => ({ default: (mod as any).AdminDashboard } as any)));
const InventoryAdminDashboard = lazy(() => import('./components/InventoryAdminDashboard').then(mod => ({ default: (mod as any).InventoryAdminDashboard } as any)));
const OrderProcessorDashboard = lazy(() => import('./components/OrderProcessorDashboard').then(mod => ({ default: (mod as any).OrderProcessorDashboard } as any)));
const DeliveryPersonDashboard = lazy(() => import('./components/DeliveryPersonDashboard').then(mod => ({ default: (mod as any).DeliveryPersonDashboard } as any)));
const AccountingDashboard = lazy(() => import('./components/AccountingDashboard').then(mod => ({ default: (mod as any).AccountingDashboard } as any)));
const SalespersonDashboard = lazy(() => import('./components/SalespersonDashboard').then(mod => ({ default: (mod as any).SalespersonDashboard } as any)));
const FinanceContractsDashboard = lazy(() => import('./components/FinanceContractsDashboard').then(mod => ({ default: (mod as any).FinanceContractsDashboard } as any)));
const ProcurementDashboard = lazy(() => import('./components/ProcurementDashboard').then(mod => ({ default: (mod as any).ProcurementDashboard } as any)));
const ITAdministratorDashboard = lazy(() => import('./components/ITAdministratorDashboard').then(mod => ({ default: (mod as any).ITAdministratorDashboard } as any)));
const SystemDocumentation = lazy(() => import('./components/SystemDocumentation').then(mod => ({ default: (mod as any).SystemDocumentation } as any)));
const AuditLogsPage = lazy(() => import('./components/AuditLogsPage').then(mod => ({ default: (mod as any).AuditLogsPage } as any)));
const WorkflowDiagrams = lazy(() => import('./components/WorkflowDiagrams').then(mod => ({ default: (mod as any).WorkflowDiagrams } as any)));
const ProductsPage = lazy(() => import('./components/ProductsPage').then(mod => ({ default: (mod as any).ProductsPage } as any)));
const CustomizePage = lazy(() => import('./components/CustomizePage').then(mod => ({ default: (mod as any).CustomizePage } as any)));
const ApproveCardDesignPage = lazy(() => import('./components/ApproveCardDesignPage').then(mod => ({ default: (mod as any).ApproveCardDesignPage } as any)));
const LetterheadsCustomizePage = lazy(() => import('./components/LetterheadsCustomizePage').then(mod => ({ default: (mod as any).LetterheadsCustomizePage } as any)));
const EnvelopesCustomizePage = lazy(() => import('./components/EnvelopesCustomizePage').then(mod => ({ default: (mod as any).EnvelopesCustomizePage } as any)));
const NotepadsCustomizePage = lazy(() => import('./components/NotepadsCustomizePage').then(mod => ({ default: (mod as any).NotepadsCustomizePage } as any)));
const FoldersCustomizePage = lazy(() => import('./components/FoldersCustomizePage').then(mod => ({ default: (mod as any).FoldersCustomizePage } as any)));
const SlipsCustomizePage = lazy(() => import('./components/SlipsCustomizePage').then(mod => ({ default: (mod as any).SlipsCustomizePage } as any)));
const OrdersPage = lazy(() => import('./components/OrdersPage').then(mod => ({ default: (mod as any).OrdersPage } as any)));
const InventoryPage = lazy(() => import('./components/InventoryPage').then(mod => ({ default: (mod as any).InventoryPage } as any)));
const AnalyticsPage = lazy(() => import('./components/AnalyticsPage').then(mod => ({ default: (mod as any).AnalyticsPage } as any)));
const LoginPage = lazy(() => import('./components/LoginPage').then(mod => ({ default: (mod as any).LoginPage } as any)));
const SignupPage = lazy(() => import('./components/SignupPage').then(mod => ({ default: (mod as any).SignupPage } as any)));
const UserInventoryPage = lazy(() => import('./components/UserInventoryPage').then(mod => ({ default: (mod as any).UserInventoryPage } as any)));
const UpdateProductPage = lazy(() => import('./components/UpdateProductPage').then(mod => ({ default: (mod as any).UpdateProductPage } as any)));
const UserProfilePage = lazy(() => import('./components/UserProfilePage').then(mod => ({ default: (mod as any).UserProfilePage } as any)));
const UserAnalyticsPage = lazy(() => import('./components/UserAnalyticsPage').then(mod => ({ default: (mod as any).UserAnalyticsPage } as any)));
const HelpPage = lazy(() => import('./components/HelpPage').then(mod => ({ default: (mod as any).HelpPage } as any)));
const SettingsPage = lazy(() => import('./components/SettingsPage').then(mod => ({ default: (mod as any).SettingsPage } as any)));

function App() {
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const storedRole = localStorage.getItem('userRole') as UserRole | null;

      if (!token) {
        localStorage.removeItem('userRole');
        setUserRole(null);
        setLoading(false);
        return;
      }

      if (storedRole) {
        setUserRole(storedRole);
      }

      try {
        const response = await fetch('/api/v1/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const resData = await response.json();

        if (response.ok && resData.success) {
          setUserRole(resData.data.role);
          localStorage.setItem('userRole', resData.data.role);
          localStorage.setItem('userName', resData.data.fullName);
          localStorage.setItem('userEmail', resData.data.email);
        } else {
          localStorage.removeItem('token');
          localStorage.removeItem('userRole');
          localStorage.removeItem('userName');
          localStorage.removeItem('userEmail');
          setUserRole(null);
        }
      } catch (error) {
        console.error('Error fetching current user:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogin = (role: UserRole) => {
    setUserRole(role);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    setUserRole(null);
  };

  const getDashboardComponent = () => {
    if (!userRole) return <Navigate to="/login" />;

    switch (userRole) {
      case 'super_user':
        return <AdminDashboard onMenuClick={() => setSidebarOpen(true)} />;
      case 'inventory_admin':
        return <InventoryAdminDashboard onMenuClick={() => setSidebarOpen(true)} />;
      case 'order_processor':
        return <OrderProcessorDashboard onMenuClick={() => setSidebarOpen(true)} />;
      case 'delivery_person':
        return <DeliveryPersonDashboard onMenuClick={() => setSidebarOpen(true)} />;
      case 'accounting':
        return <AccountingDashboard onMenuClick={() => setSidebarOpen(true)} />;
      case 'salesperson':
        return <SalespersonDashboard onMenuClick={() => setSidebarOpen(true)} />;
      case 'finance_contracts':
        return <FinanceContractsDashboard onMenuClick={() => setSidebarOpen(true)} />;
      case 'procurement':
        return <ProcurementDashboard onMenuClick={() => setSidebarOpen(true)} />;
      case 'it_administrator':
        return <ITAdministratorDashboard onMenuClick={() => setSidebarOpen(true)} />;
      default:
        return <EnhancedUserDashboard onMenuClick={() => setSidebarOpen(true)} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-full border-4 border-t-primary border-r-transparent animate-spin"></div>
          <p className="text-sm font-medium text-muted-foreground animate-pulse">Verifying credentials...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="flex h-screen overflow-hidden bg-background">
        <Suspense fallback={<div className="p-4">Loading...</div>}>
          {/* Sidebar */}
          {userRole && (
            <AppSidebar
              userRole={userRole}
              isOpen={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
              onLogout={handleLogout}
            />
          )}

          {/* Main Content */}
          <div className="flex-1 overflow-hidden flex flex-col">
            <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={userRole ? <Navigate to="/" /> : <LoginPage onLogin={handleLogin} />} />
            <Route path="/signup" element={userRole ? <Navigate to="/" /> : <SignupPage onSignup={handleLogin} />} />
            <Route path="/approve-card-design/:approvalId" element={<ApproveCardDesignPage />} />

            {/* Dashboard Route */}
            <Route
              path="/"
              element={getDashboardComponent()}
            />

            {/* User Routes */}
            <Route
              path="/products"
              element={userRole && ['user', 'super_user', 'procurement'].includes(userRole) ? <ProductsPage onMenuClick={() => setSidebarOpen(true)} userRole={userRole} /> : <Navigate to="/login" />}
            />
            <Route
              path="/customize"
              element={userRole && ['user', 'super_user'].includes(userRole) ? <CustomizePage onMenuClick={() => setSidebarOpen(true)} userRole={userRole} /> : <Navigate to="/login" />}
            />
            <Route
              path="/customize-letterheads"
              element={userRole && ['user', 'super_user'].includes(userRole) ? <LetterheadsCustomizePage onMenuClick={() => setSidebarOpen(true)} /> : <Navigate to="/login" />}
            />
            <Route
              path="/customize-envelopes"
              element={userRole && ['user', 'super_user'].includes(userRole) ? <EnvelopesCustomizePage onMenuClick={() => setSidebarOpen(true)} /> : <Navigate to="/login" />}
            />
            <Route
              path="/customize-notepads"
              element={userRole && ['user', 'super_user'].includes(userRole) ? <NotepadsCustomizePage onMenuClick={() => setSidebarOpen(true)} /> : <Navigate to="/login" />}
            />
            <Route
              path="/customize-folders"
              element={userRole && ['user', 'super_user'].includes(userRole) ? <FoldersCustomizePage onMenuClick={() => setSidebarOpen(true)} /> : <Navigate to="/login" />}
            />
            <Route
              path="/customize-slips"
              element={userRole && ['user', 'super_user'].includes(userRole) ? <SlipsCustomizePage onMenuClick={() => setSidebarOpen(true)} /> : <Navigate to="/login" />}
            />
            <Route
              path="/orders"
              element={userRole && ['user', 'super_user', 'accounting', 'order_processor'].includes(userRole) ? <OrdersPage userRole={userRole} onMenuClick={() => setSidebarOpen(true)} /> : <Navigate to="/login" />}
            />
            <Route
              path="/inventory"
              element={userRole && ['user', 'super_user', 'procurement'].includes(userRole) ? <InventoryPage onMenuClick={() => setSidebarOpen(true)} /> : <Navigate to="/login" />}
            />

            {/* Additional User Dashboard Routes */}
            <Route
              path="/user-inventory"
              element={userRole === 'user' ? <UserInventoryPage onMenuClick={() => setSidebarOpen(true)} /> : <Navigate to="/login" />}
            />
            <Route
              path="/update-product"
              element={userRole === 'user' ? <UpdateProductPage onMenuClick={() => setSidebarOpen(true)} /> : <Navigate to="/login" />}
            />
            <Route
              path="/profile"
              element={userRole === 'user' ? <UserProfilePage onMenuClick={() => setSidebarOpen(true)} /> : <Navigate to="/login" />}
            />
            <Route
              path="/user-analytics"
              element={userRole === 'user' ? <UserAnalyticsPage onMenuClick={() => setSidebarOpen(true)} /> : <Navigate to="/login" />}
            />
            <Route
              path="/help"
              element={userRole === 'user' ? <HelpPage onMenuClick={() => setSidebarOpen(true)} /> : <Navigate to="/login" />}
            />
            <Route
              path="/settings"
              element={userRole ? <SettingsPage onMenuClick={() => setSidebarOpen(true)} /> : <Navigate to="/login" />}
            />

            {/* Role-Specific Dashboard Routes */}
            <Route
              path="/deliveries"
              element={userRole && ['super_user', 'delivery_person'].includes(userRole) ? <DeliveryPersonDashboard onMenuClick={() => setSidebarOpen(true)} /> : <Navigate to="/login" />}
            />
            <Route
              path="/accounting"
              element={userRole && ['super_user', 'accounting'].includes(userRole) ? <AccountingDashboard onMenuClick={() => setSidebarOpen(true)} /> : <Navigate to="/login" />}
            />
            <Route
              path="/sales"
              element={userRole && ['super_user', 'salesperson'].includes(userRole) ? <SalespersonDashboard onMenuClick={() => setSidebarOpen(true)} /> : <Navigate to="/login" />}
            />
            <Route
              path="/finance"
              element={userRole && ['super_user', 'finance_contracts'].includes(userRole) ? <FinanceContractsDashboard onMenuClick={() => setSidebarOpen(true)} /> : <Navigate to="/login" />}
            />
            <Route
              path="/procurement"
              element={userRole && ['super_user', 'procurement'].includes(userRole) ? <ProcurementDashboard onMenuClick={() => setSidebarOpen(true)} /> : <Navigate to="/login" />}
            />

            {/* Admin Routes */}
            <Route
              path="/admin/inventory"
              element={userRole && ['super_user', 'inventory_admin'].includes(userRole) ? <InventoryPage onMenuClick={() => setSidebarOpen(true)} /> : <Navigate to="/login" />}
            />
            <Route
              path="/admin/analytics"
              element={userRole && ['super_user', 'accounting', 'salesperson'].includes(userRole) ? <AnalyticsPage onMenuClick={() => setSidebarOpen(true)} /> : <Navigate to="/login" />}
            />
            <Route
              path="/admin/users"
              element={userRole && ['super_user', 'it_administrator'].includes(userRole) ? <ITAdministratorDashboard onMenuClick={() => setSidebarOpen(true)} /> : <Navigate to="/login" />}
            />

            {/* System Routes */}
            <Route
              path="/system/documentation"
              element={userRole && ['super_user', 'it_administrator'].includes(userRole) ? <SystemDocumentation onMenuClick={() => setSidebarOpen(true)} /> : <Navigate to="/login" />}
            />
            <Route
              path="/system/audit-logs"
              element={userRole && ['super_user', 'it_administrator'].includes(userRole) ? <AuditLogsPage onMenuClick={() => setSidebarOpen(true)} /> : <Navigate to="/login" />}
            />
            <Route
              path="/system/workflow-diagrams"
              element={userRole && ['super_user', 'it_administrator'].includes(userRole) ? <WorkflowDiagrams onMenuClick={() => setSidebarOpen(true)} /> : <Navigate to="/login" />}
            />

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </Suspense>
      </div>
    </BrowserRouter>
  );
}

export default App;