import Icon from '@components/icons'
import clsx from 'clsx'
import React from 'react'
import { SubjectOptionItem } from './SubjectList'
import { useAppSelector } from 'src/redux/hook'
import { userReducer } from 'src/redux/slice/User/User'

interface IProps {
  data: SubjectOptionItem
  index: number
  isEdit: boolean
  setMakeDefaultDrawer: React.Dispatch<
    React.SetStateAction<
      | {
          status: boolean
          course_category_name: 'CMA' | 'CFA' | 'ACCA'
        }
      | undefined
    >
  >
}

const SubjectItem = ({ data, index, isEdit, setMakeDefaultDrawer }: IProps) => {
  const { user } = useAppSelector(userReducer)
  return (
    <div className="mb-4">
      <div
        className={clsx(
          'rounded-md border border-[#F1F1F1] bg-[#F9F9F9] px-6 py-4 hover:bg-[#FFFBF2]',
        )}
      >
        <div className="flex items-center">
          <div>
            <div>
              <span className="font-bold text-secondary">{`${data.title} (${data.course_category_name})`}</span>
            </div>
            <div className="mt-4 text-[#050505]">
              <div className="w-fit">
                <div className="flex items-center gap-2">
                  <Icon type="contact" />
                  <span>Account ID Number:</span>
                  <span className="font-bold">{user.hubspot_contact_id}</span>
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
                  course_category_name: data.course_category_name,
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
          )}
        </div>
      </div>
    </div>
  )
}

export default SubjectItem
