import { PROFILE_PAGES } from '@utils/constants/User'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { PageLink } from 'src/constants'
import { useAppDispatch } from 'src/redux/hook'
import { logout } from 'src/redux/slice/Login/Login'

import { IProfilePages } from 'src/type/Profile'
interface IProps {
  page: IProfilePages
}
const ProfileSideBar = ({ page }: IProps) => {
  const dispatch = useAppDispatch()
  const router = useRouter()

  const handleLogout = () => {
    dispatch(logout())
    router.push(PageLink.AUTH_LOGIN)
  }

  return (
    <div className="md:w-[22.8rem] w-100 shadow-box">
      <ul className="px-3 py-4 cursor-pointer bg-white h-full">
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
              <div className="absolute inset-0 border-b border-gray-3 bottom-0"></div>
            </li>
          )
        })}

        <li
          className="p-5 text-gray-1 relative hover:bg-secondary hover:font-bold hover:text-primary"
          onClick={handleLogout}
        >
          <div className="absolute inset-0 border-b border-gray-3 bottom-0"></div>
          <div>Logout</div>
        </li>
      </ul>
    </div>
  )
}

export default ProfileSideBar
