import { useRoutes } from "react-router-dom";
import AuthenticationPortal from "./pages/secure-authentication-portal";
import FinancialDashboard from "./pages/financial-reporting-dashboard";
import BillingManagement from "./pages/billing-and-invoice-management";
import ClientManagement from "./pages/client-profile-management";
import InventoryControl from "./pages/inventory-control-center";
import WorkOrderManagement from "./pages/work-order-management-system";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

const ProjectRoutes = () => {
  let element = useRoutes([
    // ✅ LOGIN COMO PÁGINA PRINCIPAL (PÚBLICAS)
    {
      path: "/",
      element: <AuthenticationPortal />
    },
    {
      path: "/login",
      element: <AuthenticationPortal />
    },
    
    // Dashboard financiero - PROTEGIDO
    {
      path: "/dashboard",
      element: (
        <ProtectedRoute>
          <FinancialDashboard />
        </ProtectedRoute>
      )
    },
    {
      path: "/financial",
      element: (
        <ProtectedRoute>
          <FinancialDashboard />
        </ProtectedRoute>
      )
    },
    
    // Gestión de facturación - PROTEGIDO
    {
      path: "/billing",
      element: (
        <ProtectedRoute>
          <BillingManagement />
        </ProtectedRoute>
      )
    },
    {
      path: "/invoices",
      element: (
        <ProtectedRoute>
          <BillingManagement />
        </ProtectedRoute>
      )
    },
    
    // Gestión de clientes - PROTEGIDO
    {
      path: "/clients",
      element: (
        <ProtectedRoute>
          <ClientManagement />
        </ProtectedRoute>
      )
    },
    {
      path: "/client-profiles",
      element: (
        <ProtectedRoute>
          <ClientManagement />
        </ProtectedRoute>
      )
    },
    
    // Control de inventario - PROTEGIDO
    {
      path: "/inventory",
      element: (
        <ProtectedRoute>
          <InventoryControl />
        </ProtectedRoute>
      )
    },
    {
      path: "/stock",
      element: (
        <ProtectedRoute>
          <InventoryControl />
        </ProtectedRoute>
      )
    },
    
    // Sistema de órdenes de trabajo - PROTEGIDO
    {
      path: "/work-orders",
      element: (
        <ProtectedRoute>
          <WorkOrderManagement />
        </ProtectedRoute>
      )
    },
    {
      path: "/orders",
      element: (
        <ProtectedRoute>
          <WorkOrderManagement />
        </ProtectedRoute>
      )
    },
    
    // ✅ 404 SIEMPRE AL FINAL
    {
      path: "*",
      element: <NotFound />
    }
  ]);

  return element;
};

export default ProjectRoutes;