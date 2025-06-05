import { calculateTimeAgo } from '@utils/helpers'
import clsx from 'clsx'
import React, { Dispatch, SetStateAction, useMemo } from 'react'
import { IDeviceItem } from 'src/type/Profile'

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
          'rounded-md border border-[#F1F1F1] bg-[#F9F9F9] p-4 hover:bg-[#FFFBF2]',
          {
            'bg-[#FFFBF2]': data.is_current,
          },
        )}
      >
        <div className="flex items-center">
          <div className="flex flex-1 justify-between gap-4">
            <div>
              <span className="text-base font-bold text-secondary">
                {`${data.user_agent.browserName} ${data.user_agent.browserVersion} (${data.user_agent.osName})`}
              </span>
              {data.is_current && (
                <span className="text-medium-sm ml-[10px] inline-block select-none bg-success-50 bg-opacity-5 px-2 py-1 leading-4 text-success">
                  This device
                </span>
              )}
            </div>
            <div>
              <div className="text-right">
                <span className="text-base font-bold text-secondary">
                  Logged in
                </span>
              </div>
              <div className="text-sm text-[#A1A1A1]">{formattedDate}</div>
            </div>
          </div>
          <div
            className="group ml-auto flex w-fit flex-1 cursor-pointer select-none items-center justify-end"
            onClick={() =>
              setSelectedDrawer({
                status: true,
                data,
              })
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={24}
              height={24}
              fill="none"
            >
              <path
                className="text-gray-500 fill-current transition-colors duration-300 group-hover:text-primary"
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
