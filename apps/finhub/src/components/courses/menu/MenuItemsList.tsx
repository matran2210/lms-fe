import { Dispatch, SetStateAction } from 'react'
import { MenuItem as MenuItemType } from '../../../constants/menu-items'
import MenuItem from './MenuItem'

type MenuItemsListProps = {
  options: MenuItemType[]
  closeSideBar: () => void
  setOpenExaminationInfo?: Dispatch<SetStateAction<boolean>>
  isVisible?: boolean
}

export default function MenuItemsList({
  options,
  closeSideBar,
  // setOpenExaminationInfo,
  isVisible,
}: MenuItemsListProps) {
  return (
    <div className="menu-items-list flex flex-col gap-4 px-3">
      {options.map((option, index) => (
        <MenuItem
          menuItem={option}
          key={option.id + index}
          closeSideBar={closeSideBar}
          isVisible={isVisible}
        />
      ))}
    </div>
  )
}
