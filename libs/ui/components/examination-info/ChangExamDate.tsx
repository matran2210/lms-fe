import { ArrowDownIcon } from "@lms/assets";
import React from "react";
import { useSelectExams, useTailwindBreakpoint } from "@lms/hooks";
import { message, Upload, UploadProps } from "antd";
import { RcFile } from "antd/es/upload";
import { useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useFeature } from "@lms/contexts";
import { SAPPSelectV2, UploadSingleFileV2 } from "../base";
import { ErrorMessage } from "../common";
interface IProps {
  classId: string;
  remainingChanges?: number;
  currentValue?: string;
  isOpen: boolean;
  setIsOpenSelectExam: React.Dispatch<React.SetStateAction<boolean>>;
  setDirection: React.Dispatch<React.SetStateAction<1 | -1>>;
}

const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];

const ChangExamDate = ({
  classId,
  currentValue,
  remainingChanges,
  isOpen,
  setIsOpenSelectExam,
  setDirection,
}: IProps) => {
  const { control, reset, setValue, clearErrors } = useFormContext();
  const { classApi } = useFeature();
  const { exams, refetch } = useSelectExams({
    api: {
      getExams: classApi.getExams
    },
    courseId: classId
  });
  const { isMobileView } = useTailwindBreakpoint();

  const options = exams?.data
    ?.map((exam) => ({
      label: exam?.examination?.name,
      value: exam?.id,
    }))
    ?.filter((item) => {
      return item.value !== currentValue;
    });

  const getUploadProps = (onChange: (file: RcFile[]) => void): UploadProps => ({
    beforeUpload: (file) => {
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
  useEffect(() => {
    if (isOpen) {
      reset({});
      refetch();
    }
  }, [isOpen, refetch, reset]);

  return (
    <div className="flex flex-col justify-start">
      <div className="mb-2 text-sm font-semibold leading-normal text-gray-800 md:text-base">
        New Exam Date
      </div>
      <SAPPSelectV2
        name="examination_subject_id"
        control={control}
        options={options ?? []}
        required
        placeholder="Choose one option"
        suffixIcon={<ArrowDownIcon className={isMobileView ? 'rotate-[0deg]' : 'rotate-[-90deg]'} />}
        onDropdownVisibleChange={() => {
          if (isMobileView) {
            setIsOpenSelectExam(true);
            setDirection(1);
          }
        }}
      />
      <div className="flex flex-col">
        <div className="mt-2 text-sm font-normal italic leading-snug text-gray-600">
          You can only change the exam date up to two times.
        </div>
        <div className="mt-1 text-sm font-bold italic leading-snug text-gray-600">
          {remainingChanges} change remaining
        </div>
      </div>
      <div className="mt-6 flex flex-col gap-2 md:flex-row md:items-center md:gap-6 ">
        <div className="text-sm font-semibold leading-normal text-gray-800 md:text-base">
          Registration Evidence:
        </div>
        <Controller
          name="note"
          control={control}
          render={({ field, fieldState }) => (
            <div className="relative">
              <UploadSingleFileV2
                fileList={field.value || []}
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
    </div>
  );
};
export default ChangExamDate;
