import SappModal from '@components/base/modal/SappModal'
import SappHookFormSelect from '@components/base/select/SappHookFormSelect'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import EntranceApi from 'src/redux/services/EntranceTest'
import { z } from 'zod'
import { EntrancePopupProps } from './EntrancePopup'
import { VALIDATE_REQUIRED } from '@utils/helpers/ValidateMessage'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAppSelector } from 'src/redux/hook'
import { userReducer } from 'src/redux/slice/User/User'
import { useRouter } from 'next/router'
import SappModalV2 from '@components/base/modal/SappModalV2'

const EntranceTestFillForm = ({
  open,
  setOpen,
  entrancePopupContent,
}: EntrancePopupProps) => {
  const [listUnivers, setListUnivers] = useState<any>()
  const [listUniverPrograms, setListUniverPrograms] = useState<any>()
  const [listMajors, setListMajors] = useState<any>()
  const [listEngLevel, setListEngLevel] = useState<any>()
  const { user } = useAppSelector(userReducer)
  const router = useRouter()
  const schema = z.object({
    univers_id: z
      .object({
        label: z.string().optional(),
        value: z.string().optional(),
      })
      .optional()
      .refine((data) => data?.value && data?.label, VALIDATE_REQUIRED),
    univers_program_id: z
      .object({
        label: z.string().optional(),
        value: z.string().optional(),
      })
      .optional()
      .refine((data) => data?.value && data?.label, VALIDATE_REQUIRED),
    majors_id: z
      .object({
        label: z.string().optional(),
        value: z.string().optional(),
      })
      .optional()
      .refine((data) => data?.value && data?.label, VALIDATE_REQUIRED),
    englishLevel_id: z
      .object({
        label: z.string().optional(),
        value: z.string().optional(),
      })
      .optional()
      .refine((data) => data?.value && data?.label, VALIDATE_REQUIRED),
  })
  const getListUniversities = async () => {
    const res = await EntranceApi.getListUnivers()
    let optionUnivers = []
    for (let e of res.data) {
      optionUnivers.push({ value: e.code, label: e.name })
    }
    setListUnivers(optionUnivers)
    // return res?.data?.[0]
  }
  const getListUniverPrograms = async () => {
    const res = await EntranceApi.getListUniversProgram()
    let optionUniverProgram = []
    for (let e of res.data) {
      optionUniverProgram.push({ value: e.id, label: e.name })
    }
    setListUniverPrograms(optionUniverProgram)
    // return res?.data?.[0]
  }
  const getListMajors = async () => {
    const res = await EntranceApi.getListMajors()
    let optionMajors = []
    for (let e of res.data) {
      optionMajors.push({ value: e.id, label: e.name })
    }
    setListMajors(optionMajors)
    // return res?.data?.[0]
  }
  const getListEngLevel = async () => {
    const res = await EntranceApi.getListEngLevel()
    let optionEngLevel = []
    for (let e of res.data) {
      optionEngLevel.push({ value: e.id, label: e.name })
    }
    setListEngLevel(optionEngLevel)
    // return res?.data?.[0]
  }
  const {
    control,
    handleSubmit,
    getValues,
    setValue,
    reset,
    watch,
    getFieldState,
  } = useForm<any>({
    resolver: zodResolver(schema),
    mode: 'onSubmit',
  })
  useEffect(() => {
    if (open) {
      getListUniversities()
      getListEngLevel()
      getListMajors()
      getListUniverPrograms()
    }
  }, [open])
  useEffect(() => {
    if (user && open) {
      if (user.university) {
        setValue('univers_id', {
          value: user.university?.code,
          label: user.university?.name,
        })
      }
      if (user.university_program) {
        setValue('univers_program_id', {
          value: user.university_program?.id,
          label: user.university_program?.name,
        })
      }
      if (user.major) {
        setValue('majors_id', {
          value: user.major?.id,
          label: user.major?.name,
        })
      }
      if (user.english_level) {
        setValue('englishLevel_id', {
          value: user.english_level?.id,
          label: user.english_level?.name,
        })
      }
    }
  }, [user, open])

  const handleOnClick = () => {
    reset()
    setOpen && setOpen(false)
  }
  const onSubmit = async (dataValue: any) => {
    if (
      user.major &&
      user.university &&
      user.english_level &&
      user.university_program
    ) {
      return
    } else {
      await EntranceApi.putLevel({
        university_program_id: dataValue.univers_program_id.value,
        major_id: dataValue.majors_id.value,
        english_level_id: dataValue.englishLevel_id.value,
        university_id: dataValue.univers_id.value,
      })
      setOpen && setOpen(false)
      router.push({
        pathname: `/test/${entrancePopupContent.id}`,
        query: {
          type: 'entrance',
        },
      })
    }
  }

  return (
    <SappModalV2
      open={open}
      cancelButtonCaption="Cancel"
      okButtonCaption="Start"
      handleCancel={handleOnClick}
      onOk={handleSubmit(onSubmit)}
      showHeader={false}
      refClass="md:px-19 py-19 flex flex-col animate-jump-in relative transform bg-white text-left shadow-xl transition-all"
      size="max-w-screen-sm"
      footerButtonClassName="justify-between flex"
      childClass=""
      parentChildClass=""
      position="center"
      buttonSize="medium"
      scrollbale={false}
      closeAfterSubmit={false}
      title={undefined}
    >
      <h2 className="text-4xl font-bold text-bw-1 mb-4 max-w-screen-sm">
        Fill This Form
      </h2>
      <div className="mt-10">
        <SappHookFormSelect
          control={control}
          name="univers_id"
          label="Trường đại học"
          required
          placeholder="Chọn 1 lựa chọn"
          options={listUnivers}
        />
      </div>
      <div className="flex gap-6 mt-10">
        <div className="flex-1">
          <SappHookFormSelect
            control={control}
            name="univers_program_id"
            label="Hệ đã/ đang theo học"
            required
            placeholder="Chọn 1 lựa chọn"
            options={listUniverPrograms}
          />
        </div>
        <div className="flex-1">
          <SappHookFormSelect
            control={control}
            name="majors_id"
            label="Chuyên ngành học"
            required
            placeholder="Chọn 1 lựa chọn"
            options={listMajors}
          />
        </div>
      </div>
      <div className="mt-10 mb-10">
        <SappHookFormSelect
          control={control}
          name="englishLevel_id"
          label="Trình độ tiếng Anh"
          required
          placeholder="Chọn 1 lựa chọn"
          options={listEngLevel}
        />
      </div>
    </SappModalV2>
  )
}
export default EntranceTestFillForm
