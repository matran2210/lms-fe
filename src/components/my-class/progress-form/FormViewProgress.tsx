import SAPPInput from '@components/base/Input/SAPPInput'
import SAPPButtonV2 from '@components/base/button/SAPPButtonV2'
import HookformTimePicker from '@components/base/datetime/HookformTimePicker'
import SAPPSelect from '@components/base/select/SAPPSelect'
import CollapseBox from '@components/layout/CollapseBox'
import CollapseItem from '@components/layout/CollapseBox/CollapseItem'
import { zodResolver } from '@hookform/resolvers/zod'
import { ProgressAPI } from '@pages/api/progress'
import { formatDate } from '@utils/common'
import { calculateHoursDifference } from '@utils/date.ulti'
import { VALIDATE_REQUIRED } from '@utils/helpers/ValidateMessage'
import { Drawer, Tree, TreeDataNode, TreeProps } from 'antd'
import { useRouter } from 'next/router'
import React, { useLayoutEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import SappIcon from 'src/common/SappIcon'
import { CONFIRM_CANCEL } from 'src/constants'
import { useAppDispatch } from 'src/redux/hook'
import confirmDialog from 'src/redux/slice/ConfirmDialog/ConfirmDialogThunk'
import {
  IContentCompleted,
  ICourseSections,
  IDefaultFormAddProgress,
  IProgress,
  IRequestCreateProgress,
} from 'src/type/progress'
import { z } from 'zod'
import styles from './styles.module.scss'

export interface IProps {
  id: string | null
  open: boolean
  isView: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  refresh?: () => void
}
const getCompletedKeys = (data: ICourseSections[]): string[] => {
  let result: string[] = []

  data.forEach((item) => {
    if (item.is_completed) {
      result.push(item.key as string)
    }
    if (item?.children?.length > 0) {
      result = result.concat(getCompletedKeys(item.children))
    }
  })

  return result
}
const convertToTreeData = (
  data: IContentCompleted[],
  parentKey: string = '_',
) => {
  return data.map((schedule) => {
    // them id parent cho các id item không bị trùng
    const currentKey = `${parentKey}${schedule.class_schedule_id}`
    const isMain = schedule.main
    return {
      title: (
        <>
          {schedule.class_schedule_name}
          {isMain && (
            <span className="badge ml-3 rounded-md bg-blue-100 px-2 px-4 py-1 text-sm font-medium text-blue-500">
              Main
            </span>
          )}
        </>
      ),
      key: currentKey,
      is_completed: schedule.is_completed,
      children: schedule.course_sections.map((section: ICourseSections) =>
        convertSection(section, currentKey),
      ),
    }
  })
}

const convertSection: any = (
  section: ICourseSections,
  parentKey: string = '',
) => {
  const currentKey = `${parentKey}_${section.id}`
  return {
    title: section.name,
    key: currentKey,
    is_completed: section.is_completed,
    children: section?.children?.map((child: ICourseSections) =>
      convertSection(child, currentKey),
    ),
  }
}

const getAllKeys = (treeData: TreeDataNode[]): string[] => {
  let keys: string[] = []

  treeData.forEach((node) => {
    keys.push(node.key as string)
    if (node.children && node.children.length > 0) {
      keys = keys.concat(getAllKeys(node.children))
    }
  })

  return keys
}

const defaultValues = {
  lesson: null,
  section: null,
  note: '',
  time: '',
  checkedNodes: [],
}

function FormViewProgress({ open, setOpen, id, isView, refresh }: IProps) {
  const router = useRouter()
  const params = router.query?.id
  const dispatch = useAppDispatch()
  const [loading, setLoading] = useState<boolean>(false)
  const [detailProgress, setDetailProgress] = useState<IProgress>()
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([])
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([])
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([])
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true)
  const [treeData, setTreeData] = useState<TreeDataNode[]>([])
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
    section: z.string().optional(),
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
  const onExpand: TreeProps['onExpand'] = (expandedKeysValue) => {
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    setExpandedKeys(expandedKeysValue)
    setAutoExpandParent(false)
  }

  const onCheck: TreeProps['onCheck'] = (checkedKeysValue) => {
    const newCheckedKeys = checkedKeysValue as string[]
    setCheckedKeys(checkedKeysValue as React.Key[])
    setValue('checkedNodes', newCheckedKeys, { shouldValidate: true })
  }

  const onSelect: TreeProps['onSelect'] = (selectedKeysValue, info) => {
    setSelectedKeys(selectedKeysValue)
  }
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
    const dataCVTree: any = convertToTreeData(data.content_completed)
    setTreeData(dataCVTree)
    setValue('time', [data.start_time, data.end_time])
    const completedKeys = getCompletedKeys(dataCVTree)
    setCheckedKeys(completedKeys)
    setValue('checkedNodes', completedKeys)

    setExpandedKeys(getAllKeys(dataCVTree))
  }

  useLayoutEffect(() => {
    loadData()
  }, [id, open])

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
    formData?.checkedNodes.forEach((item: string) => {
      const box = item.split('_')
      if (box[1] === detailProgress?.lesson.class_schedule_id) {
        // lớp học chính
        if (!currentCourse[0]) {
          currentCourse[0] = {
            class_schedule_id: '',
            course_section_ids: [],
          }
        }
        currentCourse[0].class_schedule_id =
          detailProgress?.lesson.class_schedule_id
        if (box.length > 2) {
          currentCourse[0].course_section_ids.push(box[box.length - 1])
        }
      } else {
        // lớp học bù
        const newData: {
          class_schedule_id: string
          course_section_ids: string[]
        } = {
          class_schedule_id: '',
          course_section_ids: [],
        }
        if (
          compensatedCourse[compensatedCourse.length - 1]?.class_schedule_id !==
          box[1]
        ) {
          newData.class_schedule_id = box[1]
          if (box.length > 2) {
            newData.course_section_ids.push(box[box.length - 1])
          }
          compensatedCourse.push(newData)
        } else {
          const itemCurrent = compensatedCourse.find(
            (item) => item.class_schedule_id === box[1],
          )
          itemCurrent?.course_section_ids.push(box[box.length - 1])
        }
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
    try {
      setLoading(true)
      await ProgressAPI.updateProgress(id as string, payload)
      toast.success('Update successful')
      refresh?.()
      setOpen(false)
      reset()
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

  return (
    <Drawer
      open={open}
      footer={true}
      onClose={() => handleCancel()}
      width={'50%'}
      closeIcon={false}
      loading={loading}
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
        {isView ? (
          <>
            <div className="mb-4 mt-4 px-8">
              <CollapseBox title=" Primary Information">
                <div className="grid gap-y-4">
                  <CollapseItem
                    title={'Lesson'}
                    body={detailProgress?.lesson.lesson_name}
                  />

                  <CollapseItem
                    title="Time"
                    body={
                      detailProgress?.start_time &&
                      detailProgress?.end_time &&
                      calculateHoursDifference(
                        detailProgress.start_time,
                        detailProgress.end_time,
                      ) + ' hour'
                    }
                  />

                  <CollapseItem
                    title="Progress"
                    body={
                      <span
                        style={{
                          color:
                            (detailProgress?.progress ?? 0) >= 90
                              ? '#176CDD'
                              : '#F01919',
                        }}
                      >
                        {`${detailProgress?.progress ?? 0} %`}
                      </span>
                    }
                  />

                  <CollapseItem
                    title="Catch up content"
                    body={detailProgress?.catch_up_content.map(
                      (item, index) => (
                        <p
                          key={index}
                          style={{
                            color: '#176CDD',
                            textDecoration: 'underline',
                          }}
                        >
                          {item.compensation_id &&
                            `${item.compensated_progress + '%'}-${item.compensated_lesson_name}`}
                        </p>
                      ),
                    )}
                  />

                  <CollapseItem
                    title="Teacher"
                    body={detailProgress?.teacher.full_name}
                  />
                  <CollapseItem
                    title="Creator"
                    body={detailProgress?.staff_creator.full_name}
                  />
                  <CollapseItem
                    title="Create Date"
                    body={
                      detailProgress?.created_at
                        ? formatDate(
                            detailProgress.created_at,
                            'DD/MM/YYYY | HH:mm',
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
            <div className="mb-4 mt-2 px-8">
              <CollapseBox title="Content Completed">
                <div className="grid gap-y-4">
                  {!isView && errors.checkedNodes && (
                    <div className="text-danger">
                      {errors.checkedNodes.message as string}
                    </div>
                  )}
                  <Tree
                    checkable={!isView}
                    onExpand={onExpand}
                    expandedKeys={expandedKeys}
                    autoExpandParent={autoExpandParent}
                    onCheck={onCheck}
                    checkedKeys={checkedKeys}
                    onSelect={onSelect}
                    selectedKeys={selectedKeys}
                    treeData={treeData}
                    className={styles.lessonFormTree}
                    switcherIcon={({ expanded }) =>
                      expanded ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M12 16C11.6066 16 11.2361 15.8024 11 15.4667L7.25001 10.1333C6.96593 9.72931 6.92023 9.18876 7.13197 8.73705C7.34371 8.28534 7.77654 8 8.25001 8H15.75C16.2235 8 16.6563 8.28534 16.868 8.73705C17.0798 9.18876 17.0341 9.72931 16.75 10.1333L13 15.4667C12.7639 15.8024 12.3934 16 12 16Z"
                            fill="#FFB800"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M8.73705 7.13197C9.18876 6.92023 9.72931 6.96593 10.1333 7.25001L15.4667 11C15.8024 11.2361 16 11.6066 16 12C16 12.3934 15.8024 12.7639 15.4667 13L10.1333 16.75C9.72931 17.0341 9.18876 17.0798 8.73705 16.868C8.28534 16.6563 8 16.2235 8 15.75V8.25001C8 7.77654 8.28534 7.34371 8.73705 7.13197Z"
                            fill="#9CA3AF"
                          />
                        </svg>
                      )
                    }
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
                <div>
                  <HookformTimePicker
                    control={control}
                    name="time"
                    label="Time"
                    disabled={isView}
                    required
                  />
                </div>
              </div>
            </div>
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
            <Tree
              checkable
              onExpand={onExpand}
              expandedKeys={expandedKeys}
              autoExpandParent={autoExpandParent}
              onCheck={onCheck}
              checkedKeys={checkedKeys}
              selectedKeys={selectedKeys}
              treeData={treeData}
              className={styles.lessonFormTree}
              switcherIcon={({ expanded }) =>
                expanded ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M12 16C11.6066 16 11.2361 15.8024 11 15.4667L7.25001 10.1333C6.96593 9.72931 6.92023 9.18876 7.13197 8.73705C7.34371 8.28534 7.77654 8 8.25001 8H15.75C16.2235 8 16.6563 8.28534 16.868 8.73705C17.0798 9.18876 17.0341 9.72931 16.75 10.1333L13 15.4667C12.7639 15.8024 12.3934 16 12 16Z"
                      fill="#FFB800"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M8.73705 7.13197C9.18876 6.92023 9.72931 6.96593 10.1333 7.25001L15.4667 11C15.8024 11.2361 16 11.6066 16 12C16 12.3934 15.8024 12.7639 15.4667 13L10.1333 16.75C9.72931 17.0341 9.18876 17.0798 8.73705 16.868C8.28534 16.6563 8 16.2235 8 15.75V8.25001C8 7.77654 8.28534 7.34371 8.73705 7.13197Z"
                      fill="#9CA3AF"
                    />
                  </svg>
                )
              }
            />
          </div>
        )}

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
