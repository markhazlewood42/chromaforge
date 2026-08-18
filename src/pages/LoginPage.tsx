import { Navigate } from 'react-router-dom'
import { Button } from '@heroui/react'
import { useAuth } from '../context/AuthContext'

function LoginPage() {
  const { user, loading, signInWithGoogle } = useAuth()

  if (!loading && user) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-semibold">Chromaforge</h1>
      <p className="text-neutral-500">Sign in to manage your palette and find mixes.</p>
      <Button onPress={() => signInWithGoogle()}>Sign in with Google</Button>
    </div>
  )
}

export default LoginPage
