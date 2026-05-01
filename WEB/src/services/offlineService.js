const OFFLINE_QUEUE_KEY = 'fleet:offline_queue';
const LAST_SYNC_KEY = 'fleet:last_sync';

class OfflineService {
  constructor() {
    this.queue = this.loadQueue();
    this.isOnline = navigator.onLine;
    this.setupListeners();
  }

  setupListeners() {
    window.addEventListener('online', () => {
      console.log('🟢 Conexión restaurada');
      this.isOnline = true;
      this.syncQueue();
    });

    window.addEventListener('offline', () => {
      console.log('🔴 Sin conexión');
      this.isOnline = false;
    });
  }

  loadQueue() {
    try {
      const stored = localStorage.getItem(OFFLINE_QUEUE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading offline queue:', error);
      return [];
    }
  }

  saveQueue() {
    try {
      localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(this.queue));
    } catch (error) {
      console.error('Error saving offline queue:', error);
    }
  }

  addToQueue(action) {
    const queueItem = {
      id: Date.now().toString(),
      action,
      timestamp: new Date().toISOString(),
      attempts: 0,
      maxAttempts: 3,
    };

    this.queue.push(queueItem);
    this.saveQueue();

    console.log('📥 Acción agregada a cola offline:', action.type);

    if (this.isOnline) {
      this.syncQueue();
    }

    return queueItem.id;
  }

  async syncQueue() {
    if (!this.isOnline || this.queue.length === 0) {
      return;
    }

    console.log(`🔄 Sincronizando ${this.queue.length} acciones pendientes...`);

    const itemsToSync = [...this.queue];
    const successfulIds = [];

    for (const item of itemsToSync) {
      try {
        await this.processAction(item.action);
        successfulIds.push(item.id);
        console.log('✅ Acción sincronizada:', item.action.type);
      } catch (error) {
        item.attempts++;
        console.error('❌ Error sincronizando acción:', error);
        if (item.attempts >= item.maxAttempts) {
          console.warn('⚠️ Acción descartada después de máximos intentos');
          successfulIds.push(item.id);
        }
      }
    }

    this.queue = this.queue.filter(item => !successfulIds.includes(item.id));
    this.saveQueue();

    localStorage.setItem(LAST_SYNC_KEY, new Date().toISOString());

    if (this.queue.length === 0) {
      console.log('✅ Todas las acciones sincronizadas');
    }
  }

  async processAction(action) {
 
    await new Promise(resolve => setTimeout(resolve, 500));

    switch (action.type) {
      case 'MARK_ALERT_READ':

        console.log('Procesando: Marcar alerta como leída', action.payload);
        break;

      case 'UPDATE_VEHICLE':

        console.log('Procesando: Actualizar vehículo', action.payload);
        break;

      default:
        console.warn('Tipo de acción desconocida:', action.type);
    }
  }

  getQueueStatus() {
    return {
      isOnline: this.isOnline,
      pendingActions: this.queue.length,
      lastSync: localStorage.getItem(LAST_SYNC_KEY),
    };
  }

  clearQueue() {
    this.queue = [];
    this.saveQueue();
    console.log('🗑️ Cola offline limpiada');
  }

  checkConnection() {
    return this.isOnline;
  }
}

export default new OfflineService();