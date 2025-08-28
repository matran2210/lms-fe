'use client'

import { AltArrowLeft, LogoutIcon } from '@/assets/icons'
import Logo from '@/assets/logo.svg'
import SAPPButton from '@/components/button/SAPPButton'
import { useLayoutContext } from '@/contexts/LayoutContext'
import { useTailwindBreakpoint } from '@/hooks/useTailwindBreakpoint'
import { AuthenticationManager } from '@/utils/helpers/keycloak'
import clsx from 'clsx'
import Image from 'next/image'
import Link from 'next/link'

export const Header = () => {
  const { isShowHeader, isLoadingGlobal } = useLayoutContext()
  const { isMobileView } = useTailwindBreakpoint()

  const handleLogout = async () => {
    const authenticationManager = new AuthenticationManager()
    await authenticationManager.logout()
  }

  if (!isShowHeader) return null

  return (
    <div className={clsx({ 'md:pt-16': !isLoadingGlobal })}>
      {isMobileView ? (
        <div
          className={clsx(
            'sapp-loading fixed left-0 top-0 z-50 flex h-12 w-12 items-center justify-center transition-all',
            { active: isLoadingGlobal }
          )}
        >
          <Link href="/" className="text-white">
            <AltArrowLeft />
          </Link>
        </div>
      ) : (
        <header
          className={clsx(
            'sapp-loading fixed left-0 right-0 top-0 z-50 hidden bg-white shadow-header transition-all md:block',
            { active: isLoadingGlobal }
          )}
        >
          <div className="flex h-16 items-center justify-between px-8 py-2">
            <Link href="/" className="border-0 focus:!outline-none">
              <Image src={Logo} alt="logo" width={90} height={45} />
            </Link>
            <SAPPButton title="Logout" suffixIcon={<LogoutIcon className="text-icon" />} onClick={handleLogout} />
          </div>
        </header>
      )}
    </div>
  )
}
