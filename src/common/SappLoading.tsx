import { Player } from '@lottiefiles/react-lottie-player'
import React from 'react'
import animation from 'src/assets/images/animation.json'

const SappLoading = ({ className }: { className?: string }) => {
  return (
    <div
      className={`fixed z-[9999] block h-full w-full bg-white backdrop-blur-[2000px] ${className ?? ''}`}
    >
      <Player
        src={animation}
        autoplay
        loop
        className="left-0 top-0 z-[9999] bg-white backdrop-blur-[2000px]"
        speed={3}
      />
    </div>
  )
}

export default SappLoading
