import { IconClose } from '@assets/icons'
import { Popover, Tooltip } from 'antd'
import React, { useEffect, useState } from 'react'
import PopupSupportCenter from './PopupSupportCenter'

const Help = () => {
    const [visible, setVisible] = useState(false)

    const handleVisibleChange = (newVisible: boolean) => {
        // Chỉ thay đổi trạng thái khi newVisible là true (mở Popover)
        if (newVisible) {
            setVisible(true)
        }
    }

    const handleButtonClick = () => {
        setVisible(!visible)
    }

    useEffect(() => {
        // Kiểm tra xem biến actToken có tồn tại trong localStorage hay không
        // if (getLocalStorgeActToken()) {
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
            document.head.removeChild(scriptElement)
        }
        // }
    })

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

    return (
        <div id="container-floating">
            <div className="cursor-pointer">
                <Popover
                    content={<PopupSupportCenter visible={visible} setVisible={setVisible} />}
                    title={undefined}
                    trigger="click"
                    visible={visible}
                    onVisibleChange={handleVisibleChange}
                    placement="topLeft"
                    arrow={false}
                >
                    {visible ? (
                        <div
                            id="floating-button"
                            onClick={handleButtonClick}
                            className={`${visible ? 'bottom-5 clicked' : 'bottom-[90px]'} right-[18px]`}
                        >
                            <div className="plus flex justify-center items-center bg-primary hover:opacity-75 rounded-full">
                                <svg
                                    width="34"
                                    height="34"
                                    viewBox="0 0 34 34"
                                    fill="white"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        fill-rule="evenodd"
                                        clip-rule="evenodd"
                                        d="M22.3033 11.6969C22.5962 11.9897 22.5962 12.4646 22.3033 12.7575L18.0607 17.0002L22.3033 21.2428C22.5962 21.5357 22.5962 22.0106 22.3033 22.3035C22.0104 22.5964 21.5355 22.5963 21.2426 22.3035L17 18.0608L12.7574 22.3035C12.4645 22.5963 11.9896 22.5964 11.6967 22.3035C11.4038 22.0106 11.4038 21.5357 11.6967 21.2428L15.9393 17.0002L11.6967 12.7575C11.4038 12.4646 11.4038 11.9897 11.6967 11.6969C11.9896 11.404 12.4645 11.404 12.7574 11.6969L17 15.9395L21.2426 11.6969C21.5355 11.404 22.0104 11.404 22.3033 11.6969Z"
                                        fill="white"
                                    />
                                </svg>
                            </div>
                        </div>
                    ) : (
                        <Tooltip
                            arrow
                            title={
                                <div className="text-white">Support Center</div>
                            }
                            color="#FFB800"
                            placement="left"
                        >
                            <div
                                id="floating-button"
                                onClick={handleButtonClick}
                                className={`${visible ? 'bottom-5 clicked' : 'bottom-[90px]'} right-[20px]`}
                            >
                                <div className="plus flex justify-center items-center hover:bg-primary hover:rounded-full">
                                    <IconClose />
                                </div>
                            </div>
                        </Tooltip>
                    )}
                </Popover>
            </div>
        </div>
    )
}

export default Help