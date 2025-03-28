import HookFormDateRange from '@components/base/datetime/HookFormDateRange'
import SappDrawer from '@components/base/SappDrawer'
import SappHookFormSelect from '@components/base/select/SappHookFormSelect'
import HookFormTextField from '@components/base/textfield/HookFormTextField'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/router'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { getUserInformation, userReducer } from 'src/redux/slice/User/User'
import { useAppDispatch, useAppSelector } from 'src/redux/hook'
import { VALIDATE_REQUIRED } from '@utils/helpers/ValidateMessage'
import { z } from 'zod'
import { IDefaultFormAddProgress } from '../../../type/progress'

const defaultValues = {
  lesson: '',
  section: '',
  note: '',
}

export interface IProps {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  reloadPage: () => void
}

function FormAddProgress({ open, setOpen, reloadPage }: IProps) {
  const router = useRouter()
  const params = router.query?.id
  const isEdit = false
  const dispatch = useAppDispatch()
  const [loading, setLoading] = useState<boolean>(false)
  const [initialStatus, setInitialStatus] = useState<string>()
  const [existedTeacher, setExistedTeacher] = useState<boolean>(false)
  const { user } = useAppSelector(userReducer)

  const validationSchema = z.object({
    lesson: z
      .string({ required_error: VALIDATE_REQUIRED })
      .trim()
      .min(1, VALIDATE_REQUIRED),
    soGio: z
      .array(z.date(), { required_error: VALIDATE_REQUIRED })
      .refine((val) => val.length === 2, {
        message: VALIDATE_REQUIRED,
      }),
    section: z
      .string({ required_error: VALIDATE_REQUIRED })
      .trim()
      .min(1, VALIDATE_REQUIRED),
    note: z.string().optional(),
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
    getValues,
    setError,
  } = useFormProp

  const handleSubmit = handleSubmitForm(async (formData) => {})

  const loadData = async () => {}

  useLayoutEffect(() => {
    loadData()
  }, [params])

  useEffect(() => {
    dispatch(getUserInformation())
  }, [])

  return (
    <SappDrawer
      isOpen={open}
      message="Bạn có chắc chán muốn hủy không?"
      onClose={() => setOpen(false)}
      title={`${router.query.id ? 'Edit' : 'Add'} Progress`}
      footer={true}
      btnSubmitTile="Save"
      confirmOnClose={true}
      sizeTextBtn="medium"
      handleSubmit={handleSubmit}
      heightBody={'h-[calc(100vh-146px)]'}
    >
      <div className="mb-6">
        <div className="grid w-full grid-cols-2 gap-x-6">
          <div>
            <SappHookFormSelect
              control={control}
              label="Lesson"
              name="lesson"
              placeholder="Please choose"
              required
              className="text-base font-medium"
              options={[]}
            />
          </div>
          <div>
            <HookFormDateRange
              control={control}
              required
              label="Số Giờ"
              name="soGio"
              placeholder
              format="YYYY-MM-DD | HH:mm:ss"
              showTime
              className="text-sm"
            />
          </div>
        </div>
      </div>
      <div className="mb-6">
        <SappHookFormSelect
          control={control}
          label="Section"
          name="section"
          placeholder="Please choose"
          required
          className="text-base font-medium"
          options={[]}
        />
      </div>
      <div className="mb-6">
        <HookFormTextField
          label={'Note'}
          className="sapp-h-45px fs-6"
          control={control}
          name="note"
          placeholder={'Please enter'}
        ></HookFormTextField>
      </div>
    </SappDrawer>
  )
}

export default FormAddProgress
