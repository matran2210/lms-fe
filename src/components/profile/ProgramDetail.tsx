import React, { useEffect, useState } from 'react'
import TabLayout from './TabLayout'
import { useForm } from 'react-hook-form'
import HookFormTextField from '@components/base/textfield/HookFormTextField'
import SappButton from '@components/base/button/SappButton'
import MyProfileAPI from 'src/pages/api/profile'
import { IExaminationList, ISubjectItem } from 'src/redux/types/User/urser'
import { userReducer, getMe } from 'src/redux/slice/User/User'
import { useAppSelector, useAppDispatch } from 'src/redux/hook'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import SappHookFormSelect from '@components/base/select/SappHookFormSelect'
import { isEmpty, isNull, isUndefined } from 'lodash'
import toast from 'react-hot-toast'

interface IProps {
  typeProgram: 'CMA' | 'ACCA' | 'CFA'
}

interface IForm {
  course_category_id?: string
  hubspot_account_info?: string
  user_hubspot_examination_subjects?: {
    examination_subject_id?: {
      value?: string
      label?: string
    }
    result?: string
  }[]
}

const ProgramDetail = ({ typeProgram }: IProps) => {
  const dispatch = useAppDispatch()
  const [isEdit, setIsEdit] = useState(false)
  const [subjects, setSubjects] = useState<ISubjectItem[]>()
  const { user, loading } = useAppSelector(userReducer)
  const [exams, setExams] = useState<IExaminationList>()
  const [typeOfProgram, setTypeOfProgram] = useState<string>('')
  const validationSchema = z.object({
    course_category_id: z.string().optional().default(''),
    hubspot_account_info: z.string().optional().default(''),
    user_hubspot_examination_subjects: z
      .array(
        z.object({
          examination_subject_id: z
            .object({
              value: z.string().optional().default(''),
              label: z.string().optional().default(''),
            })
            .optional(),
          result: z.string().optional().default(''),
        }),
      )
      .optional()
      .default([]),
  })
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { handleSubmit, setValue, control, getValues, resetField, reset } =
    useForm({
      mode: 'onSubmit',
      resolver: zodResolver(validationSchema),
    })

  const onSubmit = async (data: IForm) => {
    setIsLoading(true)
    try {
      delete data.hubspot_account_info
      await MyProfileAPI.updateProgram({
        ...data,
        user_hubspot_examination_subjects:
          data?.user_hubspot_examination_subjects
            ?.filter(
              (item) =>
                !isUndefined(item?.examination_subject_id?.value) &&
                !isNull(item?.examination_subject_id?.value) &&
                !isEmpty(item?.examination_subject_id?.value),
            )
            .map((item) => ({
              examination_subject_id: item?.examination_subject_id?.value,
            })) ?? [],
      })
      await dispatch(getMe())
      setIsEdit(false)
      toast.success('Update Successfully!')
    } catch (error) {
    } finally {
      setIsLoading(false)
    }
  }

  const fetchSubjectOfHub = async () => {
    try {
      const res = await MyProfileAPI.getSubjectOfhubspot(typeProgram)
      setSubjects(res.subjects)
      setValue('course_category_id', res?.course_category_id ?? '')
    } catch (err) {}
  }

  const fetchExamBySubject = async (
    pageIndex: number = 1,
    pageSize: number = 10,
    params?: Object,
  ) => {
    setIsLoading(true)
    try {
      const res = await MyProfileAPI.getExamBySubjectId({
        pageIndex,
        pageSize,
        params,
      })
      if (pageIndex === 1) {
        setExams(res)
      } else {
        setExams((prev) => ({
          metadata: res.metadata,
          examination_subjects: [
            ...(prev?.examination_subjects ?? []),
            ...(res.examination_subjects ?? []),
          ].filter(
            (item, index: number, self) =>
              index === self.findIndex((t) => t.id === item.id),
          ),
        }))
      }
    } catch (err) {
    } finally {
      setIsLoading(false)
    }
  }

  const handleScrollExam = (subjectId: string) => {
    if (!subjectId) return
    if (
      exams?.metadata?.page_size &&
      exams?.metadata?.total_pages > exams?.metadata?.page_index
    ) {
      fetchExamBySubject(
        exams.metadata.page_index + 1,
        exams.metadata.page_size,
        { subject_id: subjectId },
      )
    }
  }

  useEffect(() => {
    if (user) {
      resetField('course_category_id')
      resetField('hubspot_account_info')
      resetField('user_hubspot_examination_subjects')
      if (typeProgram && typeProgram !== typeOfProgram) {
        setTypeOfProgram(typeProgram)
        fetchSubjectOfHub()
      }
      const programData = user?.user_hubspot_program_infos?.find(
        (item) => item?.course_category?.name === typeProgram,
      )
      setValue('hubspot_account_info', programData?.hubspot_account_info ?? '')
    }
  }, [typeProgram])

  return (
    <TabLayout
      title={
        typeProgram === 'ACCA' ? 'ACCA' : typeProgram === 'CFA' ? 'CFA' : 'CMA'
      }
      headerButtons={
        <div className="flex gap-x-2">
          {isEdit && (
            <SappButton
              size="medium"
              title="Cancel"
              color="textUnderline"
              onClick={() => {
                setIsEdit(false)
              }}
            />
          )}
          {!isEdit ? (
            <SappButton
              size="medium"
              title="Edit"
              disabled={loading || isLoading}
              className="min-w-[7.5rem] text-base"
              onClick={() => setIsEdit(true)}
            />
          ) : (
            <SappButton
              size="medium"
              title="Save"
              className="min-w-[7.5rem] text-base"
              disabled={isLoading || loading}
              onClick={handleSubmit(onSubmit)}
            />
          )}
        </div>
      }
    >
      <div className="m-6">
        <div className="grid grid-cols-2">
          <div className="col-span-1 flex w-[17.43rem] max-w-[12.5rem] flex-none items-center text-gray-700 lg:max-w-[50%]">
            ACCOUNT ID:
          </div>
          <div className="col-span-1 max-w-[18.75rem] flex-auto font-medium text-bw-1">
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
          const defaultValue = {
            label: courseTabData?.examination_subject?.examination?.name ?? '',
            value: courseTabData?.examination_subject_id ?? '',
          }
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
                  <SappHookFormSelect
                    control={control}
                    name={`user_hubspot_examination_subjects.[${index}].examination_subject_id`}
                    required
                    isSearchable={false}
                    isDisabled={
                      !isEdit || courseTabData?.is_final_examination_subject
                    }
                    placeholder="Select Exam"
                    defaultValue={defaultValue}
                    options={
                      exams?.examination_subjects.length
                        ? exams?.examination_subjects?.map((item) => ({
                            label: item?.examination?.name ?? '',
                            value: item?.id,
                          }))
                        : [
                            {
                              label:
                                courseTabData?.examination_subject?.examination
                                  ?.name ?? '',
                              value:
                                courseTabData?.examination_subject_id ?? '',
                            },
                          ]
                    }
                    onFocus={() => {
                      fetchExamBySubject(1, 10, { subject_id: subject?.id })
                    }}
                    onChange={(selection) => {
                      if (selection?.value) {
                        setValue(
                          `user_hubspot_examination_subjects.[${index}].result`,
                          selection?.value ===
                            courseTabData?.examination_subject_id
                            ? (courseTabData?.result ?? '')
                            : '',
                        )
                      }
                    }}
                    onMenuScrollToBottom={() => handleScrollExam(subject?.id)}
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
