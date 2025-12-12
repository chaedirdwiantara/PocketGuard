import { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@theme/colors';
import { spacing } from '@theme/spacing';
import { Text } from '@components/atoms/Text';
import { Button } from '@components/atoms/Button';
import { Input } from '@components/atoms/Input';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';

export const WelcomeScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [income, setIncome] = useState('');

  const handleNext = () => {
    const incomeValue = parseInt(income, 10);
    if (isNaN(incomeValue) || incomeValue <= 0) {
      Alert.alert('Invalid Input', 'Please enter a valid monthly income');
      return;
    }
    navigation.navigate('BudgetSetup', { income: incomeValue });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text variant="h1" style={{ marginBottom: spacing.sm }}>Welcome to PocketGuard 👋</Text>
        <Text variant="body" color={colors.textSecondary} style={{ marginBottom: spacing.xl }}>
          Let's setup your smart budget. How much is your average monthly income?
        </Text>

        <Input
          label="Monthly Income"
          placeholder="Rp 0"
          keyboardType="numeric"
          value={income}
          onChangeText={setIncome}
          style={{ fontSize: 24, fontWeight: 'bold' }}
        />

        <View style={{ flex: 1 }} />
 
        <Button 
          label="Continue" 
          onPress={handleNext} 
          disabled={!income}
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
  content: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: 'center',
  },
});
