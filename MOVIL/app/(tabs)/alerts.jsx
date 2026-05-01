import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import useAlertStore from '../../store/alertStore';
import AlertCard from '../../components/AlertCard';
import { Colors, Spacing, FontSizes } from '../../constants/colors';

export default function AlertsScreen() {
  const { alerts, loading, fetchAlerts, markAsRead } = useAlertStore();
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all'); // all, critical, warning, info

  useEffect(() => {
    fetchAlerts();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAlerts();
    setRefreshing(false);
  };

  const handleAlertPress = async (alert) => {
    if (!alert.read) {
      await markAsRead(alert.id);
    }
  };

  const filteredAlerts = filter === 'all'
    ? alerts
    : alerts.filter(a => a.severity === filter);

  const unreadCount = alerts.filter(a => !a.read).length;

  const renderFilter = (value, label) => (
    <Pressable
      style={[styles.filterButton, filter === value && styles.filterButtonActive]}
      onPress={() => setFilter(value)}
    >
      <Text style={[
        styles.filterText,
        filter === value && styles.filterTextActive
      ]}>
        {label}
      </Text>
    </Pressable>
  );

  if (loading && alerts.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Cargando alertas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Alertas</Text>
        {unreadCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{unreadCount}</Text>
          </View>
        )}
      </View>

      {/* Filters */}
      <View style={styles.filters}>
        {renderFilter('all', 'Todas')}
        {renderFilter('critical', 'Críticas')}
        {renderFilter('warning', 'Advertencias')}
        {renderFilter('info', 'Info')}
      </View>

      {/* List */}
      <FlatList
        data={filteredAlerts}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <AlertCard alert={item} onPress={handleAlertPress} />
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
            <Text style={styles.emptyIcon}>✅</Text>
            <Text style={styles.emptyText}>No hay alertas</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    paddingBottom: 0,
  },
  title: {
    fontSize: FontSizes.xxl,
    fontWeight: 'bold',
    color: Colors.text,
  },
  badge: {
    backgroundColor: Colors.danger,
    borderRadius: 12,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    marginLeft: Spacing.sm,
  },
  badgeText: {
    color: '#fff',
    fontSize: FontSizes.xs,
    fontWeight: 'bold',
  },
  filters: {
    flexDirection: 'row',
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  filterButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterText: {
    fontSize: FontSizes.sm,
    color: Colors.text,
    fontWeight: '500',
  },
  filterTextActive: {
    color: '#fff',
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
  },
});
