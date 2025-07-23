import { MenuItemsListProps } from 'src/constants/courses3level/sidebar'
import MenuItem from './MenuItem'

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
