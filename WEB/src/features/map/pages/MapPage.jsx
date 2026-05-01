import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import useFleetStore from '../../../store/fleetStore';
import useAuthStore from '../../../store/authStore';
import { formatSpeed, formatFuel, formatRelativeTime } from '../../../shared/utils/formatters';
import { maskDeviceId } from '../../../shared/utils/deviceMask';
import 'leaflet/dist/leaflet.css';
import styles from './MapPage.module.css';


import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

const MapPage = () => {
  const { vehicles } = useFleetStore();
  const { isAdmin } = useAuthStore();


  const center = [4.7110, -74.0721];

  const getMarkerColor = (status) => {
    switch (status) {
      case 'active': return '🟢';
      case 'idle': return '🟡';
      case 'maintenance': return '🔴';
      default: return '⚪';
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Mapa de Flota</h1>
        <p className={styles.subtitle}>{vehicles.length} vehículos en el mapa</p>
      </div>

      <div className={styles.mapContainer}>
        <MapContainer
          center={center}
          zoom={12}
          scrollWheelZoom={true}
          className={styles.map}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {vehicles.map((vehicle) => (
            <Marker
              key={vehicle.id}
              position={[vehicle.location.latitude, vehicle.location.longitude]}
            >
              <Popup>
                <div className={styles.popup}>
                  <div className={styles.popupHeader}>
                    <span className={styles.popupStatus}>
                      {getMarkerColor(vehicle.status)}
                    </span>
                    <h3 className={styles.popupTitle}>{vehicle.name}</h3>
                  </div>
                  
                  <p className={styles.popupId}>
                    {maskDeviceId(vehicle.id, isAdmin())}
                  </p>

                  <div className={styles.popupStats}>
                    <div className={styles.popupStat}>
                      <span>⚡</span>
                      <span>{formatSpeed(vehicle.speed)}</span>
                    </div>
                    <div className={styles.popupStat}>
                      <span>⛽</span>
                      <span>{formatFuel(vehicle.fuelLevel)}</span>
                    </div>
                    <div className={styles.popupStat}>
                      <span>🌡️</span>
                      <span>{vehicle.temperature}°C</span>
                    </div>
                  </div>

                  <p className={styles.popupAddress}>
                    📍 {vehicle.location.address}
                  </p>

                  <p className={styles.popupTime}>
                    {formatRelativeTime(vehicle.lastUpdate)}
                  </p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

    
      <div className={styles.legend}>
        <h3 className={styles.legendTitle}>Leyenda</h3>
        <div className={styles.legendItems}>
          <div className={styles.legendItem}>
            <span>🟢</span>
            <span>Activo</span>
          </div>
          <div className={styles.legendItem}>
            <span>🟡</span>
            <span>Inactivo</span>
          </div>
          <div className={styles.legendItem}>
            <span>🔴</span>
            <span>Mantenimiento</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapPage;