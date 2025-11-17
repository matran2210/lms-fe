import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import MyProfileAPI from 'src/pages/api/profile'
import { useAppSelector } from 'src/redux/hook'
import { userReducer } from 'src/redux/slice/User/User'
import Icon from '@components/icons'
import { Divider } from 'antd'
import SappCollapse from '@components/collapse/SappCollapse'
import AttempItem from './SubjectInformation/AttempItem'
import { ISubjectItem, IUser } from 'src/redux/types/User/urser'
import { UserApi } from '@pages/api/user'
import { PROGRAM } from '@lms/core'

interface IProps {
  typeProgram: PROGRAM
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
    <div>
      <div>
        <div>
          <div className="w-fit">
            <div className="flex items-center gap-2 text-base">
              <Icon type="contact" />
              <span>Account ID Number:</span>
              <span className="font-bold">
                {' '}
                <div className="col-span-1 max-w-[300px] flex-auto font-medium text-[#050505]">
                  {programData?.hubspot_account_info}
                </div>
              </span>
            </div>
          </div>
        </div>
      </div>
      <Divider className="my-4 md:my-6" />
      <div>
        {subjects?.subjects?.map((subject: ISubjectItem, index: number) => {
          const courseTabData = user.course_tab_groups?.[
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
              <SappCollapse
                ghost
                className="profile-program-collapse"
                items={[
                  {
                    key: '1',
                    label: (
                      <div className="flex flex-none items-center text-base font-semibold text-[#374151] md:text-xl ">
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
              {index + 1 < subjects?.subjects?.length && (
                <Divider className="my-6" />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ProgramDetail
