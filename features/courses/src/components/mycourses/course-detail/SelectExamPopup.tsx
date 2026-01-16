import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useMutation } from "react-query";

import { useFeature } from "@lms/contexts";
import { ClassKey, RemindChoosingExam } from "@lms/core";
import { useSelectExams } from "@lms/hooks";
import { SappModalV3, SAPPSelectV2 } from "@lms/ui";

interface ISelectExamPopup {
  courseData: any;
}

const SelectExamPopup = ({ courseData }: ISelectExamPopup) => {
  const {router, classApi, query, params} = useFeature()
  const { control, watch } = useForm({ defaultValues: { exam_date: null } })
  const selectedExam = watch('exam_date')
  const [examModal, setExamModal] = useState(false)

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

  const getTitleMessage = (remind: RemindChoosingExam) => {
    if (remind.remind_by_progress)
      return "Please select your scheduled exam date to get timely revision support.";
    if (remind.remind_by_duration)
      return "If you changed your exam date, please update your info to get timely revision support.";
    return "";
  };

  // --- Handlers
  const handleConfirmExamDate = () => {
    if (!selectedExam) return;
    const formData = new FormData();

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
        <SAPPSelectV2
          placeholder="Exam Date"
          options={examOptions}
          control={control}
          name="exam_date"
          onMenuScrollToBottom={hasNextPage && fetchNextPage}
        />
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
          : handleConfirmExamDate
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
    />
  );
};

export default SelectExamPopup;
