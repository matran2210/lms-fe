import Filter from '@components/mycourses/Filter'
import Heading from '@components/mycourses/Heading'
import SearchForm from '@components/mycourses/Search'
import BreadcrumbFilter from '@components/mycourses/course-detail/BreadcrumbFilter'
import CourseParts from '@components/mycourses/course-detail/CourseParts'
import React from 'react'

// Config Courses
const courseParts = [
  {
    name: 'Orientation',
    path: 'part-detail-1',
    des: 'Get familiar with the E-learning system at SAPP and all the information you need about the course.',
    progressText: 'In Progress',
    progressTimeStatus: '16h15m left',
    progressIconType: 'hour',
    percentage: 60,
    buttonText: 'Resume',
    pass: true,
  },
  {
    name: 'Part A: Audit framework and regulation',
    path: 'part-detail-2',
    des: 'An introduction to supply-and-demand analysis for customers and firms. Concepts include market structures, macroeconomics, the business cycle, and monetary and fiscal policies.',
    progressText: 'In Progress',
    progressTimeStatus: '16h15m left',
    progressIconType: 'hour',
    percentage: 30,
    buttonText: 'Resume',
    pass: true,
  },
  {
    name: 'Part B: Planning and risk management',
    path: 'part-detail-3',
    des: 'An introduction to supply-and-demand analysis for customers and firms. Concepts include market structures, macroeconomics, the business cycle, and monetary and fiscal policies.',
    progressText: 'Ready to Learn',
    progressTimeStatus: '',
    progressIconType: 'like',
    percentage: 0,
    buttonText: 'Begin',
    pass: true,
  },
  {
    name: 'Part C: Internal control',
    path: 'part-detail-4',
    des: 'An introduction to primary financial statements. We explore a general framework for financial statement analysis, three major financial statements, financial reporting.',
    progressText: 'In Progress',
    progressTimeStatus: '16h15m left',
    progressIconType: 'hour',
    percentage: 75,
    buttonText: 'Resume',
    pass: true,
  },
  {
    name: 'Mid-Term Test',
    path: 'part-detail-5',
    des: 'An introduction to supply-and-demand analysis for customers and firms. Concepts include market structures, macroeconomics, the business cycle, and monetary and fiscal policies.',
    timeAllow: '10800',
    attempType: 'Unlimited',
    buttonText: 'Retake',
    pass: false,
  },
  {
    name: 'Part D: Audit Evidence',
    path: 'part-detail-6',
    des: 'An exploration of fixed-income securities. We discuss global fixed-income markets and valuation of fixed-income securities. We introduce securitization.',
    progressText: 'In Progress',
    progressTimeStatus: '16h15m left',
    progressIconType: 'hour',
    percentage: 10,
    buttonText: 'Resume',
    pass: true,
  },
]

const CourseDetail = () => {
  return (
    <>
      <div className="header bg-white border-b border-default">
        <div className="max-w-xxl my-0 mx-auto flex py-[23px]">
          <SearchForm
            placeholder="Enter name of part..."
            formStyle="w-full flex items-center"
          />
        </div>
      </div>
      <div className="main max-w-xxl my-0 mx-auto">
        <div className="flex justify-between py-6">
          <BreadcrumbFilter name={''} />
          <Filter />
        </div>
      </div>
      <div className="heading bg-white max-w-xxl my-0 mx-auto flex">
        <Heading
          greeting="Welcome to"
          title="Audit & Assurance (AA) - Kiểm toán và dịch vụ đảm bảo (F8)"
        />
      </div>
      <div className="pt-6 max-w-xxl my-0 mx-auto">
        <CourseParts courses={courseParts} />
      </div>
    </>
  )
}

export default CourseDetail
