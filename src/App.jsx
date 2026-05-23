import { BrowserRouter, Routes, Route, Navigate } from 'react-router'
import { AnimatePresence } from 'motion/react'
import { useAuthStore } from './store/useAuthStore'

// Layout
import AppShell from './components/layout/AppShell'

// Pages
import EntryPage from './pages/Entry/EntryPage'
import OnboardingPage from './pages/Onboarding/OnboardingPage'
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

function AdminRoute({ children }) {
  const { isAdmin } = useAuthStore()
  if (!isAdmin) return <Navigate to="/" replace />
  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* --- Rutas públicas --- */}
        <Route path="/entry" element={<EntryPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
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
          <Route path="chat" element={<ChatPage />} />
          <Route path="chat/:id" element={<ChatConversation />} />
          <Route path="groups" element={<GroupsPage />} />
          <Route path="groups/:id" element={<GroupDetail />} />
          <Route path="qanda" element={<QandAPage />} />
          <Route path="qanda/:id" element={<QuestionDetail />} />
          <Route path="rewards" element={<RewardsPage />} />
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
