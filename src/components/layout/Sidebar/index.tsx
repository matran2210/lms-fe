import { MENU_ITEMS } from '../../../constants/menu-items'
import MenuItemsList from '../MenuItemsList'
import ExpandIcon from '../ExpandIcon'

type SidebarProps = {
  isOpened: boolean
  className: string
}

export default function Sidebar({ isOpened, className }: SidebarProps) {
  return (
    <div className={`${className} ${isOpened ? 'opacity-100' : 'opacity-0'}`}>
      <div className="logo">
        <ExpandIcon type={'logo-default'} />
      </div>
      <MenuItemsList options={MENU_ITEMS} />
    </div>
  )
}
