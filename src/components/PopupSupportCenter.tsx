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
import React, { Dispatch, SetStateAction } from 'react'

interface IProps {
  visible: boolean
  setVisible: Dispatch<SetStateAction<boolean>>
}

const PopupSupportCenter = ({ setVisible, visible }: IProps) => {
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
        className="relative mt-3 hover:cursor-pointer"
      >
        <div className="mt-3 flex h-14 cursor-pointer border-[0.0625rem] border-solid border-gray-3 px-3.5 py-2.5 hover:bg-primary">
          <div className="z-[999] flex h-full w-full hover:hidden">
            <div className="flex items-center">
              <IconFAQ />
            </div>
            <div className="ms-3 text-[0.6875rem] text-bw-1">
              <span>
                Tra cứu các vấn đề thường gặp và tài liệu học tập qua trong
                thông tin
              </span>{' '}
              <span className="font-bold">Knowledge Base</span>
            </div>
          </div>
          <div className=" absolute left-0 top-0 flex h-full w-full items-center justify-center text-ssm hover:z-[1000] hover:bg-primary hover:text-white">
            <div className="text-white">Tra cứu tại đây</div>
          </div>
        </div>
      </div>

      <div
        onClick={() =>
          onLinkSocial(
            'https://sapp.edu.vn/dich-vu-cham-soc-hoc-vien-sapp-academy',
          )
        }
        className="relative mt-3 hover:cursor-pointer"
      >
        <div className="mt-3 flex h-14 cursor-pointer border-[0.0625rem] border-solid border-gray-3 px-3.5 py-2.5 hover:bg-primary">
          <div className="z-[999] flex h-full w-full hover:hidden">
            <div className="flex items-center">
              <IconRequestForm />
            </div>
            <div className="ms-3 text-[0.6875rem] text-bw-1">
              <span>Gửi</span>{' '}
              <span className="font-bold">Phiếu yêu cầu dịch vụ </span>{' '}
              <span>để hỗ trợ giải quyết các vấn đề về dịch vụ khóa học</span>
            </div>
          </div>
          <div className=" absolute left-0 top-0 flex h-full w-full items-center justify-center text-ssm hover:z-[1000] hover:bg-primary hover:text-white">
            <div className="text-white">Gửi phiếu tại đây</div>
          </div>
        </div>
      </div>

      <div
        onClick={() => onLinkSocial('https://www.facebook.com/ServiceofSAPP')}
        className="relative mt-3 hover:cursor-pointer"
      >
        <div className="mt-3 flex h-14 cursor-pointer border-[0.0625rem] border-solid border-gray-3 px-3.5 py-2.5 hover:bg-primary">
          <div className="z-[999] flex h-full w-full hover:hidden">
            <div className="flex items-center">
              <IconChat />
            </div>
            <div className="ms-3 text-[0.6875rem] text-bw-1">
              <span>Nhắn tin qua</span>{' '}
              <span className="font-bold">Fanpage</span>{' '}
              <span>để được giải đáp kiến thức cùng bộ phận chuyên môn.</span>
            </div>
          </div>
          <div className=" absolute left-0 top-0 flex h-full w-full items-center justify-center text-ssm hover:z-[1000] hover:bg-primary hover:text-white">
            <div className="text-white">Chat cùng SAPP</div>
          </div>
        </div>
      </div>

      <div
        onClick={() =>
          onLinkSocial('https://www.facebook.com/groups/everydaywithsapp')
        }
        className="relative mt-3"
      >
        <div className="mt-3 flex h-14 border-[0.0625rem] border-solid border-gray-3 px-3.5 py-2.5 hover:bg-primary hover:text-primary">
          <div className="z-[2] flex h-full w-full hover:hidden">
            <div className="flex items-center">
              <IconAccess />
            </div>
            <div className="ms-3 text-[0.6875rem] text-bw-1">
              <span className="">Tham gia</span>{' '}
              <span className="font-bold">"Everyday with SAPP"</span>{' '}
              <span className="">- cộng đồng học tập dành cho học viên</span>
            </div>
          </div>
          <div className=" absolute left-0 top-0 flex h-full w-full items-center justify-center text-ssm hover:z-10 hover:bg-primary hover:text-white">
            <div className="text-white">Truy Cập Ngay</div>
          </div>
        </div>
      </div>

      <div className="relative mt-3 hover:cursor-pointer">
        <div className="mt-3 flex h-14 border-[0.0625rem] border-solid border-gray-3 px-3.5 py-2.5 hover:bg-primary">
          <div className="z-[999] flex h-full w-full hover:hidden hover:bg-primary">
            <div className="flex items-center">
              <IconContact />
            </div>
            <div className="ms-3 text-[0.6875rem] text-bw-1">
              <span className="font-bold">
                Liên hệ Hotline: 19002225 (nhấn phím 2)
              </span>{' '}
              <span>Tvới tình huống cần hỗ trợ khẩn cấp.</span>
            </div>
          </div>
          <div className=" absolute left-0 top-0 flex h-full w-full items-center justify-center text-ssm hover:z-[1000] hover:bg-primary hover:text-white">
            <div className="text-white">Gọi Khẩn Cấp</div>
          </div>
        </div>
      </div>

      <div className="relative mt-3 hover:cursor-pointer">
        <div className="mt-3 flex h-14 border-[0.0625rem] border-solid border-gray-3 px-3.5 py-2.5 hover:bg-primary">
          <div className="z-[999] flex h-full w-full hover:hidden">
            <div className="flex items-center">
              <IconEmergency />
            </div>
            <div className="ms-3 text-[0.6875rem] text-bw-1">
              <span>Liên hệ trao đổi qua email hỗ trợ chính thức:</span>{' '}
              <span className="font-bold">support@sapp.edu.vn</span>
            </div>
          </div>
          <div className=" absolute left-0 top-0 flex h-full w-full items-center justify-center text-ssm hover:z-[1000] hover:bg-primary hover:text-white">
            <div className="text-white">Gọi Khẩn Cấp</div>
          </div>
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
