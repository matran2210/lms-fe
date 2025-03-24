import LayoutFilter from '@components/layout/Filter/index'
import Search from './Search'
import { Typography } from 'antd'
import SappTable from '@components/table/SappTable'
import React, { useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import { TablePaginationConfig } from 'antd'
import { cleanParamsAPI } from 'src/utils/index'
import StudentCell from '../../pages/teachers/my-class/components/StudentCell'

const { Title } = Typography
interface IStudentData {
  id: string
  name: string
  email: string
  phone: string
  level: string
  duration: string
  progress: string
  examDate: string
}
const studentsData: IStudentData[] = [
  {
    id: 'HV-100001',
    name: 'Nguyễn Hoàng Bảo Phương',
    email: 'phuonghnb112@gmail.com',
    phone: '0345678910',
    level: 'IA',
    duration: '02/11/2024 - 28/03/2025',
    progress: '20%',
    examDate: '10/2025',
  },
  {
    id: 'HV-100002',
    name: 'Trần Minh Khang',
    email: 'minhkhang.tran@gmail.com',
    phone: '0356789123',
    level: 'IB',
    duration: '01/12/2024 - 30/04/2025',
    progress: '30%',
    examDate: '11/2025',
  },
  {
    id: 'HV-100003',
    name: 'Lê Thị Thu Hà',
    email: 'thuhale@gmail.com',
    phone: '0367891234',
    level: 'IIA',
    duration: '15/10/2024 - 15/03/2025',
    progress: '40%',
    examDate: '09/2025',
  },
  {
    id: 'HV-100004',
    name: 'Phạm Quốc Bảo',
    email: 'quocbao.pham@gmail.com',
    phone: '0378912345',
    level: 'IIB',
    duration: '10/09/2024 - 10/02/2025',
    progress: '50%',
    examDate: '08/2025',
  },
  {
    id: 'HV-100005',
    name: 'Đặng Thị Ngọc Lan',
    email: 'ngoclan.dang@gmail.com',
    phone: '0389123456',
    level: 'IA',
    duration: '05/11/2024 - 05/04/2025',
    progress: '60%',
    examDate: '12/2025',
  },
  {
    id: 'HV-100006',
    name: 'Võ Minh Tú',
    email: 'minhtu.vo@gmail.com',
    phone: '0391234567',
    level: 'IB',
    duration: '20/12/2024 - 20/05/2025',
    progress: '70%',
    examDate: '01/2026',
  },
  {
    id: 'HV-100007',
    name: 'Nguyễn Hải Nam',
    email: 'hainam.nguyen@gmail.com',
    phone: '0312345678',
    level: 'IIA',
    duration: '01/10/2024 - 01/03/2025',
    progress: '80%',
    examDate: '02/2026',
  },
  {
    id: 'HV-100008',
    name: 'Trương Mỹ Dung',
    email: 'mydung.truong@gmail.com',
    phone: '0323456789',
    level: 'IIB',
    duration: '15/09/2024 - 15/02/2025',
    progress: '90%',
    examDate: '03/2026',
  },
  {
    id: 'HV-100009',
    name: 'Hoàng Văn Hậu',
    email: 'vanhau.hoang@gmail.com',
    phone: '0334567891',
    level: 'IA',
    duration: '10/08/2024 - 10/01/2025',
    progress: '25%',
    examDate: '04/2026',
  },
  {
    id: 'HV-100010',
    name: 'Lý Bảo Châu',
    email: 'baochau.ly@gmail.com',
    phone: '0345678912',
    level: 'IB',
    duration: '05/07/2024 - 05/12/2024',
    progress: '35%',
    examDate: '05/2026',
  },
  {
    id: 'HV-100011',
    name: 'Phạm Gia Huy',
    email: 'giahuy.pham@gmail.com',
    phone: '0356789123',
    level: 'IIA',
    duration: '20/06/2024 - 20/11/2024',
    progress: '45%',
    examDate: '06/2026',
  },
  {
    id: 'HV-100012',
    name: 'Trần Thị Thanh Nhàn',
    email: 'thanhnhan.tran@gmail.com',
    phone: '0367891234',
    level: 'IIB',
    duration: '15/05/2024 - 15/10/2024',
    progress: '55%',
    examDate: '07/2026',
  },
  {
    id: 'HV-100013',
    name: 'Đoàn Minh Trí',
    email: 'minhtri.doan@gmail.com',
    phone: '0378912345',
    level: 'IA',
    duration: '10/04/2024 - 10/09/2024',
    progress: '65%',
    examDate: '08/2026',
  },
  {
    id: 'HV-100014',
    name: 'Lương Văn Kiệt',
    email: 'vankiet.luong@gmail.com',
    phone: '0389123456',
    level: 'IB',
    duration: '05/03/2024 - 05/08/2024',
    progress: '75%',
    examDate: '09/2026',
  },
  {
    id: 'HV-100015',
    name: 'Tạ Bích Ngọc',
    email: 'bichngoc.ta@gmail.com',
    phone: '0391234567',
    level: 'IIA',
    duration: '20/02/2024 - 20/07/2024',
    progress: '85%',
    examDate: '10/2026',
  },
  {
    id: 'HV-100016',
    name: 'Nguyễn Văn Dũng',
    email: 'vandung.nguyen@gmail.com',
    phone: '0312345678',
    level: 'IIB',
    duration: '01/01/2024 - 01/06/2024',
    progress: '95%',
    examDate: '11/2026',
  },
  {
    id: 'HV-100017',
    name: 'Lê Minh Khoa',
    email: 'minhkhoa.le@gmail.com',
    phone: '0323456789',
    level: 'IA',
    duration: '15/12/2023 - 15/05/2024',
    progress: '10%',
    examDate: '12/2026',
  },
  {
    id: 'HV-100018',
    name: 'Trương Quang Huy',
    email: 'quanghuy.truong@gmail.com',
    phone: '0334567891',
    level: 'IB',
    duration: '10/11/2023 - 10/04/2024',
    progress: '20%',
    examDate: '01/2027',
  },
  {
    id: 'HV-100019',
    name: 'Bùi Thanh Sơn',
    email: 'thanhnson.bui@gmail.com',
    phone: '0345678912',
    level: 'IIA',
    duration: '05/10/2023 - 05/03/2024',
    progress: '30%',
    examDate: '02/2027',
  },
  {
    id: 'HV-100020',
    name: 'Ngô Thị Hồng Nhung',
    email: 'hongnhung.ngo@gmail.com',
    phone: '0356789123',
    level: 'IIB',
    duration: '20/09/2023 - 20/02/2024',
    progress: '40%',
    examDate: '03/2027',
  },
]

export default function StudenTestResult() {
  const [selectedRowKeys, setSelectedRowKeys] = useState<
    Map<number, React.Key[]>
  >(new Map())
  const router = useRouter()

  const queryParams = {
    page_index: Number(router.query.page_index) || 1,
    page_size: Number(router.query.page_size) || 10,
    textSearch: router.query.text || '',
    sortRole: router.query.role || '',
    sortStatus: router.query.status || '',
    sortType: router.query.sortType || '',
    fromDate: router.query.fromDate
      ? new Date(router.query.fromDate as string)
      : undefined,
    toDate: router.query.toDate
      ? new Date(router.query.toDate as string)
      : undefined,
    sex: router.query.sex || '',
  }

  const filterParams = cleanParamsAPI({ ...queryParams })
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: queryParams?.page_index || 1,
    pageSize: queryParams?.page_size || 10,
    total: 10,
    showSizeChanger: true,
    showQuickJumper: true,
  })
  const selectedRowId = useMemo(
    () => [...selectedRowKeys.values()].flat(),
    [selectedRowKeys],
  )
  const columnsValue = [
    {
      title: 'ID',
      render: (record: IStudentData) => <StudentCell data={record?.id ?? ''} />,
    },
    {
      title: 'Student Name',
      render: (record: IStudentData) => (
        <StudentCell data={record?.name ?? ''} />
      ),
    },
    {
      title: 'Email',
      render: (record: IStudentData) => (
        <StudentCell data={record?.email ?? ''} />
      ),
    },
    {
      title: 'Phone',
      render: (record: IStudentData) => (
        <StudentCell data={record?.phone ?? ''} />
      ),
    },
    {
      title: 'Level',
      render: (record: IStudentData) => (
        <StudentCell data={record?.level ?? ''} />
      ),
    },
    {
      title: 'Duration',
      render: (record: IStudentData) => (
        <StudentCell data={record?.duration ?? ''} />
      ),
    },
    {
      title: 'Progress',
      render: (record: IStudentData) => (
        <StudentCell data={record?.progress ?? ''} />
      ),
    },
    {
      title: 'Exam Date',
      render: (record: IStudentData) => (
        <StudentCell data={record?.examDate ?? ''} />
      ),
    },
  ]

  return (
    <div className="w-full">
      <div className="mb-6 rounded-xl bg-white p-7">
        <LayoutFilter
          listFilter={<Search />}
          loading={false}
          onReset={() => {}}
          onSubmit={() => {}}
        />
        <Title level={5} className="mt-6 text-gray-700">
          Student List: 60 Students
        </Title>
        <SappTable
          handleChangeParams={() => {}}
          filterParams={filterParams}
          columns={columnsValue}
          fetchData={() => {}}
          data={studentsData ?? []}
          pagination={pagination}
          setPagination={() => {}}
          fetchTableData={() => {}}
          loading={false}
          showCheckbox={false}
          setSelection={setSelectedRowKeys}
          selections={selectedRowKeys}
        />
      </div>
    </div>
  )
}
