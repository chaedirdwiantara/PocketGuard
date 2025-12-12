import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DashboardScreen } from '@screens/DashboardScreen';
import { AddTransactionScreen } from '@screens/AddTransactionScreen';
import { colors } from '@theme/colors';

import { WelcomeScreen } from '@screens/onboarding/WelcomeScreen';
import { BudgetSetupScreen } from '@screens/onboarding/BudgetSetupScreen';

import { useUserStore } from '../store/userStore';
import { View, ActivityIndicator } from 'react-native';

const Stack = createNativeStackNavigator();

export const RootNavigator = () => {
  const hasCompletedOnboarding = useUserStore(state => state.hasCompletedOnboarding);
  const [isHydrated, setIsHydrated] = React.useState(false);

  React.useEffect(() => {
    // Small hack to wait for Zustand hydration from AsyncStorage
    // In a real app, we might use onRehydrateStorage
    const timer = setTimeout(() => setIsHydrated(true), 500); 
    return () => clearTimeout(timer);
  }, []);

  if (!isHydrated) {
      return (
          <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }}>
             <ActivityIndicator size="large" color={colors.primary} />
          </View>
      );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName={hasCompletedOnboarding ? "Dashboard" : "Welcome"}
        screenOptions={{ 
          headerShown: false,
          contentStyle: { backgroundColor: colors.background }
        }}
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="BudgetSetup" component={BudgetSetupScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen 
          name="AddTransaction" 
          component={AddTransactionScreen} 
          options={{ presentation: 'modal' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
