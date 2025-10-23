/* eslint-disable */
import {
  ArrowActionIcon,
  IconAccess,
  IconChat,
  IconContact,
  IconEmergency,
  IconFAQ,
  IconRequestForm,
  IconSend,
  MessageDialogIcon,
  MessageLetterIcon,
  OutgoingCallIcon,
  SearchIcon,
} from '@assets/icons'
import { onLinkSocial } from '@utils/index'
import React, { Dispatch, PropsWithChildren, SetStateAction } from 'react'
import { CloseIconV2 } from './icons'
interface IInfomation {
  icon: React.ReactNode
  onClick?: () => void
  hoverText: React.ReactNode
}
interface IProps {
  visible: boolean
  setVisible: Dispatch<SetStateAction<boolean>>
}

const PopupSupportCenter = ({ setVisible, visible }: IProps) => {
  return (
    <>
      <div className="mb-3 flex justify-between">
        <div className="text-base font-medium text-gray-800">
          Support Center
        </div>
        <div
          className="cursor-pointer transition-all duration-200 ease-in-out hover:scale-110"
          onClick={() => setVisible(!visible)}
        >
          <CloseIconV2 />
        </div>
      </div>

      <div className="short:h-10 short:leading-5 mb-4 text-xs font-normal text-gray-800">
        Trong quá trình học tập, nếu có các vấn đề cần hỗ trợ, bạn hãy kết nối
        với bộ phận Hỗ trợ học viên qua các kênh liên hệ sau:
      </div>

      {/* Các kênh liên hệ */}
      <div className="short:grid short:grid-cols-2 short:gap-3">
        <InfomationItem
          icon={<IconFAQ className="text-icon shrink-0" />}
          hoverText={
            <div className="flex items-center justify-center gap-3">
              <SearchIcon className="shrink-0" /> <span>Tra cứu tại đây</span>
            </div>
          }
          onClick={() =>
            onLinkSocial('https://knowledge.sapp.edu.vn/knowledge')
          }
        >
          <span>
            Tra cứu các vấn đề thường gặp và tài liệu học tập qua trong thông
            tin
          </span>{' '}
          <span className="font-bold">Knowledge Base</span>
        </InfomationItem>

        <InfomationItem
          icon={<IconRequestForm className="text-icon shrink-0" />}
          hoverText={
            <div className="flex items-center justify-center gap-3">
              <IconSend className="h-6 w-6 shrink-0" />{' '}
              <span>Gửi phiếu tại đây</span>
            </div>
          }
          onClick={() =>
            onLinkSocial(
              'https://sapp.edu.vn/dich-vu-cham-soc-hoc-vien-sapp-academy',
            )
          }
        >
          <span>Gửi</span>{' '}
          <span className="font-bold">Phiếu yêu cầu dịch vụ </span>{' '}
          <span>để hỗ trợ giải quyết các vấn đề về dịch vụ khóa học</span>
        </InfomationItem>

        <InfomationItem
          icon={<IconChat className="text-icon shrink-0" />}
          hoverText={
            <div className="flex items-center justify-center gap-3">
              <MessageDialogIcon className="shrink-0" />{' '}
              <span>Chat cùng SAPP</span>
            </div>
          }
          onClick={() => onLinkSocial('https://www.facebook.com/ServiceofSAPP')}
        >
          <span>Nhắn tin qua</span> <span className="font-bold">Fanpage</span>{' '}
          <span>để được giải đáp kiến thức cùng bộ phận chuyên môn.</span>
        </InfomationItem>

        <InfomationItem
          icon={<IconAccess className="text-icon shrink-0" />}
          hoverText={
            <div className="flex items-center justify-center gap-3">
              <ArrowActionIcon className="shrink-0" />{' '}
              <span>Truy Cập Ngay</span>
            </div>
          }
          onClick={() =>
            onLinkSocial('https://www.facebook.com/groups/everydaywithsapp')
          }
        >
          <span className="">Tham gia</span>{' '}
          <span className="font-bold">"Everyday with SAPP"</span>{' '}
          <span className="">- cộng đồng học tập dành cho học viên</span>
        </InfomationItem>

        <InfomationItem
          icon={<IconContact className="text-icon shrink-0" />}
          hoverText={
            <div className="flex items-center justify-center gap-3">
              <OutgoingCallIcon className="shrink-0" />{' '}
              <span>Gọi Khẩn Cấp</span>
            </div>
          }
        >
          <span className="font-bold">
            Liên hệ Hotline: 19002225 (nhấn phím 2)
          </span>{' '}
          <span>với tình huống cần hỗ trợ khẩn cấp.</span>
        </InfomationItem>

        <InfomationItem
          icon={<IconEmergency className="text-icon shrink-0" />}
          hoverText={
            <div className="flex items-center justify-center gap-3">
              <MessageLetterIcon className="shrink-0" />{' '}
              <span>Gửi Email tại đây</span>
            </div>
          }
        >
          <span>Liên hệ trao đổi qua email hỗ trợ chính thức:</span>{' '}
          <span className="font-bold">support@sapp.edu.vn</span>
        </InfomationItem>
      </div>

      <div className="mt-4 text-center text-xs italic leading-5 text-gray-800">
        Chúng tôi cam kết phản hồi trong 4 giờ làm việc (trừ Thứ 7, Chủ nhật và
        các ngày lễ)
      </div>
    </>
  )
}

const InfomationItem = ({
  hoverText,
  onClick,
  icon,
  children,
}: PropsWithChildren<IInfomation>) => {
  return (
    <div onClick={onClick} className="short:mt-0 relative mt-3 cursor-pointer">
      <div className="short:h-[72px] flex rounded-xl border border-gray-300 px-4 py-3">
        <div className="z-[2] flex h-full w-full items-center transition-all duration-200 ease-in-out hover:hidden">
          <div className="flex items-center">{icon}</div>
          <div className="ms-3 text-[10px] text-gray-800">{children}</div>
        </div>
        <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center rounded-xl text-xs font-medium opacity-0 transition-all duration-200 ease-in-out hover:z-10 hover:bg-secondary-600 hover:text-white hover:opacity-100">
          <div>{hoverText}</div>
        </div>
      </div>
    </div>
  )
}

export default PopupSupportCenter
