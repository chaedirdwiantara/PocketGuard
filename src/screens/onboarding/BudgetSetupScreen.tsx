import React, { useState, useEffect, useMemo } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@theme/colors';
import { spacing, borderRadius } from '@theme/spacing';
import { Text } from '@components/atoms/Text';
import { Button } from '@components/atoms/Button';
import { Input } from '@components/atoms/Input';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { CategorySeeder } from '@database/seeds/CategorySeeder';
import Slider from '@react-native-community/slider';

// 6 Pillars Default Allocation
const DEFAULT_ALLOCATION = [
  { id: 'needs', name: 'Kebutuhan Pokok', defaultPct: 40, color: '#EF4444' },
  { id: 'parents', name: 'Bakti Orang Tua', defaultPct: 10, color: '#F97316' },
  { id: 'savings', name: 'Tabungan & Investasi', defaultPct: 20, color: '#3B82F6' },
  { id: 'giving', name: 'Sedekah', defaultPct: 10, color: '#10B981' },
  { id: 'emergency', name: 'Dana Darurat', defaultPct: 10, color: '#6366F1' },
  { id: 'lifestyle', name: 'Lifestyle', defaultPct: 10, color: '#EC4899' },
];

type BudgetSetupRouteProp = RouteProp<RootStackParamList, 'BudgetSetup'>;

export const BudgetSetupScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<BudgetSetupRouteProp>();
  const { income } = route.params;

  const [allocations, setAllocations] = useState(DEFAULT_ALLOCATION);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalPercentage = useMemo(() => allocations.reduce((acc, curr) => acc + curr.defaultPct, 0), [allocations]);

  const handleUpdatePercentage = (id: string, value: number) => {
    setAllocations(prev => prev.map(item => item.id === id ? { ...item, defaultPct: Math.round(value) } : item));
  };

  const handleFinish = async () => {
    if (totalPercentage !== 100) {
      Alert.alert('Allocation Error', `Total allocation must be 100%. Current: ${totalPercentage}%`);
      return;
    }

    setIsSubmitting(true);
    try {
      // Seed categories with specific allocations
      await CategorySeeder.seedWithBudget(allocations, income);
      
      // Reset navigation to Dashboard
      navigation.reset({
        index: 0,
        routes: [{ name: 'Dashboard' }],
      });
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to save budget setup');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text variant="h2">Smart Allocations</Text>
        <Text variant="body" color={colors.textSecondary}>
          Income: Rp {income.toLocaleString('id-ID')}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {allocations.map(item => {
           const amount = (income * item.defaultPct) / 100;
           return (
             <View key={item.id} style={styles.card}>
               <View style={styles.row}>
                 <Text variant="body" weight="bold" style={{ color: item.color }}>{item.name}</Text>
                 <Text variant="body">{item.defaultPct}%</Text>
               </View>
               <Slider
                 style={{ width: '100%', height: 40 }}
                 minimumValue={0}
                 maximumValue={100}
                 step={5}
                 value={item.defaultPct}
                 onValueChange={(val) => handleUpdatePercentage(item.id, val)}
                 minimumTrackTintColor={item.color}
                 maximumTrackTintColor={colors.border}
               />
               <Text variant="caption" color={colors.textSecondary}>
                 Rp {amount.toLocaleString('id-ID')}
               </Text>
             </View>
           );
        })}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.totalRow}>
          <Text variant="body">Total Allocation:</Text>
          <Text variant="h3" color={totalPercentage === 100 ? colors.success : colors.error}>
            {totalPercentage}%
          </Text>
        </View>
        <Button 
          label="Finish Setup" 
          onPress={handleFinish} 
          isLoading={isSubmitting}
          disabled={totalPercentage !== 100}
          fullWidth
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.lg,
    backgroundColor: colors.surface,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.background,
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
});
