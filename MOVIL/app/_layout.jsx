import { Slot } from 'expo-router';
import { useEffect } from 'react';
import { connectWebSocket, disconnectWebSocket } from '../services/websocketService';

export default function RootLayout() {
  useEffect(() => {
    connectWebSocket();
    return () => {
      disconnectWebSocket();
    };
  }, []);

  return <Slot />;
}