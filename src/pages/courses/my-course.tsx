import Courses from '@components/mycourses/Course'
import Filter from '@components/mycourses/Filter'
import Heading from '@components/mycourses/Heading'
import SearchForm from '@components/mycourses/Search'
import Tabs from '@components/mycourses/Tabs'
import React from 'react'

// Config Tabs
const tabs = [
  { label: 'All', path: 'tab1', total: 23 },
  { label: 'Cfa', path: 'tab2', total: 9 },
  { label: 'Acca', path: 'tab3', total: 18 },
  { label: 'Cma', path: 'tab4', total: 8 },
]

// Config Courses
const courses = [
  {
    name: 'Coaching CFA Level I Online',
    path: 'course1',
    className: 'CMA342023',
    time: 0,
    des: 'An introduction to supply-and-demand analysis for customers and firms. Concepts include market structures, macroeconomics, the business cycle, and monetary and fiscal policies.',
    progress: 'Completed',
    percentage: 100,
    changeExam: 'Change exam',
    buttonText: 'Review',
  },
  {
    name: 'Financial Reporting (FR) - Lập báo cáo tài chính..',
    path: 'course2',
    className: 'CMA342023',
    time: 0,
    des: 'A discussion of hedge funds, private equity, real estate, commodities, and infrastructure investments. We discuss their distinguishing characteristics and potential benefits and risks.',
    progress: '',
    percentage: 0,
    changeExam: '',
    buttonText: 'Extend',
  },
  {
    name: 'Khóa học CFA Blended Learning (2023)',
    path: 'course3',
    className: 'CMA342023',
    time: 365,
    des: 'An introduction to ethics and its role in the investment profession. We examine the CFA Institute Code of Ethics',
    progress: 'Ready to Learn',
    percentage: 0,
    changeExam: '',
    buttonText: 'Begin',
  },
]

const MyCourse = () => {
  return (
    <>
      <div className="header bg-white">
        <div className="max-w-[69.625rem] my-0 mx-auto flex">
          <Tabs tabs={tabs} />
          <SearchForm />
        </div>
      </div>
      <div className="main max-w-[69.625rem] my-0 mx-auto">
        <Filter />
      </div>
      <div className="heading bg-white max-w-[69.625rem] my-0 mx-auto flex">
        <Heading />
      </div>
      <div className="pt-6 max-w-[69.625rem] my-0 mx-auto">
        <Courses courses={courses} />
      </div>
    </>
  )
}

export default MyCourse
