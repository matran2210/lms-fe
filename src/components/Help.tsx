import { IconClose } from '@assets/icons'
import { Popover, Tooltip } from 'antd'
import React, { useEffect, useState } from 'react'
import PopupSupportCenter from './PopupSupportCenter'
import { useRouter } from 'next/router'

const HELP_WIDGET_SCRIPT_ID = 'hs-script-loader'

const Help = ({ showHelp }: { showHelp: boolean }) => {
  const [visible, setVisible] = useState(false)
  const router = useRouter()

  // Check if URL contains '/teachers'
  const isTeacherPage = router.asPath.includes('/teachers')

  // Hide help widget on teacher pages

  const handleVisibleChange = (newVisible: boolean) => {
    if (newVisible) {
      setVisible(true)
    }
  }

  const handleButtonClick = () => {
    setVisible(!visible)
  }

  useEffect(() => {
    // Kiểm tra xem biến actToken có tồn tại trong localStorage hay không
    if (showHelp && !isTeacherPage) {
      // Tạo một thẻ script mới
      const scriptElement = document.createElement('script')
      scriptElement.type = 'text/javascript'
      scriptElement.id = 'hs-script-loader'
      scriptElement.async = true
      scriptElement.defer = true
      scriptElement.src = `//js.hs-scripts.com/1774127.js`

      // Thêm thẻ script vào trong thẻ head của trang
      document.head.appendChild(scriptElement)

      // Cleanup: Xóa script khi component unmount (nếu cần)
      return () => {
        if (document.head.contains(scriptElement)) {
          document.head.removeChild(scriptElement)
        }
      }
    }
  }, [showHelp, isTeacherPage])

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

  if (isTeacherPage) {
    return null
  }

  return (
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
          <Tooltip arrow title="Support Center" placement="left">
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
  )
}

export default Help
