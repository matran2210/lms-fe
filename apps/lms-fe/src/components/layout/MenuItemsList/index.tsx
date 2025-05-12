import { Dispatch, SetStateAction } from 'react'
import { MenuItem as MenuItemType } from '../../../constants/menu-items'
import MenuItem from '../MenuItem'

type MenuItemsListProps = {
  options: MenuItemType[]
  setOpenResource?: Dispatch<SetStateAction<boolean>>
  closeSideBar: () => void
}

export default function MenuItemsList({
  options,
  setOpenResource,
  closeSideBar,
}: MenuItemsListProps) {
  return (
    <div className="menu-items-list">
      {options.map((option, index) => (
        <MenuItem
          menuItem={option}
          key={option.id + index}
          setOpenResource={setOpenResource}
          closeSideBar={closeSideBar}
        />
      ))}
    </div>
  )
}
