import { confirmDialog, useFeature, useRequestContext } from "@lms/contexts";
import {
  CONFIRM_CANCEL,
  CONFIRM_DELETE,
  E_REQUEST_STATUS,
  E_REQUEST_TYPE,
  IRequest,
} from "@lms/core";
import { SAPPDropdownV2 } from "@lms/ui";
import toast from "react-hot-toast";

interface Iprops {
  item: IRequest;
  reloadPage: () => void;
}

const RequestActionCell = ({ item, reloadPage }: Iprops) => {
  const { requestApi, myRequestApi, pathname, dispatch, router } = useFeature();
  const { setIsOpenViewModal, setOpenAddModal, setIsReFetch } =
    useRequestContext();
  const handleDelete = () => {
    dispatch?.(
      confirmDialog.open({ message: CONFIRM_DELETE, onConfirm: onDelete }),
    );
  };

  const onDelete = async () => {
    try {
      const res = await requestApi?.deleteRequest(item.id);
      if (res?.success) {
        reloadPage();
        toast.success("Delete request successfully");
        setIsReFetch(true);
      }
    } catch (error) {
      // Handled by axios interceptor
    }
  };

  const handleCancel = () => {
    dispatch?.(
      confirmDialog.open({ message: CONFIRM_CANCEL, onConfirm: onCancel }),
    );
  };

  const onCancel = async () => {
    try {
      let res;
      switch (item.type) {
        case E_REQUEST_TYPE.TEACHER_SCHEDULE_BUSY:
          res = await myRequestApi?.editBusySchedule(item.id, {
            status: E_REQUEST_STATUS.CANCEL,
          });

          break;
        case E_REQUEST_TYPE.TEACHER_WEEKLY_NORMS:
          res = await myRequestApi?.editWeeklyNorm(item.id, {
            status: E_REQUEST_STATUS.CANCEL,
          });
          break;
        case E_REQUEST_TYPE.TEACHER_SCHEDULE_TIME_OFF:
          res = await myRequestApi?.editTimeoffRequest(item.id, {
            status: E_REQUEST_STATUS.CANCEL,
            scheduleAdjustments: item.teacher_schedules.map((item) => ({
              id: item.id,
              reason: item.request_reason || "",
            })),
          });
          break;
        default:
          return;
      }
      if (res?.success) {
        toast.success("Cancel request successfully");
        setIsReFetch(true);
      }
    } catch (error: any) {
      if (error.response.data.error.code == "400|50001") {
        toast.error("All class schedules have already assigned!");
      }
    }
  };
  const handleRedirect = () => {
    router.push(`${pathname}?id=${item.id}`);
  };
  const hanldeView = () => {
    handleRedirect();
    setIsOpenViewModal(true);
  };

  const handleEdit = () => {
    handleRedirect();
    setOpenAddModal(true);
  };

  return (
    <SAPPDropdownV2
      actions={[
        { label: "View", onClick: hanldeView, show: true },
        {
          label: "Edit",
          onClick: handleEdit,
          show: item.status === E_REQUEST_STATUS.PENDING,
        },
        {
          label: "Cancel",
          onClick: handleCancel,
          show: item.status === E_REQUEST_STATUS.APPROVED,
        },
        {
          label: "Delete",
          onClick: handleDelete,
          show: item.status === E_REQUEST_STATUS.PENDING,
        },
      ]}
    />
  );
};

export default RequestActionCell;
