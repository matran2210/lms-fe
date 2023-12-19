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

const TestResultDetail = () => {
  return (
    <>
      <div className="main px-4 lg:px-16">
        <Breadcrumb tabs={breadcrumbs} currentPage={'TestResults'} />
      </div>
      <div className="mx-auto mx-4 lg:mx-16 mb-6">
        <TestResultPage />
      </div>
    </>
  )
}

export default TestResultDetail
