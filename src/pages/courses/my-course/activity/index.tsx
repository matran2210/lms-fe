import React from 'react'

type Props = {}

const ActivityPage = (props: Props) => {
  return (
    <div className="max-w-xxl my-0 mx-auto flex px-6 pb-12 text-bw-1">
      <div className="bg-gray-4 ">
        <div className="flex justify-between w-full gap-4 py-6  border-b border-gray-2">
          <div className="font-semibold text-2xl ">
            Activity 4: Introduction to professional ethics and fundamental
            principles
          </div>
          <div className="text-base text-gray-1 whitespace-nowrap">
            30 min estimated
          </div>
        </div>

        <div className="py-6">
          <div className="font-semibold text-base mb-2">Learning Outcome:</div>
          <ul className="list-disc text-base">
            <li className="ml-4 mb-3">
              Now this is a story all about how, my life got flipped-turned
              upside down
            </li>
            <li className="ml-4 mb-3">
              Now this is a story all about how, my life got flipped-turned
              upside down
            </li>
          </ul>
        </div>
      </div>

      <div>
        <div></div>
      </div>
    </div>
  )
}

export default ActivityPage
