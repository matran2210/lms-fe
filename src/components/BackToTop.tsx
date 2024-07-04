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
    if (scrollY > 100) {
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
      className={`fixed rounded-[50%] bottom-[160px] cursor-pointe right-[33px] text-white w-[36px] h-[36px] ${isVisible ? 'visible ' : 'hidden'} cursor-pointer`}
      onClick={scrollToTop}
    >
      <div className="flex justify-center items-center self-center w-[48px] h-[48px] svg-container">
        <svg width="48" height="48" viewBox="0 0 48 48" fill="#A1A1A1" xmlns="http://www.w3.org/2000/svg">
          <path d="M34.9991 10.0005H12.9997C12.8658 9.99637 12.7325 10.0192 12.6076 10.0676C12.4827 10.116 12.3688 10.189 12.2726 10.2822C12.1765 10.3755 12.1001 10.4871 12.0479 10.6104C11.9956 10.7338 11.9688 10.8664 11.9688 11.0003C11.9688 11.1343 11.9956 11.2668 12.0479 11.3902C12.1001 11.5135 12.1765 11.6251 12.2726 11.7184C12.3688 11.8116 12.4827 11.8846 12.6076 11.933C12.7325 11.9814 12.8658 12.0043 12.9997 12.0002H34.9991C35.1329 12.0043 35.2663 11.9814 35.3912 11.933C35.5161 11.8846 35.6299 11.8116 35.7261 11.7184C35.8222 11.6251 35.8987 11.5135 35.9509 11.3902C36.0031 11.2668 36.03 11.1343 36.03 11.0003C36.03 10.8664 36.0031 10.7338 35.9509 10.6104C35.8987 10.4871 35.8222 10.3755 35.7261 10.2822C35.6299 10.189 35.5161 10.116 35.3912 10.0676C35.2663 10.0192 35.1329 9.99637 34.9991 10.0005Z" fill="#A1A1A1" />
          <path d="M24.8126 17.42C24.7203 17.2904 24.5984 17.1847 24.457 17.1116C24.3156 17.0386 24.1589 17.0003 23.9998 17C23.847 17 23.6963 17.0351 23.5593 17.1026C23.4223 17.17 23.3026 17.268 23.2094 17.3891L17.7063 22.8931C17.5188 23.0811 17.4137 23.3358 17.4141 23.6013C17.4144 23.8668 17.5202 24.1213 17.7082 24.3088C17.8962 24.4962 18.1509 24.6013 18.4164 24.601C18.6819 24.6006 18.9363 24.4948 19.1238 24.3069L23.0013 20.4294L22.9844 33.0003C22.9843 33.1317 23.0101 33.2618 23.0602 33.3832C23.1104 33.5046 23.184 33.6149 23.2768 33.7079C23.3696 33.8009 23.4798 33.8747 23.6011 33.9251C23.7224 33.9754 23.8524 34.0014 23.9838 34.0016C24.2494 34.0016 24.504 33.8961 24.6918 33.7083C24.8796 33.5205 24.9851 33.2659 24.9851 33.0003L24.9963 20.4312L28.8569 24.2919C29.0448 24.4795 29.2995 24.5848 29.5649 24.5846C29.8304 24.5844 30.085 24.4788 30.2726 24.2909C30.4602 24.1031 30.5655 23.8484 30.5653 23.5829C30.5651 23.3174 30.4595 23.0629 30.2716 22.8753L24.8126 17.42Z" fill="#A1A1A1" />
        </svg>
      </div>
    </div>
  )
}

export default BackToTop
