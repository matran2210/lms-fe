import React from 'react'
import { isEmpty } from 'lodash'
import NoData from 'src/common/NoData'
import EventTest from './EventTest'
// import { ANIMATION } from 'src/constants'

interface EntranceTestListProps {
  entranceTestLists: any[]
}

const EventTestList: React.FC<EntranceTestListProps> = ({
  entranceTestLists,
}) => {
  return (
    <div
      className={`${
        !isEmpty(entranceTestLists)
          ? 'grid grid-cols-1 gap-6 md:grid-cols-3'
          : 'flex min-h-[calc(100vh-15rem)] items-center justify-center'
      }`}
      // data-aos={ANIMATION.DATA_AOS}
    >
      {!isEmpty(entranceTestLists) ? (
        entranceTestLists?.map((e, index) => (
          <div
            key={index}
            className={`item flex flex-col bg-white p-7.5 shadow-sidebar`}
          >
            <EventTest data={e} />
          </div>
        ))
      ) : (
        <NoData />
      )}
    </div>
  )
}

export default EventTestList
