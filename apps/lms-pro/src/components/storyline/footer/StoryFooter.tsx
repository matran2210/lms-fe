import { useStoryline } from '@contexts/StorylineContext'
import { useStorylineSidebar } from '@contexts/StorylineSidebarContext'
import { RestartIcon } from '@lms/assets'
import { IStoryline } from '@lms/core'
import { ButtonPrimary, ButtonText } from '@lms/ui'
import clsx from 'clsx'
import Image from 'next/image'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { useQueryClient } from 'react-query'
import { StorylineAPI } from 'src/api/storyline'

interface IProps {
  listStorylineData: IStoryline | undefined
  onClick: () => void
}
const StoryFooter = ({ onClick, listStorylineData }: IProps) => {
  const searchParams = useSearchParams()
  const class_id = searchParams.get('class_id')
  const storylineItemId = searchParams.get('storylineItemId')
  const queryClient = useQueryClient()
  const { setListStorylines, setLearningProgress } = useStorylineSidebar()
  const { setIsCompletedProgress, setVisibleDocumentCount, storylineDocument, updateProgress, currentStepIndex } = useStoryline()
  const params = useParams()
  const { section_storyline_id } = params
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const course_section_id = searchParams.get('course_section_id')
  const status = searchParams.get('status')
  const handleRedoItem = async () => {
    setLoading(true)
    const res = await StorylineAPI.retakeStoryline({
      class_id: class_id as string,
      course_section_id: section_storyline_id as string,
      storyline_item_id: storylineItemId as string,
    })
    setLoading(false)
    if (res) {
      setListStorylines(res?.data.storyline.items)
      setLearningProgress(res?.data.learning_progress)
      setIsCompletedProgress(0)
      setVisibleDocumentCount(1)
      queryClient.invalidateQueries({
        queryKey: ['storyline'],
      })
      queryClient.invalidateQueries({
        queryKey: [`storyline-document-${storylineItemId}`],
      })
      if (status === 'Review') {
        router.replace(
          `?class_id=${class_id}&course_section_id=${course_section_id}&storylineItemId=${storylineItemId}&status=Start`,
          {
            scroll: false,
          },
        )
        if (storylineDocument?.length === 0) return
        const firstDocument = storylineDocument?.[0]
        if (!firstDocument) return

        updateProgress(firstDocument?.id as string, true)
      }
    }
  }
  return (
    <div
      className={clsx(
        'fixed bottom-0 z-[201] flex w-full justify-center border-t border-t-success bg-success-50 px-8 py-4 animate-aos-fade-up',
      )}
    >
      <div
        className={clsx(
          'mx-auto flex w-full max-w-5xl items-center justify-between',
        )}
      >
        <div className="flex justify-start gap-3">
          <Image
            src="/assets/images/fire.png"
            alt="check"
            width={24}
            height={24}
            className="shrink-0"
          />
          <div className=" text-xl font-semibold leading-7 text-gray-800">
            You have finished this item!
          </div>
        </div>
        <div className="flex items-center justify-start gap-4">
          <ButtonText
            isUnderLine={false}
            size="medium"
            startIcon={<RestartIcon className="h-6 w-6 hover:text-primary" />}
            onClick={handleRedoItem}
            loading={loading}
            disabled={loading}
          >
            Redo Item
          </ButtonText>
          <ButtonPrimary size="medium" onClick={onClick}>
            Next Item
          </ButtonPrimary>
        </div>
      </div>
    </div>
  )
}

export default StoryFooter
