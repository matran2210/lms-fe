import HookFormTextField from '@components/base/textfield/HookFormTextField'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import MyProfileAPI from 'src/pages/api/profile'
import { useAppSelector } from 'src/redux/hook'
import { userReducer } from 'src/redux/slice/User/User'
import { ISubjectItem, IUser } from 'src/redux/types/User/urser'
import TabLayout from './TabLayout'
import { UserApi } from '@pages/api/user'
import SappButton from '@components/base/button/SappButton'

interface IProps {
  typeProgram: 'CMA' | 'ACCA' | 'CFA'
  onOpenTab?: () => void
}

interface ISubject {
  subjects: Array<{
    id: string
    created_at: Date
    updated_at: Date
    course_category_id: string
    name: string
    code: string
  }>
  course_category_id: string
}

const ProgramDetail = ({ typeProgram, onOpenTab }: IProps) => {
  const [subjects, setSubjects] = useState<ISubject>()
  const { user } = useAppSelector(userReducer)
  const [typeOfProgram, setTypeOfProgram] = useState<string>('')
  const [userProgram, setUserProgram] = useState<IUser>()

  const { setValue, control, resetField } = useForm({
    mode: 'onSubmit',
  })

  /**
   * Hàm fetchSubjectOfHub dùng để lấy danh sách môn học từ API dựa trên loại chương trình (typeProgram).
   * Sau khi lấy dữ liệu thành công, cập nhật danh sách môn học vào state và thiết lập giá trị cho trường 'course_category_id'.
   */
  const fetchSubjectOfHub = async () => {
    try {
      // Gọi API để lấy danh sách môn học dựa trên typeProgram
      const res = await MyProfileAPI.getSubjectOfhubspot(typeProgram)

      // Cập nhật danh sách môn học vào state
      setSubjects(res)

      // Thiết lập giá trị cho trường 'course_category_id' trong form
      setValue('course_category_id', res?.course_category_id ?? '')
    } catch (err) {
      // Xử lý lỗi nếu có
    }
  }

  /**
   * Lấy thông tin chương trình học của người dùng dựa trên course_category_id.
   * @returns Thông tin chương trình học phù hợp với course_category_id của môn học.
   */
  const programData = userProgram?.user_hubspot_program_infos?.find(
    (item) => item?.course_category_id === subjects?.course_category_id,
  )

  /**
   * useEffect để xử lý khi thông tin người dùng hoặc loại chương trình thay đổi.
   * - Nếu typeProgram thay đổi và khác với typeOfProgram hiện tại, cập nhật typeOfProgram và gọi hàm fetchSubjectOfHub.
   * - Thiết lập giá trị cho trường 'hubspot_account_info' trong form.
   */
  useEffect(() => {
    if (user) {
      if (typeProgram && typeProgram !== typeOfProgram) {
        setTypeOfProgram(typeProgram) // Cập nhật loại chương trình
        fetchSubjectOfHub() // Lấy danh sách môn học từ API
      }

      // Thiết lập giá trị cho trường 'hubspot_account_info' trong form
      setValue('hubspot_account_info', programData?.hubspot_account_info ?? '')
    }
  }, [resetField, setValue, typeOfProgram, typeProgram, user])

  /**
   * Hàm getUserProgram dùng để lấy thông tin chương trình học của người dùng từ API.
   * @returns Cập nhật thông tin chương trình học vào state userProgram.
   */
  async function getUserProgram() {
    try {
      // Gọi API để lấy thông tin chương trình học dựa trên course_category_id
      const res = await UserApi.getUserPrograms(subjects?.course_category_id)
      setUserProgram(res) // Cập nhật thông tin chương trình học vào state
    } catch (err) {}
  }

  /**
   * useEffect để gọi hàm getUserProgram khi course_category_id của môn học thay đổi.
   * - Nếu course_category_id tồn tại, gọi hàm getUserProgram để lấy thông tin chương trình học.
   */
  useEffect(() => {
    if (subjects?.course_category_id) {
      getUserProgram() // Lấy thông tin chương trình học
    }
  }, [subjects?.course_category_id])

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
            className="min-w-120 block pr-0 text-base lg:hidden"
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

          setValue(
            `user_hubspot_examination_subjects.[${index}].result`,
            courseTabData?.result ?? '',
          )
          setValue(
            `user_hubspot_examination_subjects.[${index}].examination_subject_id`,
            courseTabData?.examination_subject?.examination?.name ?? '',
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
