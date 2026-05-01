import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../../store/authStore';
import authService from '../../../services/authService';
import Button from '../Button/Button';
import styles from './Header.module.css';

const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await authService.logout();
    logout();
    navigate('/login');
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>🚗</span>
          <h1 className={styles.logoText}>Simon Fleet Monitor</h1>
        </div>

        <div className={styles.userSection}>
          <div className={styles.userInfo}>
            <span className={styles.userName}>{user?.name}</span>
            <span className={styles.userRole}>({user?.role})</span>
          </div>
          <Button variant="outline" size="small" onClick={handleLogout}>
            Cerrar Sesión
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;