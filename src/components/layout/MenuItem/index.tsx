import Link from 'next/link'
import { useRouter } from 'next/router'
import { MenuItem as MenuItemType } from '../../../constants/menu-items'
import MenuItemsList from '../MenuItemsList'
import ExpandIcon from '../ExpandIcon'
import { useState } from 'react'

type MenuItemProps = {
  menuItem: MenuItemType
}

export default function MenuItem({
  menuItem: { name, icon: Icon, url, subItems },
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
      <div className={`${selected ? 'selected' : ''} relative sidebar-list`}>
        <Link href={url} passHref>
          <div className="sidebar-item cursor-pointer flex items-center">
            <ExpandIcon
              type={Icon}
              className={`w-6 h-6 ${isNested ? '' : 'mr-4'} text-gray-2`}
            />
            <span className="label hidden">{name}</span>
            {isNested ? (
              <ExpandIcon
                isExpanded={isExpanded}
                handleClick={onClick}
                type={'ontoggle'}
              />
            ) : null}
          </div>
        </Link>
        {isNested ? (
          <div className="sidebar-child">
            <MenuItemsList options={subItems} />
          </div>
        ) : null}
      </div>
    </>
  )
}
