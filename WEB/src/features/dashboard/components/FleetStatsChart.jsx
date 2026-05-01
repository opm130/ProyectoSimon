import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import Card from '../../../shared/components/Card/Card';
import styles from './FleetStatsChart.module.css';

/**
 * Gráfico de estadísticas de la flota (estado de vehículos)
 */
const FleetStatsChart = ({ vehicles }) => {
  const statusCount = vehicles.reduce((acc, vehicle) => {
    acc[vehicle.status] = (acc[vehicle.status] || 0) + 1;
    return acc;
  }, {});

  const data = [
    { name: 'Activos', value: statusCount.active || 0, color: '#10b981' },
    { name: 'Inactivos', value: statusCount.idle || 0, color: '#f59e0b' },
    { name: 'Mantenimiento', value: statusCount.maintenance || 0, color: '#ef4444' },
  ].filter(item => item.value > 0);

  const COLORS = data.map(d => d.color);

  return (
    <Card variant="outlined" padding="medium">
      <div className={styles.container}>
        <div className={styles.header}>
          <h3 className={styles.title}>📈 Estado de la Flota</h3>
          <p className={styles.subtitle}>Distribución actual</p>
        </div>

        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>

        <div className={styles.summary}>
          {data.map((item, index) => (
            <div key={index} className={styles.summaryItem}>
              <div 
                className={styles.summaryDot} 
                style={{ backgroundColor: item.color }}
              />
              <span className={styles.summaryLabel}>{item.name}</span>
              <span className={styles.summaryValue}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default FleetStatsChart;