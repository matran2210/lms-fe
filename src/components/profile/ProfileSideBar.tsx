import ExpandIcon from '@components/layout/ExpandIcon'
import {
  MYPROFILE_TREE,
  PROFILE_PAGES,
  SECURITY_TREE,
} from '@utils/constants/User'
import { trackGAEvent } from '@utils/google-analytics'
import { AuthenticationManager } from '@utils/helpers/keycloak'
import { getLocalStorageItem, removeLocalStorageItem } from '@utils/index'
import clsx from 'clsx'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { ANIMATION } from 'src/constants'
import { useAppDispatch } from 'src/redux/hook'
import { getLogoutUser } from 'src/redux/slice/Login/Login'
import { NOTIFICATION_STATUS } from 'src/type'
import { IProfilePages } from 'src/type/Profile'

interface IProps {
  page: IProfilePages
  className?: string
  children?: React.ReactNode
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

interface ChildWithOverview {
  OVERVIEW: {
    label: string
  }
}

interface ChildWithACCA {
  ACCA: {
    label: string
  }
}
interface ChildWithCMA {
  CMA: {
    label: string
  }
}

interface ChildWithCFA {
  CFA: {
    label: string
  }
}

type Child =
  | ChildWithLabel
  | ChildWithDevices
  | ChildWithLoginHistory
  | ChildWithChangePassword
  | ChildWithOverview
  | ChildWithACCA
  | ChildWithCMA
  | ChildWithCFA

const ProfileSideBar = ({ page, children }: IProps) => {
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
    } else if ('OVERVIEW' in child) {
      return child.OVERVIEW.label
    } else if ('ACCA' in child) {
      return child.ACCA.label
    } else if ('CFA' in child) {
      return child.CFA.label
    } else if ('CMA' in child) {
      return child.CMA.label
    }

