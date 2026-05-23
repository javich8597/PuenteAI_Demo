import { useNavigate, useLocation } from 'react-router'
import { ChevronLeft, Bell, LogOut } from 'lucide-react'
import { useAuthStore } from '../../store/useAuthStore'
import styles from './Header.module.css'

export default function Header() {
  const navigate = useNavigate()
  const location = useLocation()
  const isHome = location.pathname === '/'
  const logout = useAuthStore(s => s.logout)

  const handleLogout = () => {
    logout()
    navigate('/entry')
  }

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {!isHome ? (
          <button 
            className={styles.iconButton} 
            onClick={() => navigate(-1)}
            aria-label="Volver atrás"
          >
            <ChevronLeft size={28} />
          </button>
        ) : (
          <div className={styles.logo}>
            <span className={styles.logoDot} style={{ backgroundColor: 'var(--color-primary)' }}></span>
            <span className={styles.logoDot} style={{ backgroundColor: 'var(--color-secondary)' }}></span>
            <span className={styles.logoDot} style={{ backgroundColor: 'var(--color-accent)' }}></span>
            <span className={styles.logoText}>PuenteAI</span>
          </div>
        )}

        <div className={styles.actions}>
          {isHome && (
            <button className={styles.iconButton} aria-label="Notificaciones">
              <Bell size={24} />
              <span className={styles.notificationBadge} />
            </button>
          )}
          <button className={styles.iconButton} aria-label="Cerrar sesión" onClick={handleLogout}>
            <LogOut size={24} color="var(--color-text-secondary)" />
          </button>
        </div>
      </div>
    </header>
  )
}
