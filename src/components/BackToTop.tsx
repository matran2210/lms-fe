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
    if (scrollY > 300) {
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
  }

  useEffect(() => {
    if (window.scrollY === 0) {
      setIsVisible(false)
    }
  }, [window.scrollY])

  return (
    <div
      className={`fixed rounded-[50%] bottom-[43px] cursor-pointer hover:opacity-100 hover:bg-primary bg-primary opacity-30 right-2 text-white w-[36px] h-[36px] ${
        isVisible ? 'visible ' : 'hidden'
      } sapp-scrolltop`}
      onClick={scrollToTop}
    >
      <div className="flex justify-center items-center self-center h-[inherit]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="white"
        >
          <path
            d="M12.9398 8.00002C12.8082 8.00078 12.6777 7.97555 12.5559 7.92579C12.4341 7.87602 12.3232 7.8027 12.2298 7.71002L6.9998 2.49002L1.7698 7.72002C1.68015 7.8247 1.56983 7.90972 1.44577 7.96974C1.3217 8.02977 1.18657 8.0635 1.04885 8.06882C0.911132 8.07413 0.7738 8.05093 0.645475 8.00066C0.51715 7.95038 0.400602 7.87412 0.303147 7.77667C0.205692 7.67921 0.129435 7.56267 0.0791601 7.43434C0.0288855 7.30602 0.00567959 7.16868 0.0109991 7.03096C0.0163186 6.89324 0.0500487 6.75811 0.110072 6.63405C0.170095 6.50998 0.255116 6.39966 0.359798 6.31002L6.2898 0.370017C6.38276 0.276289 6.49336 0.201895 6.61522 0.151126C6.73708 0.100357 6.86779 0.0742188 6.9998 0.0742188C7.13181 0.0742188 7.26252 0.100357 7.38437 0.151126C7.50623 0.201895 7.61683 0.276289 7.7098 0.370017L13.6398 6.31002C13.826 6.49738 13.9306 6.75083 13.9306 7.01502C13.9306 7.2792 13.826 7.53265 13.6398 7.72002C13.4519 7.9011 13.2007 8.00158 12.9398 8.00002Z"
            fill="white"
          />
          <path
            opacity="0.3"
            d="M7 14.0001C6.73478 14.0001 6.48043 13.8947 6.29289 13.7072C6.10536 13.5196 6 13.2653 6 13.0001V1.08008C6 0.814862 6.10536 0.560508 6.29289 0.372972C6.48043 0.185435 6.73478 0.0800781 7 0.0800781C7.26522 0.0800781 7.51957 0.185435 7.70711 0.372972C7.89464 0.560508 8 0.814862 8 1.08008V13.0001C8 13.2653 7.89464 13.5196 7.70711 13.7072C7.51957 13.8947 7.26522 14.0001 7 14.0001Z"
            fill="white"
          />
        </svg>
      </div>
    </div>
  )
}

export default BackToTop
