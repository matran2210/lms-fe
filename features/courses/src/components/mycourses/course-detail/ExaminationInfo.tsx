import { CheckCircleTwoTone } from "@ant-design/icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { PencilV2Icon } from "@lms/assets";
import { ExaminationForm, useFeature } from "@lms/contexts";
import { COURSE_TYPE, Data, TitleSidebar, zodMsg } from "@lms/core";
import { useTailwindBreakpoint } from "@lms/hooks";
import { CarouselSlideAnimation, NoData, SappDrawerV3, Tooltip } from "@lms/ui";
import { getDuration } from "@lms/utils";
import { ClassAPI } from "@pages/api/class";
import { ClassKey } from "@pages/api/queryKey";
import { Avatar, GetProp, List, Skeleton, UploadFile, UploadProps } from "antd";
import clsx from "clsx";
import { isEmpty, isUndefined } from "lodash";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "react-query";
import useSelectExams from "src/hooks/useSelectExams";
import { z } from "zod";
import ChangExamDate from "./ChangExamDate";
import ChangeAnywayModal from "./ChangeAnywayModal";
import SelectExamDate from "./SelectExamDate";

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  isEditProps?: boolean;
  classIdProps?: string;
  isExamList?: boolean;
  currentValue?: string;
  onSuccess?: () => void;
};

export interface InfoItemProps {
  label: string;
  value: ReactNode;
}
type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const InfoItem = ({ label, value }: InfoItemProps) => {
  return (
    <div className="flex justify-between gap-2 text-sm text-secondary md:text-base">
      <div>{label}</div>
      <div className="flex items-center gap-2 font-semibold">
        {value || "-"}
      </div>
    </div>
  );
};

const ExamDate = ({
  data,
  setIsEdit,
  setDirection,
}: {
  data: Data;
  setIsEdit: (isEdit: boolean) => void;
  setDirection: React.Dispatch<React.SetStateAction<1 | -1>>;
}) => (
  <>
    <div>{data?.exam?.examination?.name ?? "-"}</div>
    {data?.is_final_examination_subject ? (
      <Tooltip
        showTooltip={true}
        title={"This is your official exam date and can not be changed"}
      >
        <CheckCircleTwoTone twoToneColor={"#52c41a"} />
      </Tooltip>
    ) : (
      data?.remaining_changes > 0 &&
      data?.course.course_type === COURSE_TYPE.NORMAL_COURSE && (
        <Tooltip showTooltip={false} title={"Change Exam Date"}>
          <div
            className="cursor-pointer text-primary"
            onClick={() => {
              setIsEdit(true);
              setDirection(1);
            }}
          >
            <PencilV2Icon />
          </div>
        </Tooltip>
      )
    )}
  </>
);

