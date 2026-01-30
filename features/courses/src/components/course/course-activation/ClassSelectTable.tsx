import { useFeature } from "@lms/contexts";
import { SAPPRadio } from "@lms/ui";
import { formatDate } from "@lms/utils";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useQuery } from "react-query";

type ClassItem = {
  id: string;
  finished_at: string;
  code: string;
  name: string;
  examination_subject: {
    id: string;
    examination: {
      id: string;
      name: string;
    };
  };
};
export const ClassSelectTable = ({
  courseId,
  selectedClassId,
  setSelectedClassId,
}: {
  courseId: string;
  selectedClassId: string | null;
  setSelectedClassId: (id: string) => void;
}) => {
  const { courseActivationAPI } = useFeature();
  const { data, isLoading } = useQuery({
    queryKey: ["class-for-activate-subject", courseId],
    queryFn: () =>
      courseActivationAPI.getSubjectClassForActivateSubject(courseId),
    enabled: !!courseId,
    retry: false,
  });
  const classes = data?.data;

  const mergedClasses = [
    classes?.class_suggest_on_going,
    classes?.class_suggest_upcoming,
  ].filter(Boolean);

  const columns: ColumnsType<ClassItem> = [
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
        <span className="font-normal text-base text-gray-900">{value || '_'}</span>
      ),
      width: 180,
      align: "left",
    },
    {
      title: "Duration",
      dataIndex: "finished_at",
      width: 224,
      align: "center",
      render: (value) => (
        <span className="font-normal text-base text-gray-900">
          {formatDate(value)}
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
          {record?.examination_subject?.examination?.name || '_'}
        </span>
      ),
    },
  ];

  return (
    <Table
      loading={isLoading}
      className="style-table-choose-class"
      columns={columns}
      dataSource={mergedClasses}
      pagination={false}
      rowKey="key"
      onRow={(record) => ({
        onClick: () => setSelectedClassId(record.key),
      })}
      rowClassName={(record) =>
        record.key === selectedClassId ? "bg-gray-50" : ""
      }
    />
  );
};
