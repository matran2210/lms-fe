import { zodResolver } from '@hookform/resolvers/zod'
import { confirmDialog, useAppDispatch, useFeature } from '@lms/contexts'
import {
  CONFIRM_CANCEL,
  IContentCompleted,
  IDefaultFormAddProgress,
  ILesson,
  IRequestCreateProgress,
} from '@lms/core'
import {
  HookformTimePicker,
  SAPPButtonV2,
  SappIcon,
  SAPPInput,
  SAPPSelect,
} from '@lms/ui'
import { buildQueryString, sortSectionsByPosition } from '@lms/utils'
import { VALIDATE_REQUIRED } from '@utils/helpers/ValidateMessage'
import { Drawer } from 'antd'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React, { useLayoutEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { ProgressAPI } from 'src/api/progress'
import { z } from 'zod'
import TreeProgress from './TreeProgress'

const defaultValues = {
  lesson: undefined,
  section: undefined,
  note: '',
  time: [] as string[],
  checkedNodes: [],
}

export interface IProps {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  refresh?: () => void
  allowSection?: boolean
}

function FormAddProgress({ open, setOpen, refresh, allowSection }: IProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const query = Object.fromEntries(searchParams.entries())
  const { params: progressParam } = useFeature()

  const currentQuery = { ...query }
  const params = query?.id
  const dispatch = useAppDispatch()
  const [lesson, setLesson] = useState<ILesson[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [treeDataNotConvert, setTreeDataNotConvert] = useState<
    IContentCompleted[]
  >([])
  const [sectionOption, setSectionOption] = useState<
    { label: string; value: string }[]
  >([])

  const validationSchema = z.object({
    lesson: z
      .string({ required_error: VALIDATE_REQUIRED })
      .trim()
      .min(1, VALIDATE_REQUIRED)
      .refine((val) => val !== null, {
        message: VALIDATE_REQUIRED,
      }),
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
          .refine((val) => val !== null, {
            message: VALIDATE_REQUIRED,
          })
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
    watch,
    formState: { errors },
  } = useFormProp

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

      if (lessonId === watch('lesson')) {
        addToCurrentCourse(lessonId, sectionId)
      } else {
        addToCompensatedCourse(lessonId, sectionId)
      }
    })

    payload.current_class_schedule_id = formData.lesson
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
    setLoading(true)
    try {
      const data = await ProgressAPI.createProgress(payload)
      if (data?.success) {
        const updatedQuery = {
          ...currentQuery,
          classProgress: data?.data?.progress || 0,
        }
        router.push(`${pathname}?${buildQueryString(updatedQuery)}`)
        toast.success('Update successful')
        setOpen(false)
        refresh?.()
        reset()
      }
    } catch (err) {
    } finally {
      setLoading(false)
    }
  })

  useLayoutEffect(() => {
    const fetchDataLesson = async () => {
      if (progressParam?.id) {
        try {
          const res = await ProgressAPI.getListLesson(
            progressParam?.id as string,
          )
          if (res?.data && res?.data?.length > 0) {
            const newData = res?.data?.map((item: ILesson) => ({
              ...item,
              label: item.schedule.lesson_name,
              value: item.schedule.id,
              key: item.schedule.id,
              title: item.schedule.lesson_name,
            }))
            setLesson(newData)
          }
          //
        } catch (error) {
          // Handled by axios interceptors
        }
      }
    }
    fetchDataLesson()
    return () => {
      reset()
      setTreeDataNotConvert([])
    }
  }, [params])

  const handleChangeLesson = (value: string) => {
    setValue('section', '')
    setTreeDataNotConvert([])

    const fetchDataSection = async () => {
      if (progressParam?.id && value) {
        try {
          const res = await ProgressAPI.getListSection(
            progressParam?.id as string,
            value,
          )
          if (res?.data && res?.data?.length > 0) {
            const nameSection = res.data
              ?.filter((item: { main: boolean }) => item.main)[0]
              ?.course_sections.filter(
                (item: { type: string }) => item.type === 'PART',
              )
            setValue('section', nameSection[0]?.name)
            setSectionOption([
              {
                label: res.data[0]?.course_sections[0]?.name,
                value: res.data[0]?.course_sections[0]?.id,
              },
            ])
            setTreeDataNotConvert(sortSectionsByPosition(res.data))
          }
          //
        } catch (error) {
          // Handled by axios interceptors
        }
      }
    }
    fetchDataSection()
  }

  const handleClose = () => {
    setOpen(false)
    reset()
  }
  const handleCancel = () => {
    dispatch(
      confirmDialog.open({ message: CONFIRM_CANCEL, onConfirm: handleClose }),
    )
  }

  return (
    <Drawer
      open={open}
      footer={true}
      onClose={() => handleCancel()}
      width={'50%'}
      closeIcon={false}
    >
      <div className="flex h-full w-full flex-col">
        <div className="flex items-center justify-between border-b border-b-[#7E8299] px-8 py-5">
          <span className="font-sans text-lg font-semibold">Add Progress</span>
          <span className="cursor-pointer" onClick={handleCancel}>
            <SappIcon icon="closeicon" />
          </span>
        </div>
        <div className="flex-1 overflow-y-auto px-8 py-6">
          <div className="mb-6">
            <div className="grid w-full grid-cols-2 gap-x-6">
              <div>
                <SAPPSelect
                  control={control}
                  label="Lesson"
                  name="lesson"
                  onChange={(e) => handleChangeLesson(e)}
                  placeholder="Please choose"
                  required
                  className="h-[45px] text-base font-medium"
                  options={lesson}
                />
              </div>
              <div>
                <HookformTimePicker
                  control={control}
                  name="time"
                  label="Time"
                  required
                />
              </div>
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
                className="h-[45px] text-base font-medium"
                options={sectionOption}
              />
            </div>
          )}

          <div className="mb-6">
            <SAPPInput
              label={'Note'}
              className="h-[45px]"
              control={control}
              name="note"
              placeholder={'Please enter'}
            ></SAPPInput>
          </div>

          <label className="mb-2 block text-base font-medium">
            <span className="required">{'Content completed'}</span>
          </label>
          {errors.checkedNodes && (
            <div className="text-error">
              {errors.checkedNodes.message as string}
            </div>
          )}
          <TreeProgress
            dataTreeNotConvert={treeDataNotConvert}
            setValue={setValue}
          />
        </div>
        <div className="flex justify-end border-t border-t-[#7E8299] px-8 py-5">
          <SAPPButtonV2
            title={'Cancel'}
            onClick={handleCancel}
            className="mr-4"
            color="secondary"
          />
          <SAPPButtonV2
            loading={loading}
            title={'Save'}
            onClick={handleSubmit}
          />
        </div>
      </div>
    </Drawer>
  )
}

export default FormAddProgress
