import React from 'react'
import EntranceTest from './EntranceTest'
import { isEmpty } from 'lodash'
import NoData from 'src/common/NoData'
// import { ANIMATION } from 'src/constants'

interface EntranceTestListProps {
  entranceTestLists: any[]
}

const EntranceTestList: React.FC<EntranceTestListProps> = ({
  entranceTestLists,
}) => {
  return (
    <div
      className={`${
        !isEmpty(entranceTestLists)
          ? 'grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3'
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
            <EntranceTest
              data={e}
              test_id_default={entranceTestLists.find(
                (entrance) => entrance.is_attempt === false,
              )}
            />
          </div>
        ))
      ) : (
        <NoData />
      )}
    </div>
  )
}

export default EntranceTestList
