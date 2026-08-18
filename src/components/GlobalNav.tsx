import { NavLink } from 'react-router-dom'
import { Button } from '@heroui/react'
import { useAuth } from '../context/AuthContext'

function GlobalNav() {
  const { signOut } = useAuth()

  return (
    <nav className="flex items-center justify-between border-b border-neutral-200 px-6 py-3">
      <div className="flex items-center gap-6">
        <span className="font-semibold">Chromaforge</span>
        <NavLink to="/" end className="text-sm text-neutral-600">
          Match
        </NavLink>
        <NavLink to="/collection" className="text-sm text-neutral-600">
          Collection
        </NavLink>
        <NavLink to="/history" className="text-sm text-neutral-600">
          History
        </NavLink>
      </div>
      <Button size="sm" variant="ghost" onPress={() => signOut()}>
        Sign out
      </Button>
    </nav>
  )
}

export default GlobalNav
