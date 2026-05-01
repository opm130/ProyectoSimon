import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Card from '../../../shared/components/Card/Card';
import styles from './FuelChart.module.css';

/**
 * Gráfico de consumo de combustible histórico
 */
const FuelChart = ({ data }) => {
  // Formatear datos para Recharts
  const chartData = data.map((item, index) => ({
    name: `Día ${7 - index}`,
    combustible: item.level,
    fecha: new Date(item.timestamp).toLocaleDateString('es-CO', { 
      month: 'short', 
      day: 'numeric' 
    }),
  }));

  return (
    <Card variant="outlined" padding="medium">
      <div className={styles.container}>
        <div className={styles.header}>
          <h3 className={styles.title}>📊 Consumo de Combustible (7 días)</h3>
          <p className={styles.subtitle}>Promedio de la flota</p>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="fecha" 
              tick={{ fontSize: 12 }}
              stroke="#6b7280"
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              stroke="#6b7280"
              label={{ value: 'Litros', angle: -90, position: 'insideLeft', style: { fontSize: 12 } }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}
              labelStyle={{ fontWeight: 600, marginBottom: '4px' }}
            />
            <Legend 
              wrapperStyle={{ fontSize: '14px', paddingTop: '10px' }}
            />
            <Line 
              type="monotone" 
              dataKey="combustible" 
              stroke="#2563eb" 
              strokeWidth={3}
              dot={{ fill: '#2563eb', strokeWidth: 2, r: 5 }}
              activeDot={{ r: 7 }}
              name="Combustible (L)"
            />
          </LineChart>
        </ResponsiveContainer>

        <div className={styles.insights}>
          <div className={styles.insight}>
            <span className={styles.insightIcon}>📉</span>
            <div>
              <p className={styles.insightLabel}>Consumo promedio</p>
              <p className={styles.insightValue}>
                {(data.reduce((acc, d) => acc + d.level, 0) / data.length).toFixed(1)} L/día
              </p>
            </div>
          </div>
          
          <div className={styles.insight}>
            <span className={styles.insightIcon}>⚠️</span>
            <div>
              <p className={styles.insightLabel}>Tendencia</p>
              <p className={styles.insightValue}>
                {data[0].level < data[data.length - 1].level ? '↓ Descendente' : '↑ Ascendente'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default FuelChart;