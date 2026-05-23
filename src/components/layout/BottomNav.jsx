import { NavLink } from 'react-router'
import { Home, Compass, MessageCircle, Users, User } from 'lucide-react'
import { motion } from 'motion/react'
import styles from './BottomNav.module.css'

export default function BottomNav() {
  const tabs = [
    { to: '/', icon: Home, label: 'Inicio' },
    { to: '/explore', icon: Compass, label: 'Explorar' },
    { to: '/chat', icon: MessageCircle, label: 'Chat', hasBadge: true },
    { to: '/groups', icon: Users, label: 'Grupos' },
    { to: '/privacy', icon: User, label: 'Perfil' },
  ]

  return (
    <nav className={styles.bottomNav}>
      <div className={styles.navContainer}>
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) => 
              `${styles.navItem} ${isActive ? styles.active : ''}`
            }
          >
            {({ isActive }) => (
              <>
                <div className={styles.iconContainer}>
                  <tab.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                  {tab.hasBadge && <span className={styles.badge} />}
                </div>
                <span className={styles.label}>{tab.label}</span>
                {isActive && (
                  <motion.div 
                    layoutId="nav-indicator"
                    className={styles.indicator}
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
