import {
  FilterRequestScheduleParams,
  StatusMultipleRequestScheduleParams,
  StatusRequestSchedule,
  TeacherKey,
} from "@lms/core";
import { ButtonPrimary, LayoutFilter } from "@lms/ui";
import { sappFormatDate } from "@lms/utils";
import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import ScheduleRequestFilter from "./ScheduleRequestFilter";
import TableContainer, {
  defaultOpenReasonModal,
  IOpenReasonModal,
  UpdateStatusParams,
} from "./TableContainer";
import ReasonModal from "./ReasonModal";
import SuccessModal from "./SuccessModal";
import { useFeature } from "@lms/contexts";
import { useQueryClient } from "react-query";

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
  const [hasAction, setHasAction] = useState(false);
  const [openReasonModal, setOpenReasonModal] = useState<IOpenReasonModal>(
    defaultOpenReasonModal,
  );
  const [loading, setLoading] = useState(false);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const queryClient = useQueryClient();

  const handleRefresh = () => {
    queryClient.invalidateQueries({
      queryKey: [TeacherKey.ScheduleRequest],
    });
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
