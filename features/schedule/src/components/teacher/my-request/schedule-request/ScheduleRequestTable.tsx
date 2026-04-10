import { useFeature } from "@lms/contexts";
import {
  FilterRequestScheduleParams,
  StatusMultipleRequestScheduleParams,
  StatusRequestSchedule
} from "@lms/core";
import { ButtonPrimary, LayoutFilter } from "@lms/ui";
import { sappFormatDate } from "@lms/utils";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import ReasonModal from "./ReasonModal";
import ScheduleRequestFilter from "./ScheduleRequestFilter";
import SuccessModal from "./SuccessModal";
import TableContainer, {
  defaultOpenReasonModal,
  IOpenReasonModal,
  UpdateStatusParams,
} from "./TableContainer";

const ScheduleRequestTable = () => {
  const initialValues: FilterRequestScheduleParams = {
    search: "",
    course_category_id: "",
    status: "",
    fromDate: "",
    toDate: "",
    dateField: "",
    tab: "schedulerequest",
  };
  const { teacherApi } = useFeature();
  const { control, getValues, reset } = useForm();
  const [params, setParams] =
    useState<FilterRequestScheduleParams>(initialValues);
  const selectedActionRef = useRef<Record<string, StatusRequestSchedule>>({});
  /**
   * Ref để lưu function refetch từ TableContainer.
   * Dùng useRef thay vì state để tránh re-render không cần thiết.
   * Function này sẽ được gán giá trị thông qua callback onRefetchReady.
   */
  const refetchRef = useRef<(() => void) | null>(null);
  const [hasAction, setHasAction] = useState(false);
  const [openReasonModal, setOpenReasonModal] = useState<IOpenReasonModal>(
    defaultOpenReasonModal,
  );
  const [loading, setLoading] = useState(false);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);

  /**
   * Hàm refresh lại data từ API.
   * Gọi trực tiếp function refetch từ useSappPaging thông qua ref.
   * 
   * Lý do không dùng queryClient.invalidateQueries:
   * - Query key trong useSappPaging là: [uniqueKey, pagination.current, pagination.pageSize, params]
   * - Nếu dùng invalidateQueries với key không đầy đủ sẽ không match được query
   * - Function refetch từ useQuery đã biết chính xác query key nên luôn hoạt động đúng
   */
  const handleRefresh = () => {
    if (refetchRef.current) {
      refetchRef.current();
    }
  };

  /**
   * Hàm reset bộ lọc.
   * Reset giá trị của bộ lọc về giá trị ban đầu.
   */
  const handleResetFilter = () => {
    /**
     * Reset giá trị của bộ lọc về giá trị ban đầu.
     *
     * @param {object} initialValues - Giá trị ban đầu của bộ lọc.
     */
    reset(initialValues);

    /**
     * Cập nhật tham số của bộ lọc về giá trị ban đầu.
     *
     * @param {object} initialValues - Giá trị ban đầu của bộ lọc.
     */
    setParams(initialValues);
  };
  /**
   * Hàm xử lý khi người dùng submit bộ lọc.
   * Lấy giá trị của các trường bộ lọc và tạo tham số tìm kiếm.
   */
  const onSubmit = () => {
    /**
     * Lấy giá trị của trường date_range.
     *
     * @param {array} date_range - Mảng chứa giá trị của trường date_range.
     */
    const fromDate = getValues("date_range")?.[0] || undefined;
    const toDate = getValues("date_range")?.[1] || undefined;
    /**
     * Tạo tham số tìm kiếm.
     *
     * @param {object} searchParams - Tham số tìm kiếm.
     * @param {string} searchParams.search - Giá trị của trường tìm kiếm.
     * @param {string} searchParams.course_category_id - ID của khóa học.
     * @param {string} searchParams.status - Trạng thái của yêu cầu lịch trình.
     * @param {string} searchParams.fromDate - Ngày bắt đầu của khoảng thời gian.
     * @param {string} searchParams.toDate - Ngày kết thúc của khoảng thời gian.
     */
    const searchParams: FilterRequestScheduleParams = {
      search: getValues("search") || undefined,
      course_category_id: getValues("course_category_id")?.value || undefined,
      status: getValues("status")?.value || undefined,
      fromDate: sappFormatDate(fromDate, "YYYY-MM-DDTHH:mm:ssZ"),
      toDate: sappFormatDate(toDate, "YYYY-MM-DDTHH:mm:ssZ"),
    };
    /**
     * Cập nhật tham số tìm kiếm.
     *
     * @param {object} searchParams - Tham số tìm kiếm.
     */
    setParams(searchParams);
  };

  const handleSelectedActionChange = (
    data: Record<string, StatusRequestSchedule>,
  ) => {
    selectedActionRef.current = data;

    // chỉ update boolean → tránh re-render nặng
    setHasAction(Object.keys(data).length > 0);
  };
  const handleSubmit = () => {
    const hasRejectOrCancel = Object.values(selectedActionRef.current).some(
      (v) =>
        v === StatusRequestSchedule.REJECT ||
        v === StatusRequestSchedule.CANCEL,
    );
    if (hasRejectOrCancel) {
      setOpenReasonModal({
        open: true,
        requestId: "",
        type: StatusRequestSchedule.PENDING,
      });
    } else {
      handleUpdateStatus({
        requestId: "",
        type: StatusRequestSchedule.PENDING,
      });
    }
  };
  const handleUpdateStatus = async ({
    requestId,
    type,
    reason = "",
    callback = () => {},
  }: UpdateStatusParams) => {
    setLoading(true);
    try {
      const payload: StatusMultipleRequestScheduleParams = {
        requests: Object.entries(selectedActionRef.current).map(
          ([requestId, status]) => ({
            request_id: requestId,
            status,
            ...(status === StatusRequestSchedule.REJECT ||
            status === StatusRequestSchedule.CANCEL
              ? { reason }
              : {}),
          }),
        ),
      };
      console.log("payload", payload);
      await teacherApi!.updateMultipleStatusRequestSchedules(payload);
      console.log("updateMultipleStatusRequestSchedules success");
      callback();
      setOpenSuccessModal(true);
      selectedActionRef.current = {};
      setHasAction(false);
      setLoading(false);
      handleRefresh();
    } catch (error) {
      // handle error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <LayoutFilter
        className="py-6"
        listFilter={<ScheduleRequestFilter control={control} />}
        onReset={handleResetFilter}
        onSubmit={onSubmit}
        layoutAction={
          hasAction ? (
            <ButtonPrimary
              title="Save"
              className="font-semibold"
              onClick={handleSubmit}
              loading={loading}
            />
          ) : undefined
        }
      />
      <TableContainer
        params={params}
        onSelectedActionChange={handleSelectedActionChange}
        /**
         * Callback để nhận function refetch từ TableContainer.
         * Khi TableContainer mount và có refetch function từ useSappPaging,
         * nó sẽ gọi callback này để truyền refetch function lên parent component.
         * Parent component lưu function này vào refetchRef để dùng khi cần refresh data.
         */
        onRefetchReady={(refetch) => {
          refetchRef.current = refetch;
        }}
      />
      {openReasonModal.open && (
        <ReasonModal
          open={openReasonModal}
          setOpen={setOpenReasonModal}
          setOpenSuccessModal={setOpenSuccessModal}
          handleUpdateStatus={handleUpdateStatus}
        />
      )}
      {openSuccessModal && (
        <SuccessModal open={openSuccessModal} setOpen={setOpenSuccessModal} />
      )}
    </div>
  );
};

export default ScheduleRequestTable;
