import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router'
import { AnimatePresence } from 'motion/react'
import { useAuthStore } from './store/useAuthStore'

// Layout
import AppShell from './components/layout/AppShell'

// Pages
import EntryPage from './pages/Entry/EntryPage'
import OnboardingPage from './pages/Onboarding/OnboardingPage'
import LoginPage from './pages/Login/LoginPage'
import HomePage from './pages/Home/HomePage'
import CategoriesPage from './pages/Categories/CategoriesPage'
import CategoryDetail from './pages/Categories/CategoryDetail'
import RecommendationsPage from './pages/Recommendations/RecommendationsPage'
import ExplorePage from './pages/Explore/ExplorePage'
import ChatPage from './pages/Chat/ChatPage'
import ChatConversation from './pages/Chat/ChatConversation'
import GroupsPage from './pages/Groups/GroupsPage'
import GroupDetail from './pages/Groups/GroupDetail'
import QandAPage from './pages/QandA/QandAPage'
import QuestionDetail from './pages/QandA/QuestionDetail'
import SafetyPage from './pages/Safety/SafetyPage'
import RewardsPage from './pages/Rewards/RewardsPage'
import PrivacyPage from './pages/Privacy/PrivacyPage'

// Admin
import AdminLayout from './admin/AdminLayout'
import Dashboard from './admin/Dashboard'
import ContentManager from './admin/ContentManager'
import UserManager from './admin/UserManager'
import ModerationPanel from './admin/ModerationPanel'

/** 
 * ProtectedRoute — redirige a /entry si no hay sesión activa.
 * Permite modo invitado con acceso limitado.
 */
function ProtectedRoute({ children }) {
  const { isAuthenticated, isGuest } = useAuthStore()
  if (!isAuthenticated && !isGuest) return <Navigate to="/entry" replace />
  return children
}

/** 
 * RestrictedRoute — para áreas comunitarias.
 * Si es Invitada, muestra un cartel amigable en lugar de la vista.
 */
function RestrictedRoute({ children }) {
  const { isAuthenticated, isGuest } = useAuthStore()
  
  if (isGuest && !isAuthenticated) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-navy)', marginBottom: '1rem' }}>
          ¡Únete a la Comunidad! ✨
        </h2>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem', maxWidth: '300px' }}>
          Para proteger la privacidad de nuestras madres, necesitas registrarte para acceder a los foros, chats y grupos de apoyo.
        </p>
        <button 
          onClick={() => window.location.href = '/entry'}
          style={{ 
            padding: '1rem 2rem', 
            backgroundColor: 'var(--color-primary)', 
            color: 'white', 
            borderRadius: 'var(--radius-full)',
            border: 'none',
            fontWeight: 'bold',
            fontSize: '1.1rem'
          }}
        >
          Crear mi cuenta gratuita
        </button>
      </div>
    )
  }
  
  if (!isAuthenticated && !isGuest) return <Navigate to="/entry" replace />
  
  return children
}

function AdminRoute({ children }) {
  const { isAdmin } = useAuthStore()
  if (!isAdmin) return <Navigate to="/" replace />
  return children
}

export default function App() {
  const { initializeAuth, isLoading } = useAuthStore()

  useEffect(() => {
    initializeAuth()
  }, [initializeAuth])

  if (isLoading) {
    return <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center' }}>Cargando sesión...</div>
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* --- Rutas públicas --- */}
        <Route path="/entry" element={<EntryPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/safety" element={<SafetyPage />} />

        {/* --- Rutas protegidas (app principal) --- */}
        <Route path="/" element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }>
          <Route index element={<HomePage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="categories/:id" element={<CategoryDetail />} />
          <Route path="recommendations" element={<RecommendationsPage />} />
          <Route path="explore" element={<ExplorePage />} />
          <Route path="chat" element={<RestrictedRoute><ChatPage /></RestrictedRoute>} />
          <Route path="chat/:id" element={<RestrictedRoute><ChatConversation /></RestrictedRoute>} />
          <Route path="groups" element={<RestrictedRoute><GroupsPage /></RestrictedRoute>} />
          <Route path="groups/:id" element={<RestrictedRoute><GroupDetail /></RestrictedRoute>} />
          <Route path="qanda" element={<RestrictedRoute><QandAPage /></RestrictedRoute>} />
          <Route path="qanda/:id" element={<RestrictedRoute><QuestionDetail /></RestrictedRoute>} />
          <Route path="rewards" element={<RestrictedRoute><RewardsPage /></RestrictedRoute>} />
          <Route path="privacy" element={<PrivacyPage />} />
        </Route>

        {/* --- Panel de Administración --- */}
        <Route path="/admin" element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="content" element={<ContentManager />} />
          <Route path="users" element={<UserManager />} />
          <Route path="moderation" element={<ModerationPanel />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/entry" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
