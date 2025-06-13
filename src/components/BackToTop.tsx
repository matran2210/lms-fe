/* eslint-disable */

import { trackGAEvent } from '@utils/google-analytics'
import React, { useState, useEffect } from 'react'

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    /**
     * @description Listen to scroll events
     */
    window.addEventListener('scroll', handleScroll)

    /**
     * @description Remove event listener on cleanup
     */
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  /**
   * @description Function to handle scroll event
   */
  const handleScroll = () => {
    const scrollY = window.scrollY

    /**
     * @description Set visibility based on scroll position
     */
    if (scrollY > 50) {
      setIsVisible(true)
    } else {
      setIsVisible(false)
    }
  }

  /**
   * @description Function to scroll back to top
   */
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
    trackGAEvent('Click Button Back To Top')
  }

  useEffect(() => {
    if (window.scrollY === 0) {
      setIsVisible(false)
    }
  }, [window.scrollY])

  return (
    <div
      id="back-to-top"
      className={`fixed bottom-[160px] right-[27px] ${isVisible ? 'visible ' : 'hidden'} cursor-pointer`}
      onClick={scrollToTop}
    >
      <div className="flex items-center justify-center self-center rounded-full bg-white p-2 shadow-card">
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M15.2929 4.6259C15.6834 4.23538 16.3166 4.23538 16.7071 4.6259L24.7071 12.6259C25.0976 13.0164 25.0976 13.6496 24.7071 14.0401C24.3166 14.4306 23.6834 14.4306 23.2929 14.0401L17 7.74722L17 26.6663C17 27.2186 16.5523 27.6663 16 27.6663C15.4477 27.6663 15 27.2186 15 26.6663L15 7.74722L8.70711 14.0401C8.31658 14.4306 7.68342 14.4306 7.29289 14.0401C6.90237 13.6496 6.90237 13.0164 7.29289 12.6259L15.2929 4.6259Z"
            fill="#1C274C"
            stroke="#1C274C"
            stroke-width="0.5"
          />
        </svg>
      </div>
    </div>
  )
}

export default BackToTop
