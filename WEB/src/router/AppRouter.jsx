import { Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import MainLayout from '../shared/components/Layout/MainLayout';
import LoginPage from '../features/auth/pages/LoginPage';
import DashboardPage from '../features/dashboard/pages/DashboardPage';
import MapPage from '../features/map/pages/MapPage';
import AlertsPage from '../features/alerts/pages/AlertsPage';
import FleetPage from '../features/fleet/pages/FleetPage';

/**
 * Router principal de la aplicación
 */
const AppRouter = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <Routes>
       
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />}
        />

        <Route
          path="/"
          element={isAuthenticated ? <MainLayout /> : <Navigate to="/login" replace />}
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="map" element={<MapPage />} />
          <Route path="alerts" element={<AlertsPage />} />
          <Route path="fleet" element={<FleetPage />} />
        </Route>


        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
  );
};

export default AppRouter;