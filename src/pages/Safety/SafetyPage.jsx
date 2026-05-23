import { useNavigate } from 'react-router'
import { motion } from 'motion/react'
import { PhoneCall, ShieldAlert, HeartPulse, Scale, XCircle } from 'lucide-react'
import styles from './SafetyPage.module.css'

const emergencies = [
  {
    id: '112',
    name: 'Emergencias Generales',
    number: '112',
    desc: 'Policía, bomberos, ambulancia (Gratuito y 24h)',
    icon: ShieldAlert,
    color: '#FF6B6B'
  },
  {
    id: '016',
    name: 'Atención Violencia de Género',
    number: '016',
    desc: 'No deja rastro en la factura (Gratuito y 24h)',
    icon: PhoneCall,
    color: '#E07A5F'
  },
  {
    id: '061',
    name: 'Emergencias Médicas (CatSalut)',
    number: '061',
    desc: 'Consultas médicas y urgencias',
    icon: HeartPulse,
    color: '#81B29A'
  },
  {
    id: 'musa',
    name: 'Asesoría MUSA',
    number: 'Contactar por Chat',
    desc: 'Ayuda legal y soporte a madres migrantes',
    icon: Scale,
    color: '#3D405B',
    isChat: true
  }
]

export default function SafetyPage() {
  const navigate = useNavigate()

  return (
    <motion.div 
      className={styles.page}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <header className={styles.header}>
        <ShieldAlert size={48} color="var(--color-error)" className={styles.pulseIcon} />
        <h1 className={styles.title}>Centro de Seguridad</h1>
        <p className={styles.subtitle}>
          Si estás en peligro inminente, llama al 112.
        </p>
      </header>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Contactos Rápidos</h2>
        <div className={styles.grid}>
          {emergencies.map(em => (
            <div key={em.id} className={styles.card} style={{ '--theme-color': em.color }}>
              <div className={styles.cardHeader}>
                <div className={styles.iconWrapper}>
                  <em.icon size={24} color={em.color} />
                </div>
                <h3 className={styles.cardTitle}>{em.name}</h3>
              </div>
              <p className={styles.cardDesc}>{em.desc}</p>
              
              {em.isChat ? (
                <button 
                  className={styles.callBtn} 
                  onClick={() => navigate('/chat/conv-3')}
                  style={{ backgroundColor: em.color }}
                >
                  Abrir Chat Seguro
                </button>
              ) : (
                <a 
                  href={`tel:${em.number}`} 
                  className={styles.callBtn}
                  style={{ backgroundColor: em.color }}
                >
                  <PhoneCall size={16} /> Llamar {em.number}
                </a>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className={styles.infoSection}>
        <div className={styles.infoCard}>
          <XCircle size={24} color="var(--color-error)" />
          <div>
            <h3>Botón de Salida Rápida</h3>
            <p>
              El botón flotante con la 'X' en la esquina de tu pantalla cierra la aplicación instantáneamente y borra tu historial de navegación actual por tu seguridad.
            </p>
          </div>
        </div>
      </section>

    </motion.div>
  )
}
