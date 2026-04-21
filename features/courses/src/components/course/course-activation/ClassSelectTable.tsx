import { IClassForActivation } from "@lms/core";
import { SAPPRadio } from "@lms/ui";
import { formatDate } from "@lms/utils";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";

export const ClassSelectTable = ({
  selectedClassId,
  setSelectedClassId,
  classes,
  isLoading
}: {
  selectedClassId: string | null;
  setSelectedClassId: (id: string) => void;
  classes?: any;
  isLoading: boolean
}) => {


  const columns: ColumnsType<IClassForActivation> = [
    {
      title: "",
      width: 48,
      render: (_, record) => (
        <SAPPRadio
          name="class-select"
          checked={record.id === selectedClassId}
          onChange={() => setSelectedClassId(record.id)}
        />
      ),
      align: "left",
    },
    {
      title: "Class code",
      dataIndex: "code",
      render: (value) => (
        <span className="font-normal text-base text-gray-900">{value || '--'}</span>
      ),
      width: 180,
      align: "left",
    },
    {
      title: "Duration",
      dataIndex: "duration",
      width: 224,
      align: "center",
      render: (_, record) => (
        <span className="font-normal text-base text-gray-900">
          {formatDate(record.started_at)} - {formatDate(record.finished_at)}
        </span>
      ),
    },
    {
      title: "Exam",
      dataIndex: "subject_name",
      width: 185,
      align: "center",
      render: (_, record) => (
        <span className="font-normal text-base text-gray-900">
          {record?.examination_subject?.examination?.name || '--'}
        </span>
      ),
    },
  ];

  return (
    <Table
      loading={isLoading}
      className="style-table-choose-class"
      columns={columns}
      dataSource={classes}
      pagination={false}
      rowKey="id"
      onRow={(record) => ({
        onClick: () => setSelectedClassId(record.id),
      })}
      rowClassName={(record) =>
        record.id === selectedClassId ? "bg-gray-50" : ""
      }
    />
  );
};
