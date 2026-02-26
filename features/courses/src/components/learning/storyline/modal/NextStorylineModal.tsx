'use client'
import { useFeature } from '@lms/contexts'
import { INeighborActivity } from '@lms/core'
import { SappModalV3 } from '@lms/ui'
import { useMemo } from 'react'
import StorylineItem from './StorylineItem'
interface IProps {
  open: boolean
  setOpen: (status: boolean) => void
  next_activity: INeighborActivity | undefined | null
  course_section_id: string
}

const NextStorylineModal = ({ open, setOpen, next_activity, course_section_id }: IProps) => {
  const {router, params} = useFeature()
    const storylineItemsHasDocs = next_activity?.storyline?.items || []
    const onClose = () => {
    setOpen(false)
  }

  const progress = useMemo(() => {
    if (!next_activity?.learning_progress) return 0
    const progressData =
      next_activity?.learning_progress.total_course_sections_completed /
      next_activity?.learning_progress.total_course_sections
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
  const handleSubmit = (storylineItemId?: string) => {
    const defaultStorylineItemId =
      storylineItemsHasDocs.find(
        (item) =>
          item.item_progress.total_document_completed !==
          item.item_progress.total_document,
      )?.id || storylineItemsHasDocs[0]?.id
    router.push(
      `/storyline/${next_activity?.id}?class_id=${params?.id}&course_section_id=${course_section_id}&storylineItemId=${storylineItemId || defaultStorylineItemId}&status=${okButtonCaption()}`,
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
        onOk={handleSubmit}
        cancelButtonCaption={'Cancel'}
        okButtonCaption={okButtonCaption()}
        footerButtonClassName={'w-full flex flex-col gap-2 justify-center'}
        okButtonClass="w-full"
        cancelButtonClass="w-full"
      >
        <div className="flex flex-col gap-10 text-left text-gray-800">
          {/* <div
            className={clsx('text-base leading-6', {
              'mt-10': next_activity?.description,
            })}
          >
            {next_activity?.description}
          </div> */}

          <div className="flex flex-col gap-4">
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
                return (
                  <StorylineItem
                    key={index}
                    name={item.name}
                    progress={itemProgress}
                    onClick={() => handleSubmit(item.id)}
                  />
                )
              })}
            </div>
          </div>
        </div>
      </SappModalV3>
    </>
  )
}

export default NextStorylineModal
