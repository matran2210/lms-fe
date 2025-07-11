import { HamburgerMenuLargeIcon } from '@assets/icons'
import SearchForm from '@components/mycourses/Search'
import PopupStep from '@components/user-guide/PopupStep'
import React from 'react'
import { UserGuide } from 'src/constants'
import { MY_COURSES } from 'src/constants/lang'
import { useAppSelector } from 'src/redux/hook'
import TourGuideStart from 'src/assets/lotties/tour-guide-start.json'
import clsx from 'clsx'

interface IProps {
  handleOpenSidebar: () => void
  disabledSearch?: boolean
  isShowUserGuide?: boolean
  isShowToggle?: boolean
  className?: string
}
const SearchWithMenuToggle = ({
  handleOpenSidebar,
  disabledSearch,
  isShowUserGuide = false,
  isShowToggle = false,
  className,
}: IProps) => {
  const {
    status: guideStatus,
    isActive: guideIsActive,
    step: guideStep,
  } = useAppSelector((state) => state.userGuideReducer)
  return (
    <div
      className={clsx(
        'my-4 flex items-center justify-between gap-2 md:gap-6 lg:mb-6 lg:mt-4',
        className,
      )}
    >
      {isShowToggle && (
        <div
          className="flex h-11 w-11 items-center justify-center rounded-lg bg-white p-2 shadow-small md:h-14 md:w-14 lg:hidden"
          onClick={handleOpenSidebar}
        >
          <HamburgerMenuLargeIcon />
        </div>
      )}
      <div className="w-full rounded-lg bg-white px-2 py-3 shadow-small md:px-8 md:py-4">
        <SearchForm
          placeholder={MY_COURSES.placeholderSearchV2}
          formStyle="w-full flex items-center"
          disabled={disabledSearch}
        />
        {isShowUserGuide && guideStatus && guideStep === 1 && (
          <PopupStep
            content={UserGuide.CONTENT_STEP_1}
            className="left-0 top-full mt-3"
            title={'Search box'}
            index={1}
            total={7}
            imgSrc={TourGuideStart}
          />
        )}
      </div>
    </div>
  )
}

export default SearchWithMenuToggle
