import React from 'react';
import { View, StyleSheet } from 'react-native';
import { withObservables } from '@nozbe/watermelondb/react';
import { colors } from '@theme/colors';
import { spacing, borderRadius, shadows } from '@theme/spacing';
import { Text } from '@components/atoms/Text';
import Transaction from '@database/models/Transaction';
import Category from '@database/models/Category';
import { formatCurrency } from '@utils/currency';

interface TransactionItemProps {
  transaction: Transaction;
  category: Category;
}

const TransactionItemComponent = ({ transaction, category }: TransactionItemProps) => {
  const isIncome = transaction.type === 'income';
  
  return (
    <View style={styles.txItem}>
      <View style={styles.txIcon}>
         <View style={[styles.circle, { backgroundColor: category.color || colors.primary }]} />
      </View>
      <View style={styles.txDetails}>
        <Text variant="body" weight="medium">{transaction.note || category.name}</Text>
        <Text variant="caption" color={colors.textSecondary}>
          {transaction.date.toLocaleDateString('id-ID')}
        </Text>
      </View>
      <Text 
        variant="body" 
        weight="bold" 
        color={isIncome ? colors.success : colors.error}
      >
        {isIncome ? '+' : '-'} {formatCurrency(transaction.amount)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  txItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    ...shadows.sm,
  },
  txIcon: {
    marginRight: spacing.md,
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.border,
  },
  txDetails: {
    flex: 1,
  },
});

export const TransactionItem = withObservables(['transaction'], ({ transaction }: { transaction: Transaction }) => ({
  transaction: transaction.observe(),
  category: transaction.category.observe(),
}))(TransactionItemComponent);
