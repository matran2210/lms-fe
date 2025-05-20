import Icon from '@components/icons'
import clsx from 'clsx'
import React from 'react'
import { IUserContact } from 'src/redux/types/User/urser'

interface IProps {
  data: IUserContact
  index: number
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
  isEdit,
  setMakeDefaultDrawer,
}: IProps) => {
  return (
    <div className="mb-4">
      <div
        className={clsx(
          'rounded-md border border-gray-3 bg-gray-4 px-6 py-4 hover:bg-yellow-2',
          {
            'bg-yellow-2': e?.is_default,
          },
        )}
      >
        <div className="flex items-center">
          <div>
            <div>
              <span className="text-base font-bold text-gray-14">
                Profile {index + 1}
              </span>
              {e?.is_default && (
                <span className="ml-[10px] inline-block select-none bg-green-6 bg-opacity-5 px-2 py-1 text-medium-sm leading-4 text-green-7">
                  Default
                </span>
              )}
            </div>
            <div className="mt-4 font-medium text-bw-1">
              <div className="flex w-fit gap-2">
                <div className="flex">
                  <Icon type="phone-ring" className="mr-2" />{' '}
                  {e?.phone && e?.phone}
                </div>
                {e?.email && e?.phone && (
                  <span className="mx-3 text-gray-1">|</span>
                )}
                <div className="flex">
                  <Icon type="email" className="mr-2" /> {e?.email && e?.email}
                </div>
              </div>
            </div>
          </div>
          {!isEdit && (
            <div
              className="group ml-auto flex w-fit cursor-pointer select-none items-center gap-2"
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
              {e?.is_default && (
                <span className="text-base font-bold text-gray-500 transition-colors duration-300 group-hover:text-primary">
                  Xem Thêm
                </span>
              )}

              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={24}
                height={24}
                fill="none"
              >
                <path
                  className="fill-current text-gray-500 transition-colors duration-300 group-hover:text-primary"
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
