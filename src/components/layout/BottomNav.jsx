import { NavLink } from 'react-router'
import { Home, Compass, MessageCircle, Users, User, Sprout } from 'lucide-react'
import { motion } from 'motion/react'
import { useTranslation } from '../../hooks/useTranslation'
import styles from './BottomNav.module.css'

export default function BottomNav() {
  const { t } = useTranslation()

  const tabs = [
    { to: '/', icon: Home, label: t('nav.home') },
    { to: '/explore', icon: Compass, label: t('nav.explore') },
    { to: '/chat', icon: MessageCircle, label: t('nav.chat'), hasBadge: true },
    { to: '/rewards', icon: Sprout, label: t('nav.rewards') },
    { to: '/privacy', icon: User, label: t('nav.profile') },
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
