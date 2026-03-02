import { useStorylineSidebar } from '@contexts/StorylineSidebarContext'
import { CloseDetailIcon } from '@lms/assets'
import { StorylineItem } from '@lms/feature-courses'
import { Divider } from 'antd'
import { AnimatePresence, motion } from 'framer-motion'
import { useRouter, useSearchParams } from 'next/navigation'
import { IStoryline } from '@lms/core'

interface IProps {
  listStorylineData: IStoryline | undefined
}
export default function Sidebar({ listStorylineData }: IProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const storylineItemId = searchParams.get('storylineItemId')
  const class_id = searchParams.get('class_id')
  const course_section_id = searchParams.get('course_section_id')
  const status = searchParams.get('status')
  const { showSidebar, setShowSidebar, listStorylines } = useStorylineSidebar()
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
    <AnimatePresence mode="wait">
      {showSidebar && (
        <motion.aside
          key="sidebar"
          initial={{ x: -40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -40, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed bottom-0 top-0 z-[202] h-full w-80 bg-white p-6 shadow-md"
        >
          <div className="flex items-center justify-between gap-2">
            <div className="text-lg font-semibold text-gray-800">
              {listStorylineData?.name}
            </div>
            <div className="cursor-pointer" onClick={toggleSidebar}>
              <CloseDetailIcon className="shrink-0 rotate-180" />
            </div>
          </div>
          <Divider className="my-4" />
          <div className="hide-scrollbar flex max-h-[calc(100vh-90px)] flex-col overflow-y-auto">
            {listStorylines.map((storylineItem, index) => {
              const itemProgress = Math.round(
                (storylineItem.item_progress.total_document_completed /
                  storylineItem.item_progress.total_document) *
                  100,
              )

              return (
                <div key={storylineItem.id} className={`transition-opacity`}>
                  <StorylineItem
                    name={storylineItem.name}
                    active={storylineItem.id === storylineItemId}
                    progress={itemProgress}
                    onClick={() => {
                      handleSubmit(storylineItem.id)
                    }}
                    isShowProgress
                  />
                </div>
              )
            })}
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
