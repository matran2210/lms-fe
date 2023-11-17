import { PROFILE_PAGES } from '@utils/constants/Profile'
import Link from 'next/link'
import React from 'react'
import { IProfilePages } from 'src/type/Profile'
interface IProps {
  page: IProfilePages
}
const ProfileSideBar = ({ page }: IProps) => {
  return (
    <div className="md:w-96 w-100">
      <ul className="px-3 py-4 cursor-pointer bg-white">
        {Object.entries(PROFILE_PAGES).map(([key, value]) => {
          const urlPage = key.toLowerCase()
          const isActive = page === urlPage
          let className =
            'text-gray-1 relative hover:bg-secondary hover:font-bold hover:text-primary'
          if (isActive) {
            className = 'bg-secondary font-bold text-primary'
          }
          return (
            <li className={className} key={key}>
              <Link href={`/profile/${urlPage}/`} passHref scroll={false}>
                <button className="p-5 block w-full text-left">
                  {value.label}
                </button>
              </Link>
            </li>
          )
        })}

        <li className="p-5 text-gray-1 relative hover:bg-secondary hover:font-bold hover:text-primary">
          <div className="absolute inset-0 border-b border-gray-3 bottom-0"></div>
          <div>Logout</div>
        </li>
      </ul>
    </div>
  )
}

export default ProfileSideBar
