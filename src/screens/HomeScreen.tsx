import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '@theme/colors';
import { spacing } from '@theme/spacing';
import { useUserStore } from '@store/userStore';
import { Text } from '@components/atoms/Text';
import { Button } from '@components/atoms/Button';

export const HomeScreen = () => {
  const { username, setUsername, reset } = useUserStore();

  return (
    <View style={styles.container}>
      <Text variant="h1" centered style={{ marginBottom: spacing.xl }}>
        PocketGuard
      </Text>
      
      <View style={styles.card}>
        <Text variant="caption" color={colors.textSecondary} style={{ marginBottom: spacing.xs }}>
          User Identity
        </Text>
        
        <Text variant="h2" color={colors.primary} style={{ marginBottom: spacing.lg }}>
          {username || 'Guest User'}
        </Text>
        
        <View style={styles.buttonGroup}>
          <Button 
            label="Login as User" 
            onPress={() => setUsername('Chaedir Dwiantara')}
            fullWidth
          />
          
          <Button 
            label="Logout" 
            variant="outline"
            onPress={reset} 
            fullWidth
          />
        </View>
      </View>
      
      <Text variant="caption" color={colors.textTertiary} style={{ marginTop: spacing.xxl }}>
        Phase 1 Complete v1.0
      </Text>
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
  buttonGroup: {
    width: '100%',
    gap: spacing.md,
  },
});
