import LearningResource from '@components/mycourses/LearningResource'
import PopupStep from '@components/user-guide/PopupStep'
import { trackGAEvent } from '@utils/google-analytics'
import clsx from 'clsx'
import { Dispatch, SetStateAction } from 'react'
import TourGuideNoti from 'src/assets/lotties/tour-guide-noti.json'
import TourGuideSidebar from 'src/assets/lotties/tour-guide-sidebar.json'
import { UserGuide } from 'src/constants'
import { useAppSelector } from 'src/redux/hook'
import {
  MENU_BOTTOM,
  MENU_ITEMS,
  MENU_ITEMS_EVENT,
} from '../../../constants/menu-items'
import ExpandIcon from '../ExpandIcon'
import MenuItemsList from '../MenuItemsList'
import ExaminationInfo from '@components/mycourses/course-detail/ExaminationInfo'

import { Divider } from 'antd'
type SidebarProps = {
  isOpened: boolean
  className: string
  toggleDrawer: () => void
  setOpenResource: Dispatch<SetStateAction<boolean>>
  openResource: boolean
  openExaminationInfo: boolean
  setOpenExaminationInfo: Dispatch<SetStateAction<boolean>>
}

export default function Sidebar({
  isOpened,
  className,
  toggleDrawer,
  setOpenResource,
  openResource,
  openExaminationInfo,
  setOpenExaminationInfo,
}: SidebarProps) {
  const guideStatus = useAppSelector((state) => state.userGuideReducer?.status)
  const guideStep = useAppSelector((state) => state.userGuideReducer?.step)

  const closeSideBar = () => {
    document.body.classList.add('no-hover')
    setTimeout(() => {
      document.body.classList.remove('no-hover')
    }, 1000)
  }

  const isGuideActive = guideStatus && (guideStep === 2 || guideStep === 3)
  return (
    <div>
      <div
        className={clsx(
          className,
          isGuideActive ? 'z-50' : 'z-30',
          isOpened || (isGuideActive && 'w-[220px]'),
          'm-4 rounded-xl',
        )}
      >
        <div
          className={`max-h-[calc(100vh-145px) relative rounded-xl pb-6 pt-[25PX] ${
            guideStatus && guideStep == 2
              ? 'z-50 bg-white'
              : 'overflow-y-auto overflow-x-hidden'
          }`}
        >
          <div
            className="group-logos mx-auto px-5"
            onClick={() => closeSideBar()}
          >
            <div
              className="flex h-[50px] items-end justify-center text-center"
              onClick={() => trackGAEvent('Click Logo SAPP Menu')}
            >
              <ExpandIcon type={'logo-default'} />
              <ExpandIcon type={'logo-full'} />
            </div>
          </div>
          {/* Divider */}
          <div className="mx-auto w-[calc(100%-48px)] text-center">
            <Divider className="my-6 bg-[#DCDDDD]" />
          </div>
          <MenuItemsList
            options={
              Number(localStorage.getItem('countEvent')) <= 0
                ? MENU_ITEMS
                : MENU_ITEMS.concat(MENU_ITEMS_EVENT)
            }
            setOpenResource={setOpenResource}
            closeSideBar={closeSideBar}
            setOpenExaminationInfo={setOpenExaminationInfo}
          />
          {guideStatus && guideStep == 2 && (
            <PopupStep
              title="Sidebar"
              content={UserGuide.CONTENT_STEP_2}
              className="left-full top-1/2 ml-5"
              index={2}
              total={7}
              imgSrc={TourGuideSidebar}
            />
          )}
        </div>
        <div
          className={`absolute bottom-0 w-full rounded-xl bg-white pb-6
          ${guideStatus && guideStep == 3 ? 'z-50' : ''}`}
        >
          <div className="mx-auto w-[calc(100%-48px)] bg-[#DCDDDD] text-center">
            <Divider className="mb-8 mt-0 bg-[#DCDDDD]" />
          </div>
          <MenuItemsList
            options={MENU_BOTTOM}
            setOpenResource={setOpenResource}
            closeSideBar={closeSideBar}
            setOpenExaminationInfo={setOpenExaminationInfo}
          />
          {guideStatus && guideStep == 3 && (
            <PopupStep
              content={UserGuide.CONTENT_STEP_3}
              className="bottom-0 left-full ml-5"
              title="Notification & Profile"
              imgSrc={TourGuideNoti}
              index={3}
              total={7}
            />
          )}
        </div>
        {guideStatus && (guideStep === 2 || guideStep === 3) && (
          <div className="absolute inset-0 z-40 animate-fade-in-overlay rounded-xl bg-black opacity-[.55] transition-opacity" />
        )}
      </div>
      <div
        onClick={toggleDrawer}
        className={`sidebar-overlay ${
          isOpened ? 'block lg:hidden' : 'hidden'
        } h-ful fixed bottom-0 left-0 right-0 top-0 z-20 w-full cursor-pointer bg-[#00000080]`}
      />
      {openResource && (
        <LearningResource
          open={openResource}
          setOpenResource={setOpenResource}
        />
      )}

      <ExaminationInfo
        open={openExaminationInfo}
        setOpen={setOpenExaminationInfo}
      />
    </div>
  )
}
