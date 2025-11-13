import SappDrawerV3 from '@components/base/drawer/SappDrawerV3'
import { ClassAPI } from '@pages/api/class'
import { ClassKey } from '@pages/api/queryKey'
import { useRouter } from 'next/router'
import { Dispatch, ReactNode, SetStateAction, useEffect, useState } from 'react'
import { useQuery, useQueryClient, useMutation } from 'react-query'
import { PencilV2Icon } from '@assets/icons'
import Tooltip from 'src/common/Tooltip'
import { COURSE_TYPE } from 'src/constants'
import { CheckCircleTwoTone } from '@ant-design/icons'
import { getDuration } from '@utils/index'
import { Avatar, GetProp, List, Skeleton, UploadProps, UploadFile } from 'antd'
import NoData from 'src/common/NoData'
import { Data } from 'src/type/course'
import ChangExamDate from '@components/mycourses/course-detail/ChangExamDate'
import { zodMsg } from 'src/constants/form'
import { z } from 'zod'
import { ExaminationForm } from 'src/redux/types/Course/MyCourse/ExamInformation'
import { zodResolver } from '@hookform/resolvers/zod'
import { SubmitHandler, useForm, FormProvider } from 'react-hook-form'
import toast from 'react-hot-toast'
import useSelectExams from 'src/hooks/useSelectExams'
import { isEmpty } from 'lodash'
import ChangeAnywayModal from 'src/components/mycourses/course-detail/ChangeAnywayModal'
import { TitleSidebar } from 'src/constants'
import { useTailwindBreakpoint } from 'src/hooks/useTailwindBreakpoint'
import clsx from 'clsx'
import SelectExamDate from '@components/mycourses/course-detail/SelectExamDate'
import { motion, AnimatePresence } from 'framer-motion'

type Props = {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  isEditProps?: boolean
  classIdProps?: string
  isExamList?: boolean
  currentValue?: string
  onSuccess?: () => void
}

export interface InfoItemProps {
  label: string
  value: ReactNode
}
type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0]

const InfoItem = ({ label, value }: InfoItemProps) => {
  return (
    <div className="flex justify-between gap-2 text-sm text-secondary md:text-base">
      <div>{label}</div>
      <div className="flex items-center gap-2 font-semibold">
        {value || '-'}
      </div>
    </div>
  )
}

const ExamDate = ({
  data,
  setIsEdit,
}: {
  data: Data
  setIsEdit: (isEdit: boolean) => void
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
            className="cursor-pointer text-primary"
            onClick={() => setIsEdit(true)}
          >
            <PencilV2Icon />
          </div>
        </Tooltip>
      )
    )}
  </>
)

