import {
  useStorylineSidebar
} from '@contexts/StorylineSidebarContext'
import { CheckCircleOutlineYellow, CloseModalIcon, HamburgerMenuLargeIcon, SelectArrow } from '@lms/assets'
import { Select } from '@lms/ui'
import clsx from 'clsx'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import QuitLearningStoryline from '../modal/QuitLearningStoryline'
import ProgressBar from './ProgressBar'

const StoryHeader = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const class_id = searchParams.get('class_id')
  const course_section_id = searchParams.get('course_section_id')
  const { showSidebar, setShowSidebar, listStorylines, learning_progress } =
    useStorylineSidebar()
  const storylineItemsHasDocs = listStorylines || []
  const status = searchParams.get('status')
  const [open, setOpen] = useState(false)
  const toggleSidebar = () => setShowSidebar(!showSidebar)
  const handleSubmit = (storylineItemId?: string) => {
    router.replace(
      `?class_id=${class_id}&course_section_id=${course_section_id}&storylineItemId=${storylineItemId}&status=${status}`,
      {
        scroll: false,
      },
    )
  }
  return (
    <div className="sticky top-0 z-[201] shadow-medium">
      <div className="relative bg-white px-8 py-4">
        <div className=" flex w-full items-center justify-between">
          <div
            className={clsx(
              'flex  cursor-pointer items-center justify-start gap-2.5 rounded-lg transition-all duration-300',
              {
                'bg-inherit': !showSidebar,
                'bg-neutral-200': showSidebar,
              },
            )}
            onClick={toggleSidebar}
          >
            <HamburgerMenuLargeIcon />
          </div>
          <div>
            <Select
              className="custom-select-v2 h-8 rounded-full p-[10px] text-lg"
              variant="borderless"
              value={
                storylineItemsHasDocs
                  ? searchParams.get('storylineItemId')
                  : undefined
              }
              options={storylineItemsHasDocs.map((item, index) => {
                return {
                  label: `Item ${index + 1} of ${storylineItemsHasDocs.length}`,
                  value: item.id,
                }
              })}
              labelRender={(option) => {
                return <span className="text-lg">{option.label}</span>
              }}
              optionRender={(option) => {
                const isSelected =
                  option.value === searchParams.get('storylineItemId')

                return (
                  <div className="flex w-full items-center justify-between">
                    <span className="text-base">{option.label}</span>
                    {isSelected && (
                      <CheckCircleOutlineYellow className="h-5 w-5" />
                    )}
                  </div>
                )
              }}
              dropdownStyle={{ width: 150 }}
              suffixIcon={<SelectArrow />}
              onChange={handleSubmit}
            />
          </div>
          <div
            className="flex cursor-pointer items-center justify-start gap-2.5 rounded-lg bg-[#E5E7EB] p-2"
            onClick={() => setOpen(true)}
          >
            <CloseModalIcon />
          </div>
        </div>
        <ProgressBar
          percent={
            learning_progress
              ? Math.round(
                  (learning_progress.total_course_sections_completed /
                    learning_progress.total_course_sections) *
                    100,
                )
              : 70
          }
        />
      </div>

      <QuitLearningStoryline open={open} setOpen={setOpen} />
    </div>
  )
}

export default StoryHeader
