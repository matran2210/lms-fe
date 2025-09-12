import { calculateTimeAgo } from '@utils/helpers'
import clsx from 'clsx'
import React, { Dispatch, SetStateAction, useMemo } from 'react'
import { IDeviceItem } from 'src/type/v2'

interface IProps {
  data: IDeviceItem
  index: number
  setSelectedDrawer: Dispatch<
    SetStateAction<
      | {
          status: boolean
          data: IDeviceItem
        }
      | undefined
    >
  >
}

const DeviceItem = ({ data, setSelectedDrawer }: IProps) => {
  const formattedDate = useMemo(() => {
    if (data?.created_at) {
      return calculateTimeAgo(data.created_at)
    }
    return null
  }, [data.created_at])

  return (
    <div className="mb-4">
      <div
        className={clsx(
          'hover:bg-primary-v2-50 cursor-pointer rounded-md border border-[#F1F1F1] bg-[#F9F9F9] p-3 md:p-4',
          {
            'bg-primary-v2-50': data.is_current,
          },
        )}
      >
        <div
          className="flex items-center"
          onClick={() =>
            setSelectedDrawer({
              status: true,
              data,
            })
          }
        >
          <div className="flex flex-1 flex-col justify-between gap-[10px] md:flex-row md:gap-4">
            <div>
              <span className="text-sm font-bold text-gray-v2-800 md:text-base">
                {`${data.user_agent.browserName} ${data.user_agent.browserVersion} (${data.user_agent.osName})`}
              </span>
              {data.is_current && (
                <span className="bg-success-v2-50 text-success-v2-DEFAULT ml-[10px] inline-block select-none bg-opacity-5 px-2 py-1 text-sm leading-4">
                  This device
                </span>
              )}
            </div>
            <div>
              <div className="text-left md:text-right">
                <span className="text-sm font-bold text-gray-v2-800 md:text-base">
                  Logged in
                </span>
              </div>
              <div className="text-xs text-gray-400 md:text-sm">
                {formattedDate}
              </div>
            </div>
          </div>
          <div className="group ml-auto hidden w-fit flex-1 cursor-pointer select-none items-center justify-end md:flex">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={24}
              height={24}
              fill="none"
            >
              <path
                className="fill-current text-[#6b7280] transition-colors duration-300 group-hover:text-primary"
                d="M13.102 19.147a.562.562 0 0 1 0-.795l5.79-5.79H3.75a.562.562 0 1 1 0-1.125h15.142l-5.79-5.79a.563.563 0 0 1 .796-.795l6.75 6.75a.563.563 0 0 1 0 .795l-6.75 6.75a.562.562 0 0 1-.796 0Z"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DeviceItem
