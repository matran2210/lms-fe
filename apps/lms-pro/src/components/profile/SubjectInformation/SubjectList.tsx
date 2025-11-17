import React, { useState } from 'react'
import SubjectItem from './SubjectItem'
import ProfileCard from '@components/card/ProfileCard'
import SappDrawerV2 from '@components/base/drawer/SappDrawerV2'
import ProgramDetail from '../ProgramDetail'
import { Select } from 'antd'
import Icon from '@components/icons'
import { CollapseArrowIcon } from '@assets/icons'
import clsx from 'clsx'
import { PROGRAM } from '@lms/core'
import { useTailwindBreakpoint } from 'src/hooks/useTailwindBreakpoint'

export interface SubjectOptionItem {
  course_category_name: 'CMA' | 'CFA' | 'ACCA'
  status: boolean
  title: string
  value: 'CMA' | 'CFA' | 'ACCA'
  label: string
}
interface IProps {
  isEdit: boolean
}
const SubjectList = ({ isEdit }: IProps) => {
  const { isAlwaysShowSidebar } = useTailwindBreakpoint()
  const [makeDefaultDrawer, setMakeDefaultDrawer] = useState<{
    status: boolean
    course_category_name: 'CMA' | 'CFA' | 'ACCA'
  }>()

  const closeMakeDefault = () => {
    setMakeDefaultDrawer(undefined)
  }

  const subjectOptions: SubjectOptionItem[] = [
    {
      course_category_name: 'CMA',
      status: false,
      title: 'Certified Management Accountant',
      value: 'CMA',
      label: 'CMA',
    },
    {
      course_category_name: 'CFA',
      status: false,
      title: 'Chartered Financial Analyst',
      value: 'CFA',
      label: 'CFA',
    },
    {
      course_category_name: 'ACCA',
      status: false,
      title: 'Association of Chartered Certified Accountants',
      value: 'ACCA',
      label: 'ACCA',
    },
  ]
  return (
    <ProfileCard
      title="Exam ID"
      className={clsx({ 'hidden lg:block': isEdit })}
    >
      {subjectOptions.map((e, i) => {
        return (
          <SubjectItem
            key={e.course_category_name}
            data={e}
            className={clsx({ 'mb-4': i < subjectOptions.length - 1 })}
            isEdit={isEdit}
            setMakeDefaultDrawer={setMakeDefaultDrawer}
          />
        )
      })}
      <SappDrawerV2
        open={makeDefaultDrawer?.status || false}
        onClose={closeMakeDefault}
        title={
          <Select
            suffixIcon={<CollapseArrowIcon className="text-secondary" />}
            value={makeDefaultDrawer?.course_category_name}
            onChange={(value) => {
              setMakeDefaultDrawer({
                course_category_name: value,
                status: true,
              })
            }}
            variant="borderless"
            className="profile-subject-select"
            options={subjectOptions}
          />
        }
        handleCancel={closeMakeDefault}
        classNameHeader={'bg-white !text-black md:!p-0 lg:!px-8 lg:!py-6'}
        classNameBody="pt-0 lg:pt-2 md:!px-0 lg:!px-8"
        rootClassName={'profile-subject-drawer profile-subject-list-drawer'}
        placement={!isAlwaysShowSidebar ? 'bottom' : 'right'}
        classNames={{
          content: 'rounded-2xl',
        }}
      >
        <ProgramDetail
          typeProgram={makeDefaultDrawer?.course_category_name as PROGRAM}
          onOpenTab={() => {}}
        />
      </SappDrawerV2>
    </ProfileCard>
  )
}

export default SubjectList
