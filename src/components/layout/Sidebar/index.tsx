import LearningResource from '@components/mycourses/LearningResource'
import PopupStep from '@components/user-guide/PopupStep'
import { trackGAEvent } from '@utils/google-analytics'
import { Dispatch, SetStateAction } from 'react'
import { UserGuide } from 'src/constants'
import { useAppDispatch, useAppSelector } from 'src/redux/hook'
import { increment, reset } from 'src/redux/slice/Course/UserGuide'
import {
  MENU_BOTTOM,
  MENU_ITEMS,
  MENU_ITEMS_EVENT,
} from '../../../constants/menu-items'
import ExpandIcon from '../ExpandIcon'
import MenuItemsList from '../MenuItemsList'

type SidebarProps = {
  isOpened: boolean
  className: string
  toggleDrawer: () => void
  setOpenResource: Dispatch<SetStateAction<boolean>>
  openResource: boolean
}

export default function Sidebar({
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
          className={`max-h-[calc(100vh-145px) relative pb-6 pt-5.25 ${
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
            options={
              MENU_ITEMS
              // Number(localStorage.getItem('countEvent')) <= 0
              //   ? MENU_ITEMS
              //   : MENU_ITEMS.concat(MENU_ITEMS_EVENT)
            }
            setOpenResource={setOpenResource}
            closeSideBar={closeSideBar}
          />
          {guideStatus && guideStep == 2 && (
            <PopupStep
              content={UserGuide.CONTENT_STEP_2}
              className="left-full top-full ml-3 mt-3 w-screen max-w-365px"
              index={2}
              total={6}
              handleNext={nextStep}
              handleCancel={closeUserGuide}
            />
          )}
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
          {guideStatus && guideStep == 3 && (
            <PopupStep
              content={UserGuide.CONTENT_STEP_3}
              className="bottom-full left-full mb-3 ml-3 w-screen max-w-365px"
              index={3}
              total={6}
              handleNext={nextStep}
              handleCancel={closeUserGuide}
            />
          )}
        </div>
        {guideStatus && (guideStep === 2 || guideStep === 3) && (
          <div className="absolute inset-0 z-40 animate-fade-in-overlay bg-black opacity-55 transition-opacity"></div>
        )}
      </div>
      <div
        onClick={toggleDrawer}
        className={`sidebar-overlay ${
          isOpened ? 'block md:hidden' : 'hidden'
        } h-ful fixed bottom-0 left-0 right-0 top-0 z-20 w-full cursor-pointer bg-overlay-dark`}
      ></div>
      <LearningResource open={openResource} setOpenResource={setOpenResource} />
    </>
  )
}
