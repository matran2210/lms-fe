import React from 'react'
import EntranceTest from './EntranceTest'
// import { ANIMATION } from 'src/constants'

interface EntranceTestListProps {
  entranceTestLists: any[]
}

const EntranceTestList: React.FC<EntranceTestListProps> = ({
  entranceTestLists,
}) => {
  return (
    <div
      className="grid grid-cols-1 md:grid-cols-3 gap-6"
      // data-aos={ANIMATION.DATA_AOS}
    >
      {entranceTestLists?.map((e, index) => (
        <div
          key={index}
          className={`item bg-white p-7.5 shadow-sidebar flex flex-col`}
        >
          <EntranceTest data={e} />
        </div>
      ))}
    </div>
  )
}

export default EntranceTestList
