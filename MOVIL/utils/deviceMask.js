/**
 * Enmascaramiento de IDs de dispositivos para privacidad
 */

export const maskDeviceId = (deviceId, userRole = 'user') => {
  if (!deviceId) return '';
  
  // Solo admin puede ver IDs completos
  if (userRole === 'admin') {
    return deviceId;
  }

  // Para usuarios normales, enmascarar la parte media
  // Ejemplo: DEV-12345-XC54 → DEV-****-XC54
  const parts = deviceId.split('-');
  
  if (parts.length === 3) {
    return `${parts[0]}-****-${parts[2]}`;
  }

  // Si no tiene formato esperado, enmascarar caracteres del medio
  if (deviceId.length > 8) {
    const start = deviceId.substring(0, 3);
    const end = deviceId.substring(deviceId.length - 4);
    return `${start}****${end}`;
  }

  return '****';
};

export const getVisibleDeviceId = (vehicle, userRole) => {
  return maskDeviceId(vehicle.id, userRole);
};
