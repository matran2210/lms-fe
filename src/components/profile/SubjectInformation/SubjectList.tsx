import React, { useState } from 'react'
import { useAppSelector } from 'src/redux/hook'
import { userReducer } from 'src/redux/slice/User/User'
import SubjectItem from './SubjectItem'
import SappDrawer from '@components/base/SappDrawer'
import { getMe, makeContactDefault } from 'src/redux/slice/User/User'
import { useAppDispatch } from 'src/redux/hook'
import ProfileCard from '@components/card/ProfileCard'
import SappDrawerV2 from '@components/base/drawer/SappDrawerV2'
import ProgramDetail from '../ProgramDetail'
export interface SubjectOptionItem {
  course_category_name: 'CMA' | 'CFA' | 'ACCA'
  status: boolean
  title: string
}
interface IProps {
  isEdit: boolean
}
const SubjectList = ({ isEdit }: IProps) => {
  const dispatch = useAppDispatch()

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
    },
    {
      course_category_name: 'CFA',
      status: false,
      title: 'Chartered Financial Analyst',
    },
    {
      course_category_name: 'ACCA',
      status: false,
      title: 'Association of Chartered Certified Accountants',
    },
  ]
  return (
    <ProfileCard title="Exam ID">
      {subjectOptions.map((e, i) => {
        return (
          <SubjectItem
            key={e.course_category_name}
            data={e}
            index={i}
            isEdit={isEdit}
            setMakeDefaultDrawer={setMakeDefaultDrawer}
          />
        )
      })}
      {makeDefaultDrawer?.status && (
        <SappDrawerV2
          open={makeDefaultDrawer?.status || false}
          onClose={closeMakeDefault}
          title={makeDefaultDrawer?.course_category_name || ''}
          handleCancel={closeMakeDefault}
        >
          <ProgramDetail
            typeProgram={makeDefaultDrawer?.course_category_name}
            onOpenTab={() => {}}
          />
        </SappDrawerV2>
      )}
    </ProfileCard>
  )
}

export default SubjectList
