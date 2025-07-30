/* eslint-disable react-hooks/rules-of-hooks */
import { IconClose } from '@assets/icons'
import { Popover } from 'antd'
import { useEffect, useRef, useState } from 'react'
import Tooltip from 'src/common/Tooltip'
import PopupSupportCenter from './PopupSupportCenter'
import { useRouter } from 'next/router'
import { excludedPathsHelp } from '@pages/_app'
const Help = ({ showHelp }: { showHelp: boolean }) => {
  // All hooks need to be at the top level, before any conditional returns
  const [visible, setVisible] = useState(false)
  const router = useRouter()
  const scriptRef = useRef<HTMLScriptElement | null>(null)
  const { asPath } = router
  const [isTeacherPage, isTestPage, isCaseStudyPage, isActivityPage] = [
    '/teachers',
    '/test',
    '/case-study',
    '/activity',
  ].map((p) => asPath.includes(p))
  const hiddenChatbot =
    excludedPathsHelp.some((path) => router.pathname.includes(path)) ||
    isTeacherPage

  // Handle visibility changes
  const handleVisibleChange = (newVisible: boolean) => {
    if (newVisible) {
      setVisible(true)
    }
  }

  const handleButtonClick = () => {
    setVisible(!visible)
  }

  // Effect for teacher pages cleanup
  useEffect(() => {
    if (hiddenChatbot) {
      const hsScript = document.getElementById('hs-script-loader')
      if (hsScript) document?.head?.removeChild(hsScript)

      // Also clean up HubSpot containers if they exist
      const container = document.getElementById(
        'hubspot-messages-iframe-container',
      )
      if (container) {
        container.style.display = 'none'
        if (container.classList.contains('show')) {
          container.classList.remove('show')
        }
        container.classList.add('hide')
      }
      const conversationsContainer = document.getElementById(
        'hubspot-conversations-iframe',
      )
      if (conversationsContainer) conversationsContainer.style.display = 'none'
    }
  }, [hiddenChatbot])

  // Effect for script creation
  useEffect(() => {
    let scriptElement = document.getElementById(
      'hs-script-loader',
    ) as HTMLScriptElement

    if (showHelp && !hiddenChatbot) {
      if (!scriptElement) {
        scriptElement = document.createElement('script')
        scriptElement.type = 'text/javascript'
        scriptElement.id = 'hs-script-loader'
        scriptElement.async = true
        scriptElement.defer = true
        scriptElement.src = `//js.hs-scripts.com/1774127.js`
        scriptRef.current = scriptElement
        document.head.appendChild(scriptElement)
      }
      // Hiển thị các container chat nếu có
      const container = document.getElementById(
        'hubspot-messages-iframe-container',
      )
      if (container) {
        container.style.display = ''
        container.classList.remove('hide')
        container.classList.add('show')
      }
      const conversationsContainer = document.getElementById(
        'hubspot-conversations-iframe',
      )
      if (conversationsContainer) conversationsContainer.style.display = ''
    } else {
      // Xóa script và ẩn chat nếu không thỏa điều kiện
      if (scriptElement) {
        document.head.removeChild(scriptElement)
        scriptRef.current = null
      }
      // Ẩn các container chat nếu có
      const container = document.getElementById(
        'hubspot-messages-iframe-container',
      )
      if (container) {
        container.style.display = 'none'
        container.classList.remove('show')
        container.classList.add('hide')
      }
      const conversationsContainer = document.getElementById(
        'hubspot-conversations-iframe',
      )
      if (conversationsContainer) conversationsContainer.style.display = 'none'
    }
  }, [showHelp, hiddenChatbot])

  // Effect for container visibility
  useEffect(() => {
    const container = document.getElementById(
      'hubspot-messages-iframe-container',
    )
    if (container && visible) {
      container.classList.add('visible-icon')
    } else {
      if (container && !visible) {
        container.classList.remove('visible-icon')
      }
    }
  }, [visible])

  // Early return after all hooks are declared
  if (isTeacherPage || isTestPage || isCaseStudyPage || isActivityPage) {
    return null
  }

  return (
    <>
      {showHelp && (
        <div className="cursor-pointer">
          <Popover
            content={
              <PopupSupportCenter visible={visible} setVisible={setVisible} />
            }
            trigger="click"
            open={visible}
            onOpenChange={handleVisibleChange}
            placement="topLeft"
            arrow={false}
          >
            {visible ? (
              <div
                id="floating-button"
                onClick={handleButtonClick}
                className={`${visible ? 'clicked bottom-5' : 'bottom-[90px]'} right-[16px]`}
              >
                <div className="plus flex items-center justify-center rounded-full bg-white transition delay-300 hover:opacity-100">
                  <svg
                    width="60"
                    height="60"
                    viewBox="0 0 34 34"
                    fill="#33475B"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M22.3033 11.6969C22.5962 11.9897 22.5962 12.4646 22.3033 12.7575L18.0607 17.0002L22.3033 21.2428C22.5962 21.5357 22.5962 22.0106 22.3033 22.3035C22.0104 22.5964 21.5355 22.5963 21.2426 22.3035L17 18.0608L12.7574 22.3035C12.4645 22.5963 11.9896 22.5964 11.6967 22.3035C11.4038 22.0106 11.4038 21.5357 11.6967 21.2428L15.9393 17.0002L11.6967 12.7575C11.4038 12.4646 11.4038 11.9897 11.6967 11.6969C11.9896 11.404 12.4645 11.404 12.7574 11.6969L17 15.9395L21.2426 11.6969C21.5355 11.404 22.0104 11.404 22.3033 11.6969Z"
                      fill="#33475B"
                    />
                  </svg>
                </div>
              </div>
            ) : (
              <Tooltip title={'Support Center'} placement="left">
                <div
                  id="floating-button"
                  onClick={handleButtonClick}
                  className={`${visible ? 'clicked bottom-5' : 'bottom-[90px]'} right-[16px]`}
                >
                  <div className="plus flex items-center justify-center delay-300 hover:rounded-full hover:opacity-100">
                    <IconClose />
                  </div>
                </div>
              </Tooltip>
            )}
          </Popover>
        </div>
      )}
    </>
  )
}

export default Help
