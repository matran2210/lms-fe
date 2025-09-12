import { trackGAEvent } from '@utils/google-analytics'
import { useAppDispatch, useAppSelector } from 'src/redux/hook'
import { increment, reset } from 'src/redux/slice/Course/UserGuide'
import MenuItemsList from './MenuItemsList'
import ExpandIcon from '@components/layout/ExpandIcon'
import {
  MENU_BOTTOM,
  MENU_ITEMS,
  SidebarProps,
} from 'src/constants/courses3level/sidebar'
import CourseResource from '../popup/CourseResource'

export default function Sidebar3Level({
  isOpened,
  className,
  toggleDrawer,
  setOpenResource,
  openResource,
}: SidebarProps) {
  const dispatch = useAppDispatch()
  const guideStatus = useAppSelector((state) => state.userGuideReducer?.status)
  const guideStep = useAppSelector((state) => state.userGuideReducer?.step)

  const nextStep = () => {
    dispatch(increment())
  }

  const closeUserGuide = () => {
    dispatch(reset())
  }

  const closeSideBar = () => {
    document.body.classList.add('no-hover')
    setTimeout(() => {
      document.body.classList.remove('no-hover')
    }, 1000)
  }
  return (
    <>
      <div
        className={`${className} ${
          guideStatus && (guideStep === 2 || guideStep === 3) ? 'z-50' : 'z-30'
        } ${isOpened ? 'w-[200px]' : ''}`}
      >
        <div
          className={`relative max-h-[calc(100vh-145px)] pb-6 pt-5.25 ${
            guideStatus && guideStep == 2
              ? 'z-50 bg-white'
              : 'overflow-y-auto overflow-x-hidden'
          }`}
        >
          <div
            className="group-logos mx-auto h-[71px] px-5 pb-5.25"
            onClick={() => closeSideBar()}
          >
            <div
              className="flex h-[50px] items-end justify-start text-center"
              onClick={() => trackGAEvent('Click Logo SAPP Menu')}
            >
              <ExpandIcon type={'logo-default'} />
              <ExpandIcon type={'logo-full'} />
            </div>
          </div>
          <div className="mx-auto mb-6 h-px w-[calc(100%-48px)] bg-gray-2 text-center"></div>
          <MenuItemsList
            options={MENU_ITEMS}
            setOpenResource={setOpenResource}
            closeSideBar={closeSideBar}
          />
        </div>
        <div
          className={`absolute bottom-0 w-full bg-white pb-6 
          ${guideStatus && guideStep == 3 ? 'z-50' : ''}`}
        >
          <div className="mx-auto mb-6 h-px w-[calc(100%-48px)] bg-gray-2 text-center"></div>
          <MenuItemsList
            options={MENU_BOTTOM}
            setOpenResource={setOpenResource}
            closeSideBar={closeSideBar}
          />
        </div>
      </div>
      <div
        onClick={toggleDrawer}
        className={`sidebar-overlay ${
          isOpened ? 'block md:hidden' : 'hidden'
        } h-ful fixed bottom-0 left-0 right-0 top-0 z-20 w-full cursor-pointer bg-overlay-dark`}
      ></div>
      <CourseResource />
    </>
  )
}
