import HookFormTextField from '@components/base/textfield/HookFormTextField'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import MyProfileAPI from 'src/pages/api/profile'
import { useAppSelector } from 'src/redux/hook'
import { userReducer } from 'src/redux/slice/User/User'
import { ISubjectItem } from 'src/redux/types/User/urser'
import TabLayout from './TabLayout'
import SappButton from '@components/base/button/SappButton'
import Icon from '@components/icons'
import { Divider } from 'antd'
import SappCollapse from '@components/collapse/SappCollapse'
import AttempItem from './SubjectInformation/AttempItem'

interface IProps {
  typeProgram: 'CMA' | 'ACCA' | 'CFA'
  onOpenTab?: () => void
}

const ProgramDetail = ({ typeProgram, onOpenTab }: IProps) => {
  const [subjects, setSubjects] = useState<ISubjectItem[]>()
  const { user } = useAppSelector(userReducer)
  const [typeOfProgram, setTypeOfProgram] = useState<string>('')

  const { setValue, control, getValues, resetField } = useForm({
    mode: 'onSubmit',
  })

  useEffect(() => {
    const fetchSubjectOfHub = async () => {
      try {
        const res = await MyProfileAPI.getSubjectOfhubspot(typeProgram)
        setSubjects(res.subjects)
        setValue('course_category_id', res?.course_category_id ?? '')
      } catch (err) {}
    }

    if (user) {
      if (typeProgram && typeProgram !== typeOfProgram) {
        setTypeOfProgram(typeProgram)
        fetchSubjectOfHub()
      }
      const programData = user?.user_hubspot_program_infos?.find(
        (item) => item?.course_category?.name === typeProgram,
      )
      setValue('hubspot_account_info', programData?.hubspot_account_info ?? '')
    }
  }, [resetField, setValue, typeOfProgram, typeProgram, user])

  return (
    <div>
      <div>
        <div className="grid grid-cols-2">
          <div className="w-fit">
            <div className="flex items-center gap-2 text-base">
              <Icon type="contact" />
              <span>Account ID Number:</span>
              <span className="font-bold">
                {' '}
                <div className="col-span-1 max-w-[300px] flex-auto font-medium text-[#050505]">
                  {getValues('hubspot_account_info')}
                </div>
              </span>
            </div>
          </div>
        </div>
      </div>
      <Divider className="my-6" />
      <div>
        {subjects?.map((subject: ISubjectItem, index: number) => {
          const courseTabData = user.course_tab_groups?.[
            typeProgram
          ]?.user_hubspot_examination_subjects?.find(
            (item) => item.examination_subject.subject.id === subject.id,
          )

          return (
            <div key={`${subject.id}-${index}`}>
              <SappCollapse
                ghost
                items={[
                  {
                    key: '1',
                    label: (
                      <div className="flex flex-none items-center text-xl font-semibold text-[#374151] ">
                        {subject?.name}
                      </div>
                    ),
                    children: (
                      <AttempItem
                        index={0}
                        courseTabData={courseTabData}
                        control={control}
                      />
                    ),
                  },
                ]}
              />
              {index + 1 < subjects.length && <Divider className="my-6" />}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ProgramDetail
