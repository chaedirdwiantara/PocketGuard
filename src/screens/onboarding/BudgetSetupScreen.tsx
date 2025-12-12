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

  // Manual Allocation Edit State
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<{ id: string, name: string } | null>(null);
  const [editNominal, setEditNominal] = useState('');
  const [editPercentage, setEditPercentage] = useState('');

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

  // Manual Allocation Handlers
  const openEditModal = (item: { id: string, name: string, defaultPct: number }) => {
    setEditingItem(item);
    const amount = (income * item.defaultPct) / 100;
    setEditPercentage(item.defaultPct.toString());
    setEditNominal(Math.round(amount).toString());
    setEditModalVisible(true);
  };

  const handleNominalChange = (text: string) => {
    // Remove non-numeric characters for calculation
    const cleanValue = text.replace(/[^0-9]/g, '');
    setEditNominal(cleanValue);
    
    if (cleanValue) {
        const nominal = parseInt(cleanValue, 10);
        const derivedPct = (nominal / income) * 100;
        // Limit to 2 decimals for display, but logic uses float
        setEditPercentage(derivedPct.toFixed(1)); 
    } else {
        setEditPercentage('0');
    }
  };

  const handlePercentageChange = (text: string) => {
    setEditPercentage(text);
    const pct = parseFloat(text);
    if (!isNaN(pct)) {
        const derivedNominal = (income * pct) / 100;
        setEditNominal(Math.round(derivedNominal).toString());
    } else {
        setEditNominal('0');
    }
  };

  const saveManualAllocation = () => {
      if (editingItem) {
          const finalPct = parseFloat(editPercentage);
          const cleanNominal = parseInt(editNominal, 10);
          
          // Validation: Ensure valid number
          if (isNaN(finalPct) || isNaN(cleanNominal)) {
              Alert.alert('Invalid Input', 'Please enter valid numbers');
              return;
          }

          // Update allocation
          handleUpdatePercentage(editingItem.id, finalPct);
          
          setEditModalVisible(false);
          setEditingItem(null);
      }
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

  const renderEditModal = () => (
    <Modal
      animationType="fade"
      transparent={true}
      visible={editModalVisible}
      onRequestClose={() => setEditModalVisible(false)}
    >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text variant="h3" style={{ marginBottom: spacing.sm }}>Edit {editingItem?.name}</Text>
            <Text variant="caption" color={colors.textSecondary} style={{ marginBottom: spacing.md }}>
                Adjust allocation manually
            </Text>

            <View style={{ width: '100%', gap: 15 }}>
                <View>
                    <Text variant="caption" style={{ marginBottom: 5 }}>Nominal (Rp)</Text>
                    <Input 
                        value={editNominal}
                        onChangeText={handleNominalChange}
                        keyboardType="numeric"
                        placeholder="0"
                    />
                </View>
                <View>
                    <Text variant="caption" style={{ marginBottom: 5 }}>Percentage (%)</Text>
                    <Input 
                        value={editPercentage}
                        onChangeText={handlePercentageChange}
                        keyboardType="numeric" // float input might need careful handling on Android
                        placeholder="0"
                    />
                </View>
            </View>

            <View style={{ flexDirection: 'row', gap: 10, marginTop: 20 }}>
                <Button label="Cancel" variant="outline" onPress={() => setEditModalVisible(false)} style={{ flex: 1 }} />
                <Button label="Save" onPress={saveManualAllocation} style={{ flex: 1 }} />
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
        {/* Usage Hint Banner */}
        <View style={styles.hintBanner}>
            <Icon name="information-outline" size={20} color={colors.primary} />
            <Text variant="caption" style={{ flex: 1, marginHorizontal: 10 }}>
                Tip: Tap on the percentage or amount to edit manually ({'\u270F'}).
            </Text>
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
                    <TouchableOpacity onPress={() => openEditModal(item)}>
                        <Text variant="body" weight="bold" style={{ color: item.color }}>{item.name}</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                            <Text variant="caption" color={colors.textSecondary}>
                                Rp {amount.toLocaleString('id-ID')}
                            </Text>
                            <Icon name="pencil" size={12} color={colors.textSecondary} style={{ opacity: 0.5 }} />
                        </View>
                    </TouchableOpacity>
                 </View>
                 <View style={{ alignItems: 'flex-end', flexDirection: 'row', gap: 10 }}>
                    <TouchableOpacity onPress={() => openEditModal(item)} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                        <Text variant="body" weight="bold">{Math.round(item.defaultPct * 10) / 10}%</Text>
                        <Icon name="pencil" size={12} color={colors.textSecondary} style={{ opacity: 0.5 }} />
                    </TouchableOpacity>
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
                  step={1}
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
      {renderEditModal()}
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
  },
  hintBanner: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      padding: spacing.sm,
      marginTop: spacing.sm,
      borderRadius: borderRadius.sm,
      borderWidth: 1,
      borderColor: colors.primary + '30', // Low opacity primary
  }
});
