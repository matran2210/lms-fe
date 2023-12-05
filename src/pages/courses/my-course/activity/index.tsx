import ButtonPrimary from '@components/base/button/ButtonPrimary'
import SappButton from '@components/base/button/SappButton'
import React from 'react'

type Props = {}

const ActivityPage = (props: Props) => {
  return (
    <div className=" text-bw-1 max-w-xxl my-0 mx-auto ">
      <div className="bg-gray-3 pb-10 px-6 ">
        <div className="flex justify-between w-full gap-4 py-6  border-b border-gray-2 bg-none">
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
            <li className="ml-4">
              Now this is a story all about how, my life got flipped-turned
              upside down
            </li>
          </ul>
        </div>
      </div>

      <div className="-mt-9">
        <div className="flex gap-2 px-6 flex-wrap">
          <SappButton
            size="small"
            className="py-2.5 !px-3 text-base !font-normal"
            color="white"
            title={'Introduction'}
          ></SappButton>
          <SappButton
            size="small"
            className="py-2.5 !px-3 text-base !font-normal"
            color="white"
            title={'Introduction'}
          ></SappButton>
          <SappButton
            size="small"
            className="py-2.5 !px-3 text-base !font-normal"
            color="white"
            title={'Introduction'}
          ></SappButton>
        </div>
      </div>
      <div className="mt-6 max-w-[998px] w-full my-0 mx-auto px-6">
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quas id
        perspiciatis quia illo eligendi architecto sed eaque voluptates,
        officiis at iusto officia! In, facere eveniet dolore ipsum quia pariatur
        dolor.
      </div>
    </div>
  )
}

export default ActivityPage
