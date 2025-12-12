import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@theme/colors';
import { spacing, borderRadius } from '@theme/spacing';
import { Text } from '@components/atoms/Text';
import { Button } from '@components/atoms/Button';
import { Input } from '@components/atoms/Input';
import { CategoryRepository } from '@database/repositories/CategoryRepository';
import { TransactionRepository } from '@database/repositories/TransactionRepository';
import Category from '@database/models/Category';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { RouteProp, useRoute } from '@react-navigation/native';
import Transaction from '@database/models/Transaction';


type AddTransactionRouteProp = RouteProp<RootStackParamList, 'AddTransaction'>;

export const AddTransactionScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<AddTransactionRouteProp>();
  const editingTransaction = route.params?.transaction as Transaction | undefined;

  const [amount, setAmount] = useState(editingTransaction ? Math.round(editingTransaction.amount).toString() : '');
  const [note, setNote] = useState(editingTransaction?.note || '');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(editingTransaction?.category?.id || null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Hack to get initial category ID if it's a relation and not loaded yet
  // In WatermelonDB relation access is async or requires `_raw` for sync ID access.
  useEffect(() => {
      if (editingTransaction && !selectedCategory) {
           // Try to get accessible category ID if relation not resolved synchronously
           // @ts-ignore
           const rawId = editingTransaction._raw?.category_id;
           if (rawId) setSelectedCategory(rawId);
      }
  }, [editingTransaction, selectedCategory]);

  useEffect(() => {
    // Fetch categories eagerly for the selector
    const fetchCategories = async () => {
      const cats = await CategoryRepository.getAll();
      setCategories(cats);
    };
    fetchCategories();
  }, []);

  const handleSave = async () => {
    if (!amount || !selectedCategory) {
      Alert.alert('Error', 'Please enter amount and select a category');
      return;
    }

    try {
      setIsSubmitting(true);
        // If editing
        if (editingTransaction) {
           await TransactionRepository.update(editingTransaction.id, {
               amount: parseInt(amount, 10),
               categoryId: selectedCategory,
               note: note
           });
        } else {
           // Create new
            await TransactionRepository.create(
                parseInt(amount, 10),
                'expense',
                selectedCategory,
                new Date(),
                note
            );
        }
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to save transaction');
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleDelete = () => {
      if (!editingTransaction) return;
      
      Alert.alert(
          'Delete Transaction',
          'Are you sure you want to delete this transaction?',
          [
              { text: 'Cancel', style: 'cancel' },
              { 
                  text: 'Delete', 
                  style: 'destructive',
                  onPress: async () => {
                      try {
                          setIsSubmitting(true);
                          await TransactionRepository.delete(editingTransaction.id);
                          navigation.goBack();
                      } catch {
                          Alert.alert('Error', 'Failed to delete');
                          setIsSubmitting(false);
                      }
                  }
              }
          ]
      );
  };

  const renderCategoryItem = ({ item }: { item: Category }) => {
    const isSelected = item.id === selectedCategory;
    return (
      <TouchableOpacity 
        style={[
          styles.categoryItem, 
          isSelected && { borderColor: colors.primary, backgroundColor: colors.surface } 
        ]}
        onPress={() => setSelectedCategory(item.id)}
      >
        <View style={[styles.circle, { backgroundColor: item.color || colors.primary }]} />
        <Text variant="caption" style={{ marginTop: spacing.xs }}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text variant="body" color={colors.primary}>Cancel</Text>
        </TouchableOpacity>
        <Text variant="h3">{editingTransaction ? 'Edit Transaction' : 'Add Transaction'}</Text>
        <TouchableOpacity onPress={handleDelete} disabled={!editingTransaction}>
            <Text variant="body" color={editingTransaction ? colors.error : 'transparent'}>Delete</Text>
        </TouchableOpacity> 
      </View>

      <View style={styles.form}>
        <Input
          label="Amount"
          placeholder="0"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
          autoFocus
          style={{ fontSize: 32, fontWeight: 'bold', height: 60 }}
        />

        <Input
          label="Note"
          placeholder="What is this for?"
          value={note}
          onChangeText={setNote}
          multiline
        />

        <Text variant="caption" color={colors.textSecondary} style={{ marginVertical: spacing.lg }}>Category</Text>
        <View style={{ height: 100 }}>
          <FlatList
            data={categories}
            renderItem={renderCategoryItem}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: spacing.md, paddingHorizontal: spacing.xs }}
          />
        </View>
      </View>

      <View style={styles.footer}>
        <Button 
          label={editingTransaction ? "Update Transaction" : "Save Transaction"} 
          onPress={handleSave} 
          isLoading={isSubmitting}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  form: {
    padding: spacing.lg,
    flex: 1,
  },
  categoryItem: {
    alignItems: 'center',
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    borderColor: 'transparent',
    minWidth: 70,
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.border,
  },
  footer: {
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
