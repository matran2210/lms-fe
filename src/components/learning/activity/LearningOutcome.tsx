import { CollapseArrowIcon, StarCircleIcon } from '@assets/icons'
import EditorReader from '@components/base/editor/EditorReader'
import { Collapse } from 'antd'
import clsx from 'clsx'
import React from 'react'
import { IActivity } from 'src/type/course/my-course/Activity'

interface IProps {
  activity: IActivity
}
const LearningOutcome = ({ activity }: IProps) => {
  const getItemsLearningOutcome = [
    {
      key: 'learning_outcome',
      label: (
        <div className={'select-none text-lg font-medium text-gray-800'}>
          Learning Outcome
        </div>
      ),
      children: (
        <>
          {activity?.course_outcomes?.length > 0 && (
            <div className="mt-4 select-none text-base md:mt-6">
              {activity?.course_outcomes?.map((e: any, index: number) => {
                return (
                  <div
                    className={clsx('flex items-start gap-2', {
                      'mb-3 md:mb-4':
                        index < activity?.course_outcomes?.length - 1,
                    })}
                    key={e?.id}
                  >
                    <div className="text-primary">
                      <StarCircleIcon />
                    </div>
                    <EditorReader
                      className="learning-outcome-content"
                      text_editor_content={e.description}
                    />
                  </div>
                )
              })}
            </div>
          )}
        </>
      ),
    },
  ]
  return (
    <Collapse
      bordered={false}
      expandIconPosition="end"
      defaultActiveKey={['learning_outcome']}
      expandIcon={({ isActive }) => <CollapseArrowIcon selected={isActive} />}
      items={getItemsLearningOutcome}
      className="learning-activity-collapse rounded-xl bg-white p-4 shadow-learning-activity md:p-6"
    />
  )
}

export default LearningOutcome
