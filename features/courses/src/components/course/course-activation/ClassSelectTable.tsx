import { SAPPRadio } from "@lms/ui";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useState } from "react";

type ClassItem = {
  key: string;
  classCode: string;
  duration: string;
  exam: string;
};

const dataSource: ClassItem[] = [
  {
    key: "F7.01",
    classCode: "F7.01",
    duration: "24/12/2025 - 24/02/2025",
    exam: "Kỳ tháng 3/2026",
  },
  {
    key: "F7.0101",
    classCode: "F7.0101",
    duration: "24/12/2025 - 24/02/2025",
    exam: "Kỳ tháng 6/2026",
  },
];

export const ClassSelectTable = () => {
  const [selectedKey, setSelectedKey] = useState<string>("F7.01");

  const columns: ColumnsType<ClassItem> = [
    {
      title: "",
      width: 48,
      render: (_, record) => (
        <SAPPRadio
          name="class-select"
          checked={record.key === selectedKey}
          onChange={() => setSelectedKey(record.key)}
        />
      ),
      align: "left",
    },
    {
      title: "Class code",
      dataIndex: "classCode",
      render: (value) => (
        <span className="font-normal text-base text-gray-900">{value}</span>
      ),
      width: 180,
      align: "left",
    },
    {
      title: "Duration",
      dataIndex: "duration",
      width: 224,
      align: "center",
      render: (value) => (
        <span className="font-normal text-base text-gray-900">{value}</span>
      ),
    },
    {
      title: "Exam",
      dataIndex: "exam",
      width: 185,
      align: "center",
      render: (value) => (
        <span className="font-normal text-base text-gray-900">{value}</span>
      ),
    },
  ];

  return (
    <Table
      className="style-table-choose-class"
      columns={columns}
      dataSource={dataSource}
      pagination={false}
      rowKey="key"
      onRow={(record) => ({
        onClick: () => setSelectedKey(record.key),
      })}
      rowClassName={(record) =>
        record.key === selectedKey ? "bg-gray-50" : ""
      }
    />
  );
};
