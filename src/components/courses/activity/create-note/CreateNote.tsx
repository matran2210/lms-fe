import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { VALIDATE_REQUIRED } from '@utils/helpers/ValidateMessage'
import { CoursesAPI } from 'src/pages/api/courses'
import toast from 'react-hot-toast'
import { closeNote } from 'src/redux/slice/Course/ShortCourse/NoteList/ShortNoteList'
import { useAppDispatch } from 'src/redux/hook'
import { IProps } from 'src/type/courses-3-level'
import { NoteFormData } from 'src/type/courses-3-level'
import CreateNoteDesktop from './CreateNoteDesktop'
import CreateNoteMobile from './CreateNoteMobile'

const CreateNote = ({
  id,
  content,
  uuid,
  count,
  activeTab,
  handleCloseTab,
  countNote,
}: IProps) => {
  const router = useRouter()
  const activityId = router.query.id
  const [activeSectionId, setActiveSectionId] = useState<string>()
  const dispatch = useAppDispatch()
  const [loading, setLoading] = useState<boolean>(false)

  const validationSchema = z.object({
    [`description_${id ? id : uuid}`]: z
      .string()
      .trim()
      .min(1, VALIDATE_REQUIRED),
  })

  // Use the type for useForm
  const { control, handleSubmit } = useForm<NoteFormData>({
    resolver: zodResolver(validationSchema),
    mode: 'onSubmit',
  })

  // Type the data parameter everywhere
  const createNewNote = async (data: NoteFormData) => {
    setLoading(true)
    const params = {
      course_section_id: activityId,
      name: 'Note',
      description: data[`description_${id ? id : uuid}`],
    }
    const res = await CoursesAPI.createNote(params)
    setActiveSectionId(res?.data?.id)
    toast.success('Tạo thành công!')
    setLoading(false)
  }

  const updateNote = async (data: NoteFormData) => {
    setLoading(true)
    const params = {
      name: 'Note',
      description: data[`description_${id ? id : uuid}`],
    }
    await CoursesAPI.updateCourseNotesList(id || activeSectionId, params)
    toast.success('Cập nhật thành công!')
    setLoading(false)
  }

  const onSubmit = async (data: NoteFormData) => {
    id || activeSectionId ? updateNote(data) : createNewNote(data)
  }

  const removeNote = () => {
    dispatch(closeNote(uuid))

    if (activeTab && countNote <= 1) {
      handleCloseTab()
    }
  }

  return (
    <>
      {activeTab ? (
        <CreateNoteMobile
          id={id}
          uuid={uuid}
          content={content}
          onSubmit={onSubmit}
          onRemove={removeNote}
          control={control}
          handleSubmit={handleSubmit}
          loading={loading}
          visible={activeTab}
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
        />
      )}
    </>
  )
}

export default CreateNote
