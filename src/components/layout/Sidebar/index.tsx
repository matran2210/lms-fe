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
  mode: string
  setOpenResource: Dispatch<SetStateAction<boolean>>
}

export default function Sidebar({
  isOpened,
  className,
  toggleDrawer,
  mode,
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
        } ${isOpened ? 'left-0' : '-left-full'}`}
      >
        <div
          className={`${
            mode === 'student' ? 'pt-2.5' : 'pt-8 '
          } pb-6 relative ${
            guideStatus && guideStep == 2 ? 'bg-white z-50' : ''
          }`}
        >
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
            setOpenResource={setOpenResource}
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
          className={`absolute bottom-0 w-full ${
            mode === 'student' ? 'pb-6' : 'pb-10'
          } ${guideStatus && guideStep == 3 ? 'bg-white z-50' : ''}`}
        >
          {mode === 'student' && (
            <div className="h-px w-8 bg-gray-2 text-center mx-auto mb-6"></div>
          )}
          <MenuItemsList
            mode={mode}
            options={mode === 'student' ? MENU_BOTTOM : MENU_BOTTOM}
            setOpenResource={setOpenResource}
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
