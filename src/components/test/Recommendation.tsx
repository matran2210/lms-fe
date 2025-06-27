import { AltArrowIcon } from '@assets/icons'
import ButtonText from '@components/base/button/ButtonText'
import EditorReader from '@components/base/editor/EditorReader'
import React, { useState } from 'react'
import { IQuizAttempComment } from 'src/type'
import ModalRecomment from './ModalRecomment'

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
      <div key={key} className="flex flex-col gap-6">
        {data?.comment && (
          <CommentModal
            title="Examiner’s Comment:"
            content={data?.comment}
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
    <div
      className={`rounded-xl bg-white p-6 shadow-small ${className ?? ''} text-gray-800`}
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="text-xl font-semibold">{title}</div>

        <ButtonText
          title="See more"
          onClick={onSeeMore}
          endIcon={<AltArrowIcon />}
        />
      </div>
      <div className={`h-[175px] overflow-hidden`}>
        <EditorReader text_editor_content={content} className="mr-2" />
      </div>
    </div>
  )
}

export default Recommendation
