
export const formatDate = (date) => {
  if (!date) return 'N/A';
  
  const d = new Date(date);
  return d.toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};


export const formatDateTime = (date) => {
  if (!date) return 'N/A';
  
  const d = new Date(date);
  return d.toLocaleString('es-CO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatRelativeTime = (date) => {
  if (!date) return 'N/A';
  
  const now = new Date();
  const past = new Date(date);
  const diffMs = now - past;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return 'Ahora';
  if (diffMins < 60) return `Hace ${diffMins} min`;
  if (diffHours < 24) return `Hace ${diffHours} h`;
  if (diffDays < 7) return `Hace ${diffDays} días`;
  
  return formatDate(date);
};

export const formatSpeed = (speed) => {
  if (speed === null || speed === undefined) return 'N/A';
  return `${Math.round(speed)} km/h`;
};

export const formatFuel = (level) => {
  if (level === null || level === undefined) return 'N/A';
  return `${Math.round(level)} L`;
};

export const formatTemperature = (temp) => {
  if (temp === null || temp === undefined) return 'N/A';
  return `${Math.round(temp)}°C`;
};

export const formatPercentage = (value, total) => {
  if (!value || !total) return '0%';
  const percentage = (value / total) * 100;
  return `${Math.round(percentage)}%`;
};

export const formatNumber = (num) => {
  if (!num) return '0';
  
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  
  return num.toString();
};

export const formatDuration = (minutes) => {
  if (!minutes) return '0 min';
  
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) return `${mins} min`;
  if (mins === 0) return `${hours} h`;
  
  return `${hours} h ${mins} min`;
};