describe('Fuel Autonomy Calculation', () => {
  const AVERAGE_CONSUMPTION = 5; // Litros por hora
  const CRITICAL_HOURS = 1;
  const WARNING_HOURS = 2;

  function calculateFuelAlert(fuelLevel) {
    const autonomyHours = fuelLevel / AVERAGE_CONSUMPTION;
    
    if (autonomyHours < CRITICAL_HOURS) {
      return {
        shouldAlert: true,
        severity: 'critical',
        message: `Combustible crítico. Autonomía: ${autonomyHours.toFixed(1)} horas`,
        autonomyHours
      };
    }
    
    if (autonomyHours < WARNING_HOURS) {
      return {
        shouldAlert: true,
        severity: 'warning',
        message: `Combustible bajo. Autonomía: ${autonomyHours.toFixed(1)} horas`,
        autonomyHours
      };
    }
    
    return { shouldAlert: false };
  }

  test('debería generar alerta crítica cuando autonomía < 1 hora', () => {
    const result = calculateFuelAlert(4); // 4 litros / 5 = 0.8 horas
    
    expect(result.shouldAlert).toBe(true);
    expect(result.severity).toBe('critical');
    expect(result.autonomyHours).toBe(0.8);
    expect(result.message).toContain('0.8 horas');
  });

  test('debería generar alerta warning cuando autonomía entre 1-2 horas', () => {
    const result = calculateFuelAlert(7.5); // 7.5 litros / 5 = 1.5 horas
    
    expect(result.shouldAlert).toBe(true);
    expect(result.severity).toBe('warning');
    expect(result.autonomyHours).toBe(1.5);
    expect(result.message).toContain('1.5 horas');
  });

  test('NO debería generar alerta cuando autonomía > 2 horas', () => {
    const result = calculateFuelAlert(15); // 15 litros / 5 = 3 horas
    
    expect(result.shouldAlert).toBe(false);
    expect(result.severity).toBeUndefined();
  });

  test('debería manejar valores límite correctamente', () => {
    // Exactamente 1 hora (límite crítico)
    const critical = calculateFuelAlert(5);
    expect(critical.severity).toBe('warning'); // Justo fuera del crítico
    
    // Exactamente 2 horas (límite warning)
    const warning = calculateFuelAlert(10);
    expect(warning.shouldAlert).toBe(false); // Justo fuera del warning
  });

  test('debería manejar combustible vacío', () => {
    const result = calculateFuelAlert(0);
    
    expect(result.shouldAlert).toBe(true);
    expect(result.severity).toBe('critical');
    expect(result.autonomyHours).toBe(0);
  });
});