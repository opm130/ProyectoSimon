import { describe, test, expect } from 'vitest';

function maskDeviceId(deviceId, isAdmin = false) {
  if (isAdmin) {
    return deviceId;
  }
  
  if (!deviceId || deviceId.length < 8) {
    return deviceId;
  }
  
  const parts = deviceId.split('-');
  
  if (parts.length === 3) {
    const [prefix, middle, suffix] = parts;
    const maskedMiddle = '*'.repeat(middle.length);
    return `${prefix}-${maskedMiddle}-${suffix}`;
  }
  
  const firstPart = deviceId.slice(0, 4);
  const lastPart = deviceId.slice(-4);
  const maskedMiddle = '*'.repeat(deviceId.length - 8);
  
  return `${firstPart}${maskedMiddle}${lastPart}`;
}

describe('maskDeviceId Function', () => {
  test('debería enmascarar correctamente un ID con formato XXX-XXXXX-XXXX', () => {
    const deviceId = 'DEV-12345-XC54';
    const result = maskDeviceId(deviceId, false);
    
    expect(result).toBe('DEV-*****-XC54');
  });

  test('debería mostrar ID completo para admin', () => {
    const deviceId = 'DEV-12345-XC54';
    const result = maskDeviceId(deviceId, true);
    
    expect(result).toBe('DEV-12345-XC54');
  });

  test('debería enmascarar ID sin guiones', () => {
    const deviceId = 'ABCD1234EFGH5678';
    const result = maskDeviceId(deviceId, false);
    
    expect(result).toBe('ABCD********5678');
  });

  test('debería devolver ID original si es muy corto (<8 caracteres)', () => {
    const shortId = 'ABC123';
    const result = maskDeviceId(shortId, false);
    
    expect(result).toBe('ABC123');
  });

  test('debería manejar IDs nulos o vacíos', () => {
    expect(maskDeviceId(null, false)).toBe(null);
    expect(maskDeviceId('', false)).toBe('');
    expect(maskDeviceId(undefined, false)).toBe(undefined);
  });

  test('debería enmascarar diferentes formatos de ID', () => {
    const testCases = [
      { input: 'DEV-67890-AB12', expected: 'DEV-*****-AB12' },
      { input: 'DEV-11223-YZ89', expected: 'DEV-*****-YZ89' },
      { input: 'ABC-12-XYZ', expected: 'ABC-**-XYZ' },
    ];

    testCases.forEach(({ input, expected }) => {
      expect(maskDeviceId(input, false)).toBe(expected);
    });
  });

  test('debería preservar la longitud total del ID', () => {
    const deviceId = 'DEV-12345-XC54';
    const masked = maskDeviceId(deviceId, false);
    
    expect(masked.length).toBe(deviceId.length);
  });

  test('NO debería enmascarar para usuarios admin', () => {
    const testIds = [
      'DEV-12345-XC54',
      'ABC-67890-XYZ',
      'TEST-11111-ABCD'
    ];

    testIds.forEach(id => {
      expect(maskDeviceId(id, true)).toBe(id);
    });
  });
});