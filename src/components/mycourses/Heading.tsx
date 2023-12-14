// components/SearchForm.tsx

import React, { useState } from 'react'
interface IProps {
  greeting: string
  title: string
  des?: string
}

const Heading = ({ greeting, title, des }: IProps) => {
  return (
    <div className="2xl-min:flex justify-between 2xl-min:py-5 py-[30px] px-[30px] w-full">
      <h1 className="text-2xl font-semibold text-gray-2">
        {greeting}
        <span className="text-bw-1 ml-1.5">{title}</span>
      </h1>
      <div className="filter flex 2xl-min:mt-0 mt-2">
        <p className="text-gray-1 text-medium-sm 2xl-min:text-right max-w-[553px]">
          {des}
        </p>
      </div>
    </div>
  )
}

export default Heading
