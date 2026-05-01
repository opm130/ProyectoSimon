/**
 * Funciones de formateo
 */

export const formatSpeed = (speed) => {
  if (typeof speed !== 'number') return '0 km/h';
  return `${Math.round(speed)} km/h`;
};

export const formatFuel = (fuelLevel) => {
  if (typeof fuelLevel !== 'number') return '0%';
  return `${Math.round(fuelLevel)}%`;
};

export const formatTemperature = (temp) => {
  if (typeof temp !== 'number') return '0°C';
  return `${Math.round(temp)}°C`;
};

export const formatDistance = (km) => {
  if (typeof km !== 'number') return '0 km';
  if (km >= 1000) {
    return `${(km / 1000).toFixed(1)}k km`;
  }
  return `${Math.round(km)} km`;
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export const formatTime = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleTimeString('es-CO', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatDateTime = (dateString) => {
  if (!dateString) return '';
  return `${formatDate(dateString)} ${formatTime(dateString)}`;
};

export const getTimeAgo = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Ahora';
  if (diffMins === 1) return 'Hace 1 minuto';
  if (diffMins < 60) return `Hace ${diffMins} minutos`;
  if (diffHours === 1) return 'Hace 1 hora';
  if (diffHours < 24) return `Hace ${diffHours} horas`;
  if (diffDays === 1) return 'Ayer';
  if (diffDays < 7) return `Hace ${diffDays} días`;
  return formatDate(dateString);
};
