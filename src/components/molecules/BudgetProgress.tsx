import React from 'react';
import { View, StyleSheet, DimensionValue } from 'react-native';
import { colors } from '@theme/colors';
import { spacing } from '@theme/spacing';
import { Text } from '@components/atoms/Text';
import { formatCurrency } from '@utils/currency';

interface BudgetProgressProps {
  name: string;
  allocated: number;
  spent: number;
  color: string;
}

export const BudgetProgress = ({ name, allocated, spent, color }: BudgetProgressProps) => {
  const percentage = Math.min(Math.max((spent / allocated) * 100, 0), 100);
  const isOverBudget = spent > allocated;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="body" weight="bold" style={{ color }}>{name}</Text>
        <Text variant="caption" color={isOverBudget ? colors.error : colors.textSecondary}>
          {formatCurrency(spent)} / {formatCurrency(allocated)}
        </Text>
      </View>
      
      <View style={styles.track}>
        <View 
          style={[
            styles.bar, 
            { 
              width: `${percentage}%` as DimensionValue, 
              backgroundColor: isOverBudget ? colors.error : color 
            }
          ]} 
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  track: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    borderRadius: 4,
  },
});
