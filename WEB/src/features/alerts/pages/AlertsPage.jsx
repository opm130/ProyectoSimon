import { useState } from 'react';
import useAlertStore from '../../../store/alertStore';
import Card from '../../../shared/components/Card/Card';
import Button from '../../../shared/components/Button/Button';
import Input from '../../../shared/components/Input/Input';
import { formatRelativeTime } from '../../../shared/utils/formatters';
import styles from './AlertsPage.module.css';

const AlertsPage = () => {
  const { alerts, markAsRead, markAllAsRead } = useAlertStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const unreadAlerts = alerts.filter(a => !a.read);

  // Filtrar alertas
  const filteredAlerts = alerts.filter(alert => {
    // Filtro de búsqueda
    const matchesSearch = alert.vehicleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.message.toLowerCase().includes(searchTerm.toLowerCase());
    
  
    const matchesSeverity = severityFilter === 'all' || alert.severity === severityFilter;
    
    // Filtro de estado (leído/no leído)
    const matchesStatus = statusFilter === 'all' || 
                          (statusFilter === 'unread' && !alert.read) ||
                          (statusFilter === 'read' && alert.read);
    
    return matchesSearch && matchesSeverity && matchesStatus;
  });

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return '#ef4444';
      case 'warning': return '#f59e0b';
      case 'info': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'critical': return '🚨';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return '🔔';
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Alertas</h1>
          <p className={styles.subtitle}>
            {unreadAlerts.length} sin leer de {alerts.length} total
          </p>
        </div>
        {unreadAlerts.length > 0 && (
          <Button variant="outline" size="small" onClick={markAllAsRead}>
            Marcar todas como leídas
          </Button>
        )}
      </div>

      {/* Filtros */}
      <div className={styles.filters}>
        <div className={styles.searchBar}>
          <Input
            type="text"
            placeholder="Buscar por vehículo o mensaje..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon="🔍"
          />
        </div>

        <div className={styles.filterButtons}>
          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>Severidad:</span>
            <button
              className={`${styles.filterBtn} ${severityFilter === 'all' ? styles.filterBtnActive : ''}`}
              onClick={() => setSeverityFilter('all')}
            >
              Todas
            </button>
            <button
              className={`${styles.filterBtn} ${severityFilter === 'critical' ? styles.filterBtnActive : ''}`}
              onClick={() => setSeverityFilter('critical')}
            >
              🚨 Críticas
            </button>
            <button
              className={`${styles.filterBtn} ${severityFilter === 'warning' ? styles.filterBtnActive : ''}`}
              onClick={() => setSeverityFilter('warning')}
            >
              ⚠️ Advertencias
            </button>
            <button
              className={`${styles.filterBtn} ${severityFilter === 'info' ? styles.filterBtnActive : ''}`}
              onClick={() => setSeverityFilter('info')}
            >
              ℹ️ Info
            </button>
          </div>

          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>Estado:</span>
            <button
              className={`${styles.filterBtn} ${statusFilter === 'all' ? styles.filterBtnActive : ''}`}
              onClick={() => setStatusFilter('all')}
            >
              Todas
            </button>
            <button
              className={`${styles.filterBtn} ${statusFilter === 'unread' ? styles.filterBtnActive : ''}`}
              onClick={() => setStatusFilter('unread')}
            >
              No leídas ({unreadAlerts.length})
            </button>
            <button
              className={`${styles.filterBtn} ${statusFilter === 'read' ? styles.filterBtnActive : ''}`}
              onClick={() => setStatusFilter('read')}
            >
              Leídas
            </button>
          </div>
        </div>
      </div>

      {/* Resultados */}
      <div className={styles.results}>
        <p className={styles.resultsText}>
          Mostrando {filteredAlerts.length} de {alerts.length} alertas
        </p>
      </div>

      <div className={styles.alertsList}>
        {filteredAlerts.length === 0 ? (
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>
              {searchTerm || severityFilter !== 'all' || statusFilter !== 'all' ? '🔍' : '🔔'}
            </span>
            <p className={styles.emptyText}>
              {searchTerm || severityFilter !== 'all' || statusFilter !== 'all' 
                ? 'No se encontraron alertas con esos filtros'
                : 'No hay alertas'}
            </p>
          </div>
        ) : (
          filteredAlerts.map(alert => (
            <Card
              key={alert.id}
              variant="outlined"
              padding="medium"
              className={!alert.read ? styles.unread : ''}
            >
              <div className={styles.alertCard}>
                <span className={styles.alertIcon}>
                  {getSeverityIcon(alert.severity)}
                </span>
                
                <div className={styles.alertContent}>
                  <div className={styles.alertHeader}>
                    <h3 className={styles.alertVehicle}>{alert.vehicleName}</h3>
                    <span
                      className={styles.alertSeverity}
                      style={{ color: getSeverityColor(alert.severity) }}
                    >
                      {alert.severity}
                    </span>
                  </div>
                  
                  <p className={styles.alertMessage}>{alert.message}</p>
                  
                  <div className={styles.alertFooter}>
                    <span className={styles.alertTime}>
                      {formatRelativeTime(alert.timestamp)}
                    </span>
                    {!alert.read && (
                      <Button
                        variant="outline"
                        size="small"
                        onClick={() => markAsRead(alert.id)}
                      >
                        Marcar como leída
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default AlertsPage;