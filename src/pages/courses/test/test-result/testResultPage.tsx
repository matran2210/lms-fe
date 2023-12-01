import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import ButtonSecondary from '@components/base/button/ButtonSecondary'
import Icon from '@components/icons'
import YourScore from './yourScore'
import YourScoreDetail from './yourScoreDetail'
import MultipleQuestion from './multipleQues'

interface CoursesProps {
  courses: any[]
}
const datamulti = [
  {
    id: 1,
    status: 'true',
    type: 'Multiple Question',
  },
  {
    id: 2,
    status: 'false',
    type: 'Constructed Questions',
  },
]

const TestResultPage = () => {
  return (
    <div className="grid grid-rows-3 grid-flow-col gap-4 m-[64px] overflow-y-auto">
      <div className="col-span-2 ">
        <YourScore />
      </div>
      <div className="row-span-2 col-span-2">
        <YourScoreDetail />
      </div>
      <div className="row-span-3 ">
        <MultipleQuestion data={datamulti} />
      </div>
    </div>
  )
}

export default TestResultPage
