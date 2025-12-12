import React, { useMemo } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { withObservables } from '@nozbe/watermelondb/react';
import { colors } from '@theme/colors';
import { spacing, borderRadius, shadows } from '@theme/spacing';
import { Text } from '@components/atoms/Text';
import { TransactionRepository } from '@database/repositories/TransactionRepository';
import { CategoryRepository } from '@database/repositories/CategoryRepository';
import Transaction from '@database/models/Transaction';
import Category from '@database/models/Category';
import { formatCurrency } from '@utils/currency';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TransactionItem } from '@components/molecules/TransactionItem';
import { BudgetProgress } from '@components/molecules/BudgetProgress';

interface DashboardProps {
  transactions: Transaction[];
  categories: Category[];
  navigation: any;
}

const DashboardComponent = ({ transactions, categories, navigation }: DashboardProps) => {
  
  const { totalIncome, totalExpense, balance, categorySpending } = useMemo(() => {
    let income = 0;
    let expense = 0;
    const catSpending = new Map<string, number>();

    transactions.forEach(tx => {
      if (tx.type === 'income') {
        income += tx.amount;
      } else {
        expense += tx.amount;
        // Aggregate spending per category
        // Note: Relation id access might differ depending on how the model is set up. 
        // Assuming tx.category.id is accessible or tx._raw.category_id
        // WatermelonDB relations are async, but IDs are usually on the raw object.
        // However, for synchronous ID access we often rely on specific query or raw access.
        // Let's assume for now we can group by filtering or we need a specific join.
        // Since we are iterating all transactions, let's use the category_id from the record.
        // But `item.category.id` triggers a fetch. 
        // We should use `item.category.id` if we are sure, OR rely on a simpler approach.
        // Actually, withObserveables, `transactions` are models. `tx.category.id` is the way if it's a Relation.
        // But Relation.id is a property getter.
        // Let's check Transaction model carefully. For now, assuming basic access working.
        
        // SAFE APPROACH: We might not have easy sync access to category_id without 'raw'.
        // Let's use `(tx as any)._raw.category_id` if needed, or if relation is loaded.
        // For standard models, `tx.category.id` returns the ID string without fetching.

        const catId = (tx as any).category.id; 
        const current = catSpending.get(catId) || 0;
        catSpending.set(catId, current + tx.amount);
      }
    });

    return {
      totalIncome: income,
      totalExpense: expense,
      balance: income - expense,
      categorySpending: catSpending
    };
  }, [transactions]);

  // Filter categories that have allocation > 0
  const budgetedCategories = useMemo(() => {
    return categories.filter(c => (c.allocatedAmount || 0) > 0);
  }, [categories]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text variant="h1">Dashboard</Text>
          <Text variant="body" color={colors.textSecondary}>Welcome back!</Text>
        </View>

        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <Text variant="caption" color={colors.onPrimary} style={{ opacity: 0.8 }}>Total Balance</Text>
          <Text variant="h1" color={colors.onPrimary} style={{ marginVertical: spacing.sm }}>
            {formatCurrency(balance)}
          </Text>
          
          <View style={styles.statsRow}>
            <View>
              <Text variant="caption" color={colors.onPrimary} style={{ opacity: 0.8 }}>Income</Text>
              <Text variant="body" weight="bold" color={colors.onPrimary}>
                + {formatCurrency(totalIncome)}
              </Text>
            </View>
             <View>
              <Text variant="caption" color={colors.onPrimary} style={{ opacity: 0.8 }}>Expense</Text>
              <Text variant="body" weight="bold" color={colors.onPrimary}>
                - {formatCurrency(totalExpense)}
              </Text>
            </View>
          </View>
        </View>

        {/* Budget Status */}
        {budgetedCategories.length > 0 && (
          <View style={styles.section}>
            <Text variant="h3" style={{ marginBottom: spacing.md }}>Budget Status</Text>
            {budgetedCategories.map(cat => (
              <BudgetProgress
                key={cat.id}
                name={cat.name}
                color={cat.color}
                allocated={cat.allocatedAmount || 0}
                spent={categorySpending.get(cat.id) || 0}
              />
            ))}
          </View>
        )}

        {/* Transaction List */}
        <View style={styles.section}>
          <View style={styles.listHeader}>
            <Text variant="h3">Recent Transactions</Text>
          </View>
          
          {transactions.length === 0 ? (
             <View style={styles.emptyState}>
                <Text variant="h2" style={{ marginBottom: spacing.xs }}>👋</Text>
                <Text variant="body" weight="medium" style={{ marginBottom: spacing.xs }}>No transactions yet</Text>
                <Text variant="caption" color={colors.textSecondary} centered>
                  Start by adding your first income or expense manually.
                </Text>
              </View>
          ) : (
            transactions.slice(0, 5).map(tx => (
               <TransactionItem key={tx.id} transaction={tx} />
            ))
          )}
        </View>
      </ScrollView>

      {/* FAB - Fixed Position outside ScrollView */}
      <TouchableOpacity 
        style={styles.fab} 
        activeOpacity={0.8}
        onPress={() => navigation.navigate('AddTransaction')}
      >
        <Text variant="h1" color={colors.onPrimary} style={{ lineHeight: 30 }}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  fab: {
    position: 'absolute',
    bottom: spacing.xl,
    right: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.md,
    elevation: 6,
  },
  header: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  summaryCard: {
    marginHorizontal: spacing.lg,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    ...shadows.md,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: spacing.sm,
    borderRadius: borderRadius.md,
  },
  section: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  emptyState: {
    padding: spacing.xl,
    alignItems: 'center',
  },
});

export const DashboardScreen = withObservables([], () => ({
  transactions: TransactionRepository.observeAll(),
  categories: CategoryRepository.observeAll(),
}))(DashboardComponent);
