import { Player } from '@lottiefiles/react-lottie-player'
import React from 'react'
import animation from 'src/assets/images/animation.json'

const SappLoading = () => {
  return (
    <div className="backdrop-blur-[2000px] bg-white w-full h-full fixed block z-[9999]">
      <Player
        src={animation}
        autoplay
        loop
        className="top-0 left-0 z-[9999] backdrop-blur-[2000px] bg-white"
        speed={2}
      />
    </div>
  )
}

export default SappLoading
