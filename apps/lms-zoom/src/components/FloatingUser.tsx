import { UserIcon } from '@/assets/icons'
import { FLOATING_USER_ID } from '@/constants'
import { useFloatingUser } from '@/hooks/useFloatingUser'
import { useRef } from 'react'

interface FloatingUserProps {
  hubspotContactId: string
  /** Gọi khi phát hiện watermark bị can thiệp ẩn/gỡ bằng CSS hoặc DOM */
  onTamper?: () => void
}

const FloatingUser = ({ hubspotContactId, onTamper }: FloatingUserProps) => {
  const floatingRef = useRef<HTMLDivElement>(null)
  const { position } = useFloatingUser({ floatingRef, onTamper })

  return (
    <div
      ref={floatingRef}
      id={FLOATING_USER_ID}
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
