'use client'
import { SappModalV3 } from '@lms/ui'
import { useParams, useRouter } from 'next/navigation'
import { Dispatch, SetStateAction, useMemo } from 'react'
import StorylineItem from './StorylineItem'
import { IStoryline } from 'src/type/storyline'
import clsx from 'clsx'
interface IProps {
  open: boolean
  setOpen: () => void
  storylineData: IStoryline | undefined
}

const StoryOverview = ({ open, setOpen, storylineData }: IProps) => {
  const router = useRouter()
  const params = useParams()
  const { id, course_section_id } = params
  const storylineItemsHasDocs = storylineData?.storyline?.items || []
  const onClose = () => {
    setOpen()
  }

  const progress = useMemo(() => {
    if (!storylineData?.learning_progress) return 0
    const progressData =
      storylineData?.learning_progress.total_course_sections_completed /
      storylineData?.learning_progress.total_course_sections
    return Math.round(progressData * 100)
  }, [storylineData?.learning_progress])

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
      `/storyline/${storylineData?.id}?class_id=${id}&course_section_id=${course_section_id}&storylineItemId=${storylineItemId || defaultStorylineItemId}&status=${okButtonCaption()}`,
      { scroll: false },
    )
  }
  return (
    <>
      <SappModalV3
        handleClose={onClose}
        open={open}
        handleCancel={onClose}
        title={storylineData?.name}
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
          <div
            className={clsx('text-base leading-6', {
              'mt-10': storylineData?.description,
            })}
          >
            {storylineData?.description}
          </div>

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

export default StoryOverview
