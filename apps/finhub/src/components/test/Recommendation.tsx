import React, { useState } from 'react'
import { IQuizAttempComment } from 'src/type'
import EditorReader from '@components/base/editor/EditorReader'
import ModalRecomment from './ModalRecomment'
import SappIcon from '@components/common/SappIcon'

interface IProps {
  data: IQuizAttempComment
  key?: number | string
}

interface ICommentModal {
  title: string
  content?: string
  className?: string
  onSeeMore: () => void
}

const Recommendation = ({ data, key }: IProps) => {
  const [isOpenComment, setIsComment] = useState<boolean>(false)
  const [isOpenRecomment, setIsOpenRecomment] = useState<boolean>(false)
  const [currentContent, setCurrentContent] = useState<string | null>(null)

  const handleOpenModal = (contentType: 'comment' | 'recommendation') => {
    if (contentType === 'comment') {
      setCurrentContent(data?.comment || '')
      setIsComment(true)
    } else {
      setCurrentContent(data?.recommendation || '')
      setIsOpenRecomment(true)
    }
  }

  const handleCloseRecomment = () => {
    setIsComment(false)
    setIsOpenRecomment(false)
  }

  return (
    <React.Fragment>
      <div key={key} className="text-bw-1">
        {data?.comment && (
          <CommentModal
            title="Examiner’s Comment:"
            content={data?.comment}
            className="mt-5"
            onSeeMore={() => handleOpenModal('comment')}
          />
        )}
        {data?.recommendation && (
          <CommentModal
            title="Recommendation:"
            content={data?.recommendation}
            onSeeMore={() => handleOpenModal('recommendation')}
          />
        )}
      </div>
      <ModalRecomment
        isOpen={isOpenComment || isOpenRecomment}
        handleCloseRecomment={handleCloseRecomment}
        currentContent={currentContent}
        isComment={isOpenComment}
      />
    </React.Fragment>
  )
}

const CommentModal = ({
  title,
  content,
  className,
  onSeeMore,
}: ICommentModal) => {
  return (
    <div className={`mb-6 bg-gray-4 p-4 ${className ?? ''}`}>
      <div className="mb-1.5 flex items-center justify-between">
        <div className="text-base font-medium">{title}</div>
        <div
          className="cursor-pointer text-sm text-state-info"
          onClick={onSeeMore}
        >
          <div className="group flex items-center group-hover:cursor-pointer group-hover:fill-primary">
            <div className="group-hover:text-primary">See more</div>
            <SappIcon icon="seemore" />
          </div>
        </div>
      </div>
      <div
        className={`max-h-[210px] overflow-y-auto break-words transition-all`}
      >
        <EditorReader text_editor_content={content} className="mr-2" />
      </div>
    </div>
  )
}

export default Recommendation