    // Mặc định trả về chuỗi rỗng nếu không tìm thấy
    return ''
  }

  const handleLogout = async () => {
    try {
      await dispatch(getLogoutUser()).then(() => {
        const pinnedStatus = getLocalStorageItem('pinnedStatus')
        if (pinnedStatus === NOTIFICATION_STATUS.SHOWING) {
          removeLocalStorageItem('pinnedId')
        }
      })
      const authenticationManager = new AuthenticationManager()
      await authenticationManager.logout(window.location.origin)
    } catch (error) {}
  }

  // Sử dụng useState để lưu trạng thái active của từng child
  const [childActivationStates, setChildActivationStates] = useState<{
    [key: string]: boolean
  }>({})

  const handleSetStatusActiveChild = (childLabel: string) => {
    // Set the child and the "Security" page to active
    setChildActivationStates((prev) => ({
      ...prev,
      [childLabel]: true,
      // security: true,
    }))

    // Set the active state of other children to false
    Object.keys(childActivationStates).forEach((key) => {
      if (key !== childLabel) {
        setChildActivationStates((prev) => ({ ...prev, [key]: false }))
      }
    })
  }
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

    handleSetStatusActiveChild(childLabel)
    // Chuyển trang
    let formattedChildLabel = childLabel.toLowerCase()

    router.push(`/${formattedChildLabel}`)
  }

  const [isExpanded, toggleExpanded] = useState({ urlPage: '', isOpen: false })

  /**
   * Hàm xử lý khi người dùng click vào nút mở rộng.
   * Chuyển trang đến trang con đầu tiên của trang hiện tại.
   *
   * @param {string} urlPage - Đường dẫn trang hiện tại.
   */
  const onClickExpand = (urlPage: string) => {
    switch (urlPage) {
      /**
       * Trang cá nhân hoặc trang bảo mật.
       */
      case 'myprofile':
      case 'security':
        /**
         * Đổi trạng thái mở rộng của trang hiện tại.
         *
         * @param {object} prev - Trạng thái mở rộng trước đó.
         * @returns {object} - Trạng thái mở rộng mới.
         */
        toggleExpanded((prev) => ({
          urlPage,
          isOpen: urlPage !== prev.urlPage ? true : !prev.isOpen,
        }))
        /**
         * Nếu đang ở trang cá nhân hoặc trang bảo mật, thì không cần chuyển trang.
         * Nếu không, chuyển đến trang con đầu tiên của trang hiện tại.
         */
        if (
          MYPROFILE_TREE.includes(router.query.page as string) &&
          urlPage === 'myprofile'
        ) {
          handleSetStatusActiveChild(router.query.page as string)
          break
        }
        if (
          SECURITY_TREE.includes(router.query.page as string) &&
          urlPage === 'security'
        ) {
          handleSetStatusActiveChild(router.query.page as string)
          break
        }

        /**
         * Lấy danh sách trang con của trang hiện tại.
         *
         * @param {string} parentKey - Khóa của trang hiện tại.
         * @returns {array} - Danh sách trang con.
         */
        const parentKey = urlPage.toUpperCase()
        const listChildren =
          PROFILE_PAGES[parentKey as keyof typeof PROFILE_PAGES].children
        /**
         * Lấy trang con đầu tiên.
         *
         * @param {array} listChildren - Danh sách trang con.
         * @returns {object} - Trang con đầu tiên.
         */
        const firstChild = listChildren[0]
        /**
         * Lấy nhãn của trang con đầu tiên.
         *
         * @param {object} firstChild - Trang con đầu tiên.
         * @returns {string} - Nhãn của trang con đầu tiên.
         */
        const firstChildKey = Object.keys(firstChild)[0]
        const firstChildLabel =
          firstChild?.[firstChildKey as keyof typeof firstChild]
        const firstChildLabelValue = getLabelFromChild(
          firstChildLabel as ChildWithLabel,
        )
        /**
         * Định dạng nhãn của trang con đầu tiên.
         *
         * @param {string} firstChildLabelValue - Nhãn của trang con đầu tiên.
         * @returns {string} - Nhãn định dạng.
         */
        const formattedChildLabel = firstChildLabelValue
          .toLowerCase()
          .replace(/\s+/g, '_')
        /**
         * Chuyển trang đến trang con đầu tiên.
         *
         * @param {string} formattedChildLabel - Nhãn định dạng.
         */
        handleSetStatusActiveChild(formattedChildLabel)
        router.push(`/${formattedChildLabel}`)
        break
      default:
        /**
         * Đổi trạng thái mở rộng của trang hiện tại.
         *
         * @param {object} - Trạng thái mở rộng mới.
         */
        toggleExpanded({
          urlPage: '',
          isOpen: false,
        })
        break
    }
  }
  /**
   * Hàm xử lý khi người dùng click vào menu.
   * Xử lý dựa trên đường dẫn trang hiện tại và nhãn của trang con.
   *
   * @param {string} urlPage - Đường dẫn trang hiện tại.
   * @param {string} childLabel - Nhãn của trang con.
   */
  const hanldeClickMenu = (urlPage: string, childLabel: string) => {
    switch (urlPage) {
      case 'myprofile':
        setChildActivationStates({ myprofile: true, security: false })
        onClickExpand(urlPage)
        trackGAEvent(`Click Button Programs My Profile`)
        break
      case 'security':
        setChildActivationStates({ security: true, myprofile: false })
        onClickExpand(urlPage)
        trackGAEvent(`Click Button Security My Profile`)
        break
      default:
        setChildActivationStates({ security: false, myprofile: false })
        handleChildClick(childLabel)
        onClickExpand('')
        trackGAEvent(`Click Button ${childLabel} My Profile`)
        break
    }
  }

  useEffect(() => {
    const rootMenu = SECURITY_TREE.includes(router.query.page as string)
      ? 'security'
      : MYPROFILE_TREE.includes(router.query.page as string)
        ? 'myprofile'
        : null
    rootMenu && onClickExpand(rootMenu)
    handleChildClick(router.query.page as string)
  }, [])

  useEffect(() => {
    // Check if the clicked label is a child
    if (childActivationStates[page]) {
      return // If the child is already active, do nothing
    } else {
      handleSetStatusActiveChild(page)

      // if page is child of security or myprofile, set expanded
      if (SECURITY_TREE.includes(page)) {
        toggleExpanded({ urlPage: 'security', isOpen: true })
      }
      if (MYPROFILE_TREE.includes(page)) {
        toggleExpanded({ urlPage: 'myprofile', isOpen: true })
      }
    }
  }, [page])

  return (
    <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-4">
      <div className="w-full shadow-box" data-aos={ANIMATION.DATA_AOS}>
        <ul className="flex h-full flex-col justify-between bg-white px-3 py-4">
          <div>
            {Object.entries(PROFILE_PAGES).map(([key, value]) => {
              const urlPage = key?.toLowerCase()
              const urlChildren = (value?.children || []) as Child[]
              const childLabel = getLabelFromChild(value)?.replace(/\s+/g, '_')
              const isActive = urlPage === page

              let className =
                'text-gray-1 relative hover:text-primary font-normal'
              if (isActive) {
                className = 'bg-secondary font-medium text-primary'
              }
              if (childActivationStates[childLabel]) {
                className = 'bg-secondary text-primary'
              }

              return (
                <li
                  className={`${className} group relative cursor-pointer border-b-[1px] border-gray-2`}
                  key={key}
                >
                  <a
                    className={`hover-transition-font-weight flex w-full justify-between p-5 text-left hover:bg-secondary  ${
                      isActive ||
                      (urlPage === isExpanded.urlPage &&
                        Object.values(childActivationStates)?.some(
                          (active) => active,
                        ) &&
                        !childActivationStates[childLabel])
                        ? 'bg-secondary font-medium text-primary'
                        : 'font-normal '
                    }`}
                    style={{
                      position: 'relative', // Đặt position là relative
                      zIndex: 2, // Thiết lập z-index của thẻ a
                    }}
                    onClick={() => hanldeClickMenu(urlPage, childLabel)}
                  >
                    {value?.label}
                    {['security', 'myprofile'].includes(urlPage) && (
                      <div className="mt-2">
                        <ExpandIcon
                          isExpanded={
                            isExpanded.isOpen && isExpanded.urlPage === urlPage
                          }
                          type={'ontoggle'}
                          className={''}
                        />
                      </div>
                    )}
                  </a>
                  {urlChildren?.length > 0 && (
                    <div
                      className={clsx(
                        'ml-5 border-l border-gray-2',
                        isExpanded.isOpen &&
                          isExpanded.urlPage === urlPage &&
                          'my-5',
                      )}
                    >
                      {isExpanded.isOpen &&
                        isExpanded.urlPage === urlPage &&
                        urlChildren?.map((child) => {
                          const childLabel = getLabelFromChild(child)
                            ?.toLowerCase()
                            ?.replace(/\s+/g, '_')
                          const childIsActive =
                            childActivationStates[childLabel] || false
                          return (
                            <div
                              key={childLabel}
                              className={`${className} hover-transition-font-weight relative ms-4 cursor-pointer hover:bg-secondary ${
                                childIsActive
                                  ? 'bg-secondary font-medium text-primary'
                                  : 'font-normal '
                              }`}
                            >
                              <a
                                className="block w-full p-3 text-left"
                                onClick={() => handleChildClick(childLabel)}
                              >
                                {getLabelFromChild(child).toLowerCase() ===
                                'devices'
                                  ? 'Browsers'
                                  : getLabelFromChild(child)}
                              </a>
                            </div>
                          )
                        })}
                    </div>
                  )}
                  <div
                    className={`hover-transition-font-weight relative top-px border-b border-gray-3 `}
                  />
                </li>
              )
            })}
            <li
              className="hover-transition-font-weight relative cursor-pointer p-5 font-normal text-gray-1  hover:bg-secondary hover:text-primary"
              onClick={handleLogout}
            >
              <div className="absolute inset-0 bottom-0"></div>
              <div>Logout</div>
            </li>
          </div>
          <div className="text-center text-sm font-normal text-gray-1">
            LMS Pro Version 2.8.0
          </div>
        </ul>
      </div>
      <div className="col-span-3 mb-6 hidden bg-white shadow-box lg:mb-0 lg:block">
        {children}
      </div>
    </div>
  )
}

export default ProfileSideBar
