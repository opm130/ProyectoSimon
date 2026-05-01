import { useState } from 'react';
import useFleetStore from '../../../store/fleetStore';
import useAuthStore from '../../../store/authStore';
import Card from '../../../shared/components/Card/Card';
import Input from '../../../shared/components/Input/Input';
import { formatSpeed, formatFuel, formatRelativeTime } from '../../../shared/utils/formatters';
import { maskDeviceId } from '../../../shared/utils/deviceMask';
import styles from './FleetPage.module.css';

const FleetPage = () => {
  const { vehicles } = useFleetStore();
  const { isAdmin } = useAuthStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  // Filtrar vehículos
  let filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.location.address.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || vehicle.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Ordenar vehículos
  filteredVehicles = [...filteredVehicles].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'speed':
        return b.speed - a.speed;
      case 'fuel':
        return a.fuelLevel - b.fuelLevel;
      case 'temperature':
        return b.temperature - a.temperature;
      default:
        return 0;
    }
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#10b981';
      case 'idle': return '#f59e0b';
      case 'maintenance': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'active': return 'Activo';
      case 'idle': return 'Inactivo';
      case 'maintenance': return 'Mantenimiento';
      default: return status;
    }
  };

  const statusCounts = vehicles.reduce((acc, v) => {
    acc[v.status] = (acc[v.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Gestión de Flota</h1>
        <p className={styles.subtitle}>{vehicles.length} vehículos en total</p>
      </div>

      {/* Filtros */}
      <div className={styles.filters}>
        <div className={styles.searchBar}>
          <Input
            type="text"
            placeholder="Buscar por nombre, ID o ubicación..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon="🔍"
          />
        </div>

        <div className={styles.filterRow}>
          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>Estado:</span>
            <button
              className={`${styles.filterBtn} ${statusFilter === 'all' ? styles.filterBtnActive : ''}`}
              onClick={() => setStatusFilter('all')}
            >
              Todos ({vehicles.length})
            </button>
            <button
              className={`${styles.filterBtn} ${statusFilter === 'active' ? styles.filterBtnActive : ''}`}
              onClick={() => setStatusFilter('active')}
            >
              🟢 Activos ({statusCounts.active || 0})
            </button>
            <button
              className={`${styles.filterBtn} ${statusFilter === 'idle' ? styles.filterBtnActive : ''}`}
              onClick={() => setStatusFilter('idle')}
            >
              🟡 Inactivos ({statusCounts.idle || 0})
            </button>
            <button
              className={`${styles.filterBtn} ${statusFilter === 'maintenance' ? styles.filterBtnActive : ''}`}
              onClick={() => setStatusFilter('maintenance')}
            >
              🔴 Mantenimiento ({statusCounts.maintenance || 0})
            </button>
          </div>

          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>Ordenar:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={styles.select}
            >
              <option value="name">Nombre</option>
              <option value="speed">Velocidad</option>
              <option value="fuel">Combustible</option>
              <option value="temperature">Temperatura</option>
            </select>
          </div>
        </div>
      </div>

      {/* Resultados */}
      <div className={styles.results}>
        <p className={styles.resultsText}>
          Mostrando {filteredVehicles.length} de {vehicles.length} vehículos
        </p>
      </div>

      <div className={styles.vehiclesList}>
        {filteredVehicles.length === 0 ? (
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>🔍</span>
            <p className={styles.emptyText}>No se encontraron vehículos con esos filtros</p>
          </div>
        ) : (
          filteredVehicles.map(vehicle => (
            <Card key={vehicle.id} variant="outlined" padding="medium">
              <div className={styles.vehicleCard}>
                <div className={styles.vehicleHeader}>
                  <div className={styles.vehicleInfo}>
                    <h3 className={styles.vehicleName}>{vehicle.name}</h3>
                    <p className={styles.vehicleId}>
                      {maskDeviceId(vehicle.id, isAdmin())}
                    </p>
                  </div>
                  
                  <div
                    className={styles.statusBadge}
                    style={{
                      backgroundColor: getStatusColor(vehicle.status) + '20',
                      color: getStatusColor(vehicle.status)
                    }}
                  >
                    {getStatusLabel(vehicle.status)}
                  </div>
                </div>

                <div className={styles.vehicleStats}>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>Velocidad</span>
                    <span className={styles.statValue}>{formatSpeed(vehicle.speed)}</span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>Combustible</span>
                    <span className={styles.statValue}>{formatFuel(vehicle.fuelLevel)}</span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>Temperatura</span>
                    <span className={styles.statValue}>{vehicle.temperature}°C</span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>Kilometraje</span>
                    <span className={styles.statValue}>{vehicle.mileage?.toLocaleString()} km</span>
                  </div>
                </div>

                <div className={styles.vehicleFooter}>
                  <p className={styles.location}>
                    📍 {vehicle.location.address}
                  </p>
                  <span className={styles.updated}>
                    {formatRelativeTime(vehicle.lastUpdate)}
                  </span>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default FleetPage;