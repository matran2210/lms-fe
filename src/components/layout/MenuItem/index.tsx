import blankAvatar from '@assets/images/blank_avatar.webp'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Dispatch, SetStateAction, useState } from 'react'
import { useAppSelector } from 'src/redux/hook'
import { userReducer } from 'src/redux/slice/User/User'
import { MenuItem as MenuItemType } from '../../../constants/menu-items'
import ExpandIcon from '../ExpandIcon'
import MenuItemsList from '../MenuItemsList'

type MenuItemProps = {
  menuItem: MenuItemType
  mode: string
  setOpenResource: Dispatch<SetStateAction<boolean>>
}

export default function MenuItem({
  mode,
  menuItem: { name, icon: Icon, url, type, subItems },
  setOpenResource,
}: MenuItemProps) {
  const [isExpanded, toggleExpanded] = useState(false)
  const { user } = useAppSelector(userReducer)
  const router = useRouter()
  const selected = router.pathname === url
  const isNested = subItems && subItems?.length > 0

  const onClick = () => {
    toggleExpanded((prev) => !prev)
  }

  const handleOpenResource = () => {
    setOpenResource(true)
    document.body.style.overflow = 'hidden'
  }

  const handleActiveResource =
    name === 'Resource' && (router?.query?.courseId || router.query.id)
      ? handleOpenResource
      : () => {}

  return (
    <>
      <div
        className={`cursor-pointer ${
          selected && type === 'level-1' ? 'border-l-4 pr-1 border-active' : ''
        } relative sidebar-list-items py-2 ${
          mode === 'student' ? 'mb-4 last:mb-0' : 'mb-7 last:mb-0'
        }`}
      >
        <div className="sidebar-item flex items-center justify-center group">
          <Link href={url} passHref>
            <div className="flex items-center" onClick={handleActiveResource}>
              {Icon === 'avatar' ? (
                <div className="w-10 h-10">
                  <Image
                    src={
                      user.detail.avatar['40x40'] ||
                      user.detail.avatar['ORIGIN'] ||
                      blankAvatar
                    }
                    alt="avatar"
                    className="rounded-full"
                    width={40}
                    height={40}
                  />
                </div>
              ) : (
                <ExpandIcon
                  type={Icon}
                  className={`before-icon min-w-6 min-h-6 ${
                    type == 'level-1' ? '' : 'mr-4'
                  } text-gray-2 ${
                    selected ? 'text-primary' : ''
                  } group-hover:text-primary`}
                />
              )}
              <span
                className={`label hidden ${
                  selected ? 'text-primary' : ''
                } group-hover:text-primary`}
              >
                {name}
              </span>
            </div>
          </Link>
          {isNested && type === 'level-2' ? (
            <ExpandIcon
              isExpanded={isExpanded}
              handleClick={onClick}
              type={'ontoggle'}
              className={`${
                selected ? 'text-primary' : ''
              } group-hover:text-primary`}
            />
          ) : null}
        </div>
        {isNested ? (
          <div
            className={`sidebar-child ${type} ${
              isExpanded && type === 'level-2' ? 'active' : ''
            }`}
          >
            <MenuItemsList
              options={subItems}
              mode={mode}
              setOpenResource={setOpenResource}
            />
          </div>
        ) : null}
      </div>
    </>
  )
}
