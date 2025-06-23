import { isEmpty } from 'lodash'
import React from 'react'
import NoData from 'src/common/NoData'
import { IEntranceTest } from 'src/type/entrance-test'
import EntranceTest from './EntranceTest'

interface EntranceTestListProps {
  entranceTestLists: IEntranceTest[]
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
          <EntranceTest
            key={index}
            data={e}
            test_id_default={entranceTestLists.find(
              (entrance) => entrance.is_attempt === false,
            )}
          />
        ))
      ) : (
        <NoData />
      )}
    </div>
  )
}

export default EntranceTestList
