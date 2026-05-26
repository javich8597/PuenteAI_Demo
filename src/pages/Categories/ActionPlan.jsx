import { useState } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router'
import { motion, AnimatePresence } from 'motion/react'
import { ArrowLeft, CheckCircle, ShieldCheck, ChevronDown, MapPin, Map, FileText, ExternalLink, Users } from 'lucide-react'
import styles from './ActionPlan.module.css'
import categories from '../../data/categories'

export default function ActionPlan() {
  const { id: categoryId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { answers, isAnxious } = location.state || { answers: {}, isAnxious: false }

  const category = categories.find(c => c.id === categoryId) || categories[0]
  const [openCard, setOpenCard] = useState('paso1')

  const toggleCard = (id) => {
    setOpenCard(openCard === id ? null : id)
  }

  const handleCompanionRequest = () => {
    alert("¡Solicitud enviada! En breve una Madre Tutora de MUSA se pondrá en contacto contigo para acompañarte a la oficina.")
  }

  return (
    <motion.div 
      className={styles.page}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate(`/categories/${categoryId}`)}>
          <ArrowLeft size={24} color="var(--color-navy)" />
        </button>
        <h1 className={styles.headerTitle}>Tu Plan de Acción</h1>
      </header>

      <div className={styles.validationBadge}>
        <ShieldCheck size={20} color="var(--color-success)" />
        <p><strong>Validado por MUSA - Associació de Suport a la Integració.</strong> Todos los pasos, oficinas y referencias legales han sido revisados y certificados.</p>
      </div>

      <div className={styles.welcomeMsg}>
        <p>Aquí tienes tu plan. Lo hemos dividido en pasos claros para que sepas qué va primero. No tienes que hacerlo todo a la vez.</p>
      </div>

      <div className={styles.content}>
        {/* Accordion Card 1: Empadronamiento */}
        <div className={styles.actionCard}>
          <button 
            className={`${styles.cardHeader} ${openCard === 'paso1' ? styles.cardHeaderOpen : ''}`}
            onClick={() => toggleCard('paso1')}
          >
            <div className={styles.cardHeaderLeft}>
              <div className={styles.stepBadge}>PASO 1</div>
              <h2 className={styles.cardTitle}>Empadronarte</h2>
            </div>
            <ChevronDown 
              size={24} 
              className={styles.chevron} 
              style={{ transform: openCard === 'paso1' ? 'rotate(180deg)' : 'rotate(0deg)' }} 
            />
          </button>

          <AnimatePresence>
            {openCard === 'paso1' && (
              <motion.div 
                className={styles.cardBody}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
              >
                <div className={styles.section}>
                  <h3><LightbulbIcon /> Qué es</h3>
                  <p>Es registrar tu dirección en el Ayuntamiento. Sirve para demostrar que vives en la ciudad. No es inmigración ni te reportarán a nadie.</p>
                </div>

                <div className={styles.section}>
                  <h3><UserCheckIcon /> Tu situación</h3>
                  <p>Según nos comentaste, no tienes contrato de alquiler y la situación de tu vivienda es complicada. Puedes usar la <strong>Declaración de Terceros</strong> (si alguien te autoriza) o el <strong>Empadronamiento Sin Domicilio Fijo</strong> a través de Servicios Sociales.</p>
                </div>

                <div className={styles.section}>
                  <h3><ClipboardIcon /> Qué hacer</h3>
                  <p>Debes pedir cita previa en la Oficina de Atención Ciudadana (OAC) de tu distrito. Si optas por 'Sin Domicilio Fijo', ve primero a Servicios Sociales.</p>
                </div>

                <div className={styles.section}>
                  <h3><FileText size={18} /> Qué documentos llevar</h3>
                  <ul className={styles.checklist}>
                    <li><CheckCircle size={16} className={styles.checkIcon}/> Tu Pasaporte original y copia.</li>
                    <li><CheckCircle size={16} className={styles.checkIcon}/> Formulario de solicitud relleno.</li>
                    <li><CheckCircle size={16} className={styles.checkIcon}/> Autorización firmada por el titular de la vivienda y copia de su DNI (o informe de Servicios Sociales).</li>
                  </ul>
                </div>

                <div className={styles.section}>
                  <h3><MapPin size={18} /> Dónde ir</h3>
                  <div className={styles.mapContainer}>
                    {/* Generico Iframe for Demo */}
                    <iframe 
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2993.447385966453!2d2.1743603156681023!3d41.38506387926449!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12a4a2f86eb8c7a7%3A0xc3f6087da34444!2sAyuntamiento%20de%20Barcelona!5e0!3m2!1ses!2ses!4v1684332145678!5m2!1ses!2ses" 
                      width="100%" 
                      height="200" 
                      style={{ border: 0, borderRadius: '8px' }} 
                      allowFullScreen="" 
                      loading="lazy" 
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                  </div>
                  <div className={styles.officeInfo}>
                    <p><strong>OAC Ciutat Vella</strong><br/>Plaça de Sant Miquel, 3<br/>Lunes a Viernes, 8:30 a 14:30</p>
                    <a href="#" className={styles.bookingLink}>Pedir cita online <ExternalLink size={14}/></a>
                  </div>
                </div>

                {isAnxious && (
                  <div className={styles.companionLayer}>
                    <Users size={20} />
                    <div>
                      <h4>¿Te da ansiedad ir sola?</h4>
                      <p>Podemos asignarte a alguien de la comunidad MUSA que quiera acompañarte a la oficina.</p>
                      <button className={styles.companionBtn} onClick={handleCompanionRequest}>
                        Solicitar Acompañamiento
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Card 2: Tarjeta Sanitaria (Closed by default) */}
        <div className={styles.actionCard}>
          <button 
            className={`${styles.cardHeader} ${openCard === 'paso2' ? styles.cardHeaderOpen : ''}`}
            onClick={() => toggleCard('paso2')}
          >
            <div className={styles.cardHeaderLeft}>
              <div className={styles.stepBadge}>PASO 2</div>
              <h2 className={styles.cardTitle}>Tarjeta Sanitaria (TSI)</h2>
            </div>
            <ChevronDown size={24} className={styles.chevron} style={{ transform: openCard === 'paso2' ? 'rotate(180deg)' : 'rotate(0deg)' }} />
          </button>
          <AnimatePresence>
            {openCard === 'paso2' && (
              <motion.div className={styles.cardBody} initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                <p>Necesitas el volante de empadronamiento (Paso 1) para poder pedir la tarjeta sanitaria en el CAP.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}

function LightbulbIcon() { return <span style={{ marginRight: '6px' }}>💡</span> }
function UserCheckIcon() { return <span style={{ marginRight: '6px' }}>👤</span> }
function ClipboardIcon() { return <span style={{ marginRight: '6px' }}>📋</span> }
