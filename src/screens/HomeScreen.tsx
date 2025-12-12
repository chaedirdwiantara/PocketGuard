import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { colors } from '@theme/colors';
import { spacing } from '@theme/spacing';
import { useUserStore } from '@store/userStore';
import { Text } from '@components/atoms/Text';
import { Button } from '@components/atoms/Button';
import { CategoryRepository } from '@database/repositories/CategoryRepository';
import { TransactionRepository } from '@database/repositories/TransactionRepository';
import Category from '@database/models/Category';
import Transaction from '@database/models/Transaction';
import { withObservables } from '@nozbe/watermelondb/react';

const DataList = ({ categories, transactions }: { categories: Category[], transactions: Transaction[] }) => (
  <View style={styles.listContainer}>
    <View style={styles.section}>
      <Text variant="h3">Categories ({categories.length})</Text>
      {categories.slice(0, 3).map(cat => (
        <Text key={cat.id} variant="caption">· {cat.name}</Text>
      ))}
    </View>
    <View style={styles.section}>
      <Text variant="h3">Transactions ({transactions.length})</Text>
      {transactions.slice(0, 3).map(tx => (
        <Text key={tx.id} variant="caption">· {tx.amount} ({tx.type})</Text>
      ))}
    </View>
  </View>
);

const EnhancedDataList = withObservables([], () => ({
  categories: CategoryRepository.observeAll(),
  transactions: TransactionRepository.observeAll(),
}))(DataList);

export const HomeScreen = () => {
  const { username, setUsername, reset } = useUserStore();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAddData = async () => {
    setIsProcessing(true);
    try {
      // Create Category
      const cat = await CategoryRepository.create(
        `Cat ${Math.floor(Math.random() * 100)}`, 
        'expense',
        '#FF0000'
      );
      // Create Transaction for that category
      await TransactionRepository.create(
        Math.floor(Math.random() * 10000),
        'expense',
        cat.id,
        new Date(),
        'Test Transaction'
      );
    } catch (error) {
      console.error('Error adding data:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClearAll = async () => {
    setIsProcessing(true);
    try {
      await TransactionRepository.deleteAll();
      await CategoryRepository.deleteAll();
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="h1" centered style={{ marginBottom: spacing.xl }}>
        PocketGuard
      </Text>
      
      <ScrollView style={{ width: '100%' }} contentContainerStyle={{ gap: spacing.md, alignItems: 'center' }}>
        <View style={styles.card}>
          <Text variant="h2" style={{ marginBottom: spacing.md }}>Database Test</Text>
          
          <EnhancedDataList />
          
          <View style={styles.buttonGroup}>
            <Button 
              label="Add Category & Transaction" 
              onPress={handleAddData}
              isLoading={isProcessing}
              size="sm"
            />
             <Button 
              label="Clear All Data" 
              variant="outline"
              color={colors.error}
              onPress={handleClearAll}
              isLoading={isProcessing}
              size="sm"
            />
          </View>
        </View>

        <View style={styles.card}>
           <Text variant="h2" color={colors.primary} style={{ marginBottom: spacing.lg }}>
            {username || 'Guest User'}
          </Text>
          <View style={styles.buttonGroup}>
            <Button 
              label="Login" 
              onPress={() => setUsername('Chaedir Dwiantara')}
              fullWidth
            />
            <Button 
              label="Reset" 
              variant="outline"
              onPress={reset} 
              fullWidth
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  card: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  listContainer: {
    width: '100%',
    marginVertical: spacing.md,
    gap: spacing.md,
  },
  section: {
    gap: spacing.xs,
  },
  buttonGroup: {
    width: '100%',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
});
