import { CheckIcon, FineTuninIcon } from '@components/courses/icons'
import BaseDrawer from '@components/courses/popup/BaseDrawer'
import { defaultStatusCourse, MobileFilter3LevelProps } from '@lms/core'
import { ButtonPrimary } from '@lms/ui'
import ButtonIcon from '../buttons/ButtonIcon'

export default function MobileFilter3Level({
  courses,
  filterType,
  filterStatus,
  tempType,
  tempStatus,
  setTempType,
  setTempStatus,
  openDrawer,
  setOpenDrawer,
  confirmFilter,
}: MobileFilter3LevelProps) {
  return (
    <>
      <div className="flex justify-end md:hidden">
        <ButtonIcon
          onClick={() => {
            setTempType(filterType)
            setTempStatus(filterStatus)
            setOpenDrawer(true)
          }}
          className="flex items-center gap-2 text-base font-normal leading-6 text-bw-15"
        >
          <FineTuninIcon /> Filter
        </ButtonIcon>
      </div>

      <BaseDrawer
        title="Filter"
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        className="filter-mobile-course-3lv"
      >
        {/* Category */}
        <div className="mb-4">
          <div className="mb-2 text-base font-semibold leading-6 text-bw-15">
            Category
          </div>
          <div className="space-y-2">
            <div
              onClick={() => setTempType({ label: 'All', value: '' })}
              className={`cursor-pointer py-2 text-sm leading-5.5 ${tempType.value === '' ? 'text-primary' : 'text-bw-16'}`}
            >
              All
              {tempType.value === '' && (
                <span className="ml-2 inline-block">
                  <CheckIcon />
                </span>
              )}
            </div>
            {courses?.total?.map((cat) => (
              <div
                key={cat.categoryName}
                onClick={() =>
                  setTempType({
                    label: cat.categoryName,
                    value: cat.categoryName,
                  })
                }
                className={`cursor-pointer py-2 text-sm leading-5.5 ${tempType.value === cat.categoryName ? 'text-primary' : 'text-bw-16'}`}
              >
                {cat.categoryName}
                {tempType.value === cat.categoryName && (
                  <span className="ml-2 inline-block">
                    <CheckIcon />
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Status */}
        <div className="mb-4 border-t border-gray-17 pt-4">
          <div className="mb-2 text-base font-semibold leading-6 text-bw-15">
            Status
          </div>
          <div className="space-y-2">
            {defaultStatusCourse.map((status) => (
              <div
                key={status.value}
                onClick={() => setTempStatus(status)}
                className={`cursor-pointer py-2 text-sm leading-5.5 ${tempStatus.value === status.value ? 'text-primary' : 'text-bw-16'}`}
              >
                {status.label}
                {tempStatus.value === status.value && (
                  <span className="ml-2 inline-block">
                    <CheckIcon />
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-end px-4 pb-4">
          <ButtonPrimary
            title={'Confirm'}
            full={true}
            size={'medium'}
            onClick={confirmFilter}
          />
        </div>
      </BaseDrawer>
    </>
  )
}
