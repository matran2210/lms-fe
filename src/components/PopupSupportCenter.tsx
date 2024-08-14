/* eslint-disable */
import {
  IconAccess,
  IconChat,
  IconContact,
  IconEmergency,
  IconFAQ,
  IconRequestForm,
  IconSupportCenter,
} from '@assets/icons'
import { onLinkSocial } from '@utils/index'
import React, { Dispatch, SetStateAction, useRef, useState } from 'react'
import { useHover } from 'usehooks-ts'

interface IProps {
  visible: boolean
  setVisible: Dispatch<SetStateAction<boolean>>
}

const PopupSupportCenter = ({ setVisible, visible }: IProps) => {
  const hoverRefFourLevel = useRef(null)
  const isHoverFourLevel = useHover(hoverRefFourLevel)

  const hoverRefRequestForm = useRef(null)
  const isHoverRequestForm = useHover(hoverRefRequestForm)

  const hoverRefChat = useRef(null)
  const isHoverChat = useHover(hoverRefChat)

  const hoverRefAccess = useRef(null)
  const isHoverAccess = useHover(hoverRefAccess)

  const hoverRefContact = useRef(null)
  const isHoverContact = useHover(hoverRefContact)

  const hoverRefEmergency = useRef(null)
  const isHoverEmergency = useHover(hoverRefEmergency)

  return (
    <>
      <div className="flex">
        <IconSupportCenter onClick={() => setVisible(!visible)} />
        <div className="ms-2 text-base font-semibold text-bw-1">
          Support Center
        </div>
      </div>
      <div className="mb-4 mt-3 text-ssm text-bw-1">
        Trong quá trình học tập, nếu có các vấn đề cần hỗ trợ, bạn hãy kết nối
        với bộ phận Hỗ trợ học viên qua các kênh liên hệ sau:
      </div>

      <div
        onClick={() => onLinkSocial('https://knowledge.sapp.edu.vn/knowledge')}
        className="mt-3"
      >
        <div
          // onMouseEnter={() => setIsHoveredFourLevel(true)}
          // onMouseLeave={() => setIsHoveredFourLevel(false)}
          className="mt-3 flex h-14 cursor-pointer border-[1px] border-solid border-gray-3 px-3.5 py-2.5 hover:bg-primary"
          ref={hoverRefFourLevel}
        >
          {isHoverFourLevel ? (
            <Infomation title="Tra cứu tại đây" />
          ) : (
            <>
              <div className="flex items-center">
                <IconFAQ />
              </div>
              <div className="ms-3 text-[11px] text-bw-1">
                <span className="">
                  Tra cứu các vấn đề thường gặp và tài liệu học tập qua trong
                  thông tin
                </span>{' '}
                <span className="font-bold">Knowledge Base</span>
              </div>
            </>
          )}
        </div>
      </div>

      <div
        onClick={() =>
          onLinkSocial(
            'https://sapp.edu.vn/dich-vu-cham-soc-hoc-vien-sapp-academy',
          )
        }
        className="mt-3"
      >
        <div
          className="mt-3 flex h-14 cursor-pointer border-[1px] border-solid border-gray-3 px-3.5 py-2.5 hover:bg-primary"
          ref={hoverRefRequestForm}
        >
          {isHoverRequestForm ? (
            <Infomation title="Gửi phiếu tại đây" />
          ) : (
            <>
              <div className="flex items-center">
                <IconRequestForm />
              </div>
              <div className="ms-3 text-[11px] text-bw-1">
                <span>Gửi</span>{' '}
                <span className="font-bold">Phiếu yêu cầu dịch vụ </span>{' '}
                <span>để hỗ trợ giải quyết các vấn đề về dịch vụ khóa học</span>
              </div>
            </>
          )}
        </div>
      </div>

      <div
        onClick={() => onLinkSocial('https://www.facebook.com/ServiceofSAPP')}
        className="mt-3"
      >
        <div
          className="mt-3 flex h-14 cursor-pointer border-[1px] border-solid border-gray-3 px-3.5 py-2.5 hover:bg-primary"
          ref={hoverRefChat}
        >
          {isHoverChat ? (
            <Infomation title="Chat cùng SAPP" />
          ) : (
            <>
              <div className="flex items-center">
                <IconChat />
              </div>
              <div className="ms-3 text-[11px] text-bw-1">
                <span>Nhắn tin qua</span>{' '}
                <span className="font-bold">Fanpage</span>{' '}
                <span>để được giải đáp kiến thức cùng bộ phận chuyên môn.</span>
              </div>
            </>
          )}
        </div>
      </div>

      <div
        onClick={() =>
          onLinkSocial('https://www.facebook.com/groups/everydaywithsapp')
        }
        className="mt-3"
      >
        <div
          className="mt-3 flex h-14 cursor-pointer border-[1px] border-solid border-gray-3 px-3.5 py-2.5 hover:bg-primary"
          ref={hoverRefAccess}
        >
          {isHoverAccess ? (
            <Infomation title="Truy cập ngay" />
          ) : (
            <>
              <div className="flex items-center">
                <IconAccess />
              </div>
              <div className="ms-3 text-[11px] text-bw-1">
                <span className="">Tham gia</span>{' '}
                <span className="font-bold">"Everyday with SAPP"</span>{' '}
                <span className="">- cộng đồng học tập dành cho học viên</span>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="mt-3">
        <div
          ref={hoverRefContact}
          className="mt-3 flex h-14 border-[1px] border-solid border-gray-3 px-3.5 py-2.5 hover:bg-primary"
        >
          {isHoverContact ? (
            <Infomation title="Gọi khẩn cấp" />
          ) : (
            <>
              <div className="flex items-center">
                <IconContact />
              </div>
              <div className="ms-3 text-[11px] text-bw-1">
                <span className="font-bold">
                  Liên hệ Hotline: 19002225 (nhấn phím 2)
                </span>{' '}
                <span>Tvới tình huống cần hỗ trợ khẩn cấp.</span>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="mt-3">
        <div
          ref={hoverRefEmergency}
          className="mt-3 flex h-14 border-[1px] border-solid border-gray-3 px-3.5 py-2.5 hover:bg-primary"
        >
          {isHoverEmergency ? (
            <Infomation title="Gọi khẩn cấp" />
          ) : (
            <>
              <div className="flex items-center">
                <IconEmergency />
              </div>
              <div className="ms-3 text-[11px] text-bw-1">
                <span>Liên hệ trao đổi qua email hỗ trợ chính thức:</span>{' '}
                <span className="font-bold">support@sapp.edu.vn</span>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="mt-4 text-center text-ssm italic text-bw-1">
        Chúng tôi cam kết phản hồi trong 4 giờ làm việc (trừ Thứ 7, Chủ nhật và
        các ngày lễ)
      </div>
    </>
  )
}

const Infomation = ({ title }: { title: string }) => {
  return (
    <div className="flex w-full items-center justify-center text-ssm text-white">
      {title}
    </div>
  )
}

export default PopupSupportCenter
