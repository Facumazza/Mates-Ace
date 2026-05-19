import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'

export default function RequireAdmin({ children }) {
  const token = useAuthStore((s) => s.token)
  const currentUser = useAuthStore((s) => s.currentUser)

  if (!token || currentUser?.role !== 'ADMIN') {
    return <Navigate to="/admin" replace />
  }

  return children
}
