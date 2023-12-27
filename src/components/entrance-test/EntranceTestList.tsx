import React from 'react'
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
            startStatus={entranceTestList.is_attempt}
            timeTaken={entranceTestList.total_attempt_time || 0}
            timeAllow={entranceTestList.timeAllow}
            result={`${entranceTestList.total_correct_answer?.toString()} /
              ${entranceTestList.total_question?.toString()}`}
            id={entranceTestList.id}
          />
        </div>
      ))}
    </div>
  )
}

export default EntranceTestList
