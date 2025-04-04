import HookFormTextField from '@components/base/textfield/HookFormTextField'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import MyProfileAPI from 'src/pages/api/profile'
import { useAppSelector } from 'src/redux/hook'
import { userReducer } from 'src/redux/slice/User/User'
import { ISubjectItem, IUser } from 'src/redux/types/User/urser'
import TabLayout from './TabLayout'
import { UserApi } from '@pages/api/user'

interface IProps {
  typeProgram: 'CMA' | 'ACCA' | 'CFA'
}

const ProgramDetail = ({ typeProgram }: IProps) => {
  const [subjects, setSubjects] = useState<any>()
  const { user } = useAppSelector(userReducer)
  const [typeOfProgram, setTypeOfProgram] = useState<string>('')
  const [userProgram, setUserProgram] = useState<IUser>()

  const { setValue, control, resetField } = useForm({
    mode: 'onSubmit',
  })

  const fetchSubjectOfHub = async () => {
    try {
      const res = await MyProfileAPI.getSubjectOfhubspot(typeProgram)
      setSubjects(res)
      setValue('course_category_id', res?.course_category_id ?? '')
    } catch (err) {}
  }
  const programData = userProgram?.user_hubspot_program_infos?.find(
    (item) => item?.course_category_id === subjects?.course_category_id,
  )

  useEffect(() => {
    if (user) {
      if (typeProgram && typeProgram !== typeOfProgram) {
        setTypeOfProgram(typeProgram)
        fetchSubjectOfHub()
      }

      setValue('hubspot_account_info', programData?.hubspot_account_info ?? '')
    }
  }, [resetField, setValue, typeOfProgram, typeProgram, user])

  async function getUserProgram() {
    try {
      const res = await UserApi.getUserPrograms(subjects?.course_category_id)
      setUserProgram(res)
    } catch (err) {}
  }

  useEffect(() => {
    if (subjects?.course_category_id) {
      getUserProgram()
    }
  }, [subjects?.course_category_id])

  return (
    <TabLayout
      title={
        typeProgram === 'ACCA' ? 'ACCA' : typeProgram === 'CFA' ? 'CFA' : 'CMA'
      }
      headerButtons
    >
      <div className="m-6">
        <div className="grid grid-cols-2">
          <div className="col-span-1 flex w-[17.43rem] max-w-[200px] flex-none items-center text-gray-700 lg:max-w-[50%]">
            ACCOUNT ID:
          </div>
          <div className="col-span-1 max-w-[300px] flex-auto font-medium text-bw-1">
            {programData?.hubspot_account_info}
          </div>
        </div>
      </div>
      <div className="m-6">
        {subjects?.subjects?.map((subject: ISubjectItem, index: number) => {
          const courseTabData = userProgram?.course_tab_groups?.[
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
