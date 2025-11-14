import clsx from 'clsx'
import React, { useEffect, useState } from 'react'

interface Props {
  scrollContainerRef?: React.RefObject<HTMLElement>
  className?: string
  iconClassName?: string
  iconWrapperClassName?: string
}

const BackToTop = ({
  scrollContainerRef,
  className,
  iconClassName,
  iconWrapperClassName,
}: Props) => {
  const [isVisible, setIsVisible] = useState(false)
  useEffect(() => {
    const container = scrollContainerRef?.current || window

    const handleScroll = () => {
      const scrollY = scrollContainerRef?.current?.scrollTop ?? window.scrollY
      setIsVisible(scrollY > 50)
    }

    container.addEventListener('scroll', handleScroll)
    handleScroll() // Gọi khi mount

    return () => {
      container.removeEventListener('scroll', handleScroll)
    }
  }, [scrollContainerRef?.current]) // Re-run khi ref thay đổi

  const scrollToTop = () => {
    if (scrollContainerRef?.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <div
      className={clsx(
        `fixed bottom-[250px] right-4 z-50 cursor-pointer`,
        className,
        {
          hidden: !isVisible,
        },
      )}
      onClick={scrollToTop}
    >
      <div
        className={clsx(
          'flex size-[60px] items-center justify-center rounded-full bg-white p-2 shadow-card',
          iconWrapperClassName,
        )}
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          className={iconClassName}
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M15.2929 4.6259C15.6834 4.23538 16.3166 4.23538 16.7071 4.6259L24.7071 12.6259C25.0976 13.0164 25.0976 13.6496 24.7071 14.0401C24.3166 14.4306 23.6834 14.4306 23.2929 14.0401L17 7.74722V26.6663C17 27.2186 16.5523 27.6663 16 27.6663C15.4477 27.6663 15 27.2186 15 26.6663V7.74722L8.70711 14.0401C8.31658 14.4306 7.68342 14.4306 7.29289 14.0401C6.90237 13.6496 6.90237 13.0164 7.29289 12.6259L15.2929 4.6259Z"
            fill="#1C274C"
            stroke="#1C274C"
            strokeWidth="0.5"
          />
        </svg>
      </div>
    </div>
  )
}

export default BackToTop
