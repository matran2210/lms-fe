// components/SearchForm.tsx

import React, { useState } from 'react'
import HookFormSelect from '@components/base/select/HookFormSelect'

const Heading: React.FC = () => {
  return (
    <div className="flex justify-between py-5 px-[30px] w-full">
      <h1 className="text-2xl font-semibold text-gray-2">
        Welcome to
        <span className="text-bw-1 ml-1">My Course</span>
      </h1>
      <div className="result filter flex">
        <p className="text-gray-1 text-medium-sm text-right max-w-[553px]">
          The course is your starting point to learning. From here, you can
          access every topic, reading, and video lesson, as well as assignment
          questions.
        </p>
      </div>
    </div>
  )
}

export default Heading
