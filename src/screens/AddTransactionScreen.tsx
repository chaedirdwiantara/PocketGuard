import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@theme/colors';
import { spacing, borderRadius, shadows } from '@theme/spacing';
import { Text } from '@components/atoms/Text';
import { Button } from '@components/atoms/Button';
import { Input } from '@components/atoms/Input';
import { CategoryRepository } from '@database/repositories/CategoryRepository';
import { TransactionRepository } from '@database/repositories/TransactionRepository';
import Category from '@database/models/Category';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

export const AddTransactionScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      await TransactionRepository.create(
        parseInt(amount),
        'expense', // Default to expense for now, can add toggle later
        selectedCategory,
        new Date(),
        note
      );
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to save transaction');
    } finally {
      setIsSubmitting(false);
    }
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
        <Text variant="h3">Add Transaction</Text>
        <View style={{ width: 50 }} /> 
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
          label="Save Transaction" 
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
