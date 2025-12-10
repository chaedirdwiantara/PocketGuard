import React, { useMemo } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { withObservables } from '@nozbe/watermelondb/react';
import { colors } from '@theme/colors';
import { spacing, borderRadius, shadows } from '@theme/spacing';
import { Text } from '@components/atoms/Text';
import { TransactionRepository } from '@database/repositories/TransactionRepository';
import Transaction from '@database/models/Transaction';
import { formatCurrency } from '@utils/currency';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TransactionItem } from '@components/molecules/TransactionItem';

interface DashboardProps {
  transactions: Transaction[];
  navigation: any;
}

const DashboardComponent = ({ transactions, navigation }: DashboardProps) => {
  
  const { totalIncome, totalExpense, balance } = useMemo(() => {
    let income = 0;
    let expense = 0;
    transactions.forEach(tx => {
      if (tx.type === 'income') income += tx.amount;
      else expense += tx.amount;
    });
    return {
      totalIncome: income,
      totalExpense: expense,
      balance: income - expense
    };
  }, [transactions]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
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

      {/* Transaction List */}
      <View style={styles.listSection}>
        <View style={styles.listHeader}>
          <Text variant="h3">Recent Transactions</Text>
        </View>
        
        <FlatList
          data={transactions}
          renderItem={({ item }) => <TransactionItem transaction={item} />}
          keyExtractor={item => item.id}
          contentContainerStyle={{ gap: spacing.md, paddingBottom: spacing.xl }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text variant="body" color={colors.textSecondary}>No transactions yet.</Text>
            </View>
          }
        />
      </View>

      {/* FAB */}
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
    paddingHorizontal: spacing.lg,
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
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  summaryCard: {
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
  listSection: {
    flex: 1,
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
}))(DashboardComponent);
