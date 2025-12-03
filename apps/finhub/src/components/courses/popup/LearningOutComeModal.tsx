import { BlackStarIcon } from '../icons/BlackStartIcon'
import SappDrawerV3 from '@components/v2/base/drawer/SappDrawerV3'
import { ArrowDownIcon } from '@lms/assets'
import { useCourseContext } from '@lms/contexts'
import { ILearningOutcome, ISubSection } from '@lms/core'
import { BaseCollapse } from '@lms/feature-courses'
import { useTailwindBreakpoint } from '@lms/hooks'
import { EditorReader } from '@lms/ui'
import { CollapseProps } from 'antd'
import clsx from 'clsx'
import { useEffect, useState } from 'react'

interface IProps {
  open: boolean
  onClose: () => void
  listLearningOutcome: ISubSection[]
  handleRouterChapter: (id: string, chapter?: any) => void
  handleRouterActivity: (id: string, chapter: any) => void
}

const LearningOutComeModal: React.FC<IProps> = ({
  open,
  onClose,
  listLearningOutcome,
  handleRouterChapter,
  handleRouterActivity,
}) => {
  const { isMobileView, isTabletView } = useTailwindBreakpoint()
  const [activeKey, setActiveKey] = useState<string | string[]>(
    listLearningOutcome?.[0]?.id ? [String(listLearningOutcome[0].id)] : [],
  )
  const { setOpenPopupCTA } = useCourseContext()
  const course_section = listLearningOutcome?.[0]?.children?.[0]
  const handleLockedSection = () => {
    setOpenPopupCTA({
      lockSection: true,
      ctaUpgrade: false,
      thankYou: false,
      thankYouLater: false,
    })
    onClose()
  }

  const handleUnlockedSection = (callback: () => void) => {
    callback()
    onClose()
  }

  const handleNextLesson = () => {
    const lockSection =
      course_section?.course_section_link_parents?.[0]?.is_preview_locked

    // Determine the action based on the course section type
    if (course_section?.course_section_type === 'CHAPTER_TEST') {
      // Handle chapter test section
      lockSection
        ? handleLockedSection()
        : handleUnlockedSection(() =>
            handleRouterChapter(course_section?.quiz?.id, course_section),
          )
    } else if (
      course_section?.course_section_type === 'ACTIVITY' ||
      course_section?.course_section_type === 'UNIT'
    ) {
      // Handle activity or unit section
      lockSection ||
      listLearningOutcome?.[0]?.course_learning_outcome?.next_section
        ?.is_preview_locked
        ? handleLockedSection()
        : handleUnlockedSection(() =>
            handleRouterActivity(course_section?.id, undefined),
          )
    } else {
      onClose()
    }
  }
  const heightContent = isMobileView
    ? '102px'
    : isTabletView
      ? '128px'
      : '144px'

  useEffect(() => {
    if (listLearningOutcome?.length) {
      setActiveKey([String(listLearningOutcome[0]?.id)])
    }
  }, [listLearningOutcome])

  const renderContent = (item: ISubSection) => {
    const clo = item.course_learning_outcome as ILearningOutcome | undefined
    return (
      <>
        <div className="mb-3 text-sm font-semibold text-gray-800 lg:mb-4 lg:text-base">
          {clo?.name}
        </div>
        <div
          className={clsx(
            'learningOutcome-description mb-3 text-sm text-gray-800 lg:mb-4 lg:text-base',
          )}
          dangerouslySetInnerHTML={{
            __html: clo?.description ?? '',
          }}
        />
        {clo?.course_outcomes?.map((outcome, index: number) => (
          <div className="item mb-3 last:mb-0 lg:mb-4" key={index}>
            <div className="content flex gap-2">
              <div className="mt-[0.05em]">
                <BlackStarIcon />
              </div>
              <div className="flex select-none items-start gap-1 text-sm font-normal text-bw-15 lg:text-base">
                <span>LO{index + 1}:</span>
                <EditorReader text_editor_content={outcome?.description} />
              </div>
            </div>
          </div>
        ))}
      </>
    )
  }
  const getItems: (data: ISubSection[]) => CollapseProps['items'] = (data) => {
    return data
      ?.filter((item) => !!item.course_learning_outcome)
      ?.map((item: ISubSection) => ({
        key: item?.id,
        label: (
          <div className="text-base font-semibold text-gray-800 lg:text-lg">
            {item?.name}
          </div>
        ),
        children: renderContent(item),
      }))
  }

  return (
    <>
      <SappDrawerV3
        open={open}
        onClose={onClose}
        title="Learning Outcome"
        handleCancel={onClose}
        btnSubmitTile="Next Lesson"
        handleSubmit={handleNextLesson}
        isShowFooter
        closable
        isShowBtnClose
        submitButtonClassName={isMobileView ? 'w-full' : ''}
        rootClassName={'responsive-drawer-base'}
      >
        <div
          className="overflow-y-auto"
          style={{
            maxHeight: `calc(100% - ${heightContent})`,
          }}
        >
          <BaseCollapse
            items={getItems(listLearningOutcome)}
            activeKey={activeKey}
            onChange={(key) => setActiveKey(key)}
            expandIcon={({ isActive }) => (
              <ArrowDownIcon
                className={clsx('transition-transform', {
                  'rotate-180': isActive,
                })}
              />
            )}
            classNameProp="learning-outcome-collapse bg-white"
          />
        </div>
      </SappDrawerV3>
    </>
  )
}

export default LearningOutComeModal
