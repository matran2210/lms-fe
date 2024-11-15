import React from 'react'
import { IQuizAttempComment } from 'src/type'

interface IProps {
  data: IQuizAttempComment
  key?: number | string
}

const Recommendation = ({ data, key }: IProps) => {
  return (
    <div key={key} className=" text-[#050505]">
      {data?.comment && (
        <div className="mb-5 mt-5 bg-gray-4 p-4">
          <h4 className="mb-1 font-medium">Examiner’s Comment:</h4>
          <div
            className="break-words"
            dangerouslySetInnerHTML={{ __html: data?.comment ?? '' }}
          />
        </div>
      )}
      {data?.recommendation && (
        <div className="mb-5 bg-gray-4 p-4">
          <h4 className="mb-1 font-medium">Recommendation:</h4>
          <div
            className="break-words"
            dangerouslySetInnerHTML={{ __html: data?.recommendation ?? '' }}
          />
        </div>
      )}
    </div>
  )
}

export default Recommendation
