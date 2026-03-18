'use client'
import { useFeature } from '@lms/contexts'
import { INeighborActivity } from '@lms/core'
import { ButtonPrimary, ButtonSecondary, ButtonText, EditorReader, SappModalV3 } from '@lms/ui'
import { useMemo } from 'react'
import StorylineItem from './StorylineItem'
import clsx from 'clsx'
interface IProps {
  open: boolean
  setOpen: (status: boolean) => void
  next_activity: INeighborActivity | undefined | null
  course_section_id: string
}

const NextStorylineModal = ({ open, setOpen, next_activity, course_section_id }: IProps) => {
  const { router, params, query, storylineApi } = useFeature()
  const classID = query?.class_id ?? params?.id
  const storylineItemsHasDocs = next_activity?.storyline?.items || []
  const onClose = () => {
    setOpen(false)
  }

  const progress = useMemo(() => {
    if (!next_activity) return 0
    const totalDocument = storylineItemsHasDocs.reduce((acc, curr) => acc + curr.item_progress.total_document, 0)
    const totalDocumentCompleted = storylineItemsHasDocs.reduce((acc, curr) => acc + curr.item_progress.total_document_completed, 0)
    const progressData = totalDocumentCompleted / totalDocument
    return Math.round(progressData * 100)
  }, [next_activity?.learning_progress])

  const okButtonCaption = () => {
    if (progress === 100) {
      return 'Review'
    } else if (progress > 0 && progress < 100) {
      return 'Continue'
    }
    return 'Start'
  }
  const handleSubmit = async ({
    storylineItemId,
    isRetake = false,
  }: {
    storylineItemId?: string
    isRetake?: boolean
  }) => {
    const defaultStorylineItemId =
      storylineItemsHasDocs.find(
        (item) =>
          item.item_progress.total_document_completed !==
          item.item_progress.total_document,
      )?.id || storylineItemsHasDocs[0]?.id

    if (isRetake) {
      const res = await storylineApi?.retakeStoryline({
        class_id: classID as string,
        course_section_id: next_activity?.id as string,
      })
      if (res) {
        router.push(
          `/storyline/${next_activity?.id}?class_id=${classID}&course_section_id=${course_section_id}&storylineItemId=${storylineItemId || defaultStorylineItemId}&status=Start`,
          { scroll: false },
        )
        return
      }
    }

    router.push(
      `/storyline/${next_activity?.id}?class_id=${classID}&course_section_id=${course_section_id}&storylineItemId=${storylineItemId || defaultStorylineItemId}&status=${okButtonCaption()}`,
      { scroll: false },
    )
  }
  return (
    <>
      <SappModalV3
        handleClose={onClose}
        open={open}
        handleCancel={onClose}
        title={next_activity?.name}
        isShowBtnClose={false}
        isShowFooter
        submitButtonClassName="w-full h-10"
        onOk={() => handleSubmit({ isRetake: false })}
        cancelButtonCaption={'Cancel'}
        okButtonCaption={okButtonCaption()}
        footerButtonClassName={'w-full flex flex-col gap-2 justify-center'}
        okButtonClass="w-full"
        cancelButtonClass="w-full"
        buttonSize='medium'
        showFooter={progress < 100}
        className='storyline-overview'
        width={638}
        wrapClassName="!overflow-y-hidden"
      >
        <div className="flex flex-col gap-10 text-left text-gray-800">
          <EditorReader
            className={clsx(
              'max-h-60 overflow-y-auto !font-sans text-base leading-6',
              {
                'mt-10': next_activity?.storyline?.description,
              },
            )}
            text_editor_content={next_activity?.storyline?.description || ''}
          />
          <div className="flex flex-col gap-4 mt-10">
            <div className="text-lg font-semibold leading-7">
              This Story Include:
            </div>
            <div className="hide-scrollbar flex max-h-72 flex-col items-start justify-start gap-2 overflow-y-auto">
              {storylineItemsHasDocs?.map((item, index) => {
                const itemProgress = Math.round(
                  (item.item_progress.total_document_completed /
                    item.item_progress.total_document) *
                  100,
                )
                const firstItemContinueLearning =
                  storylineItemsHasDocs.findIndex(
                    (item) =>
                      item.item_progress.total_document_completed !==
                      item.item_progress.total_document,
                  )

                return (
                  <StorylineItem
                    active={firstItemContinueLearning === index}
                    key={index}
                    name={item.name}
                    progress={itemProgress}
                    onClick={() => handleSubmit({ storylineItemId: item.id })}
                    className='!p-2'
                  />
                )
              })}
            </div>
          </div>
        </div>
        {progress === 100 && (
          <div className="flex w-full flex-col items-center justify-center gap-2 pt-10">
            <ButtonPrimary
              full
              size="medium"
              onClick={() => handleSubmit({ isRetake: false })}
            >
              Review
            </ButtonPrimary>
            <ButtonSecondary
              full
              size="medium"
              onClick={() => handleSubmit({ isRetake: true })}
            >
              Retake
            </ButtonSecondary>
            <ButtonText size="medium" onClick={onClose}>
              Cancel
            </ButtonText>
          </div>
        )}
      </SappModalV3>
    </>
  )
}

export default NextStorylineModal
