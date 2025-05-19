import HookFormTextField from '@components/base/textfield/HookFormTextField'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import MyProfileAPI from 'src/pages/api/profile'
import { useAppSelector } from 'src/redux/hook'
import { userReducer } from 'src/redux/slice/User/User'
import { ISubjectItem } from 'src/redux/types/User/urser'
import TabLayout from './TabLayout'
import SappButton from '@components/base/button/SappButton'

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
    <TabLayout
      title={
        typeProgram === 'ACCA' ? 'ACCA' : typeProgram === 'CFA' ? 'CFA' : 'CMA'
      }
      headerButtons={
        <div className=" flex gap-x-2">
          <SappButton
            onClick={onOpenTab}
            size="medium"
            title={'Back'}
            color="textUnderline"
            className="block min-w-120 pr-0 text-base lg:hidden"
          ></SappButton>
        </div>
      }
    >
      <div className="m-6">
        <div className="grid grid-cols-2">
          <div className="col-span-1 flex w-[17.43rem] max-w-[200px] flex-none items-center text-gray-700 lg:max-w-[50%]">
            ACCOUNT ID:
          </div>
          <div className="col-span-1 max-w-[300px] flex-auto font-medium text-bw-1">
            {getValues('hubspot_account_info')}
          </div>
        </div>
      </div>
      <div className="m-6">
        {subjects?.map((subject: ISubjectItem, index: number) => {
          const courseTabData = user.course_tab_groups?.[
            typeProgram
          ]?.user_hubspot_examination_subjects?.find(
            (item) => item.examination_subject.subject.id === subject.id,
          )

          return (
            <div key={`${subject.id}-${index}`}>
              <div className="font-ligth mb-3 flex flex-none items-center text-gray-700 lg:max-w-[50%]">
                {subject?.name}:
              </div>
              <div className="mb-5 grid grid-cols-2 rounded border p-3">
                <div className="col-span-1 mb-3 flex flex-none items-center text-gray-1 lg:max-w-[50%]">
                  Exam:
                </div>
                <div className="col-span-1 mb-3 flex-auto font-medium text-bw-1">
                  <HookFormTextField
                    control={control}
                    disabled
                    name={`user_hubspot_examination_subjects.[${index}].examination_subject_id`}
                    defaultValue={
                      courseTabData?.examination_subject?.examination?.name
                    }
                  />
                </div>
                <div className="col-span-1 flex flex-none items-center text-gray-1 lg:max-w-[50%]">
                  Result:
                </div>
                <div className="col-span-1 flex-auto font-medium text-bw-1">
                  <HookFormTextField
                    control={control}
                    disabled
                    name={`user_hubspot_examination_subjects.[${index}].result`}
                    defaultValue={courseTabData?.result ?? ''}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </TabLayout>
  )
}

export default ProgramDetail
