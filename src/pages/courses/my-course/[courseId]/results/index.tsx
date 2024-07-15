import Heading from '@components/mycourses/Heading'
import React from 'react'
import SappLoadingGlobal from 'src/common/SappLoadingGlobal'
import { ANIMATION } from 'src/constants'

const Results = () => {
  return (
    <SappLoadingGlobal loading={false}>
      <div className="header bg-white border-b border-default h-[70px]">
        <div className="max-w-xxl my-0 mx-auto flex py-6 xl-max:mx-5">
          {/* <SearchForm
            placeholder="Enter name of course..."
            formStyle="w-full flex items-center"
          /> */}
        </div>
      </div>
      <div className="main max-w-xxl my-0 mx-auto xl-max:container relative">
        {/* <div className="flex justify-between pt-6 pb-4 w-full items-center">
          <BreadcrumbFilter name={courseNameDetail} />
          <FilterCourseDetail totalResult={courses?.length || 0} />
        </div> */}
      </div>
      <div
        className="heading bg-white max-w-xxl my-0 mx-auto flex xl-max:mx-6"
        data-aos={ANIMATION.DATA_AOS}
      >
        <Heading greeting="" title={'Results'} />
      </div>
      <div
        className="pt-6 max-w-xxl my-0 mx-auto xl-max:container"
        data-aos={ANIMATION.DATA_AOS}
      >
        {/* <CourseParts
          courses={courses}
          class_user_id={class_user_id}
          lastElementRef={lastElementRef}
        /> */}
      </div>
    </SappLoadingGlobal>
  )
}

export default Results
