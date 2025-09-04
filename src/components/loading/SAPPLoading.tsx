'use client'

import animation from '@/assets/animations/loading.json'
import clsx from 'clsx'
import dynamic from 'next/dynamic'

interface SAPPLoadingProps {
  className?: string
}

const Player = dynamic(() => import('@lottiefiles/react-lottie-player').then(mod => mod.Player), {
  ssr: false,
})

const SAPPLoading = ({ className }: SAPPLoadingProps) => {
  return (
    <div className={clsx('fixed bottom-0 left-0 right-0 top-0 z-[9999] bg-white backdrop-blur-[2000px]', className)}>
      <Player
        src={animation}
        autoplay
        loop
        className="left-0 top-0 z-[9999] max-h-[90px] max-w-[90px] !bg-white backdrop-blur-[2000px]"
        speed={3}
      />
    </div>
  )
}

export default SAPPLoading
