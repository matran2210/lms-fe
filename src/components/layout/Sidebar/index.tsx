import { MENU_ITEMS, MENU_BOTTOM } from '../../../constants/menu-items'
import MenuItemsList from '../MenuItemsList'
import ExpandIcon from '../ExpandIcon'
import { Dispatch, SetStateAction, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from 'src/redux/hook'
import { getMe } from 'src/redux/slice/User/User'
import PopupStep from '@components/user-guide/PopupStep'
import { increment, reset } from 'src/redux/slice/Course/UserGuide'
import { UserGuide } from 'src/constants'

type SidebarProps = {
  isOpened: boolean
  className: string
  toggleDrawer: () => void
  setOpenResource: Dispatch<SetStateAction<boolean>>
}

export default function Sidebar({
  isOpened,
  className,
  toggleDrawer,
  setOpenResource,
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

  useEffect(() => {
    try {
      dispatch(getMe())
    } catch (error) {}
  }, [dispatch])
  return (
    <>
      <div
        className={`${className} ${
          guideStatus && (guideStep === 2 || guideStep === 3) ? 'z-50' : 'z-30'
        } ${isOpened ? 'w-[200px]' : ''}`}
      >
        <div
          className={`pt-5.25 pb-6 relative max-h-[calc(100vh-145px) overflow-y-auto overflow-x-hidden ${
            guideStatus && guideStep == 2 ? 'bg-white z-50' : ''
          }`}
        >
          <div
            className="group-logos mx-auto pb-5.25 px-5 h-[71px]"
            onClick={() => closeSideBar()}
          >
            <div className="h-[50px] flex justify-start text-center items-end">
              <ExpandIcon type={'logo-default'} />
              <ExpandIcon type={'logo-full'} />
            </div>
          </div>
          <div className="h-px w-[calc(100%-48px)] bg-gray-2 text-center mx-auto mb-6"></div>
          <MenuItemsList
            options={MENU_ITEMS}
            setOpenResource={setOpenResource}
            closeSideBar={closeSideBar}
          />
          {guideStatus && guideStep == 2 && (
            <PopupStep
              content={UserGuide.CONTENT_STEP_2}
              className="top-full left-full max-w-365px mt-3 ml-3 w-screen"
              index={2}
              total={6}
              handleNext={nextStep}
              handleCancel={closeUserGuide}
            />
          )}
        </div>
        <div
          className={`absolute bottom-0 w-full pb-6 bg-white 
          ${guideStatus && guideStep == 3 ? 'z-50' : ''}`}
        >
          <div className="h-px w-[calc(100%-48px)] bg-gray-2 text-center mx-auto mb-6"></div>
          <MenuItemsList
            options={MENU_BOTTOM}
            setOpenResource={setOpenResource}
            closeSideBar={closeSideBar}
          />
          {guideStatus && guideStep == 3 && (
            <PopupStep
              content={UserGuide.CONTENT_STEP_3}
              className="max-w-365px bottom-full left-full mb-3 ml-3 w-screen"
              index={3}
              total={6}
              handleNext={nextStep}
              handleCancel={closeUserGuide}
            />
          )}
        </div>
        {guideStatus && (guideStep === 2 || guideStep === 3) && (
          <div className="absolute animate-fade-in-overlay inset-0 bg-black opacity-55 transition-opacity z-40"></div>
        )}
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
