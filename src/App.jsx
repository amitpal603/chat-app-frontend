import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useAuth } from './hooks/useAuth'

// Components
import ProtectedRoute from './components/ProtectedRoute'

// Pages
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import HomePage from './pages/HomePage'

function App() {
  const { handleCheckAuth } = useAuth()

  useEffect(() => {
    // Attempt to fetch current user session on load
    handleCheckAuth().catch(() => {
      console.log('No active session found')
    })
  }, [handleCheckAuth])

  return (
    <Router>
      <Toaster 
        position="top-right" 
        toastOptions={{
          style: {
            background: '#1e293b',
            color: '#fff',
            border: '1px solid #334155'
          }
        }} 
      />
      <Routes>
        {/* Authenticated Routes */}
        <Route element={<ProtectedRoute authentication={true} />}>
          <Route path="/" element={<HomePage />} />
        </Route>

        {/* Guest Routes (Redirect to home if already logged in) */}
        <Route element={<ProtectedRoute authentication={false} />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App