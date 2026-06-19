import { useStoryline } from '@contexts/StorylineContext'
import { useStorylineSidebar } from '@contexts/StorylineSidebarContext'
import { RestartIcon } from '@lms/assets'
import { IStoryline, IStorylineItem } from '@lms/core'
import { ButtonPrimary, ButtonText } from '@lms/ui'
import clsx from 'clsx'
import Image from 'next/image'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { useQueryClient } from 'react-query'
import { StorylineAPI } from 'src/api/storyline'
import { motion } from 'framer-motion'


interface IProps {
  storylineItemsHasDocs: IStorylineItem[]
  onClick: () => void
  isFinished: boolean
}
const StoryFooter = ({
  onClick,
  storylineItemsHasDocs,
  isFinished = false,
}: IProps) => {
  const searchParams = useSearchParams()
  const class_id = searchParams.get('class_id')
  const storylineItemId = searchParams.get('storylineItemId')
  const queryClient = useQueryClient()
  const { setListStorylines, setLearningProgress, showSidebar } = useStorylineSidebar()
  const {
    setIsCompletedProgress,
    setVisibleDocumentCount,
    storylineDocument,
    updateProgress,
    currentStepIndex,
    isCompletedProgress,
    currentStep,
    refetchStorylineDocument,
  } = useStoryline()
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
      refetchStorylineDocument()
      if (status === 'Review') {
        router.replace(
          `?class_id=${class_id}&course_section_id=${course_section_id}&storylineItemId=${storylineItemId}&status=Start`,
          {
            scroll: false,
          },
        )
      }
      if (status === 'Review' || storylineDocument?.length === 1) {
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
        'fixed bottom-0 z-[201] flex w-full animate-aos-fade-up justify-center border-t border-t-success bg-success-50 px-4 py-4 md:px-8',
      )}
    >
      <motion.div
        initial={{ x: 240 }}
        animate={{ x: showSidebar ? 150 : 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        exit={{ x: -240 }}
        className={clsx(
          'mx-auto flex w-full max-w-5xl flex-col gap-4 md:flex-row md:items-center md:justify-between',
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
          <div className="text-xl font-semibold leading-7 text-gray-800">
            You have finished this item!
          </div>
        </div>
        <div className="flex items-center justify-between gap-4 md:justify-start">
          <ButtonText
            isUnderLine={false}
            size="medium"
            startIcon={<RestartIcon className="h-6 w-6 hover:text-primary" />}
            onClick={handleRedoItem}
            loading={loading}
            disabled={
              loading ||
              currentStep?.item_progress.total_document_completed !==
              currentStep?.item_progress.total_document
            }
          >
            Redo Item
          </ButtonText>
          {(status === 'Review' ||
            (status !== 'Review' &&
              (currentStepIndex + 1 < storylineItemsHasDocs.length ||
                (currentStepIndex + 1 === storylineItemsHasDocs.length &&
                  isCompletedProgress === 100)))) && (
              <ButtonPrimary size="medium" onClick={onClick}>
                {isFinished ? 'Finish' : 'Next Item'}
              </ButtonPrimary>
            )}
        </div>
      </motion.div>
    </div>
  )
}


export default StoryFooter
