import React from 'react'
import { isEmpty } from 'lodash'
import NoData from 'src/common/NoData'
import EventTest from './EventTest'
import { IEventTest } from '@lms/core'
// import { ANIMATION } from '@lms/core'

const EventTestList = ({
  eventTestLists,
  onRefetch,
}: {
  eventTestLists: IEventTest[]
  onRefetch: () => void
}) => {
  return (
    <div
      className={`${
        !isEmpty(eventTestLists)
          ? 'grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3'
          : 'flex min-h-[calc(100vh-15rem)] items-center justify-center'
      }`}
      // data-aos={ANIMATION.DATA_AOS}
    >
      {!isEmpty(eventTestLists) ? (
        eventTestLists?.map((e: IEventTest, index) => (
          <EventTest key={index} data={e} onRefetch={onRefetch} />
        ))
      ) : (
        <NoData />
      )}
    </div>
  )
}

export default EventTestList
