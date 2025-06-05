import SAPPInput from '@components/base/Input/SAPPInput'
import SAPPButtonV2 from '@components/base/button/SAPPButtonV2'
import HookformTimePicker from '@components/base/datetime/HookformTimePicker'
import SAPPSelect from '@components/base/select/SAPPSelect'
import CollapseBox from '@components/layout/CollapseBox'
import CollapseItem from '@components/layout/CollapseBox/CollapseItem'
import { zodResolver } from '@hookform/resolvers/zod'
import { ProgressAPI } from '@pages/api/progress'
import { formatDate } from '@utils/common'
import { VALIDATE_REQUIRED } from '@utils/helpers/ValidateMessage'
import { Drawer } from 'antd'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import SappIcon from 'src/common/SappIcon'
import { CONFIRM_CANCEL, DATE_TIME_FORMAT_DMY } from 'src/constants'
import { useAppDispatch } from 'src/redux/hook'
import confirmDialog from 'src/redux/slice/ConfirmDialog/ConfirmDialogThunk'
import {
  IContentCompleted,
  IDefaultFormAddProgress,
  IProgress,
  IRequestCreateProgress,
  LearningMode,
} from 'src/type/progress'
import { z } from 'zod'
import TreeProgress from './TreeProgress'
import { round } from 'lodash'
import { sortSectionsByPosition } from '@utils/teacher-progress'
import { useRouter } from 'next/router'

export interface IProps {
  id: string | null
  open: boolean
  isView: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  refresh?: () => void
  allowSection?: boolean
  classId?: string
}

const defaultValues: IDefaultFormAddProgress = {
  lesson: '',
  section: '',
  note: '',
  time: ['', ''],
  checkedNodes: [],
}

