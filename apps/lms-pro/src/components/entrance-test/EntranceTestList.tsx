import { isEmpty } from 'lodash'
import React from 'react'
import { IEntranceTest } from 'src/type/entrance-test'
import EntranceTest from './EntranceTest'
import { EAttemptStatus } from '@lms/core'
import NoCoursesAvailable from 'src/common/NoCoursesAvailable'

interface EntranceTestListProps {
  entranceTestLists: IEntranceTest[]
  onRefetch: () => void
}

const EntranceTestList: React.FC<EntranceTestListProps> = ({
  entranceTestLists,
  onRefetch,
}) => {
  const firstIndexToShowEntrancePopup = entranceTestLists.findIndex(
    (entrance) =>
      entrance.is_attempt === false ||
      (entrance.attempt_times < entrance.limit_count &&
        entrance.attempt_status === EAttemptStatus.IN_PROGRESS),
  )

  return (
    <div
      className={`${
        !isEmpty(entranceTestLists)
          ? 'grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 xl:grid-cols-3'
          : 'flex min-h-[calc(100vh-25rem)] items-center justify-center'
      }`}
      // data-aos={ANIMATION.DATA_AOS}
    >
      {!isEmpty(entranceTestLists) ? (
        entranceTestLists?.map((e: IEntranceTest, index) => {
          const isShowEntranceTestPopup =
            firstIndexToShowEntrancePopup === index
          return (
            <EntranceTest
              key={index}
              data={e}
              test_id_default={entranceTestLists.find(
                (entrance) => entrance.is_attempt === false,
              )}
              onRefetch={onRefetch}
              isShowEntranceTestPopup={isShowEntranceTestPopup}
            />
          )
        })
      ) : (
        <NoCoursesAvailable />
      )}
    </div>
  )
}

export default EntranceTestList
