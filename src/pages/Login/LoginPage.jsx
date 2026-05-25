import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { motion } from 'motion/react'
import { ArrowLeft } from 'lucide-react'
import useAuthStore from '../../store/useAuthStore'
import styles from './LoginPage.module.css'

export default function LoginPage() {
  const navigate = useNavigate()
  const signIn = useAuthStore((s) => s.signIn)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const isAdmin = useAuthStore((s) => s.isAdmin)
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isAuthenticated) {
      if (isAdmin) {
        navigate('/admin')
      } else {
        navigate('/')
      }
    }
  }, [isAuthenticated, isAdmin, navigate])

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signIn(email, password)
      // La navegación ahora la maneja el useEffect al cambiar isAuthenticated
    } catch (err) {
      console.warn('Supabase login failed, fallback to local session for demo:', err.message);
      
      const cleanEmail = email.trim().toLowerCase();
      const isMarta = cleanEmail === 'marta@puente.ai' && password === 'puente123'
      const isAdminDemo = cleanEmail === 'admin@demo.com' && password === 'admin123'
      const isAnyAdmin = isMarta || isAdminDemo
      
      // Forzar sesión local para la demo si las credenciales fallan o el usuario es falso
      useAuthStore.setState({
        isAuthenticated: true,
        isGuest: false,
        isLoading: false,
        user: {
          id: isAnyAdmin ? (isMarta ? 'admin-001' : 'admin-002') : 'demo-login-' + Date.now(),
          email: email,
          name: isAnyAdmin ? (isMarta ? 'Marta' : 'Admin') : (email.split('@')[0] || 'Usuaria'),
          avatar: isAnyAdmin ? (isMarta ? 'Ⓜ️' : '👑') : (email ? email.charAt(0).toUpperCase() : '👤'),
          role: isAnyAdmin ? 'admin' : 'user',
          seeds: isAnyAdmin ? (isMarta ? 12 : 99) : 0
        },
        isAdmin: isAnyAdmin
      });
      // Navegación automática por useEffect
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      className={styles.page}
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
    >
      <div className={styles.header}>
        <button
          className={styles.backButton}
          onClick={() => navigate('/entry')}
          aria-label="Volver atrás"
        >
          <ArrowLeft size={20} />
        </button>
      </div>

      <div className={styles.content}>
        <h1 className={styles.heading}>¡Hola de nuevo! 👋</h1>
        <p className={styles.subtext}>Nos alegra verte. Inicia sesión para continuar.</p>

        <form onSubmit={handleLogin} className={styles.form}>
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>Correo Electrónico</label>
            <input
              type="email"
              className={styles.input}
              placeholder="Ej: ana@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>Contraseña</label>
            <input
              type="password"
              className={styles.input}
              placeholder="Tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className={styles.errorText}>{error}</p>}

          <button
            type="submit"
            className={styles.loginBtn}
            disabled={loading || !email || !password}
          >
            {loading ? 'Iniciando...' : 'Iniciar Sesión'}
          </button>
        </form>
      </div>
    </motion.div>
  )
}
