import { EAttemptStatus, EDateTime, GRADING_METHOD, QuizActivity, StatusQuizTag } from "@lms/core";
import { SappTable, Tooltip } from "@lms/ui";
import { getTimeFromInput } from "@lms/utils";
import { ColumnsType, TablePaginationConfig } from "antd/es/table";
import dayjs from "dayjs";
// import { GradingMethod } from '@lms/core'
import { Dispatch, SetStateAction } from "react";

interface TableListQuizInActivityProps {
  data: QuizActivity[];
  pagination: TablePaginationConfig;
  setPagination: Dispatch<SetStateAction<TablePaginationConfig>>;
  handleChangeParams: (currentPage: number, pageSize: number) => void;
  loading: boolean;
  handleViewActivity: (record: QuizActivity) => void;
}

const TableListQuizInActivity = ({
  data,
  pagination,
  setPagination,
  handleChangeParams,
  loading,
  handleViewActivity,
  // getScore,
}: TableListQuizInActivityProps) => {
  const truncateText = (text: string, maxLength = 30) => {
    if (!text) return "";
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  };

  const getAttemptStatus = (resultData: any) => {
    if (resultData?.grading_method === GRADING_METHOD.MANUAL) {
      if (
        resultData?.attempts?.[0]?.status === EAttemptStatus.SUBMITTED
      ) {
        return resultData?.attempts?.[0]?.grading_status;
      }
      return resultData?.attempts?.[0]?.status || "NOT_STARTED";
    }

    if (resultData?.grading_method === GRADING_METHOD.AUTO) {
      return resultData?.attempts?.[0]?.status || "NOT_STARTED";
    }
  };
  const columnsValue: ColumnsType<QuizActivity> = [
    {
      title: "Type",
      align: "center",
      render: (record) => <div>{record?.quiz_type}</div>,
    },
    {
      title: "Graded Activity",
      align: "center",
      render: (record) => <div> {record?.is_graded ? "Yes" : "No"}</div>,
    },
    {
      title: "Status",
      align: "center",
      className: "column-center",
      render: (record) => <StatusQuizTag
        status={getAttemptStatus(record)}
      />, 
    },
    {
      title: "Score",
      align: "center",
      render: (record) => <div>{record?.attempts?.[0]?.score ?? "-"}</div>,
    },
    {
      title: <div style={{ textAlign: "center", width: "100%" }}>Path</div>,
      render: (record) =>
        (() => {
          const fullText = record?.quiz_path;
          return (
            <Tooltip title={fullText}>
              <div>{truncateText(fullText)}</div>
            </Tooltip>
          );
        })(),
    },
    {
      title: "Time Spent",
      align: "center",
      render: (record) => (
        <div>
          {getTimeFromInput(
            record?.attempts?.[0]?.total_attempt_time,
            "seconds",
          ) ?? "-"}
        </div>
      ),
    },
    {
      title: "Last Submission",
      align: "center",
      render: (record) => (
        <div>
          {record?.attempts?.[0]?.finished_at
            ? dayjs(record?.attempts?.[0]?.finished_at).format(
                EDateTime.fullDate,
              )
            : "-"}
        </div>
      ),
    },
  ];

  // Tính toán xem có nên hiển thị pagination không
  const shouldShowPagination =
    pagination.total && pagination.total > (pagination.pageSize || 10);

  return (
    <SappTable<QuizActivity, { page_index: number; page_size: number }>
      columns={columnsValue}
      data={data ?? []}
      pagination={pagination}
      setPagination={setPagination}
      handleChangeParams={handleChangeParams}
      loading={loading}
      isShowIndex
      isShowPagination={!!shouldShowPagination}
      onRow={(record: QuizActivity) => ({
        onClick: () => handleViewActivity(record),
      })}
      className="style-table-quiz cursor-pointer"
      rowClassName={(record, index) => {
        const isLastRow = data && index === data.length - 1;
        const isSinglePage = !shouldShowPagination;
        return isLastRow && isSinglePage ? "last-row-no-border" : "";
      }}
    />
  );
};

export default TableListQuizInActivity;
