import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import useFleetStore from '../../store/fleetStore';

export default function MapViewScreen() {
  const { vehicles, fetchVehicles } = useFleetStore();

  useEffect(() => {
    fetchVehicles();
  }, []);

  const vehiclesWithCoords = vehicles.filter(
    v => v.latitude != null && v.longitude != null
  );

  const getMarkerColor = (status) => {
    switch (status) {
      case 'active': return '#22c55e';   // Verde
      case 'idle': return '#f59e0b';     // Amarillo
      case 'maintenance': return '#ef4444'; // Rojo
      default: return '#64748b';
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 4.7110,
          longitude: -74.0721,
          latitudeDelta: 0.15,
          longitudeDelta: 0.15,
        }}
      >
        {vehiclesWithCoords.map((vehicle) => (
          <Marker
            key={vehicle.id}
            coordinate={{
              latitude: vehicle.latitude,
              longitude: vehicle.longitude,
            }}
            title={vehicle.name}
            description={`${vehicle.status} | Combustible: ${vehicle.fuelLevel}%`}
            pinColor={getMarkerColor(vehicle.status)}
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});