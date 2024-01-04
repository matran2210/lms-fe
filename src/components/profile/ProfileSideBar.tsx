import { PROFILE_PAGES } from '@utils/constants/User'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { PageLink } from 'src/constants'
import { useAppDispatch } from 'src/redux/hook'
import { getLogoutUser } from 'src/redux/slice/Login/Login'

import { IProfilePages } from 'src/type/Profile'
interface IProps {
  page: IProfilePages
}
const ProfileSideBar = ({ page }: IProps) => {
  const dispatch = useAppDispatch()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await dispatch(getLogoutUser())
      router.push(PageLink.AUTH_LOGIN)
    } catch (error) {}
  }

  return (
    <div className="md:w-[22.8rem] w-100 shadow-box">
      <ul className="px-3 py-4 bg-white h-full">
        {Object.entries(PROFILE_PAGES).map(([key, value]) => {
          const urlPage = key.toLowerCase()
          const isActive = page === urlPage
          let className =
            'text-gray-1 relative hover:bg-secondary hover:font-bold hover:text-primary'
          if (value?.children?.length > 0) {
            return (
              <li className={`${className} cursor-pointer relative`} key={key}>
                <div>
                  <a className="p-5 block w-full text-left">{value.label}</a>
                </div>
                <div>
                  {value?.children?.map((e: any) => {
                    return Object.entries(e).map(([k, v]: any) => {
                      const urlPage = k.toLowerCase()
                      return (
                        <div
                          className={`${className} cursor-pointer relative ms-4`}
                          key={key}
                        >
                          <Link href={`/${urlPage}/`} passHref scroll={false}>
                            <a className="p-5 block w-full text-left">
                              {v.label}
                            </a>
                          </Link>
                          <div className="absolute bottom-0">
                            <Link href={`/${urlPage}/`} passHref scroll={false}>
                              <a className="p-5 block w-full text-left">
                                {v.label}
                              </a>
                            </Link>
                          </div>
                        </div>
                      )
                    })
                  })}
                </div>
                <div className=" border-b border-gray-3"></div>

                {/* <Link href={`/profile/${urlPage}/`} passHref scroll={false}>
                  <a className="p-5 block w-full text-left">{value.label}</a>
                </Link> */}
              </li>
            )
          }

          if (isActive) {
            className = 'bg-secondary font-bold text-primary'
          }
          return (
            <li className={`${className} cursor-pointer relative`} key={key}>
              <Link href={`/${urlPage}/`} passHref scroll={false}>
                <a className="p-5 block w-full text-left">{value.label}</a>
              </Link>
              <div className="absolute inset-0 border-b border-gray-3 bottom-0">
                <Link href={`/${urlPage}/`} passHref scroll={false}>
                  <a className="p-5 block w-full text-left">{value.label}</a>
                </Link>
              </div>
            </li>
          )
        })}

        <li
          className="cursor-pointer p-5 text-gray-1 relative hover:bg-secondary hover:font-bold hover:text-primary"
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
