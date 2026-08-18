import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import GlobalNav from './components/GlobalNav'
import LoginPage from './pages/LoginPage'
import MatchPage from './pages/MatchPage'
import CollectionPage from './pages/CollectionPage'
import HistoryPage from './pages/HistoryPage'

function AppLayout() {
  return (
    <div className="min-h-screen">
      <GlobalNav />
      <Routes>
        <Route path="/" element={<MatchPage />} />
        <Route path="/collection" element={<CollectionPage />} />
        <Route path="/history" element={<HistoryPage />} />
      </Routes>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/*" element={<AppLayout />} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}

export default App
