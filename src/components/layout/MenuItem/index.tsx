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
      <div className={`${selected ? 'selected' : ''} w-7`}>
        <Link href={url} passHref>
          <div className="menu-item">
            {Icon}
            <span>{name}</span>
          </div>
        </Link>
        {isNested ? (
          <ExpandIcon
            isExpanded={isExpanded}
            handleClick={onClick}
            type={'ontoggle'}
          />
        ) : null}
      </div>
      {isExpanded && isNested ? <MenuItemsList options={subItems} /> : null}
    </>
  )
}
