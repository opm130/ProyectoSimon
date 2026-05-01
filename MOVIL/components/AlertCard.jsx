import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Colors, Spacing, FontSizes } from '../constants/colors';
import { getTimeAgo } from '../utils/formatters';

const AlertCard = ({ alert, onPress }) => {
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical':
        return Colors.danger;
      case 'warning':
        return Colors.warning;
      case 'info':
        return Colors.info;
      default:
        return Colors.secondary;
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'critical':
        return '🚨';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return '📢';
    }
  };

  const getSeverityLabel = (severity) => {
    switch (severity) {
      case 'critical':
        return 'CRÍTICA';
      case 'warning':
        return 'ADVERTENCIA';
      case 'info':
        return 'INFO';
      default:
        return severity?.toUpperCase();
    }
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        { borderLeftColor: getSeverityColor(alert.severity) },
        alert.read && styles.cardRead,
        pressed && styles.cardPressed,
      ]}
      onPress={() => onPress?.(alert)}
    >
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>{getSeverityIcon(alert.severity)}</Text>
        </View>
        <View style={styles.content}>
          <View style={styles.topRow}>
            <View style={[
              styles.severityBadge,
              { backgroundColor: getSeverityColor(alert.severity) }
            ]}>
              <Text style={styles.severityText}>
                {getSeverityLabel(alert.severity)}
              </Text>
            </View>
            <Text style={styles.time}>{getTimeAgo(alert.timestamp)}</Text>
          </View>
          
          <Text style={styles.vehicleName}>{alert.vehicleName}</Text>
          <Text style={styles.message} numberOfLines={2}>
            {alert.message}
          </Text>

          {!alert.read && (
            <View style={styles.unreadIndicator}>
              <View style={styles.unreadDot} />
              <Text style={styles.unreadText}>No leída</Text>
            </View>
          )}
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
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardRead: {
    opacity: 0.6,
  },
  cardPressed: {
    opacity: 0.7,
  },
  header: {
    flexDirection: 'row',
  },
  iconContainer: {
    marginRight: Spacing.sm,
  },
  icon: {
    fontSize: 28,
  },
  content: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  severityBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: 8,
  },
  severityText: {
    color: '#fff',
    fontSize: FontSizes.xs,
    fontWeight: 'bold',
  },
  time: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
  },
  vehicleName: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  message: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  unreadIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    marginRight: 6,
  },
  unreadText: {
    fontSize: FontSizes.xs,
    color: Colors.primary,
    fontWeight: '600',
  },
});

export default AlertCard;
