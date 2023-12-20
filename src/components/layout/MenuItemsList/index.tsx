import { MenuItem as MenuItemType } from '../../../constants/menu-items'
import MenuItem from '../MenuItem'

type MenuItemsListProps = {
  options: MenuItemType[]
  mode: string
}

export default function MenuItemsList({ options, mode }: MenuItemsListProps) {
  return (
    <div className="menu-items-list">
      {options.map((option) => (
        <MenuItem mode={mode} menuItem={option} key={option.id} />
      ))}
    </div>
  )
}
