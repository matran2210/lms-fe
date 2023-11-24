// components/SearchForm.tsx

import React, { useState } from 'react'
import HookFormSelect from '@components/base/select/HookFormSelect'
interface IProps {
  greeting: string
  title: string
  des?: string
}

const Heading = ({ greeting, title, des }: IProps) => {
  return (
    <div className="flex justify-between py-5 px-[30px] w-full">
      <h1 className="text-2xl font-semibold text-gray-2">
        {greeting}
        <span className="text-bw-1 ml-1.5">{title}</span>
      </h1>
      <div className="result filter flex">
        <p className="text-gray-1 text-medium-sm text-right max-w-[553px]">
          {des}
        </p>
      </div>
    </div>
  )
}

export default Heading
