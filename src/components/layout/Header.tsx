'use client'

import Logo from '@/assets/logo.svg'
import Logout from '@/assets/logout.svg'
import SAPPButton from '@/components/button/SAPPButton'
import { AuthenticationManager } from '@/utils/helpers/keycloak'
import Image from 'next/image'

export const Header = () => {
  const handleLogout = async () => {
    await AuthenticationManager.instance.logout()
  }

  return (
    <header className="fixed left-0 right-0 top-0 z-50 bg-white shadow-header">
      <div className="flex h-16 items-center justify-between px-8 py-2">
        <div className="flex-shrink-0">
          <Image src={Logo} alt="logo" width={90} height={45} />
        </div>
        <SAPPButton
          title="Logout"
          suffixIcon={<Image src={Logout} alt="logout" width={24} height={24} />}
          onClick={handleLogout}
        />
      </div>
    </header>
  )
}
