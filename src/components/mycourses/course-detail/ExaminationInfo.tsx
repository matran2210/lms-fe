import SappDrawerV3 from '@components/base/drawer/SappDrawerV3'
import { ClassAPI } from '@pages/api/class'
import { ClassKey } from '@pages/api/queryKey'
import { useRouter } from 'next/router'
import { Dispatch, ReactNode, SetStateAction, useState } from 'react'
import { useQuery, useQueryClient, useMutation } from 'react-query'
import { PencilV2Icon, AlertTriagle } from '@assets/icons'
import Tooltip from 'src/common/Tooltip'
import { COURSE_TYPE } from 'src/constants'
import { CheckCircleTwoTone } from '@ant-design/icons'
import { formatDateFromUTC } from '@utils/index'
import { Avatar, GetProp, List, Skeleton, UploadProps, UploadFile } from 'antd'
import NoDataV2 from 'src/common/NodataV2'
import { Data } from 'src/type/course'
import ChangExamDate from '@components/mycourses/course-detail/ChangExamDate'
import { zodMsg } from 'src/constants/form'
import { z } from 'zod'
import { ExaminationForm } from 'src/redux/types/Course/MyCourse/ExamInformation'
import { zodResolver } from '@hookform/resolvers/zod'
import { SubmitHandler, useForm, FormProvider } from 'react-hook-form'
import toast from 'react-hot-toast'
import useSelectExams from 'src/hooks/useSelectExams'
import SappModalV3 from '@components/base/modal/SappModalV3'

type Props = {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}

interface InfoItemProps {
  label: string
  value: ReactNode
}
type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0]

const InfoItem = ({ label, value }: InfoItemProps) => (
  <div className="flex items-center justify-between text-base text-secondary">
    <div>{label}</div>
    <div className="flex items-center gap-2 font-semibold">{value}</div>
  </div>
)

const ExamDate = ({
  data,
  setIsOpen,
}: {
  data: Data
  setIsOpen: (isOpen: boolean) => void
}) => (
  <>
    <div>{data?.exam?.examination?.name ?? '-'}</div>
    {data?.is_final_examination_subject ? (
      <Tooltip
        showTooltip={true}
        title={'This is your official exam date and can not be changed'}
      >
        <CheckCircleTwoTone twoToneColor={'#52c41a'} />
      </Tooltip>
    ) : (
      data?.remaining_changes > 0 &&
      data?.course.course_type === COURSE_TYPE.NORMAL_COURSE && (
        <Tooltip showTooltip={true} title={'Change Exam Date'}>
          <div
            className="cursor-pointer hover:text-primary"
            onClick={() => setIsOpen(true)}
          >
            <PencilV2Icon />
          </div>
        </Tooltip>
      )
    )}
  </>
)

