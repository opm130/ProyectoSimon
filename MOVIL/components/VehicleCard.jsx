import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Colors, Spacing, FontSizes } from '../constants/colors';
import { formatSpeed, formatFuel } from '../utils/formatters';
import { maskDeviceId } from '../utils/deviceMask';
import useAuthStore from '../store/authStore';

const VehicleCard = ({ vehicle, onPress }) => {
  const userRole = useAuthStore(state => state.getUserRole());
  const maskedId = maskDeviceId(vehicle.id, userRole);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return Colors.statusActive;
      case 'idle':
        return Colors.statusIdle;
      case 'maintenance':
        return Colors.statusMaintenance;
      default:
        return Colors.secondary;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'active':
        return 'Activo';
      case 'idle':
        return 'Inactivo';
      case 'maintenance':
        return 'Mantenimiento';
      default:
        return status;
    }
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        pressed && styles.cardPressed,
      ]}
      onPress={() => onPress?.(vehicle)}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.name}>{vehicle.name}</Text>
          <Text style={styles.deviceId}>{maskedId}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(vehicle.status) }]}>
          <Text style={styles.statusText}>{getStatusLabel(vehicle.status)}</Text>
        </View>
      </View>

      <View style={styles.metrics}>
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>Velocidad</Text>
          <Text style={styles.metricValue}>{formatSpeed(vehicle.speed)}</Text>
        </View>
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>Combustible</Text>
          <Text style={styles.metricValue}>{formatFuel(vehicle.fuelLevel)}</Text>
        </View>
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>Temperatura</Text>
          <Text style={styles.metricValue}>{vehicle.temperature}°C</Text>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardPressed: {
    opacity: 0.7,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  name: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  deviceId: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: FontSizes.xs,
    fontWeight: '600',
  },
  metrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metric: {
    flex: 1,
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  metricValue: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.text,
  },
});

export default VehicleCard;
