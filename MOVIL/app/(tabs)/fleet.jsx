import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import useFleetStore from '../../store/fleetStore';
import VehicleCard from '../../components/VehicleCard';
import { Colors, Spacing, FontSizes } from '../../constants/colors';

export default function FleetScreen() {
  const { vehicles, loading, fetchVehicles } = useFleetStore();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchVehicles();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchVehicles();
    setRefreshing(false);
  };

  const filteredVehicles = vehicles.filter(vehicle =>
    vehicle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vehicle.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeCount = vehicles.filter(v => v.status === 'active').length;

  if (loading && vehicles.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Cargando flota...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Flota</Text>
        <Text style={styles.subtitle}>
          {activeCount} de {vehicles.length} activos
        </Text>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar vehículo..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <Pressable onPress={() => setSearchQuery('')}>
            <Text style={styles.clearButton}>✕</Text>
          </Pressable>
        )}
      </View>

      {/* List */}
      <FlatList
        data={filteredVehicles}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <VehicleCard
            vehicle={item}
            onPress={(vehicle) => {
              console.log('Vehicle pressed:', vehicle.id);
              // Aquí podrías navegar a una pantalla de detalle
            }}
          />
        )}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🚛</Text>
            <Text style={styles.emptyText}>
              {searchQuery
                ? 'No se encontraron vehículos'
                : 'No hay vehículos en la flota'}
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
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
    padding: Spacing.md,
    paddingBottom: 0,
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 12,
    margin: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchIcon: {
    fontSize: 20,
    marginRight: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    paddingVertical: Spacing.md,
    fontSize: FontSizes.md,
    color: Colors.text,
  },
  clearButton: {
    fontSize: 20,
    color: Colors.textSecondary,
    paddingHorizontal: Spacing.sm,
  },
  list: {
    padding: Spacing.md,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: Spacing.xl * 2,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: Spacing.md,
  },
  emptyText: {
    fontSize: FontSizes.lg,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
