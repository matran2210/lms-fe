import React, { useState } from 'react'
import EntranceTest from './EntranceTest'

interface EntranceTestListProps {
  entranceTestLists: any[]
}

const EntranceTestList: React.FC<EntranceTestListProps> = ({
  entranceTestLists,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {entranceTestLists.map((entranceTestList, index) => (
        <div
          key={index}
          className={`item bg-white p-7.5 shadow-sidebar flex flex-col`}
        >
          <EntranceTest
            name={entranceTestList.name}
            startStatus={entranceTestList.startStatus}
            timeTaken={entranceTestList.timeTaken}
            timeAllow={entranceTestList.timeAllow}
            result={entranceTestList.result}
          />
        </div>
      ))}
    </div>
  )
}

export default EntranceTestList
