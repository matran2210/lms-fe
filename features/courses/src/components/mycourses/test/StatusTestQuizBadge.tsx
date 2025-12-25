import { STATUS_QUIZ_TEST } from "@lms/core";

const StatusTestQuizBadge = ({
  status,
}: {
  status: keyof typeof STATUS_QUIZ_TEST;
}) => {
  const { label, color, bg } = STATUS_QUIZ_TEST[status] || {
    label: "Not started",
    color: "text-info",
    bg: "bg-info-50",
  };

  if (!label || !color || !bg) return "_ _";
  return (
    <div
      className={`rounded px-2 py-1 text-sm ${color || ""} ${bg || ""} w-fit`}
    >
      {label}
    </div>
  );
};

export default StatusTestQuizBadge;
