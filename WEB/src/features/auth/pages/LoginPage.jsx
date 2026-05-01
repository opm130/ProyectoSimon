import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../../store/authStore';
import Button from '../../../shared/components/Button/Button';
import Input from '../../../shared/components/Input/Input';
import styles from './LoginPage.module.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, error, isLoading } = useAuthStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const success = await login(email, password);
    
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <span className={styles.icon}>🚗</span>
          <h1 className={styles.title}>Simon Fleet Monitor</h1>
          <p className={styles.subtitle}>Sistema de Monitoreo de Flotas</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <Input
            label="Correo Electrónico"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="correo@ejemplo.com"
            leftIcon="📧"
            required
          />

          <Input
            label="Contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            leftIcon="🔒"
            required
          />

          {error && (
            <div className={styles.error}>
              <span>⚠️</span>
              <p>{error}</p>
            </div>
          )}

          <Button type="submit" fullWidth loading={isLoading}>
            {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </Button>
        </form>

        <div className={styles.demo}>
          <p className={styles.demoTitle}>🔑 Credenciales de prueba:</p>
          <p className={styles.demoText}>
            <strong>Admin:</strong> admin@simon.com / admin123
          </p>
          <p className={styles.demoText}>
            <strong>Usuario:</strong> user@simon.com / user123
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;