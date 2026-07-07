import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { AppSidebar } from './components/AppSidebar';
import { EnhancedUserDashboard } from './components/EnhancedUserDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { InventoryAdminDashboard } from './components/InventoryAdminDashboard';
import { OrderProcessorDashboard } from './components/OrderProcessorDashboard';
import { DeliveryPersonDashboard } from './components/DeliveryPersonDashboard';
import { AccountingDashboard } from './components/AccountingDashboard';
import { SalespersonDashboard } from './components/SalespersonDashboard';
import { FinanceContractsDashboard } from './components/FinanceContractsDashboard';
import { ProcurementDashboard } from './components/ProcurementDashboard';
import { ITAdministratorDashboard } from './components/ITAdministratorDashboard';
import { SystemDocumentation } from './components/SystemDocumentation';
import { AuditLogsPage } from './components/AuditLogsPage';
import { WorkflowDiagrams } from './components/WorkflowDiagrams';
import { ProductsPage } from './components/ProductsPage';
import { CustomizePage } from './components/CustomizePage';
import { ApproveCardDesignPage } from './components/ApproveCardDesignPage';
import { LetterheadsCustomizePage } from './components/LetterheadsCustomizePage';
import { EnvelopesCustomizePage } from './components/EnvelopesCustomizePage';
import { NotepadsCustomizePage } from './components/NotepadsCustomizePage';
import { FoldersCustomizePage } from './components/FoldersCustomizePage';
import { SlipsCustomizePage } from './components/SlipsCustomizePage';
import { OrdersPage } from './components/OrdersPage';
import { InventoryPage } from './components/InventoryPage';
import { AnalyticsPage } from './components/AnalyticsPage';
import { LoginPage } from './components/LoginPage';
import { SignupPage } from './components/SignupPage';
import { UserInventoryPage } from './components/UserInventoryPage';
import { UpdateProductPage } from './components/UpdateProductPage';
import { UserProfilePage } from './components/UserProfilePage';
import { UserAnalyticsPage } from './components/UserAnalyticsPage';
import { HelpPage } from './components/HelpPage';
import { SettingsPage } from './components/SettingsPage';
import { Button } from './components/ui/button';
import type { UserRole } from './types/roles';

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
        } else {
          localStorage.removeItem('token');
          localStorage.removeItem('userRole');
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
      </div>
    </BrowserRouter>
  );
}

export default App;