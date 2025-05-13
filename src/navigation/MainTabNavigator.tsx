import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, StyleSheet } from 'react-native';
import { colors, typography } from '../theme';
import { useAppSelector } from '../store';

// Import screens
import { HomeScreen } from '../screens/home';
import { WalletScreen } from '../screens/wallet';
import { PaymentsScreen } from '../screens/payments';
import { ProfileScreen } from '../screens/profile';
import { NotificationsListScreen } from '../screens/notifications';

// Define navigation types
export type MainTabParamList = {
  Home: undefined;
  Wallet: undefined;
  Payments: undefined;
  Notifications: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

// Custom tab bar icons
const TabBarIcon = ({ name, focused }: { name: string; focused: boolean }) => {
  // In a real app, you would use proper icons from a library
  const iconMap: { [key: string]: string } = {
    Home: '🏠',
    Wallet: '💰',
    Payments: '💸',
    Notifications: '🔔',
    Profile: '��',
  };

  return (
    <View style={styles.iconContainer}>
      <Text style={styles.icon}>{iconMap[name] || '📱'}</Text>
    </View>
  );
};

const MainTabNavigator = () => {
  const { unreadCount } = useAppSelector((state) => state.notification);
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => (
          <TabBarIcon name={route.name} focused={focused} />
        ),
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.gray[500],
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarStyle: styles.tabBar,
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Wallet" component={WalletScreen} />
      <Tab.Screen name="Payments" component={PaymentsScreen} />
      <Tab.Screen 
        name="Notifications" 
        component={NotificationsListScreen} 
        options={{
          tabBarBadge: unreadCount > 0 ? unreadCount : undefined,
          tabBarBadgeStyle: {
            backgroundColor: colors.primary,
            color: colors.white,
          },
        }}
      />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
    height: 60,
    paddingBottom: 5,
    paddingTop: 5,
  },
  tabBarLabel: {
    fontSize: typography.fontSize.xs,
    fontWeight: '500',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 24,
  },
});

export default MainTabNavigator;
