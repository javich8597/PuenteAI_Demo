import { NavLink, Outlet, useNavigate } from 'react-router'
import { LayoutDashboard, FileText, Users, ShieldAlert, LogOut } from 'lucide-react'
import useAuthStore from '../store/useAuthStore'
import styles from './AdminLayout.module.css'

export default function AdminLayout() {
  const navigate = useNavigate()
  const { logout, user } = useAuthStore()

  const handleLogout = () => {
    logout()
    navigate('/entry')
  }

  const navItems = [
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
    { to: '/admin/content', icon: FileText, label: 'Contenido' },
    { to: '/admin/users', icon: Users, label: 'Usuarias' },
    { to: '/admin/moderation', icon: ShieldAlert, label: 'Moderación' },
  ]

  return (
    <div className={styles.adminContainer}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <div className={styles.logo}>
            <span className={styles.logoText}>PuenteAI Admin</span>
          </div>
          <p className={styles.roleText}>Modo Moderadora</p>
        </div>

        <nav className={styles.nav}>
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => 
                `${styles.navItem} ${isActive ? styles.active : ''}`
              }
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.adminProfile}>
            <div className={styles.avatar}>{user?.avatar || 'A'}</div>
            <div className={styles.adminInfo}>
              <span className={styles.adminName}>{user?.name}</span>
              <span className={styles.adminRole}>MUSA Staff</span>
            </div>
          </div>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            <LogOut size={18} /> Salir
          </button>
        </div>
      </aside>

      <main className={styles.mainContent}>
        <Outlet />
      </main>
    </div>
  )
}
