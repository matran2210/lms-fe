import {
  DEFAULT_PAGE_NUMBER,
  DEFAULT_PAGE_SIZE,
  StatusRequestSchedule,
  TeacherKey,
} from "@lms/core";
import { SappActionCell, SappTable, TooltipParagraph } from "@lms/ui";
import { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";

import {
  FilterRequestScheduleParams,
  IScheduleRequestItem,
  StatusRequestScheduleParams,
} from "@lms/core";
import { useSappPaging } from "@lms/hooks";
import {
  buildQueryString,
  convertSlugToTitle,
  convertSnakeCaseToHumanReadable,
  formatDateFromUTC,
  groupACCABySubjectAndClass,
} from "@lms/utils";
import DetailRequestModal from "./DetailRequestModal";
import ReasonModal from "./ReasonModal";
import StatusItem from "./StatusItem";
import SuccessModal from "./SuccessModal";
import TableCell from "./TableCell";
import { useFeature } from "@lms/contexts";
import { Checkbox } from "antd";

export const statusColor = (data: IScheduleRequestItem) => {
  switch (data?.status) {
    case StatusRequestSchedule.PENDING:
      return "bg-[#F897070D] text-warning";
    case StatusRequestSchedule.APPROVED:
      return "bg-[#07AF170D] text-[#07af17]";
    case StatusRequestSchedule.REJECT:
    case StatusRequestSchedule.CANCEL:
      return "bg-[#F019190D] text-[#f01919]";
    default:
      return "";
  }
};
export const defaultOpenReasonModal: IOpenReasonModal = {
  type: undefined,
  open: false,
  requestId: "",
};
export interface UpdateStatusParams {
  requestId: string;
  type: StatusRequestSchedule;
  reason?: string;
  callback?: () => void;
  request_ids?: string[];
}
export interface IOpenReasonModal {
  requestId: string | undefined;
  type: StatusRequestSchedule | undefined;
  open: boolean;
}
interface IProps {
  params: FilterRequestScheduleParams;
  onSelectedActionChange?: (
    data: Record<string, StatusRequestSchedule>,
  ) => void;
  /**
   * Callback để expose function refetch ra ngoài parent component.
   * Parent component có thể dùng function này để refresh data khi cần thiết
   * (ví dụ: sau khi update status thành công).
   * 
   * @param refetch - Function refetch từ useSappPaging hook
   */
  onRefetchReady?: (refetch: () => void) => void;
}
export default function TableContainer({
  params,
  onSelectedActionChange,
  onRefetchReady,
}: IProps) {
  const { teacherApi, router, pathname, query } = useFeature();
  const [openDetail, setOpenDetail] = useState(false);
  const [openReasonModal, setOpenReasonModal] = useState<IOpenReasonModal>(
    defaultOpenReasonModal,
  );
  const [openSuccessModal, setOpenSuccessModal] = useState(false);

  const [selectedRequest, setSelectedRequest] = useState<
    IScheduleRequestItem | undefined
  >();
  const {
    data,
    pagination,
    isLoading,
    handleChangeParams,
    setPagination,
    refetch,
    isFetching,
  } = useSappPaging({
    uniqueKey: TeacherKey.ScheduleRequest,
    queryFn: () =>
      teacherApi!.getListRequestSchedule({
        page_index: pagination.current ?? DEFAULT_PAGE_NUMBER,
        page_size: pagination.pageSize ?? DEFAULT_PAGE_SIZE,
        ...params,
      }),
    params,
  });

  useEffect(() => {
    router.replace(
      `${pathname}?${buildQueryString({
        ...query,
        page_index: pagination.current,
        page_size: pagination.pageSize,
        ...params,
      })}`,
    );
  }, [pagination, params]);

  const Action = (data: IScheduleRequestItem) => {
    setOpenDetail(true);
    setSelectedRequest(data);
  };
  const [selectedAction, setSelectedAction] = useState<
    Record<string, StatusRequestSchedule>
  >({});
  const handleSelectAction = (
    record: IScheduleRequestItem,
    type: StatusRequestSchedule,
  ) => {
    setSelectedAction((prev) => {
      const current = prev[record.id];

      // 👇 nếu click lại cùng value → xóa key
      if (current === type) {
        const newState = { ...prev };
        delete newState[record.id];
        return newState;
      }

      // 👇 nếu chọn mới → set lại
      return {
        ...prev,
        [record.id]: type,
      };
    });
  };

  useEffect(() => {
    onSelectedActionChange?.(selectedAction);
  }, [selectedAction]);

  /**
   * Effect để truyền refetch function lên parent component.
   * Chạy khi refetch function từ useSappPaging có sẵn.
   * 
   * Flow:
   * 1. useSappPaging hook trả về refetch function
   * 2. Effect này bắt được refetch function
   * 3. Gọi callback onRefetchReady để truyền refetch lên parent (ScheduleRequestTable)
   * 4. Parent lưu refetch vào ref để dùng khi cần
   */
  useEffect(() => {
    if (refetch) {
      onRefetchReady?.(refetch);
    }
  }, [refetch, onRefetchReady]);

  const columnsValue: ColumnsType<IScheduleRequestItem> = [
    {
      title: "#",
      render: (_, record: IScheduleRequestItem, index: number) => (
        <TableCell
          data={
            index +
            1 +
            ((pagination?.current || 1) - DEFAULT_PAGE_NUMBER) *
              (pagination?.pageSize || DEFAULT_PAGE_SIZE)
          }
          className="!text-zinc-400"
        />
      ),
    },
    {
      title: "Class code",
      render: (_, record: IScheduleRequestItem) => (
        <TableCell data={record?.class?.code} className="!text-zinc-400" />
      ),
    },
    {
      title: "Program",
      render: (_, record: IScheduleRequestItem) => (
        <TableCell
          data={record?.subject?.course_category?.name}
          className="cursor-pointer hover:underline"
          onClick={() => Action(record)}
        />
      ),
    },
    {
      title: 'Subject',
      render: (_, record: IScheduleRequestItem) => {
        const isACCAProgram = record?.subject?.course_category?.name === 'ACCA'
        const subjectName = record?.subject?.name
        return (
          <TableCell
            className="max-w-36 overflow-hidden text-ellipsis whitespace-nowrap"
            data={
              <TooltipParagraph className="inline-block w-full overflow-hidden text-ellipsis whitespace-nowrap">
                {isACCAProgram ? subjectName : `${convertSlugToTitle(record?.subject?.code)}_${record?.course_section?.name}`}
              </TooltipParagraph>
            }
          />
        )
      }
    },
    {
      title: "Construction mode",
      render: (_, record: IScheduleRequestItem) => (
        <TableCell data={convertSnakeCaseToHumanReadable(record?.mode)} />
      ),
    },
    {
      title: "Start Date - End Date",
      render: (_, record: IScheduleRequestItem) => (
        <TableCell
          data={`${record?.schedule_time.start_date ? formatDateFromUTC(record?.schedule_time.start_date) : "-"} - ${
            record?.schedule_time.end_date
              ? formatDateFromUTC(record?.schedule_time.end_date)
              : "-"
          }`}
        />
      ),
    },
    {
      title: "Sent Date",
      render: (_, record: IScheduleRequestItem) => (
        <TableCell
          data={formatDateFromUTC(record?.created_at)}
          className="!text-zinc-400"
        />
      ),
    },
    {
      title: "CX Admin",
      render: (_, record: IScheduleRequestItem) => (
        <TableCell
          data={record?.staff_detail?.full_name}
          className="!text-zinc-400"
        />
      ),
    },
    {
      title: "Update Date",
      render: (_, record: IScheduleRequestItem) => (
        <TableCell
          data={formatDateFromUTC(record?.updated_at)}
          className="!text-zinc-400"
        />
      ),
    },
    {
      title: "Status",
      render: (_, record: IScheduleRequestItem) => {
        return (
          <TableCell
            data={
              <StatusItem
                status={record?.status?.toLowerCase()}
                className={statusColor(record)}
              />
            }
          />
        );
      },
    },
    {
      title: "Accept",
      render: (_, record: IScheduleRequestItem) => {
        if (record?.status === StatusRequestSchedule.PENDING) {
          return (
            <Checkbox
              checked={
                selectedAction[record.id] === StatusRequestSchedule.APPROVED
              }
              onChange={(e) => {
                handleSelectAction(record, StatusRequestSchedule.APPROVED);
              }}
            />
          );
        }
        return "-";
      },
    },
    {
      title: "Reject",
      render: (_, record: IScheduleRequestItem) => {
        if (record?.status === StatusRequestSchedule.PENDING) {
          return (
            <Checkbox
              checked={
                selectedAction[record.id] === StatusRequestSchedule.REJECT
              }
              onChange={(e) => {
                handleSelectAction(record, StatusRequestSchedule.REJECT);
              }}
            />
          );
        }
        return "-";
      },
    },
    {
      title: "Cancel",
      render: (_, record: IScheduleRequestItem) => {
        if (record?.status === StatusRequestSchedule.APPROVED) {
          return (
            <Checkbox
              checked={
                selectedAction[record.id] === StatusRequestSchedule.CANCEL
              }
              onChange={(e) => {
                handleSelectAction(record, StatusRequestSchedule.CANCEL);
              }}
            />
          );
        }
        return "-";
      },
    },
    {
      title: "",
      fixed: "right",
      render: (_, record: IScheduleRequestItem) => (
        <SappActionCell handleClickView={() => Action(record)} />
      ),
    },
  ];
  /**
   * Hàm cập nhật trạng thái yêu cầu lịch trình.
   * Gửi yêu cầu lên server để cập nhật trạng thái yêu cầu lịch trình.
   *
   * @param {object} params - Thông tin cập nhật trạng thái yêu cầu lịch trình.
   * @param {string} params.requestId - ID của yêu cầu lịch trình cần cập nhật trạng thái.
   * @param {string} params.type - Trạng thái yêu cầu lịch trình cần cập nhật.
   * @param {string} [params.reason] - Lý do cập nhật trạng thái yêu cầu lịch trình (không bắt buộc).
   * @param {function} [params.callback] - Hàm callback sẽ được gọi sau khi cập nhật trạng thái thành công (không bắt buộc).
   */
  const handleUpdateStatus = async ({
    request_ids,
    requestId,
    type,
    reason = "",
    callback = () => {},
  }: UpdateStatusParams) => {
    try {
      /**
       * Tạo payload để gửi yêu cầu lên server.
       *
       * @param {object} payload - Thông tin cập nhật trạng thái yêu cầu lịch trình.
       * @param {string} payload.reason - Lý do cập nhật trạng thái yêu cầu lịch trình.
       * @param {string} payload.status - Trạng thái yêu cầu lịch trình cần cập nhật.
       */
      const payload: StatusRequestScheduleParams = {
        reason: reason,
        status: type,
        ...(request_ids && { request_ids: request_ids }),
      }
      /**
       * Gửi yêu cầu lên server để cập nhật trạng thái yêu cầu lịch trình.
       *
       * @param {string} requestId - ID của yêu cầu lịch trình cần cập nhật trạng thái.
       * @param {object} payload - Thông tin cập nhật trạng thái yêu cầu lịch trình.
       */
      await teacherApi!.updateStatusRequestSchedule(requestId, payload);
      /**
       * Gọi hàm callback sau khi cập nhật trạng thái thành công.
       */
      callback();
      /**
       * Mở modal thành công sau khi cập nhật trạng thái thành công.
       */
      setOpenSuccessModal(true);
      /**
       * Refetch dữ liệu sau khi cập nhật trạng thái thành công.
       */
      refetch();
    } finally {
    }
  };

  useEffect(() => {
    if (query.showRequestDetail === "true") {
      setOpenDetail(true);
    }
  }, []);

  return (
    <>
      <SappTable
        handleChangeParams={handleChangeParams}
        columns={columnsValue}
        data={groupACCABySubjectAndClass(data?.data?.data ?? [])}
        pagination={pagination}
        setPagination={setPagination}
        loading={isLoading}
        emptyText="No matching records found"
      />

      {(selectedRequest || query.request_id) && (
        <DetailRequestModal
          open={openDetail}
          setOpen={setOpenDetail}
          selectedRequest={selectedRequest}
          setOpenReasonModal={setOpenReasonModal}
          handleUpdateStatus={handleUpdateStatus}
        />
      )}

      {openReasonModal && openReasonModal.requestId && openReasonModal.type && (
        <ReasonModal
          open={openReasonModal}
          setOpen={setOpenReasonModal}
          selectedRequest={selectedRequest}
          setOpenSuccessModal={setOpenSuccessModal}
          handleUpdateStatus={handleUpdateStatus}
        />
      )}

      {openSuccessModal && (
        <SuccessModal open={openSuccessModal} setOpen={setOpenSuccessModal} />
      )}
    </>
  );
}
