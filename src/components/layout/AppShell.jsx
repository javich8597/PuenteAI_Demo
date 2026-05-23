import { Outlet } from 'react-router'
import Header from './Header'
import BottomNav from './BottomNav'
import EmergencyFAB from '../common/EmergencyFAB'
import QuickExitButton from '../common/QuickExitButton'
import styles from './AppShell.module.css'

export default function AppShell() {
  return (
    <div className={styles.appShell}>
      <Header />
      
      <main className={`page-container ${styles.mainContent}`}>
        <Outlet />
      </main>

      <BottomNav />
      
      <EmergencyFAB />
      <QuickExitButton />
    </div>
  )
}
