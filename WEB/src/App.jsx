import { useEffect } from 'react';
import AppRouter from './router/AppRouter';
import useFleetStore from './store/fleetStore';
import useAlertStore from './store/alertStore';
import { connectWebSocket, disconnectWebSocket } from './services/websocketSimple';

function App() {
  const { initializeVehicles, fetchVehicles } = useFleetStore();
  const { initializeAlerts, fetchAlerts } = useAlertStore();

  useEffect(() => {
    console.log('🚀 App montado - Inicializando...');
    
    initializeVehicles();
    initializeAlerts();
    console.log('🔌 Iniciando WebSocket...');
    connectWebSocket();

    const handleNewAlert = (event) => {
      console.log('🔔 Evento new-alert recibido:', event.detail);
      fetchAlerts();
    };

    const handleVehicleUpdate = (event) => {
      console.log('🚛 Evento vehicle-update recibido:', event.detail);
      fetchVehicles();
    };

    window.addEventListener('new-alert', handleNewAlert);
    window.addEventListener('vehicle-update', handleVehicleUpdate);

    return () => {
      console.log('🧹 App desmontado - Limpiando...');
      window.removeEventListener('new-alert', handleNewAlert);
      window.removeEventListener('vehicle-update', handleVehicleUpdate);
      disconnectWebSocket();
    };
  }, []);

  return <AppRouter />;
}

export default App;