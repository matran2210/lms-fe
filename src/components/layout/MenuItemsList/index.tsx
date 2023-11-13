import { MenuItem as MenuItemType } from '../../../constants/menu-items'
import MenuItem from '../MenuItem'
import ExpandIcon from '../ExpandIcon'

type MenuItemsListProps = {
  options: MenuItemType[]
}

export default function MenuItemsList({ options }: MenuItemsListProps) {
  return (
    <div>
      <div>
        <ExpandIcon type={'logo-default'} />
      </div>
      {options.map((option) => (
        <MenuItem menuItem={option} key={option.id} />
      ))}
    </div>
  )
}
