import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import useFleetStore from '../../store/fleetStore';
import useAlertStore from '../../store/alertStore';
import KPICard from '../../components/KPICard';
import { calculateFleetStats } from '../../utils/calculations';
import { Colors, Spacing, FontSizes } from '../../constants/colors';

export default function DashboardScreen() {
  const { vehicles, loading: vehiclesLoading, fetchVehicles } = useFleetStore();
  const { alerts, loading: alertsLoading, fetchAlerts } = useAlertStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    await Promise.all([
      fetchVehicles(),
      fetchAlerts(),
    ]);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const stats = calculateFleetStats(vehicles);
  const criticalAlerts = alerts.filter(a => a.severity === 'critical' && !a.read).length;

  if (vehiclesLoading && vehicles.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Cargando datos...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={Colors.primary}
        />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Dashboard</Text>
        <Text style={styles.subtitle}>Monitoreo en tiempo real de la flota</Text>
      </View>

      {/* KPIs */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Métricas Principales</Text>
        
        <KPICard
          icon="🚛"
          label="Total Vehículos"
          value={stats.total}
        />
        
        <KPICard
          icon="✅"
          label="Activos"
          value={stats.active}
          color={Colors.success}
        />
        
        <KPICard
          icon="🚨"
          label="Alertas Críticas"
          value={criticalAlerts}
          color={criticalAlerts > 0 ? Colors.danger : Colors.textSecondary}
        />
        
        <KPICard
          icon="⚡"
          label="Velocidad Promedio"
          value={`${Math.round(stats.avgSpeed)} km/h`}
        />

        <KPICard
          icon="⛽"
          label="Combustible Promedio"
          value={`${Math.round(stats.avgFuel)}%`}
        />
      </View>

      {/* Estados de Flota */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Estado de la Flota</Text>
        
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.idle}</Text>
            <Text style={styles.statLabel}>Inactivos</Text>
            <View style={[styles.statIndicator, { backgroundColor: Colors.warning }]} />
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.maintenance}</Text>
            <Text style={styles.statLabel}>Mantenimiento</Text>
            <View style={[styles.statIndicator, { backgroundColor: Colors.danger }]} />
          </View>
        </View>
      </View>

      {/* Últimas Alertas */}
      {criticalAlerts > 0 && (
        <View style={styles.alertBanner}>
          <Text style={styles.alertIcon}>⚠️</Text>
          <View style={styles.alertContent}>
            <Text style={styles.alertTitle}>Atención Requerida</Text>
            <Text style={styles.alertText}>
              Tienes {criticalAlerts} alerta{criticalAlerts > 1 ? 's' : ''} crítica{criticalAlerts > 1 ? 's' : ''}
            </Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.md,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  loadingText: {
    marginTop: Spacing.md,
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
  },
  header: {
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: FontSizes.xxl,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: Spacing.md,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: FontSizes.xxl,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  statIndicator: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  alertBanner: {
    backgroundColor: '#fff3cd',
    borderRadius: 12,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: Colors.warning,
  },
  alertIcon: {
    fontSize: 32,
    marginRight: Spacing.md,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: '#856404',
    marginBottom: 4,
  },
  alertText: {
    fontSize: FontSizes.sm,
    color: '#856404',
  },
});
