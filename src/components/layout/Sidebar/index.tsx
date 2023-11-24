import { MENU_ITEMS, MENU_BOTTOM } from '../../../constants/menu-items'
import MenuItemsList from '../MenuItemsList'
import ExpandIcon from '../ExpandIcon'
import { useEffect } from 'react'
import { useAppDispatch } from 'src/redux/hook'
import { getMe } from 'src/redux/slice/User/User'
import MenuItem from '../MenuItem'

type SidebarProps = {
  isOpened: boolean
  className: string
  toggleDrawer: () => void
  mode: string
}

export default function Sidebar({
  isOpened,
  className,
  toggleDrawer,
  mode,
}: SidebarProps) {
  const dispatch = useAppDispatch()
  useEffect(() => {
    try {
      dispatch(getMe())
    } catch (error) {}
  }, [dispatch])
  return (
    <>
      <div className={`${className} ${isOpened ? 'left-0' : '-left-full'}`}>
        <div className="flex justify-center text-center mx-auto pb-8">
          {mode === 'student' ? (
            <ExpandIcon type={'logo-default'} />
          ) : (
            <ExpandIcon type={'logo-teacher'} />
          )}
        </div>
        {mode === 'student' && (
          <div className="h-px w-8 bg-gray-2 text-center mx-auto mb-6"></div>
        )}
        <MenuItemsList
          mode={mode}
          options={mode === 'student' ? MENU_ITEMS : MENU_ITEMS}
        />
        <div className="absolute bottom-6 w-full">
          {mode === 'student' && (
            <div className="h-px w-8 bg-gray-2 text-center mx-auto mb-6"></div>
          )}
          <MenuItemsList
            mode={mode}
            options={mode === 'student' ? MENU_BOTTOM : MENU_BOTTOM}
          />
        </div>
      </div>
      <div
        onClick={toggleDrawer}
        className={`sidebar-overlay ${
          isOpened ? 'block md:hidden' : 'hidden'
        } fixed top-0 left-0 bottom-0 right-0 bg-overlay-dark w-full h-ful z-20 cursor-pointer`}
      ></div>
    </>
  )
}
