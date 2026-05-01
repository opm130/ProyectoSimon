import { MASK_CONFIG } from '../../config/constants';

export const maskDeviceId = (deviceId, isAdmin = false) => {
  if (!deviceId) return 'N/A';
  
  if (isAdmin) return deviceId;
  
  if (deviceId.length <= MASK_CONFIG.PREFIX_LENGTH + MASK_CONFIG.SUFFIX_LENGTH) {
    return deviceId[0] + MASK_CONFIG.MASK_CHAR.repeat(deviceId.length - 1);
  }
  
  const prefix = deviceId.substring(0, MASK_CONFIG.PREFIX_LENGTH);
  const suffix = deviceId.substring(deviceId.length - MASK_CONFIG.SUFFIX_LENGTH);
  const maskedLength = deviceId.length - MASK_CONFIG.PREFIX_LENGTH - MASK_CONFIG.SUFFIX_LENGTH;
  const masked = MASK_CONFIG.MASK_CHAR.repeat(Math.max(maskedLength, 4));
  
  return `${prefix}${masked}${suffix}`;
};


export const isMasked = (deviceId) => {
  if (!deviceId) return false;
  return deviceId.includes(MASK_CONFIG.MASK_CHAR);
};

export const getVisiblePart = (deviceId) => {
  if (!deviceId) return '';
  if (!isMasked(deviceId)) return deviceId;
  
  return deviceId.replace(new RegExp(`\\${MASK_CONFIG.MASK_CHAR}+`, 'g'), '...');
};