function FormViewProgress({
  open,
  setOpen,
  id,
  isView,
  refresh,
  allowSection,
  classId,
}: IProps) {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const currentQuery = { ...router.query }

  const [loading, setLoading] = useState<boolean>(false)
  const [detailProgress, setDetailProgress] = useState<IProgress>()
  const [treeDataNotConvert, setTreeDataNotConvert] = useState<
    IContentCompleted[]
  >([])
  const validationSchema = z.object({
    lesson: z
      .string({ required_error: VALIDATE_REQUIRED })
      .trim()
      .min(1, VALIDATE_REQUIRED),
    time: z.preprocess(
      (input) => {
        if (!Array.isArray(input)) {
          return []
        }
        return input.filter((t) => typeof t === 'string' && t.trim())
      },
      z
        .array(z.string().min(1, { message: VALIDATE_REQUIRED }))
        .min(1, { message: VALIDATE_REQUIRED }),
    ),
    section: allowSection
      ? z
          .string({ required_error: VALIDATE_REQUIRED })
          .trim()
          .min(1, VALIDATE_REQUIRED)
      : z.string().optional(),
    note: z.string().optional(),
    checkedNodes: z.array(z.string()).min(1, { message: VALIDATE_REQUIRED }),
  })

  const useFormProp = useForm<IDefaultFormAddProgress>({
    resolver: zodResolver(validationSchema),
    mode: 'onSubmit',
    defaultValues,
  })

  const {
    handleSubmit: handleSubmitForm,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useFormProp
  const loadData = async () => {
    if (id) {
      setLoading(true)
      try {
        const res = await ProgressAPI.getProgressDetail(id)
        if (res?.data) {
          setDetailProgress(res?.data)
          updateDataForm(res.data)
        }
        //
      } catch (error) {
        // Handled by axios interceptors
      } finally {
        setLoading(false)
      }
    }
  }

  const updateDataForm = (data: IProgress) => {
    setValue('note', data.description)
    setValue('lesson', data.lesson.lesson_name)
    const currentLesson = data?.content_completed?.find(
      (item) => item.class_schedule_id === data.lesson.class_schedule_id,
    )
    setValue('section', currentLesson?.class_schedule_name || '')
    if (isView) {
      setTreeDataNotConvert(sortSectionsByPosition(data.content_completed))
    }
    setValue('time', [data.start_time, data.end_time])
  }

  useLayoutEffect(() => {
    loadData()
  }, [id, open])

  useEffect(() => {
    if (isView) return

    const fetchDataSection = async () => {
      if (classId && detailProgress?.lesson.class_schedule_id) {
        setLoading(true)
        try {
          const res = await ProgressAPI.getListSection(
            classId,
            detailProgress?.lesson.class_schedule_id,
            {
              progress_id: detailProgress?.id,
            },
          )
          if (res?.data) {
            setTreeDataNotConvert(sortSectionsByPosition(res.data))
          }
        } catch (error) {
          // Handled by axios interceptors
        } finally {
          setLoading(false)
        }
      }
    }
    fetchDataSection()
  }, [detailProgress?.lesson.class_schedule_id])

  const handleSubmit = handleSubmitForm(async (formData) => {
    const payload: IRequestCreateProgress = {
      current_class_schedule_id: '',
      start_time: '',
      end_time: '',
    }
    const currentCourse: {
      class_schedule_id: string
      course_section_ids: string[]
    }[] = []
    const compensatedCourse: {
      class_schedule_id: string
      course_section_ids: string[]
    }[] = []

    const addToCurrentCourse = (lessonId: string, sectionId?: string) => {
      if (!currentCourse[0]) {
        currentCourse[0] = {
          class_schedule_id: lessonId,
          course_section_ids: [],
        }
      }
      if (sectionId) {
        currentCourse[0].course_section_ids.push(sectionId)
      }
    }

    const addToCompensatedCourse = (lessonId: string, sectionId?: string) => {
      let existingCourse = compensatedCourse.find(
        (course) => course.class_schedule_id === lessonId,
      )

      if (!existingCourse) {
        existingCourse = {
          class_schedule_id: lessonId,
          course_section_ids: [],
        }
        compensatedCourse.push(existingCourse)
      }

      if (sectionId) {
        existingCourse.course_section_ids.push(sectionId)
      }
    }

    formData?.checkedNodes.forEach((item: string) => {
      const box = item.split('_')
      const lessonId = box[1]
      const sectionId = box.length > 2 ? box[box.length - 1] : undefined

      if (lessonId === detailProgress?.lesson.class_schedule_id) {
        addToCurrentCourse(lessonId, sectionId)
      } else {
        addToCompensatedCourse(lessonId, sectionId)
      }
    })

    payload.current_class_schedule_id =
      detailProgress?.lesson?.class_schedule_id || ''
    payload.description = formData.note
    payload.start_time = formData?.time[0]
    payload.end_time = formData?.time[1]

    if (currentCourse.length > 0) {
      payload.current_course_sections = currentCourse
    }

    if (compensatedCourse.length > 0) {
      payload.compensated_course_sections = compensatedCourse
    }
    if (!payload.current_course_sections) {
      toast.error('Vui lòng chọn main content')
      return
    }
    try {
      setLoading(true)
      const data = await ProgressAPI.updateProgress(id as string, payload)
      if (data?.success) {
        const updatedQuery = {
          ...currentQuery,
          classProgress: data?.data?.progress || 0,
        }
        router.push(
          {
            pathname: router.pathname,
            query: updatedQuery,
          },
          undefined,
          { shallow: true },
        )
        toast.success('Update successful')
        refresh?.()
        setOpen(false)
        reset()
      }
    } catch (err) {
    } finally {
      setLoading(false)
    }
  })
  const handleClose = () => {
    setOpen(false)
    reset()
  }
  const handleCancel = () => {
    dispatch(
      confirmDialog.open({ message: CONFIRM_CANCEL, onConfirm: handleClose }),
    )
  }

  const handleClickCatchUpContent = (idProgress: string) => {
    const loadDataProgress = async () => {
      if (idProgress) {
        setLoading(true)
        try {
          const res = await ProgressAPI.getProgressDetail(idProgress)
          if (res?.data) {
            setDetailProgress(res?.data)
            updateDataForm(res.data)
          }
        } catch (error) {
          // Handled by axios interceptors
        } finally {
          setLoading(false)
        }
      }
    }
    loadDataProgress()
  }

  return (
    <Drawer
      open={open}
      footer={true}
      onClose={() => handleCancel()}
      width={'50%'}
      closeIcon={false}
    >
      <div className="border-b-none flex h-full w-full flex-col">
        <div className="flex items-center justify-between border-b border-b-gray-5 px-8 py-5">
          <span className="font-sans text-lg font-semibold">
            {isView ? 'View Detail' : 'Edit Progress'}
          </span>
          <span className="cursor-pointer" onClick={handleCancel}>
            <SappIcon icon="closeicon" />
          </span>
        </div>
        <div className="flex-1 overflow-y-auto px-8 py-6 pb-[80px]">
          {isView ? (
            <>
              <div className="mb-4 mt-4">
                <CollapseBox title=" Primary Information">
                  <div className="grid gap-y-4">
                    <CollapseItem
                      title={'Lesson'}
                      body={detailProgress?.lesson.lesson_name}
                    />

                    <CollapseItem
                      title="Time"
                      body={
                        detailProgress?.mode !== LearningMode.ONLINE &&
                        detailProgress?.start_time &&
                        detailProgress?.end_time &&
                        `${detailProgress?.start_time?.replace(/:00$/, '')} - ${detailProgress?.end_time?.replace(/:00$/, '')}`
                      }
                    />
                    {allowSection && (
                      <CollapseItem
                        title="Section"
                        body={
                          detailProgress?.content_completed?.filter(
                            (item) => item.main,
                          )[0]?.course_sections[0]?.name ||
                          detailProgress?.section_main ||
                          ''
                        }
                      />
                    )}

                    <CollapseItem
                      title="Progress"
                      body={
                        <span
                          style={{
                            color:
                              (detailProgress?.progress ?? 0) * 100 >= 90
                                ? '#176CDD'
                                : '#F01919',
                          }}
                        >
                          {`${round((detailProgress?.progress ?? 0) * 100, 2) || 0} %`}
                        </span>
                      }
                    />

                    <CollapseItem
                      title="Catch up content"
                      body={detailProgress?.catch_up_content.map((item) => (
                        <p
                          key={item.class_teaching_progress_id}
                          style={{
                            color: '#176CDD',
                            textDecoration: 'underline',
                            cursor: 'pointer',
                          }}
                          onClick={() =>
                            handleClickCatchUpContent(
                              item.class_teaching_progress_id,
                            )
                          }
                        >
                          {item.class_teaching_progress_id &&
                            `${round((item.compensated_progress ?? 0) * 100, 2)}% - ${item.schedule_name}`}
                        </p>
                      ))}
                    />

                    <CollapseItem
                      title="Teacher"
                      body={
                        detailProgress?.mode !== LearningMode.ONLINE &&
                        (detailProgress?.teacher?.full_name || '')
                      }
                    />
                    <CollapseItem
                      title="Creator"
                      body={
                        detailProgress?.mode !== LearningMode.ONLINE &&
                        (detailProgress?.staff_creator?.full_name ||
                          detailProgress?.user_creator?.full_name ||
                          '')
                      }
                    />
                    <CollapseItem
                      title="Create Date"
                      body={
                        detailProgress?.created_at
                          ? formatDate(
                              detailProgress.created_at,
                              DATE_TIME_FORMAT_DMY,
                            )
                          : ''
                      }
                    />
                    <CollapseItem
                      title="Note"
                      body={detailProgress?.description}
                    />
                  </div>
                </CollapseBox>
              </div>
              <div className="mb-4 mt-2">
                <CollapseBox title="Content Completed">
                  <div className="grid gap-y-4">
                    {!isView && errors.checkedNodes && (
                      <div className="text-danger">
                        {errors.checkedNodes.message as string}
                      </div>
                    )}
                    <TreeProgress
                      isView={isView}
                      dataTreeNotConvert={treeDataNotConvert}
                      setValue={setValue}
                    />
                  </div>
                </CollapseBox>
              </div>
            </>
          ) : (
            <div className="flex-1 overflow-y-auto px-8 py-6">
              <div className="mb-6">
                <div className="grid w-full grid-cols-2 gap-x-6">
                  <div>
                    <SAPPSelect
                      control={control}
                      label="Lesson"
                      name="lesson"
                      placeholder="Please choose"
                      required
                      disabled
                      className="h-11.25 text-base font-medium"
                      options={[]}
                    />
                  </div>
                  {detailProgress?.mode !== LearningMode.ONLINE && (
                    <div>
                      <HookformTimePicker
                        control={control}
                        name="time"
                        label="Time"
                        disabled={isView}
                        required
                      />
                    </div>
                  )}
                </div>
              </div>
              {allowSection && (
                <div className="mb-6">
                  <SAPPSelect
                    control={control}
                    label="Section"
                    name="section"
                    placeholder="Please choose"
                    required
                    disabled
                    className="h-11.25 text-base font-medium"
                    options={[]}
                  />
                </div>
              )}

              <div className="mb-6">
                <SAPPInput
                  label={'Note'}
                  className="h-11.25"
                  control={control}
                  name="note"
                  disabled={isView}
                  placeholder={'Please enter'}
                ></SAPPInput>
              </div>

              <label className="mb-2 block text-base font-medium">
                <span className="required">{'Content completed'}</span>
              </label>
              {errors.checkedNodes && (
                <div className="text-state-error">
                  {errors.checkedNodes.message as string}
                </div>
              )}
              <TreeProgress
                dataTreeNotConvert={treeDataNotConvert}
                setValue={setValue}
              />
            </div>
          )}
        </div>

        <div className="absolute bottom-0 left-0 right-0 flex w-full justify-end border-t border-t-gray-5 bg-white px-8 py-5">
          <SAPPButtonV2
            title={'Cancel'}
            onClick={handleCancel}
            className="mb-4 mr-4"
            color="secondary"
          />
          {!isView && <SAPPButtonV2 title={'Save'} onClick={handleSubmit} />}
        </div>
      </div>
    </Drawer>
  )
}

export default FormViewProgress
