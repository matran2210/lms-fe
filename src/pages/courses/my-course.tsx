import Courses from '@components/mycourses/Course'
import Filter from '@components/mycourses/Filter'
import Heading from '@components/mycourses/Heading'
import SearchForm from '@components/mycourses/Search'
import Tabs from '@components/mycourses/Tabs'
import React from 'react'

// Config Tabs
const tabs = [
  { label: 'All', path: 'tab1', total: 23, current: true },
  { label: 'Cfa', path: 'tab2', total: 9, current: false },
  { label: 'Acca', path: 'tab3', total: 18, current: false },
  { label: 'Cma', path: 'tab4', total: 8, current: false },
]

// Config Courses
const courses = [
  {
    name: 'Coaching CFA Level I Online',
    active: true,
    showInfo: true,
    path: 'course1',
    className: 'CMA342023',
    time: 0,
    des: 'An introduction to supply-and-demand analysis for customers and firms. Concepts include market structures, macroeconomics, the business cycle, and monetary and fiscal policies.',
    progressText: 'Completed',
    progressIconType: 'check',
    progress: 'Completed',
    percentage: 100,
    changeExam: 'Change exam',
    buttonText: 'Review',
  },
  {
    name: 'Financial Reporting (FR) - Lập báo cáo tài chính..',
    active: false,
    showInfo: false,
    path: 'course2',
    className: 'CMA342023',
    time: 0,
    des: 'A discussion of hedge funds, private equity, real estate, commodities, and infrastructure investments. We discuss their distinguishing characteristics and potential benefits and risks.',
    progressText: '',
    progressIconType: '',
    percentage: 0,
    changeExam: '',
    buttonText: 'Extend',
  },
  {
    name: 'Khóa học CFA Blended Learning (2023)',
    active: true,
    showInfo: true,
    path: 'course3',
    className: 'CMA342023',
    time: 365,
    des: 'An introduction to ethics and its role in the investment profession. We examine the CFA Institute Code of Ethics',
    progressText: 'Ready to Learn',
    progressIconType: 'like',
    percentage: 0,
    changeExam: '',
    buttonText: 'Begin',
  },
  {
    name: '[Học thử] CFA online 2023 - Chương trình bổ trợ...',
    active: false,
    showInfo: true,
    path: 'course4',
    className: 'CMA342023',
    time: 0,
    des: 'A discussion of hedge funds, private equity, real estate, commodities, and infrastructure investments. We discuss their distinguishing characteristics and potential benefits and risks.',
    progressText: '',
    progressIconType: '',
    percentage: 0,
    changeExam: '',
    buttonText: 'Activate',
  },
  {
    name: 'Audit & Assurance (AA) - Kiểm toán và dịch vụ...',
    active: true,
    showInfo: true,
    path: 'course5',
    className: 'CMA342023',
    time: 34,
    des: 'An introduction to supply-and-demand analysis for customers and firms. Concepts include market structures, macroeconomics, the business cycle, and monetary and fiscal policies.',
    progressText: 'In Progress',
    progressIconType: 'hour',
    percentage: 30,
    changeExam: '',
    buttonText: 'Resume',
  },
  {
    name: 'Business Transformer Challenge 2023',
    active: true,
    showInfo: true,
    path: 'course6',
    className: 'CMA342023',
    time: 0,
    des: 'An introduction to primary financial. We explore a general framework for financial statement analysis',
    progressText: 'Expired',
    progressIconType: 'time',
    percentage: 10,
    changeExam: 'Change Exam',
    buttonText: 'Extend',
  },
]

const MyCourse = () => {
  return (
    <>
      <div className="header bg-white border-b border-default">
        <div className="max-w-xxl my-0 mx-auto flex py-[18px]">
          <Tabs tabs={tabs} />
          <SearchForm />
        </div>
      </div>
      <div className="main max-w-xxl my-0 mx-auto">
        <Filter />
      </div>
      <div className="heading bg-white max-w-xxl my-0 mx-auto flex">
        <Heading />
      </div>
      <div className="pt-6 max-w-xxl my-0 mx-auto">
        <Courses courses={courses} />
      </div>
    </>
  )
}

export default MyCourse
