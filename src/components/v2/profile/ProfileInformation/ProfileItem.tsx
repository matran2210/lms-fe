import Icon from '@components/icons'
import clsx from 'clsx'
import React from 'react'
import { IUserContact } from 'src/redux/types/User/urser'

interface IProps {
  data: IUserContact
  index: number
  className?: string
  isEdit: boolean
  setMakeDefaultDrawer: React.Dispatch<
    React.SetStateAction<
      | {
          status: boolean
          email: string
          phone: string
          address: string
          index: number
          id: string
          is_default: boolean
        }
      | undefined
    >
  >
}

const ProfileItem = ({
  data: e,
  index,
  className,
  isEdit,
  setMakeDefaultDrawer,
}: IProps) => {
  return (
    <div className={className}>
      <div
        className={clsx(
          'group rounded-md bg-gray-canvas p-3 text-sm hover:bg-primary-v2-50 md:px-6 md:py-4 md:text-base',
        )}
        onClick={() =>
          setMakeDefaultDrawer({
            status: true,
            email: e?.email,
            phone: e?.phone,
            address: e?.address,
            index: index + 1,
            id: e?.id,
            is_default: e?.is_default,
          })
        }
      >
        <div className="flex items-center">
          <div>
            <div>
              <span className="font-bold text-secondary-v2-DEFAULT md:text-base">
                Profile {index + 1}
              </span>
              {e?.is_default && (
                <span className="ml-[10px] inline-block select-none rounded bg-success-v2-50 bg-opacity-5 px-2 py-1 leading-4 text-success-v2-DEFAULT">
                  Default
                </span>
              )}
            </div>
            <div className="mt-4 font-normal text-secondary-v2-DEFAULT">
              <div className="flex w-fit flex-col gap-2 md:flex-row">
                <div className="flex">
                  <Icon type="phone-ring" className="mr-2" />{' '}
                  {e?.phone && e?.phone}
                </div>
                {e?.email && e?.phone && (
                  <span className="mx-3 hidden text-[#A1A1A1] md:block">|</span>
                )}
                <div className="flex">
                  <Icon type="email" className="mr-2" /> {e?.email && e?.email}
                </div>
              </div>
            </div>
          </div>
          {!isEdit && (
            <div className="ml-auto hidden w-fit cursor-pointer select-none items-center gap-2 md:flex">
              <span className="hidden font-bold transition-all group-hover:inline-block group-hover:text-primary">
                Xem Thêm
              </span>

              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={24}
                height={24}
                fill="none"
              >
                <path
                  className="fill-current text-icon group-hover:text-primary"
                  d="M13.102 19.147a.562.562 0 0 1 0-.795l5.79-5.79H3.75a.562.562 0 1 1 0-1.125h15.142l-5.79-5.79a.563.563 0 0 1 .796-.795l6.75 6.75a.563.563 0 0 1 0 .795l-6.75 6.75a.562.562 0 0 1-.796 0Z"
                />
              </svg>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProfileItem
