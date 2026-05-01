import { useEffect } from 'react';
import useFleetStore from '../../../store/fleetStore';
import useAlertStore from '../../../store/alertStore';
import useAuthStore from '../../../store/authStore';
import { calculateFleetStats } from '../../../shared/utils/calculations';
import { formatSpeed, formatFuel } from '../../../shared/utils/formatters';
import { maskDeviceId } from '../../../shared/utils/deviceMask';
import { mockFuelHistory } from '../../../shared/utils/mockData';
import Card from '../../../shared/components/Card/Card';
import FuelChart from '../components/FuelChart';
import FleetStatsChart from '../components/FleetStatsChart';
import styles from './DashboardPage.module.css';


const DashboardPage = () => {
  const { vehicles, fetchVehicles, fetchStats } = useFleetStore();
  const { alerts, fetchAlerts, unreadCount } = useAlertStore();
  const { isAdmin } = useAuthStore();

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        fetchVehicles(),
        fetchAlerts(),
        fetchStats(),
      ]);
    };

    loadData();
  }, [fetchVehicles, fetchAlerts, fetchStats]);

  const stats = calculateFleetStats(vehicles);
  const activeVehicles = vehicles.filter(v => v.status === 'active');
  const criticalAlerts = alerts.filter(a => a.severity === 'critical' && !a.read);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Dashboard</h1>
        <p className={styles.subtitle}>Monitoreo en tiempo real de la flota</p>
      </div>

      {/* KPI Cards */}
      <div className={styles.kpiGrid}>
        <Card variant="elevated" padding="medium">
          <div className={styles.kpi}>
            <span className={styles.kpiIcon}>🚛</span>
            <div className={styles.kpiContent}>
              <p className={styles.kpiLabel}>Total Vehículos</p>
              <h2 className={styles.kpiValue}>{stats.total}</h2>
            </div>
          </div>
        </Card>

        <Card variant="elevated" padding="medium">
          <div className={styles.kpi}>
            <span className={styles.kpiIcon}>🟢</span>
            <div className={styles.kpiContent}>
              <p className={styles.kpiLabel}>Activos</p>
              <h2 className={styles.kpiValue}>{stats.active}</h2>
            </div>
          </div>
        </Card>

        <Card variant="elevated" padding="medium">
          <div className={styles.kpi}>
            <span className={styles.kpiIcon}>🚨</span>
            <div className={styles.kpiContent}>
              <p className={styles.kpiLabel}>Alertas Críticas</p>
              <h2 className={styles.kpiValue}>{criticalAlerts.length}</h2>
            </div>
          </div>
        </Card>

        <Card variant="elevated" padding="medium">
          <div className={styles.kpi}>
            <span className={styles.kpiIcon}>⚡</span>
            <div className={styles.kpiContent}>
              <p className={styles.kpiLabel}>Velocidad Promedio</p>
              <h2 className={styles.kpiValue}>{formatSpeed(stats.avgSpeed)}</h2>
            </div>
          </div>
        </Card>
      </div>

      {/* Gráficos */}
      <div className={styles.chartsSection}>
        <div className={styles.chartsGrid}>
          <FuelChart data={mockFuelHistory} />
          <FleetStatsChart vehicles={vehicles} />
        </div>
      </div>

      {/* Vehículos Activos */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Vehículos Activos</h2>
        <div className={styles.vehiclesGrid}>
          {activeVehicles.length === 0 ? (
            <p className={styles.emptyText}>No hay vehículos activos</p>
          ) : (
            activeVehicles.map(vehicle => (
              <Card key={vehicle.id} variant="outlined" padding="medium">
                <div className={styles.vehicleCard}>
                  <div className={styles.vehicleHeader}>
                    <h3 className={styles.vehicleName}>{vehicle.name}</h3>
                    <span className={styles.vehicleId}>
                      {maskDeviceId(vehicle.id, isAdmin())}
                    </span>
                  </div>
                  <div className={styles.vehicleStats}>
                    <div className={styles.stat}>
                      <span className={styles.statLabel}>⚡ Velocidad</span>
                      <span className={styles.statValue}>{formatSpeed(vehicle.speed)}</span>
                    </div>
                    <div className={styles.stat}>
                      <span className={styles.statLabel}>⛽ Combustible</span>
                      <span className={styles.statValue}>{formatFuel(vehicle.fuelLevel)}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Alertas Críticas */}
      {criticalAlerts.length > 0 && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>⚠️ Alertas Críticas</h2>
          <div className={styles.alertsList}>
            {criticalAlerts.map(alert => (
              <Card key={alert.id} variant="outlined" padding="medium">
                <div className={styles.alertCard}>
                  <span className={styles.alertIcon}>🚨</span>
                  <div className={styles.alertContent}>
                    <h4 className={styles.alertVehicle}>{alert.vehicleName}</h4>
                    <p className={styles.alertMessage}>{alert.message}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;