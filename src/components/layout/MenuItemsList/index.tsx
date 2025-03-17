import { Dispatch, SetStateAction } from 'react'
import { MenuItem as MenuItemType } from '../../../constants/menu-items'
import SidebarMenu from 'src/components/layout/MenuItemsList/TeacherMenu'

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
      {options.map((option) => (
        <SidebarMenu className={'menu-item'} key={option.id} />
      ))}
    </div>
  )
}
