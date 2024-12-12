import React, { Dispatch, SetStateAction, useState } from 'react'
import { IQuizAttempComment } from 'src/type'
import { ArrowUpIcon, IconDownArrow } from '@assets/icons'

interface IProps {
  data: IQuizAttempComment
  key?: number | string
}

interface ICommentModal {
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
  title: string
  content?: string
  className?: string
}

const Recommendation = ({ data, key }: IProps) => {
  const [isOpenComment, setIsComment] = useState<boolean>(true)
  const [isOpenRecomment, setIsOpenRecomment] = useState<boolean>(true)
  return (
    <div key={key} className=" text-[#050505]">
      {data?.comment && (
        <CommentModal
          title="Examiner’s Comment:"
          content={data?.comment}
          isOpen={isOpenComment}
          setIsOpen={setIsComment}
          className="mt-5"
        />
      )}
      {data?.recommendation && (
        <CommentModal
          title="Recommendation:"
          content={data?.recommendation}
          isOpen={isOpenRecomment}
          setIsOpen={setIsOpenRecomment}
        />
      )}
    </div>
  )
}

const CommentModal = ({
  isOpen,
  setIsOpen,
  title,
  content,
  className,
}: ICommentModal) => {
  return (
    <div className={`mb-5 bg-gray-4 p-4 ${className ?? ''}`}>
      <div className="flex items-center justify-between">
        <h4 className="mb-1 font-medium">{title}</h4>
        <button onClick={() => setIsOpen(!isOpen)}>
          {title ? <IconDownArrow /> : <ArrowUpIcon />}
        </button>
      </div>
      <div
        className={`${isOpen ? 'block' : 'hidden'} max-h-[300px]  overflow-y-auto break-words transition-all`}
        dangerouslySetInnerHTML={{ __html: content ?? '' }}
      />
    </div>
  )
}

export default Recommendation
