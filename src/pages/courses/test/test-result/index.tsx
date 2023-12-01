import SappBreadCrumbs from '@components/base/breadcrumb/SappBreadcrumb'
import CoursesList from '@components/mycourses/CoursesList'
import Filter from '@components/mycourses/Filter'
import Heading from '@components/mycourses/Heading'
import React, { useEffect } from 'react'
import { ITabs } from 'src/type'
import TestResultPage from './testResultPage'
import Breadcrumb from '@components/base/breadcrumb/SappBreadcrumb'

// Config Courses
const breadcrumbs: ITabs[] = [
  {
    link: 'Courses',
    title: 'Courses',
  },
  {
    link: '/',
    title: 'Test',
  },
  {
    link: '/',
    title: 'TestResults',
  },
]

const MyCourse = () => {
  return (
    <>
      <div className="main pl-6 -mb-10 ">
        <Breadcrumb tabs={breadcrumbs} currentPage={'TestResults'} />
      </div>
      <div className="heading bg-white my-0 mx-auto flex"></div>
      <div className="mx-auto">
        <TestResultPage />
      </div>
    </>
  )
}

export default MyCourse