const ExaminationInfo = ({
  open,
  setOpen,
  isEditProps = false,
  classIdProps = '',
  isExamList = false,
  currentValue,
  onSuccess,
}: Props) => {
  const { isTabletView, isMobileView } = useTailwindBreakpoint()
  const router = useRouter()
  const [direction, setDirection] = useState<1 | -1>(1)
  const [isOpenSelectExam, setIsOpenSelectExam] = useState<boolean>(false)
  const [classId, setClassId] = useState(router.query.courseId as string)
  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: [ClassKey.ExamInfo, classId],
    queryFn: () => ClassAPI.getExamInfo(classId),
    refetchOnWindowFocus: false,
    select: (data) => data.data,
    retry: false,
    enabled: !!classId,
  })
  const [itemSelected, setItemSelected] = useState('')
  const queryClient = useQueryClient()
  const [isEdit, setIsEdit] = useState(isEditProps)
  const [openConfirmModal, setOpenConfirmModal] = useState(false)

  const validationSchema = z.object({
    note: z
      .array(z.instanceof(File), { message: zodMsg.required })
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

      return ClassAPI.changeExamDate(classId, formData)
    },
    onSuccess: (res) => {
      if (res.data.success) {
        toast.success(res.data.data.message)
        handleSuccess()
        handleCancel()
        onSuccess && onSuccess()
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
    setDirection(-1)
    if (isOpenSelectExam) {
      setIsOpenSelectExam(false)
    } else {
      setIsEdit(false)
      methods.reset()
    }
  }
  const handleCancel = () => {
    setOpen(false)
    setIsOpenSelectExam(false)
    setTimeout(() => {
      handleBack()
    }, 500)
  }
  const { exams } = useSelectExams(classId)
  const handleChangeExamDate = () => {
    if (isOpenSelectExam) {
      if (itemSelected) methods.setValue('examination_subject_id', itemSelected)
      setIsOpenSelectExam(false)
      return
    }
    if (isEmpty(exams?.current_exam_name)) {
      methods.handleSubmit(onSubmit)()
    } else {
      setOpenConfirmModal(true)
    }
  }

  useEffect(() => {
    if (classIdProps && isEditProps) {
      setClassId(classIdProps)
      setIsEdit(isEditProps)
    }
  }, [classIdProps, isEditProps])

  const renderContent = () => {
    if (isLoading) {
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
    if (isError) {
      return (
        <div className="flex min-h-[calc(100vh-12rem)] items-center justify-center">
          <NoData />
        </div>
      )
    }
    if (isSuccess) {
      return (
        <div className="flex w-full flex-col gap-4 text-sm md:text-base">
          <InfoItem label="Program:" value={data?.program?.name} />
          <InfoItem label="Subject:" value={data?.subject?.name} />
          <InfoItem
            label="Scheduled Exam Date:"
            value={<ExamDate data={data} setIsEdit={setIsEdit} />}
          />
          <InfoItem
            label="Revision Class Code:"
            value={data?.exam?.code_exam}
          />
          <InfoItem
            label="Revision Class Duration"
            value={getDuration(data?.exam?.start_date, data?.exam?.end_date)}
          />
        </div>
      )
    }
  }

  const title = isEdit ? 'Change Exam Date' : TitleSidebar.EXAM_INFORMATION
  const isShowCloseBtn = !isEdit || isExamList || isTabletView || isMobileView
  const isClosable = !isEdit || isExamList
  const isShowBackBtn = (isTabletView || isMobileView) && isEdit && !isExamList
  const btnSubmitTile = isEdit ? 'Confirm' : ''
  const cancelButtonCaption = isEdit && !isMobileView ? 'Cancel' : ''
  const placement = isTabletView || isMobileView ? 'bottom' : 'right'
  const height =
    (isTabletView || isMobileView) && isEdit
      ? 386
      : isTabletView || isMobileView
        ? 'auto'
        : '100%'
  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? '-100%' : '100%',
      opacity: 0,
    }),
  }

  return (
    <>
      <SappDrawerV3
        open={open}
        handleCancel={handleCancel}
        title={title}
        isShowBtnClose={isShowCloseBtn}
        closable={isClosable}
        isShowBtnBack={isShowBackBtn}
        isShowFooter={isEdit}
        btnSubmitTile={btnSubmitTile}
        cancelButtonCaption={cancelButtonCaption}
        handleBack={handleBack}
        handleSubmit={handleChangeExamDate}
        loading={isChangingLoad}
        placement={placement}
        height={height}
        submitButtonClassName="w-full md:w-auto"
        rootClassName={clsx('responsive-drawer-base', {
          'drawer-bottom-0': isMobileView,
        })}
      >
        <FormProvider {...methods}>
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={
                isMobileView && isOpenSelectExam
                  ? 'selectExam'
                  : isEdit
                    ? 'changeExam'
                    : 'viewExam'
              }
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: 'easeInOut' }}
            >
              {isMobileView && isOpenSelectExam ? (
                <SelectExamDate
                  classId={classId}
                  currentValue={data?.exam?.id || currentValue}
                  itemSelected={itemSelected}
                  setItemSelected={setItemSelected}
                />
              ) : isEdit ? (
                <ChangExamDate
                  isOpen={isEdit}
                  classId={classId}
                  remainingChanges={data?.remaining_changes}
                  currentValue={data?.exam?.id || currentValue}
                  setIsOpenSelectExam={setIsOpenSelectExam}
                />
              ) : (
                renderContent()
              )}
            </motion.div>
          </AnimatePresence>
        </FormProvider>
      </SappDrawerV3>
      <ChangeAnywayModal
        openConfirmModal={openConfirmModal}
        setOpenConfirmModal={setOpenConfirmModal}
        methods={methods}
        onSubmit={onSubmit}
        isChangingLoad={isChangingLoad}
        exams={exams}
      />
    </>
  )
}

export default ExaminationInfo
