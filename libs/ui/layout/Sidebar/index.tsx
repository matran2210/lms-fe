import ExaminationInfo from '@components/mycourses/course-detail/ExaminationInfo'
import LearningResource from '@components/mycourses/LearningResource'
import PopupStep from '@components/user-guide/PopupStep'
import { trackGAEvent } from '@lms/utils'
import clsx from 'clsx'
import { Dispatch, SetStateAction } from 'react'
import TourGuideNoti from 'src/assets/lotties/tour-guide-noti.json'
import TourGuideSidebar from 'src/assets/lotties/tour-guide-sidebar.json'
import { PageLink, UserGuide } from '@lms/core'
import { useAppSelector } from 'src/redux/hook'
import {
  MENU_BOTTOM,
  MENU_ITEMS,
  MENU_ITEMS_EVENT,
} from '@lms/core'
import ExpandIcon from '../ExpandIcon'
import MenuItemsList from '../MenuItemsList'

import { Divider } from 'antd'
import { useRouter } from 'next/router'
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
  const router = useRouter()
  const guideStatus = useAppSelector((state) => state.userGuideReducer?.status)
  const guideStep = useAppSelector((state) => state.userGuideReducer?.step)
  /**
   * @description lấy state trong context
   */
  const closeSideBar = () => {
    toggleDrawer()
    document.body.classList.add('no-hover')
    setTimeout(() => {
      document.body.classList.remove('no-hover')
    }, 1000)
  }
  const isLevel1 =
    router.pathname === PageLink.COURSES ||
    router.pathname === PageLink.CALENDAR ||
    router.pathname === PageLink.ENTRANCE_TEST ||
    router.pathname === PageLink.EXAM_LIST
  const isGuideActive = guideStatus && (guideStep === 2 || guideStep === 3)
  return (
    <div className="group">
      <div
        className={clsx(
          className,
          isGuideActive ? 'z-50' : 'z-30',
          isOpened || (isGuideActive && 'w-[220px]'),
          'peer m-4 rounded-xl before:absolute before:-left-4 before:z-50 before:block before:h-full before:w-5 before:bg-transparent before:content-[""]',
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
              className="relative flex h-[50px] items-end justify-center text-center"
              onClick={() => trackGAEvent('Click Logo SAPP Menu')}
            >
              <ExpandIcon
                type={'logo-default'}
                className={clsx(
                  'transition-transform duration-300 ease-out lg:translate-x-[70%] lg:transform lg:group-hover:left-0 lg:group-hover:translate-x-0',
                )}
              />
              <ExpandIcon type={'logo-full'} />
            </div>
          </div>
          {/* Divider */}
          <div className="mx-auto w-[calc(100%-70px)] min-w-[50px] text-center">
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
              total={6}
              imgSrc={TourGuideSidebar}
            />
          )}
        </div>
        <div
          className={`absolute bottom-0 w-full rounded-xl bg-white pb-6
          ${guideStatus && guideStep == 3 ? 'z-50' : ''}`}
        >
          {isLevel1 && (
            <div className="mx-auto w-[calc(100%-48px)] bg-[#DCDDDD] text-center">
              <Divider className="mb-8 mt-0 bg-[#DCDDDD]" />
            </div>
          )}
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
              total={6}
            />
          )}
        </div>
        {guideStatus && (guideStep === 2 || guideStep === 3) && (
          <div
            className={`absolute inset-0 z-40 animate-fade-in-overlay rounded-xl bg-black opacity-[.55] transition-opacity`}
          />
        )}
      </div>
      <div
        onClick={toggleDrawer}
        className={clsx(
          `sidebar-overlay ${
            isOpened
              ? 'pointer-events-auto opacity-100 peer-hover:pointer-events-auto peer-hover:opacity-100 lg:pointer-events-none lg:opacity-0'
              : 'pointer-events-none opacity-0 peer-hover:pointer-events-auto peer-hover:opacity-100'
          } fixed bottom-0 left-0 right-0 top-0 z-20 h-full w-full cursor-pointer bg-[#00000080] transition-opacity duration-300 ease-in-out`,
          {
            '!pointer-events-none !opacity-0':
              guideStatus && (guideStep === 2 || guideStep === 3),
          },
        )}
      />
      <LearningResource open={openResource} setOpenResource={setOpenResource} />
      <ExaminationInfo
        open={openExaminationInfo}
        setOpen={setOpenExaminationInfo}
      />
    </div>
  )
}