const ExaminationInfo = ({
  open,
  setOpen,
  isEditProps = false,
  classIdProps = "",
  isExamList = false,
  currentValue,
  onSuccess,
}: Props) => {
  const { isTabletView, isMobileView } = useTailwindBreakpoint();
  const { router } = useFeature();
  const [direction, setDirection] = useState<1 | -1>(1);
  const [isOpenSelectExam, setIsOpenSelectExam] = useState<boolean>(false);
  const [classId, setClassId] = useState(router.query?.courseId as string);

  const { data, isLoading, isError, isSuccess, refetch } = useQuery({
    queryKey: [ClassKey.ExamInfo, classId],
    queryFn: () => ClassAPI.getExamInfo(classId),
    select: (data) => data.data,
    retry: false,
    enabled: !isUndefined(classId) && open && !isEditProps,
  });
  const [itemSelected, setItemSelected] = useState("");

  useEffect(() => {
    if (!open || isUndefined(classId) || isEditProps) return;

    refetch();
  }, [open]);

  const queryClient = useQueryClient();
  const [isEdit, setIsEdit] = useState(isEditProps);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);

  const validationSchema = z.object({
    note: z
      .array(z.instanceof(File), { message: zodMsg.required })
      .min(1, { message: zodMsg.required }),
    examination_subject_id: z
      .string({ required_error: zodMsg.required })
      .min(1, { message: zodMsg.required }),
  });

  const methods = useForm<ExaminationForm>({
    resolver: zodResolver(validationSchema),
  });
  const handleSuccess = () => {
    queryClient.invalidateQueries({
      queryKey: [ClassKey.ExamInfo],
    });
  };

  const { mutate, isLoading: isChangingLoad } = useMutation({
    mutationFn: ({
      examination_subject_id,
      note,
    }: {
      examination_subject_id: string;
      note: UploadFile[];
    }) => {
      const formData = new FormData();
      formData.append("examination_subject_id", examination_subject_id);
      note && formData.append("note", note[0] as FileType);
      return ClassAPI.changeExamDate(classId, formData);
    },
    onSuccess: (res) => {
      if (res.data.success) {
        toast.success(res.data.data.message);
        handleSuccess();
        handleCancel();
        onSuccess && onSuccess();
      }
      setOpenConfirmModal(false);
    },
  });

  const onSubmit: SubmitHandler<ExaminationForm> = (data) => {
    mutate({
      examination_subject_id: data.examination_subject_id,
      note: data.note,
    });
  };
  const handleBack = (isCancel: boolean = false) => {
    setDirection(-1);
    if (isOpenSelectExam) {
      setIsOpenSelectExam(false);
    } else {
      setIsEdit(isCancel);
      methods.reset();
    }
  };
  const handleCancel = () => {
    setOpen(false);
    setIsOpenSelectExam(false);
    setTimeout(() => {
      handleBack(isEditProps);
    }, 500);
  };
  const { exams } = useSelectExams(classId);

  const handleChangeExamDate = async () => {
    if (isOpenSelectExam) {
      handleBack();
      return;
    }
    if (isEmpty(exams?.current_exam_name)) {
      methods.handleSubmit(onSubmit)();
    } else {
      const valid = await methods.trigger();

      if (!valid) return;
      setOpenConfirmModal(true);
      setOpen(false);
    }
  };

  useEffect(() => {
    if (classIdProps && isEditProps) {
      setClassId(classIdProps);
      setIsEdit(isEditProps);
    }
  }, [classIdProps, isEditProps]);

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
      );
    }
    if (isError) {
      return (
        <div className="flex min-h-[calc(100vh-12rem)] items-center justify-center">
          <NoData />
        </div>
      );
    }

    if (isSuccess) {
      return (
        <div className="flex w-full flex-col gap-4 text-sm md:text-base">
          <InfoItem label="Program:" value={data?.program?.name} />
          <InfoItem label="Subject:" value={data?.subject?.name} />
          <InfoItem
            label="Scheduled Exam Date:"
            value={
              <ExamDate
                data={data}
                setIsEdit={setIsEdit}
                setDirection={setDirection}
              />
            }
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
      );
    }
  };

  const title = isOpenSelectExam
    ? "Choose one option"
    : isEdit
      ? "Change Exam Date"
      : TitleSidebar.EXAM_INFORMATION;
  const isShowCloseBtn = !isEdit || isExamList || isTabletView || isMobileView;
  const isClosable = !isEdit || isExamList;
  const isShowBackBtn = (isTabletView || isMobileView) && isEdit && !isExamList;
  const btnSubmitTile = isEdit ? "Confirm" : "";
  const cancelButtonCaption = isEdit && !isMobileView ? "Cancel" : "";
  const placement = isTabletView || isMobileView ? "bottom" : "right";
  const height =
    (isTabletView || isMobileView) && isEdit
      ? 386
      : isTabletView || isMobileView
        ? "auto"
        : "100%";

  return (
    <>
      <SappDrawerV3
        open={open}
        handleCancel={handleCancel}
        title={title}
        isShowBtnClose={isShowCloseBtn}
        closable={isClosable && !isOpenSelectExam}
        isShowBtnBack={isShowBackBtn || isOpenSelectExam}
        isShowFooter={isEdit && !isEmpty(exams?.data)}
        btnSubmitTile={btnSubmitTile}
        cancelButtonCaption={cancelButtonCaption}
        handleBack={handleBack}
        handleSubmit={handleChangeExamDate}
        loading={isChangingLoad}
        placement={placement}
        height={height}
        submitButtonClassName="w-full md:w-auto"
        rootClassName={clsx("responsive-drawer-base", {
          "drawer-bottom-0": isMobileView,
        })}
      >
        <FormProvider {...methods}>
          <CarouselSlideAnimation slideKey={title} direction={direction}>
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
                setDirection={setDirection}
              />
            ) : (
              renderContent()
            )}
          </CarouselSlideAnimation>
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
  );
};

export default ExaminationInfo;
