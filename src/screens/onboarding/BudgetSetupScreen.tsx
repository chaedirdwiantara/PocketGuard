import React, { useState, useMemo } from 'react';
import { View, StyleSheet, ScrollView, Alert, Modal, TouchableOpacity } from 'react-native';
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
import { useUserStore } from '../../store/userStore';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// 6 Pillars Suggestion
const SUGGESTED_ALLOCATION = [
  { id: 'needs', name: 'Kebutuhan Pokok', defaultPct: 40, color: '#EF4444', icon: 'cart' },
  { id: 'parents', name: 'Bakti Orang Tua', defaultPct: 10, color: '#F97316', icon: 'heart' },
  { id: 'savings', name: 'Tabungan & Investasi', defaultPct: 20, color: '#3B82F6', icon: 'bank' },
  { id: 'giving', name: 'Sedekah', defaultPct: 10, color: '#10B981', icon: 'hand-coin' },
  { id: 'emergency', name: 'Dana Darurat', defaultPct: 10, color: '#6366F1', icon: 'shield-alert' },
  { id: 'lifestyle', name: 'Lifestyle', defaultPct: 10, color: '#EC4899', icon: 'coffee' },
];

type BudgetSetupRouteProp = RouteProp<RootStackParamList, 'BudgetSetup'>;

export const BudgetSetupScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<BudgetSetupRouteProp>();
  const { income } = route.params;

  const [allocations, setAllocations] = useState(SUGGESTED_ALLOCATION);
  const [modalVisible, setModalVisible] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState('#888888');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const setHasCompletedOnboarding = useUserStore(state => state.setHasCompletedOnboarding);

  const totalPercentage = useMemo(() => allocations.reduce((acc, curr) => acc + curr.defaultPct, 0), [allocations]);

  const handleUpdatePercentage = (id: string, value: number) => {
    setAllocations(prev => prev.map(item => item.id === id ? { ...item, defaultPct: Math.round(value) } : item));
  };

  const handleDelete = (id: string) => {
    setAllocations(prev => prev.filter(item => item.id !== id));
  };

  const handleAddCategory = () => {
    if (!newCategoryName) return;
    const newId = `custom_${Date.now()}`;
    setAllocations(prev => [
      ...prev,
      { id: newId, name: newCategoryName, defaultPct: 0, color: newCategoryColor, icon: 'tag' } 
    ]);
    setNewCategoryName('');
    setModalVisible(false);
  };

  const handleFinish = async () => {
    if (totalPercentage !== 100) {
      Alert.alert('Allocation Error', `Total allocation must be 100%. Current: ${totalPercentage}%`);
      return;
    }

    setIsSubmitting(true);
    try {
      await CategorySeeder.seedWithBudget(allocations, income);
      setHasCompletedOnboarding(true);
      navigation.reset({ index: 0, routes: [{ name: 'Dashboard' }] });
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to save budget setup');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text variant="h3" style={{ marginBottom: spacing.md }}>New Category</Text>
            <Input 
                label="Name" 
                value={newCategoryName} 
                onChangeText={setNewCategoryName} 
            />
            {/* Simple Color Picker mock - just predefined colors row */}
            <View style={{ flexDirection: 'row', gap: 10, marginVertical: 15 }}>
                {['#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#EC4899', '#6366F1'].map(c => (
                    <TouchableOpacity 
                        key={c}
                        style={[
                            styles.colorCircle, 
                            { backgroundColor: c, borderWidth: newCategoryColor === c ? 2 : 0 }
                        ]} 
                        onPress={() => setNewCategoryColor(c)}
                    />
                ))}
            </View>

            <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
                <Button label="Cancel" variant="outline" onPress={() => setModalVisible(false)} style={{ flex: 1 }} />
                <Button label="Add" onPress={handleAddCategory} disabled={!newCategoryName} style={{ flex: 1 }} />
            </View>
          </View>
        </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View>
                <Text variant="h2">Smart Allocations</Text>
                <Text variant="body" color={colors.textSecondary}>
                Income: Rp {income.toLocaleString('id-ID')}
                </Text>
            </View>
            <TouchableOpacity onPress={() => setAllocations(SUGGESTED_ALLOCATION)}>
                <Text variant="caption" color={colors.primary}>Reset</Text>
            </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {allocations.map(item => {
           const amount = (income * item.defaultPct) / 100;
           return (
             <View key={item.id} style={styles.card}>
               <View style={styles.row}>
                 <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: item.color + '20', justifyContent: 'center', alignItems: 'center' }}>
                       <Icon name={item.icon || 'tag'} size={24} color={item.color} />
                    </View>
                    <View>
                        <Text variant="body" weight="bold" style={{ color: item.color }}>{item.name}</Text>
                        <Text variant="caption" color={colors.textSecondary}>
                             Rp {amount.toLocaleString('id-ID')}
                        </Text>
                    </View>
                 </View>
                 <View style={{ alignItems: 'flex-end', flexDirection: 'row', gap: 10 }}>
                    <Text variant="body" weight="bold">{item.defaultPct}%</Text>
                    {/* Delete setup */}
                    <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteBtn}>
                        <Icon name="trash-can-outline" size={20} color={colors.error} />
                    </TouchableOpacity>
                 </View>
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
             </View>
           );
        })}

        <Button 
            label="+ Add Category" 
            variant="outline" 
            onPress={() => setModalVisible(true)} 
            style={{ marginTop: spacing.sm }}
        />
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

      {renderModal()}
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
    paddingBottom: 150,
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
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  deleteBtn: {
      padding: 5,
      backgroundColor: '#FFE5E5',
      borderRadius: 4,
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
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  colorCircle: {
      width: 30,
      height: 30,
      borderRadius: 15,
      borderColor: '#000',
  }
});
