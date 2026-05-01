import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import useFleetStore from '../../store/fleetStore';

export default function MapScreen() {
  const { vehicles, fetchVehicles } = useFleetStore();
  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchVehicles();
    setRefreshing(false);
  };

  const vehiclesWithCoordinates = vehicles.filter(
    v => v.latitude != null && v.longitude != null
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#22c55e';
      case 'idle': return '#f59e0b';
      case 'maintenance': return '#ef4444';
      default: return '#64748b';
    }
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>🗺️ Ubicaciones</Text>
        <Text style={styles.subtitle}>
          {vehiclesWithCoordinates.length} vehículos con GPS
        </Text>
      </View>

      {vehiclesWithCoordinates.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📍</Text>
          <Text style={styles.emptyText}>
            No hay vehículos con datos de ubicación
          </Text>
        </View>
      ) : (
        vehiclesWithCoordinates.map((vehicle) => (
          <View key={vehicle.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.vehicleName}>{vehicle.name}</Text>
                <Text style={styles.deviceId}>{vehicle.id}</Text>
              </View>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(vehicle.status) }
                ]}
              >
                <Text style={styles.statusText}>
                  {vehicle.status}
                </Text>
              </View>
            </View>

            <View style={styles.coordinatesContainer}>
              <View style={styles.coordinateRow}>
                <Text style={styles.coordinateLabel}>📍 Latitud:</Text>
                <Text style={styles.coordinateValue}>
                  {vehicle.latitude.toFixed(6)}
                </Text>
              </View>
              <View style={styles.coordinateRow}>
                <Text style={styles.coordinateLabel}>📍 Longitud:</Text>
                <Text style={styles.coordinateValue}>
                  {vehicle.longitude.toFixed(6)}
                </Text>
              </View>
            </View>

            <View style={styles.metricsRow}>
              <View style={styles.metric}>
                <Text style={styles.metricLabel}>Velocidad</Text>
                <Text style={styles.metricValue}>{vehicle.speed || 0} km/h</Text>
              </View>
              <View style={styles.metric}>
                <Text style={styles.metricLabel}>Combustible</Text>
                <Text style={styles.metricValue}>{vehicle.fuelLevel || 0}%</Text>
              </View>
            </View>
          </View>
        ))
      )}

      <View style={styles.note}>
        <Text style={styles.noteText}>
          💡 Mapa interactivo disponible en versión nativa
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    backgroundColor: '#2563eb',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  card: {
    backgroundColor: '#ffffff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  vehicleName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  deviceId: {
    fontSize: 14,
    color: '#666666',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  coordinatesContainer: {
    backgroundColor: '#f5f5f5',
    padding: 8,
    borderRadius: 8,
    marginBottom: 16,
  },
  coordinateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  coordinateLabel: {
    fontSize: 14,
    color: '#666666',
  },
  coordinateValue: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '600',
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  metric: {
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 64,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
  },
  note: {
    margin: 16,
    padding: 16,
    backgroundColor: '#fff3cd',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
  },
  noteText: {
    fontSize: 14,
    color: '#856404',
    lineHeight: 20,
  },
});