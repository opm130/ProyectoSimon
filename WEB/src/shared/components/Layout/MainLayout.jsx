import { NavLink, Outlet } from 'react-router-dom';
import useAlertStore from '../../../store/alertStore';
import Header from './Header';
import styles from './MainLayout.module.css';
import ConnectionIndicator from '../ConnectionIndicator/ConnectionIndicator';

const MainLayout = () => {
  const unreadCount = useAlertStore((state) => state.unreadCount);

  return (
    <div className={styles.layout}>
      <Header />

      <nav className={styles.nav}>
        <div className={styles.navContainer}>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink
            }
          >
            <span className={styles.navIcon}>📊</span>
            Dashboard
          </NavLink>

          <NavLink
            to="/map"
            className={({ isActive }) =>
              isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink
            }
          >
            <span className={styles.navIcon}>🗺️</span>
            Mapa
          </NavLink>

          <NavLink
            to="/alerts"
            className={({ isActive }) =>
              isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink
            }
          >
            <span className={styles.navIcon}>🔔</span>
            Alertas
            {unreadCount > 0 && <span className={styles.badge}>{unreadCount}</span>}
          </NavLink>

          <NavLink
            to="/fleet"
            className={({ isActive }) =>
              isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink
            }
          >
            <span className={styles.navIcon}>🚛</span>
            Flota
          </NavLink>
          

        </div>
      </nav>

      <main className={styles.main}>
        <div className={styles.container}>
          <Outlet />
        </div>
      </main>
      <ConnectionIndicator />
    </div>
  );
};

export default MainLayout;