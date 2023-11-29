import SappConfirmDialogContainer from '@components/base/confirm-dialog/SappConfirmDialogContainer'
import SappModal from '@components/base/modal/SappModal'
import Courses from '@components/mycourses/Course'
import CoursesList from '@components/mycourses/CoursesList'
import Filter from '@components/mycourses/Filter'
import Heading from '@components/mycourses/Heading'
import SearchForm from '@components/mycourses/Search'
import Tabs from '@components/mycourses/Tabs'
import React, { useEffect } from 'react'

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
    percentage: 100,
    changeExam: 'Change exam',
    buttonText: 'Review',
  },
  {
    name: 'Financial Reporting (FR) - Lập báo cáo tài chính..',
    active: false,
    showInfo: true,
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
    showInfo: false,
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
          <Tabs
            tabs={tabs}
            classUl="tab-buttons d-flex flex border-r border-gray-1 items-center py-[4.5px]"
            currentClass="activecolor w-full left-0 absolute bottom-0 h-2.5 bg-primary opacity-[0.15]"
            tabClass="item relative uppercase text-base w-full flex justify-center cursor-pointer"
            liClass="mr-12 min-w-[80px]"
            tabCurrentClass="active text-primary font-semibold capitalize"
            tabNotCurrentClass="text-gray-1"
          />
          <SearchForm
            placeholder="Enter name of course..."
            formStyle="w-full ml-12 flex items-center"
          />
        </div>
      </div>
      <div className="main max-w-xxl my-0 mx-auto">
        <div className="flex justify-between py-6">
          <h2 className="text-medium-sm font-semibold text-bw-1">My Course</h2>
          <Filter />
        </div>
      </div>
      <div className="heading bg-white max-w-xxl my-0 mx-auto flex">
        <Heading
          greeting="Welcome to"
          title="My Course"
          des="The course is your starting point to learning. From here, you can access every topic, reading, and video lesson, as well as assignment questions."
        />
      </div>
      <div className="pt-6 max-w-xxl my-0 mx-auto">
        <CoursesList courses={courses} />
      </div>
    </>
  )
}

export default MyCourse
