import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import useAuthStore from '../store/authStore';
import { Colors } from '../constants/colors';

export default function Index() {
  const router = useRouter();
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  useEffect(() => {
    // Pequeño delay para asegurar que el router esté listo
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        router.replace('/(tabs)/dashboard');
      } else {
        router.replace('/(auth)/login');
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [isAuthenticated]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
});