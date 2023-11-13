import { MENU_ITEMS } from '../../../constants/menu-items'
import MenuItemsList from '../MenuItemsList'

type SidebarProps = {
  isOpened: boolean
  className: string
}

export default function Sidebar({ isOpened, className }: SidebarProps) {
  return (
    <div className={`${className} ${isOpened ? 'opacity-100' : 'opacity-0'}`}>
      <MenuItemsList options={MENU_ITEMS} />
    </div>
  )
}
