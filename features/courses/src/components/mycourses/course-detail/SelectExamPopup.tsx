import { useEffect, useMemo, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useMutation } from "react-query";
import { useFeature } from "@lms/contexts";
import { RemindChoosingExam, zodMsg } from "@lms/core";
import { useSelectExams } from "@lms/hooks";
import { ErrorMessage, SappModalV3, SAPPSelectTooltip, UploadSingleFile } from "@lms/ui";
import { GetProp, message } from "antd";
import Upload, { RcFile, UploadProps } from "antd/es/upload";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";

interface ISelectExamPopup {
  courseData: any;
}
type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

  const validationSchema = z.object({
    note: z
      .array(z.instanceof(File), { message: zodMsg.required })
      .optional(),
    examination_subject_id: z
      .string({ required_error: zodMsg.required }).nullable().optional(),
  }).refine((data) => {
    // If examination_subject_id is not "NOT_DECIDED" and not empty, note is required
    if (data.examination_subject_id && data.examination_subject_id !== "NOT_DECIDED") {
      return data.note && data.note.length > 0;
    }
    return true;
  }, {
    message: zodMsg.required,
    path: ["note"], // This will attach the error to the note field
  });

const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];


const SelectExamPopup = ({ courseData }: ISelectExamPopup) => {
  const { router, classApi, query, params } = useFeature()
  type SelectExamFormData = z.infer<typeof validationSchema>;

  const { control, clearErrors, setValue, watch, handleSubmit } = useForm<SelectExamFormData>(
    { resolver: zodResolver(validationSchema),
      defaultValues: { note: [] } 
    }
  )
  const [examModal, setExamModal] = useState(false)
  const selectedExam = watch('examination_subject_id')

  const remindChoosingExam: RemindChoosingExam =
    courseData?.pages?.[0]?.courseDetail?.remind_choosing_exam;

  const { exams, hasNextPage, fetchNextPage } = useSelectExams({
    api: {
      getExams: classApi.getExams,
    },
    courseId: params?.courseId as string || query.courseId as string
  }

  )

  const { mutate: updateExamDate, isLoading } = useMutation({
    mutationFn: (formData: FormData) =>
      classApi.changeExamDate(params?.courseId as string || query.courseId as string, formData),
    onSuccess: (res: any) => {
      if (res.data.success) {
        setExamModal(false);
        toast.success(res.data.data?.message);
      }
    },
  });

  // --- Handle modal visibility
  useEffect(() => {
    const shouldShowModal =
      remindChoosingExam?.remind_by_progress ||
      remindChoosingExam?.remind_by_duration;
    setExamModal(!!shouldShowModal);
  }, [remindChoosingExam]);

  // --- Derived Data
  const remainingChanges = remindChoosingExam?.remaining_changes ?? 0;

  const examOptions = useMemo(
    () => [
      ...(exams?.data?.map((exam) => ({
        label: exam.examination.name,
        value: exam.id,
      })) ?? []),
      { label: "Not decided yet", value: "NOT_DECIDED" },
    ],
    [exams?.data],
  );
  const getUploadProps = (onChange: (file: RcFile[]) => void) => ({
    beforeUpload: (file: RcFile) => {
      clearErrors("note");
      const isValidType = allowedTypes.includes(file.type);

      if (!isValidType) {
        message.error(
          `${file.name} is not a valid image file (only PNG, JPG, and JPEG allowed).`,
        );
        return Upload.LIST_IGNORE;
      }
      onChange([file]); // Manually update form state
      return false; // Prevent default upload behavior
    },
    onRemove: () => {
      setValue("note", []);
    },
  });
  const getTitleMessage = (remind: RemindChoosingExam) => {
    if (remind.remind_by_progress)
      return "Please select your scheduled exam date to get timely revision support.";
    if (remind.remind_by_duration)
      return "If you changed your exam date, please update your info to get timely revision support.";
    return "";
  };
const onSubmit: SubmitHandler<SelectExamFormData> = (data) => {

    const selectedExam = data.examination_subject_id
    if(!selectedExam) return
    const formData = new FormData();
    const note = data.note || []
    note && note.length > 0 && formData.append("note", note[0] as FileType);

    if (selectedExam === "NOT_DECIDED") {
      formData.append("not_decided", "true");
    } else {
      formData.append("examination_subject_id", selectedExam);
      formData.append("not_decided", "false");
    }
    
    updateExamDate(formData);
  };

  // --- Render Content
  const renderExamContent = () => {
    if (remainingChanges === 0) {
      return (
        <p className="text-sm text-gray">
          <span>
            If you have changed your exam date, please contact our support at
            hotline 1900 2225 or submit a support ticket{" "}
            <a
              href="https://sapp.edu.vn/dich-vu-cham-soc-hoc-vien-sapp-academy/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary-3 text-primary"
            >
              here
            </a>{" "}
            to update your information and receive timely revision support.
          </span>
        </p>
      );
    }

    return (
      <>
        <p className="mb-2 text-sm text-gray">
          {getTitleMessage(remindChoosingExam)}
        </p>
        <SAPPSelectTooltip
          placeholder="Exam Date"
          options={examOptions}
          control={control}
          name="examination_subject_id"
          onMenuScrollToBottom={hasNextPage && fetchNextPage}
        />
        <div className={clsx("mt-6 flex flex-col gap-2 md:flex-row md:items-center md:gap-6", {
          hidden: selectedExam === "NOT_DECIDED" || !selectedExam
        })}>
          <div className="shrink-0 whitespace-nowrap text-sm font-semibold leading-normal text-gray-800 md:text-base">
            Registration Evidence:
          </div>
          <Controller
            name="note"
            control={control}
            render={({ field, fieldState }) => (
              <div className="relative flex-1 flex justify-start">
                <UploadSingleFile
                  accept=".png, .jpg, .jpeg"
                  fileClassName="line-clamp-1 break-all text-sm md:text-base"
                  fileList={(field.value || []) as RcFile[]}
                  {...getUploadProps(field.onChange)}
                />
                {fieldState.error && (
                  <ErrorMessage className="absolute -bottom-5">
                    {fieldState.error.message}
                  </ErrorMessage>
                )}
              </div>
            )}
          />
        </div>
      </>
    );
  };

  return (
    <SappModalV3
      handleClose={() => setExamModal(false)}
      open={examModal}
      handleCancel={() => setExamModal(false)}
      onOk={
        remainingChanges === 0
          ? () => setExamModal(false)
          : handleSubmit(onSubmit)
      }
      header={remainingChanges > 0 ? "Choosing Exam" : "Exam Reminder"}
      content={renderExamContent()}
      showFooter
      okButtonCaption={remainingChanges === 0 ? "Skip" : "Confirm"}
      fullWidthBtn
      buttonSize="medium"
      cancelButtonCaption="Skip"
      showCancelButton={remainingChanges > 0}
      isUnderLine
      loadingBtnSubmit={isLoading}
      isValidated={!!selectedExam}
    />
  );
};

export default SelectExamPopup;
