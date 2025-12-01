import { zodResolver } from '@hookform/resolvers/zod'
import { closeNote } from '@lms/contexts'
import { useTailwindBreakpoint } from '@lms/hooks'
import { VALIDATE_REQUIRED } from '@utils/helpers/ValidateMessage'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { CoursesAPI } from 'src/pages/api/courses'
import { useAppDispatch } from 'src/redux/hook'
import { IProps, NoteFormData } from 'src/type/courses-3-level'
import { z } from 'zod'
import CreateNoteDesktop from './CreateNoteDesktop'
import CreateNoteMobile from './CreateNoteMobile'

const CreateNote = ({
  id,
  content,
  uuid,
  // count,
  isActiveTab,
  handleCloseTab,
  countNote,
}: IProps) => {
  const router = useRouter()
  const activityId = router.query.id
  const [activeSectionId, setActiveSectionId] = useState<string>()
  const dispatch = useAppDispatch()
  const [loading, setLoading] = useState<boolean>(false)
  const { isMobileView } = useTailwindBreakpoint()

  const validationSchema = z.object({
    [`description_${id ? id : uuid}`]: z
      .string()
      .trim()
      .min(1, VALIDATE_REQUIRED),
  })

  // Use the type for useForm
  const { control, handleSubmit, watch, reset } = useForm<NoteFormData>({
    resolver: zodResolver(validationSchema),
    mode: 'onSubmit',
    defaultValues: {
      [`description_${id ? id : uuid}`]: content,
    },
  })

  const [baselineContent, setBaselineContent] = useState<string>(content)
  const watchDescription = watch(`description_${id ? id : uuid}`)
  const isChanged = watchDescription !== baselineContent

  // Cập nhật baselineContent khi content prop thay đổi
  useEffect(() => {
    setBaselineContent(content)
  }, [content])

  // Type the data parameter everywhere
  const createNewNote = async (data: NoteFormData) => {
    try {
      setLoading(true)
      const params = {
        course_section_id: activityId,
        name: 'Note',
        description: data[`description_${id ? id : uuid}`],
      }
      const res = await CoursesAPI.createNote(params)
      setActiveSectionId(res?.data?.id)
      // Cập nhật baseline để lần gõ tiếp theo hiển thị nút Save chính xác
      const savedValue = data[`description_${id ? id : uuid}`] || ''
      setBaselineContent(savedValue)
      reset(
        { [`description_${id ? id : uuid}`]: savedValue },
        { keepDirty: false },
      )
      toast.success('Tạo thành công!')
    } catch (error) {
      toast.error('Tạo không thành công!')
    } finally {
      setLoading(false)
    }
  }

  const updateNote = async (data: NoteFormData) => {
    try {
      setLoading(true)
      const params = {
        name: 'Note',
        description: data[`description_${id ? id : uuid}`],
      }
      await CoursesAPI.updateCourseNotesList(id || activeSectionId, params)
      // Cập nhật baseline sau khi lưu để theo dõi thay đổi mới
      const savedValue = data[`description_${id ? id : uuid}`] || ''
      setBaselineContent(savedValue)
      reset(
        { [`description_${id ? id : uuid}`]: savedValue },
        { keepDirty: false },
      )
      toast.success('Cập nhật thành công!')
    } catch (error) {
      toast.error('Cập nhật không thành công!')
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: NoteFormData) => {
    id || activeSectionId ? updateNote(data) : createNewNote(data)
  }

  const removeNote = () => {
    dispatch(closeNote(uuid))

    if (isActiveTab && countNote <= 1) {
      handleCloseTab()
    }
  }

  return (
    <>
      {isMobileView ? (
        <CreateNoteMobile
          id={id}
          uuid={uuid}
          content={content}
          onSubmit={onSubmit}
          onRemove={removeNote}
          control={control}
          handleSubmit={handleSubmit}
          loading={loading}
          visible={isMobileView}
        />
      ) : (
        <CreateNoteDesktop
          id={id}
          uuid={uuid}
          content={content}
          onSubmit={onSubmit}
          onRemove={removeNote}
          control={control}
          handleSubmit={handleSubmit}
          loading={loading}
          isChanged={isChanged}
        />
      )}
    </>
  )
}

export default CreateNote
