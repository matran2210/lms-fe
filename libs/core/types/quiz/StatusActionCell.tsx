import { FC } from "react";
import { QUIZ_ATTEMPT_GRADING_STATUS, QUIZ_ATTEMPT_STATUS } from "../../enums";

type Props = {
  dataColumn?: QUIZ_ATTEMPT_GRADING_STATUS | QUIZ_ATTEMPT_STATUS;
};

export const statusQuizMap = {
  SUBMITTED: {
    label: "Submitted",
    color: "text-success",
    bg: "bg-success-50",
  },
  IN_PROGRESS: {
    label: "In Progress",
    color: "text-[#025eff]",
    bg: "bg-[#025eff0D]",
  },
  UN_SUBMITTED: {
    label: "Not Submitted",
    color: "text-warning",
    bg: "bg-warning-50",
  },
  FINISHED: {
    label: "Finished",
    color: "text-[#07af17]",
    bg: "bg-[#01711f0D]",
  },
  UN_FINISHED: {
    label: "UnFinished",
    color: "text-[#d35563]-3",
    bg: "bg-[#D35563]-5",
  },
  AWAITING_GRADING: {
    label: "Awaiting grading",
    color: "text-[#F89707]",
    bg: "bg-[#F897070D]",
  },
  IN_REVIEW: {
    label: "In Review",
    color: "text-[#F89707]",
    bg: "bg-[#F897070D]",
  },
  FINISHED_GRADING: {
    label: "Finished Grading",
    color: "text-[#176CDD]",
    bg: "bg-[#176CDD0D]",
  },
  DRAFT: {
    label: "Draft",
    color: "text-[#99A1B7]",
    bg: "bg-[#f3f4f6]",
  },
};

export const StatusQuizTag = ({
  status,
}: {
  status: keyof typeof statusQuizMap;
}) => {
  const { label, color, bg } = statusQuizMap[status] || {
    label: "Not started",
    color: "text-info",
    bg: "bg-info-50",
  };

  if (!label || !color || !bg) return "_ _";
  return (
    <div
      className={`rounded px-2 py-1 text-xs font-medium ${color || ""} ${bg || ""} w-fit`}
    >
      {label}
    </div>
  );
};
export const StatusActionCell: FC<Props> = ({ dataColumn }) => (
  <StatusQuizTag status={dataColumn as keyof typeof statusQuizMap} />
);
