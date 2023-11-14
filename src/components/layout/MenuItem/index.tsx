import Link from 'next/link'
import { useRouter } from 'next/router'
import { MenuItem as MenuItemType } from '../../../constants/menu-items'
import MenuItemsList from '../MenuItemsList'
import ExpandIcon from '../ExpandIcon'
import { useState } from 'react'

type MenuItemProps = {
  menuItem: MenuItemType
  mode: string
}

export default function MenuItem({
  mode,
  menuItem: { name, icon: Icon, url, type, subItems },
}: MenuItemProps) {
  const [isExpanded, toggleExpanded] = useState(false)

  const router = useRouter()
  const selected = router.asPath === url
  const isNested = subItems && subItems?.length > 0

  const onClick = () => {
    toggleExpanded((prev) => !prev)
  }

  return (
    <>
      <div
        className={`${
          selected && type === 'level-1' ? 'border-l-4 border-active' : ''
        } relative sidebar-list-items py-2 ${
          mode === 'student' ? 'mb-4 last:mb-0' : 'mb-7 last:mb-0'
        }`}
      >
        <div className="sidebar-item cursor-pointer flex items-center justify-center group">
          <Link href={url} passHref>
            <div className="flex items-center">
              <ExpandIcon
                type={Icon}
                className={`before-icon min-w-6 min-h-6 ${
                  type == 'level-1' ? '' : 'mr-4'
                } text-gray-2 ${
                  selected ? 'text-primary' : ''
                } group-hover:text-primary`}
              />
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
            <MenuItemsList options={subItems} mode={mode} />
          </div>
        ) : null}
      </div>
    </>
  )
}
