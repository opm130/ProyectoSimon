import { useState, useEffect } from 'react';
import offlineService from '../../../services/offlineService';
import styles from './ConnectionIndicator.module.css';

const ConnectionIndicator = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [queueStatus, setQueueStatus] = useState(offlineService.getQueueStatus());
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      updateQueueStatus();
    };

    const handleOffline = () => {
      setIsOnline(false);
      updateQueueStatus();
    };

    const updateQueueStatus = () => {
      setQueueStatus(offlineService.getQueueStatus());
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const interval = setInterval(updateQueueStatus, 5000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className={styles.container}>
      <button
        className={`${styles.indicator} ${isOnline ? styles.online : styles.offline}`}
        onClick={() => setShowDetails(!showDetails)}
      >
        <span className={styles.icon}>{isOnline ? '🟢' : '🔴'}</span>
        <span className={styles.text}>
          {isOnline ? 'En línea' : 'Sin conexión'}
        </span>
        {queueStatus.pendingActions > 0 && (
          <span className={styles.badge}>{queueStatus.pendingActions}</span>
        )}
      </button>

      {showDetails && (
        <div className={styles.details}>
          <div className={styles.detailsHeader}>
            <h4 className={styles.detailsTitle}>Estado de sincronización</h4>
            <button
              className={styles.closeBtn}
              onClick={() => setShowDetails(false)}
            >
              ✕
            </button>
          </div>

          <div className={styles.detailsContent}>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Estado:</span>
              <span className={styles.detailValue}>
                {isOnline ? '🟢 Conectado' : '🔴 Desconectado'}
              </span>
            </div>

            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Acciones pendientes:</span>
              <span className={styles.detailValue}>{queueStatus.pendingActions}</span>
            </div>

            {queueStatus.lastSync && (
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Última sincronización:</span>
                <span className={styles.detailValue}>
                  {new Date(queueStatus.lastSync).toLocaleString('es-CO')}
                </span>
              </div>
            )}
          </div>

          {!isOnline && (
            <div className={styles.warning}>
              <p className={styles.warningText}>
                ⚠️ Sin conexión. Las acciones se guardarán y sincronizarán
                automáticamente cuando vuelva la conexión.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ConnectionIndicator;