import Filter from '@components/mycourses/Filter'
import Heading from '@components/mycourses/Heading'
import SearchForm from '@components/mycourses/Search'
import Tabs from '@components/mycourses/Tabs'
import React from 'react'
import { parse } from 'cookie'
import { getCourse } from '../api/courses'
import EntranceTestList from '@components/entrance-test/EntranceTestList'

// Config entrance test lists
const entranceTestLists = [
  {
    name: 'ACCA Entrance Test F1',
    startStatus: true,
    timeTaken: 2732,
    timeAllow: 555,
    result: '30/35',
  },
  {
    name: 'CFA Level 1 Entrance Test',
    startStatus: true,
    timeTaken: 2732,
    timeAllow: 555,
    result: '30/35',
  },
  {
    name: 'ACCA F1 Entrance Test kỳ 09/2023',
    startStatus: false,
    timeTaken: 2732,
    timeAllow: 10800,
    result: '30/35',
  },
  {
    name: 'ACCA Entrance Test 07/2023',
    startStatus: false,
    timeTaken: 2732,
    timeAllow: 2732,
    result: '30/35',
  },
  {
    name: 'ACCA F1 Entrance Test kỳ 09/2023',
    startStatus: false,
    timeTaken: 2732,
    timeAllow: 555,
    result: '30/35',
  },
  {
    name: 'CFA Level 2 Entrance Test',
    startStatus: true,
    timeTaken: 2732,
    timeAllow: 10800,
    result: '30/35',
  },
]

const EntranceTest = ({ courses }: any) => {
  return (
    <>
      <div className="header bg-white border-b border-default">
        <div className="max-w-xxl my-0 mx-auto flex py-[18px]">
          <SearchForm
            placeholder="Enter name of course..."
            formStyle="w-full flex items-center"
          />
        </div>
      </div>
      <div className="main max-w-xxl my-0 mx-auto">
        <div className="flex justify-between py-6">
          <h2 className="text-medium-sm font-semibold text-bw-1">
            Entrance Test
          </h2>
          <Filter />
        </div>
      </div>
      <div className="heading bg-white max-w-xxl my-0 mx-auto flex">
        <Heading
          greeting="Welcome to"
          title="Entrance Test"
          des="The course is your starting point to learning. From here, you can access every topic, reading, and video lesson, as well as assignment questions."
        />
      </div>
      <div className="pt-6 max-w-xxl my-0 mx-auto">
        <EntranceTestList entranceTestLists={entranceTestLists} />
      </div>
    </>
  )
}

export default EntranceTest
