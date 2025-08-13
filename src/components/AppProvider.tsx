import { AuthProvider } from '@/contexts/AuthContext'

export function AppProvider({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>
}