const ExaminationInfo = ({ open, setOpen }: Props) => {
  const router = useRouter()
  const classId = router.query.courseId as string

  const { data, isLoading, isFetching, isError, isSuccess } = useQuery({
    queryKey: [ClassKey.ExamInfo],
    queryFn: () =>
      router.query.courseId
        ? ClassAPI.getExamInfo(router.query.courseId as string)
        : Promise.reject('courseId is undefined'),
    refetchOnWindowFocus: false,
    select: (data) => data.data,
    retry: false,
  })

  const queryClient = useQueryClient()
  const [isOpen, setIsOpen] = useState(false)
  const [openConfirmModal, setOpenConfirmModal] = useState(false)

  const start = data?.exam?.start_date
    ? formatDateFromUTC(data.exam.start_date)
    : ''
  const end = data?.exam?.end_date ? formatDateFromUTC(data.exam.end_date) : ''
  const duration = [start, end].filter(Boolean).join(' - ') || '-'

  const validationSchema = z.object({
    note: z
      .array(z.any(), { message: zodMsg.required })
      .min(1, { message: zodMsg.required }),
    examination_subject_id: z
      .string({ required_error: zodMsg.required })
      .min(1, { message: zodMsg.required }),
  })

  const methods = useForm<ExaminationForm>({
    resolver: zodResolver(validationSchema),
  })

  const handleSuccess = () => {
    queryClient.invalidateQueries({
      queryKey: [ClassKey.ExamInfo],
    })
  }

  const { mutate, isLoading: isChangingLoad } = useMutation({
    mutationFn: ({
      examination_subject_id,
      note,
    }: {
      examination_subject_id: string
      note: UploadFile[]
    }) => {
      const formData = new FormData()
      formData.append('examination_subject_id', examination_subject_id)
      note && formData.append('note', note[0] as FileType)

      return ClassAPI.changeExamDate(router.query.courseId as string, formData)
    },
    onSuccess: (res) => {
      if (res.data.success) {
        toast.success(res.data.data.message)
        handleSuccess()
        handleBack()
        handleCancel()
      }
      setOpenConfirmModal(false)
    },
  })

  const onSubmit: SubmitHandler<ExaminationForm> = (data) => {
    mutate({
      examination_subject_id: data.examination_subject_id,
      note: data.note,
    })
  }
  const handleBack = () => {
    setIsOpen(false)
    methods.reset()
  }
  const handleCancel = () => {
    setOpen(false)
  }
  const { exams } = useSelectExams(classId)
  const handleChangeExamDate = () => {
    if (exams?.current_exam_name === '') {
      methods.handleSubmit(onSubmit)()
    } else {
      setOpenConfirmModal(true)
    }
  }

  const renderContent = () => {
    if (isLoading || isFetching) {
      return (
        <>
          {[...Array(6)].map((_, index) => (
            <Skeleton key={index} active avatar>
              <List.Item.Meta avatar={<Avatar />} />
            </Skeleton>
          ))}
        </>
      )
    }
    if (isError || !isSuccess) {
      return (
        <div className="flex min-h-[calc(100vh-12rem)] items-center justify-center">
          <NoDataV2 />
        </div>
      )
    }
    if (isSuccess) {
      return (
        <div className="flex w-full flex-col gap-4 text-base">
          <InfoItem label="Program:" value={data?.program?.name ?? '-'} />
          <InfoItem label="Subject:" value={data?.subject?.name ?? '-'} />
          <InfoItem label="Class Code:" value={data?.exam?.code_exam ?? '-'} />
          <InfoItem label="Duration:" value={duration} />
          <InfoItem
            label="Scheduled Exam Date:"
            value={<ExamDate data={data} setIsOpen={setIsOpen} />}
          />
        </div>
      )
    }
  }

  return (
    <>
      <SappDrawerV3
        open={open}
        handleCancel={handleCancel}
        title={isOpen ? 'Change Exam Date' : 'Exam Information'}
        isShowBtnClose={!isOpen}
        isShowFooter={isOpen}
        btnSubmitTile={isOpen ? 'Confirm' : ''}
        cancelButtonCaption={isOpen ? 'Cancel' : ''}
        handleBack={handleBack}
        handleSubmit={handleChangeExamDate}
        loading={isChangingLoad}
      >
        {isOpen ? (
          <FormProvider {...methods}>
            <ChangExamDate
              isOpen={isOpen}
              classId={classId}
              remainingChanges={data?.remaining_changes}
              currentValue={data?.exam?.id}
            />
          </FormProvider>
        ) : (
          renderContent()
        )}
      </SappDrawerV3>
      <SappModalV3
        open={openConfirmModal}
        cancelButtonCaption="No"
        okButtonCaption="Change Anyway"
        handleCancel={() => setOpenConfirmModal(false)}
        onOk={methods.handleSubmit(onSubmit, (errors) => {
          if (errors) {
            setOpenConfirmModal(false)
          }
        })}
        fullWidthBtn={true}
        buttonSize="extra"
        icon={<AlertTriagle />}
        header="Are you sure?"
        loading={isChangingLoad}
      >
        Your learning progress in the Revision class for the{' '}
        <span className="text-sm font-medium text-[#050505]">
          {exams?.current_exam_name}
        </span>{' '}
        exam cannot be saved. Do you want to continue making changes?
      </SappModalV3>
    </>
  )
}

export default ExaminationInfo
