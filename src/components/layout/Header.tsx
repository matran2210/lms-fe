'use client'

import { LogoutIcon } from '@/assets/icons'
import Logo from '@/assets/logo.svg'
import SAPPButton from '@/components/button/SAPPButton'
import { useLayoutContext } from '@/contexts/LayoutContext'
import { AuthenticationManager } from '@/utils/helpers/keycloak'
import Image from 'next/image'
import Link from 'next/link'

export const Header = () => {
  const { isShowHeader } = useLayoutContext()

  const handleLogout = async () => {
    const authenticationManager = new AuthenticationManager()
    await authenticationManager.logout()
  }

  if (!isShowHeader) return null

  return (
    <header className="left-0 right-0 top-0 z-50 bg-white shadow-header">
      <div className="flex h-16 items-center justify-between px-8 py-2">
        <Link href="/" className="border-0 focus:!outline-none">
          <Image src={Logo} alt="logo" width={90} height={45} />
        </Link>
        <SAPPButton title="Logout" suffixIcon={<LogoutIcon className="text-icon" />} onClick={handleLogout} />
      </div>
    </header>
  )
}
