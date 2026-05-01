import { Tabs, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Pressable } from 'react-native';
import useAuthStore from '../../store/authStore';
import { Colors } from '../../constants/colors';

export default function TabLayout() {
  const router = useRouter();
  const logout = useAuthStore(state => state.logout);

  const handleLogout = () => {
    logout();
    router.replace('/(auth)/login');
  };

  return (
    
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textSecondary,
        headerStyle: {
          backgroundColor: Colors.primary,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerRight: () => (
          <Pressable
            onPress={handleLogout}
            style={{ marginRight: 16 }}
          >
            <Ionicons name="log-out-outline" size={24} color="#fff" />
          </Pressable>
        ),
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="speedometer-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: 'Mapa',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="map-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="alerts"
        options={{
          title: 'Alertas',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="notifications-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="fleet"
        options={{
          title: 'Flota',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="car-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
  name="mapView"
  options={{
    title: 'Mapa Real',
    tabBarIcon: ({ color, size }) => (
      <Ionicons name="location" size={size} color={color} />
    ),
  }}
/>
    </Tabs>
  );
}
