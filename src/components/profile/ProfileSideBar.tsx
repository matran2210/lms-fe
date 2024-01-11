import { PROFILE_PAGES } from '@utils/constants/User'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { PageLink } from 'src/constants'
import { useAppDispatch } from 'src/redux/hook'
import { getLogoutUser } from 'src/redux/slice/Login/Login'
import { IProfilePages } from 'src/type/Profile'

interface IProps {
  page: IProfilePages
}

interface ChildWithLabel {
  label: string
}

interface ChildWithDevices {
  DEVICES: {
    label: string
  }
}

interface ChildWithLoginHistory {
  LOGIN_HISTORY: {
    label: string
  }
}

type Child = ChildWithLabel | ChildWithDevices | ChildWithLoginHistory

const ProfileSideBar = ({ page }: IProps) => {
  const dispatch = useAppDispatch()
  const router = useRouter()

  const getLabelFromChild = (child: Child): string => {
    if ('label' in child) {
      return child.label
    } else if ('DEVICES' in child) {
      return child.DEVICES.label
    } else if ('LOGIN_HISTORY' in child) {
      return child.LOGIN_HISTORY.label
    }

    // Mặc định trả về chuỗi rỗng nếu không tìm thấy
    return ''
  }

  const handleLogout = async () => {
    try {
      await dispatch(getLogoutUser())
      router.push(PageLink.AUTH_LOGIN)
    } catch (error) {}
  }

  // Sử dụng useState để lưu trạng thái active của từng child
  const [childActivationStates, setChildActivationStates] = useState<{
    [key: string]: boolean
  }>({})

  const handleChildClick = (childLabel: string) => {
    // Nếu child đang được active, không cần xử lý
    if (childActivationStates[childLabel]) {
      return
    }

    // Đặt trạng thái active của child được click thành true
    setChildActivationStates((prev) => ({ ...prev, [childLabel]: true }))

    // Đặt trạng thái active của các child khác thành false
    Object.keys(childActivationStates).forEach((key) => {
      if (key !== childLabel) {
        setChildActivationStates((prev) => ({ ...prev, [key]: false }))
      }
    })

    // Chuyển trang
    router.push(`/${childLabel.toLowerCase()}`)
  }

  return (
    <div className="md:w-[22.8rem] w-100 shadow-box">
      <ul className="px-3 py-4 bg-white h-full">
        {Object.entries(PROFILE_PAGES).map(([key, value]) => {
          const urlPage = key.toLowerCase()
          const urlChildren = (value.children || []) as Child[]

          const childLabel = getLabelFromChild(value).replace(/\s+/g, '_')
          const isActive = urlPage === page || childActivationStates[childLabel]

          let className =
            'text-gray-1 relative hover:bg-secondary hover:font-bold hover:text-primary'

          if (isActive) {
            className = 'bg-secondary font-bold text-primary'
          }

          return (
            <li className={`${className} cursor-pointer relative`} key={key}>
              <a
                className="p-5 block w-full text-left"
                onClick={() => handleChildClick(childLabel)}
              >
                {value.label}
              </a>
              {urlChildren.map((child) => {
                const childLabel = getLabelFromChild(child).replace(/\s+/g, '_')
                const childIsActive = childActivationStates[childLabel]

                return (
                  <div
                    key={childLabel}
                    className={`${className} cursor-pointer relative ms-4 ${
                      childIsActive ? 'bg-secondary font-bold text-primary' : ''
                    }`}
                  >
                    <a
                      className="p-5 block w-full text-left"
                      onClick={() => handleChildClick(childLabel)}
                    >
                      {getLabelFromChild(child)}
                    </a>
                  </div>
                )
              })}
              {urlChildren.length === 0 && (
                <div className=" border-b border-gray-3"></div>
              )}
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
