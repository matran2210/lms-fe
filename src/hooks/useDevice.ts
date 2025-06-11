import { useEffect, useState } from 'react'

type DeviceType = 'mobile' | 'tablet' | 'desktop'

interface DeviceInfo {
  deviceType: DeviceType
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
}

export function useDevice(): DeviceInfo {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    deviceType: 'desktop',
    isMobile: false,
    isTablet: false,
    isDesktop: true,
  })

  const detectDevice = () => {
    const width = window.innerWidth
    const ua = navigator.userAgent
    // Detect by width
    let typeByWidth: DeviceType
    if (width < 767) {
      typeByWidth = 'mobile'
    } else if (width < 1024) {
      typeByWidth = 'tablet'
    } else {
      typeByWidth = 'desktop'
    }
    // Detect by userAgent
    let typeByUA: DeviceType | null = null
    // if (/iPhone|Android.*Mobile|Windows Phone|webOS|BlackBerry/i.test(ua)) {
    //   typeByUA = 'mobile'
    // } else if (/iPad|Android(?!.*Mobile)/i.test(ua)) {
    //   typeByUA = 'tablet'
    // }
    const finalType: DeviceType = typeByUA || typeByWidth
    setDeviceInfo({
      deviceType: finalType,
      isMobile: finalType === 'mobile',
      isTablet: finalType === 'tablet',
      isDesktop: finalType === 'desktop',
    })
  }

  useEffect(() => {
    detectDevice()
    window.addEventListener('resize', detectDevice)
    return () => window.removeEventListener('resize', detectDevice)
  }, [])

  return deviceInfo
}
