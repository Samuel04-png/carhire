import { Navigate, useLocation } from "react-router-dom";
import { useAppStore } from "@/store/use-app-store";
import { AdminBookingsScreen } from "@/components/admin/screens/AdminBookingsScreen";
import { AdminAgreementsScreen } from "@/components/admin/screens/AdminAgreementsScreen";
import { AdminClientsScreen } from "@/components/admin/screens/AdminClientsScreen";
import { AdminDashboardScreen } from "@/components/admin/screens/AdminDashboardScreen";
import { AdminDriversScreen } from "@/components/admin/screens/AdminDriversScreen";
import { AdminFleetScreen } from "@/components/admin/screens/AdminFleetScreen";
import { AdminReportsScreen } from "@/components/admin/screens/AdminReportsScreen";
import { AdminSettingsScreen } from "@/components/admin/screens/AdminSettingsScreen";
import { AdminUsersScreen } from "@/components/admin/screens/AdminUsersScreen";

export default function AdminPortalPage() {
  const location = useLocation();
  const adminRole = useAppStore((state) => state.adminRole);

  if (!adminRole) {
    return <Navigate to="/admin/login" replace />;
  }

  const path = location.pathname;

  if (path.includes("/admin/bookings/new")) {
    return <AdminBookingsScreen createMode />;
  }
  if (path.includes("/admin/bookings")) {
    return <AdminBookingsScreen />;
  }
  if (path.includes("/admin/fleet")) {
    return <AdminFleetScreen />;
  }
  if (path.includes("/admin/agreements")) {
    return <AdminAgreementsScreen />;
  }
  if (path.includes("/admin/users")) {
    return <AdminUsersScreen />;
  }
  if (path.includes("/admin/clients")) {
    return <AdminClientsScreen />;
  }
  if (path.includes("/admin/drivers")) {
    return <AdminDriversScreen />;
  }
  if (path.includes("/admin/reports")) {
    return <AdminReportsScreen />;
  }
  if (path.includes("/admin/settings")) {
    return <AdminSettingsScreen />;
  }

  return <AdminDashboardScreen />;
}
