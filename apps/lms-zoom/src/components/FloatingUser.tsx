import { UserIcon } from '@/assets/icons'
import { useFloatingUser } from '@/hooks/useFloatingUser'
import { useRef } from 'react'

interface FloatingUserProps {
  hubspotContactId: string
}

const FloatingUser = ({ hubspotContactId }: FloatingUserProps) => {
  const floatingRef = useRef<HTMLDivElement>(null)
  const { position } = useFloatingUser({ floatingRef })

  return (
    <div
      ref={floatingRef}
      className="pointer-events-none fixed flex items-center gap-2 rounded-md bg-floating-user p-2 text-white shadow-lg backdrop-blur-floating-user transition-all duration-500 ease-in-out md:p-3"
      style={{
        top: `${position.top}%`,
        left: `${position.left}%`,
        zIndex: 1000,
      }}
    >
      <UserIcon />
      <span className="text-sm font-medium">{hubspotContactId}</span>
    </div>
  )
}

export default FloatingUser
