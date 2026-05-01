import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, FontSizes } from '../constants/colors';

const KPICard = ({ icon, label, value, color }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.icon}>{icon}</Text>
      <View style={styles.content}>
        <Text style={styles.label}>{label}</Text>
        <Text style={[styles.value, color && { color }]}>
          {value}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: Spacing.md,
  },
  icon: {
    fontSize: 32,
    marginRight: Spacing.md,
  },
  content: {
    flex: 1,
  },
  label: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  value: {
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
    color: Colors.text,
  },
});

export default KPICard;
