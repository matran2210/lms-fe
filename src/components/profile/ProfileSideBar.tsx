import ExpandIcon from '@components/layout/ExpandIcon'
import { PROFILE_PAGES } from '@utils/constants/User'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { ANIMATION, PageLink } from 'src/constants'
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

interface ChildWithChangePassword {
  CHANGE_PASSWORD: {
    label: string
  }
}

type Child =
  | ChildWithLabel
  | ChildWithDevices
  | ChildWithLoginHistory
  | ChildWithChangePassword

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
    } else if ('CHANGE_PASSWORD' in child) {
      return child.CHANGE_PASSWORD.label
    }

    // Mặc định trả về chuỗi rỗng nếu không tìm thấy
    return ''
  }

  const handleLogout = async () => {
    try {
      await dispatch(getLogoutUser())
      // router.push(PageLink.AUTH_LOGIN)
    } catch (error) {}
  }

  // Sử dụng useState để lưu trạng thái active của từng child
  const [childActivationStates, setChildActivationStates] = useState<{
    [key: string]: boolean
  }>({})

  const handleChildClick = (childLabel: string) => {
    // Check if the clicked label is "Security"
    if (childLabel.toLowerCase() === 'security') {
      // Set both the "Security" page and the first child to active
      setChildActivationStates({
        security: true,
        [Object.keys(childActivationStates)[0]]: true,
      })
      return
    }

    // Check if the clicked label is a child
    if (childActivationStates[childLabel]) {
      return // If the child is already active, do nothing
    }

    // Set the child and the "Security" page to active
    setChildActivationStates((prev) => ({
      ...prev,
      [childLabel]: true,
      security: true,
    }))

    // Set the active state of other children to false
    Object.keys(childActivationStates).forEach((key) => {
      if (key !== childLabel && key !== 'security') {
        setChildActivationStates((prev) => ({ ...prev, [key]: false }))
      }
    })

    // Chuyển trang
    let formattedChildLabel = childLabel.toLowerCase()

    if (formattedChildLabel === 'my_profile') {
      formattedChildLabel = formattedChildLabel.replace(/_/g, '') // hoặc có thể sử dụng ' ' để thay thế bằng khoảng trắng
    }

    router.push(`/${formattedChildLabel}`)
  }

  const [isExpanded, toggleExpanded] = useState(false)

  const onClickExpand = () => {
    toggleExpanded((prev) => !prev) // Sử dụng callback để đảm bảo sử dụng giá trị mới nhất
  }

  return (
    <div
      className="md:w-[22.8rem] w-100 shadow-box"
      data-aos={ANIMATION.DATA_AOS}
    >
      <ul className="px-3 py-4 bg-white h-full flex flex-col justify-between">
        <div>
          {Object.entries(PROFILE_PAGES).map(([key, value]) => {
            const urlPage = key.toLowerCase()
            const urlChildren = (value.children || []) as Child[]

            const childLabel = getLabelFromChild(value).replace(/\s+/g, '_')
            const isActive = urlPage === page

            let className =
              'text-gray-1 relative hover:text-primary font-normal'

            if (isActive) {
              className = 'bg-secondary font-medium text-primary'
            }
            if (childActivationStates[childLabel]) {
              className = 'bg-secondary hover:font-medium text-primary'
            }

            return (
              <li
                className={`${className} cursor-pointer relative group border-b-[1px] border-gray-2`}
                key={key}
              >
                <a
                  className={`p-5 w-full text-left flex justify-between hover:bg-secondary hover:font-medium hover-transition-font-weight ${
                    isActive ||
                    (urlPage === 'security' &&
                      Object.values(childActivationStates).some(
                        (active) => active,
                      ) &&
                      !childActivationStates[childLabel])
                      ? 'bg-secondary text-primary font-medium'
                      : 'hover:left-[-0.5px] font-normal'
                  }`}
                  style={{
                    position: 'relative', // Đặt position là relative
                    zIndex: 2, // Thiết lập z-index của thẻ a
                  }}
                  onClick={() => {
                    if (urlPage !== 'security') {
                      // If not 'security', use existing logic
                      handleChildClick(childLabel)
                      setChildActivationStates({ security: false })
                    } else if (childActivationStates[childLabel] === false) {
                      // If 'security' and not a child, set only 'security' to active
                      setChildActivationStates({ security: true })
                    } else if (urlPage === 'security') {
                      onClickExpand()
                      setChildActivationStates({ security: true })
                    }
                  }}
                >
                  {value.label}
                  {urlPage === 'security' && (
                    <div className="mt-2">
                      <ExpandIcon
                        isExpanded={isExpanded}
                        type={'ontoggle'}
                        className={''}
                      />
                    </div>
                  )}
                </a>
                {urlChildren?.length > 0 && (
                  <div className="border-l border-gray-2 ml-5 my-5">
                    {isExpanded &&
                      urlChildren.map((child) => {
                        const childLabel = getLabelFromChild(child).replace(
                          /\s+/g,
                          '_',
                        )
                        const childIsActive =
                          childActivationStates[childLabel] || false
                        return (
                          <div
                            key={childLabel}
                            className={`${className} cursor-pointer relative ms-4 hover:bg-secondary hover:font-medium hover-transition-font-weight ${
                              childIsActive
                                ? 'bg-white font-medium text-primary'
                                : 'hover:left-[-0.5px] font-normal'
                            }`}
                          >
                            <a
                              className="p-3 block w-full text-left"
                              onClick={() => handleChildClick(childLabel)}
                            >
                              {getLabelFromChild(child)}
                            </a>
                          </div>
                        )
                      })}
                  </div>
                )}
                <div
                  className={`border-b border-gray-3 relative top-px group-hover:border-secondary ${
                    isActive ? 'border-secondary' : ''
                  }`}
                ></div>
              </li>
            )
          })}
          <li
            className="cursor-pointer p-5 text-gray-1 relative hover:bg-secondary font-normal hover:font-medium hover:text-primary hover-transition-font-weight hover:left-[-0.25px]"
            onClick={handleLogout}
          >
            <div className="absolute inset-0 bottom-0"></div>
            <div>Logout</div>
          </li>
        </div>
        <div className="text-center text-sm font-normal text-gray-1">
          LMS Pro Version 1.2.0
        </div>
      </ul>
    </div>
  )
}

export default ProfileSideBar
