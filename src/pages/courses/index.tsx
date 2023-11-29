import Filter from '@components/mycourses/Filter'
import Heading from '@components/mycourses/Heading'
import SearchForm from '@components/mycourses/Search'
import Tabs from '@components/mycourses/Tabs'
import React from 'react'
import { parse } from 'cookie'
import { getCourse } from '../api/courses'

// Config Tabs
const tabs = [
  { label: 'All', path: 'tab1', total: 23, current: true },
  { label: 'Cfa', path: 'tab2', total: 9, current: false },
  { label: 'Acca', path: 'tab3', total: 18, current: false },
  { label: 'Cma', path: 'tab4', total: 8, current: false },
]

// Config Courses

const MyCourse = ({ courses }: any) => {
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
        {/* <CoursesList courses={courses} /> */}
      </div>
    </>
  )
}

export default MyCourse

export async function getServerSideProps(context: any) {
  const { req } = context

  // Parse cookies from the request headers
  const cookies = parse(req.headers.cookie || '')
  const courses = await getCourse(cookies.accessToken)

  return {
    props: {
      courses: courses?.data,
    },
  }
}
