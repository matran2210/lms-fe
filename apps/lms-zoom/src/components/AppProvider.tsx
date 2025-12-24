import { AuthProvider } from '@/contexts/AuthContext'
import { LayoutProvider } from '@/contexts/LayoutContext'

export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <LayoutProvider>
      <AuthProvider>{children}</AuthProvider>
    </LayoutProvider>
  )
}
