import ClassResourceTeacherFilter from '@components/teacher/components/ClassResourceTeacherFilter'
import NameActionCell from '@components/teacher/components/NameActionCell'
import NameNoActionCell from '@components/teacher/components/NameNoActionCell'
import StudentsTestResultFilter from '@components/teacher/components/StudentsTestResultFilter'
import { DownloadIcon } from '@lms/assets'
import { ClassKey, DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE, IClassResource, IListClassResourceParams } from '@lms/core'
import { useSappPaging, useUserRole } from '@lms/hooks'
import { ActionCellV2, LayoutFilter, SappTable } from '@lms/ui'
import { formatDate } from '@lms/utils'
import { ClassAPI } from '@pages/api/class'
import { UploadAPI } from '@pages/api/upload'
import clsx from 'clsx'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

interface FilterParams {
  quiz_name?: string
  grading_method?: string
  quiz_type?: string
}

const initialValues: FilterParams = {
  quiz_name: undefined,
  quiz_type: undefined,
  grading_method: undefined,
}

export default function ClassResourceTeacher() {
  const router = useRouter()
  const { control, reset, getValues } = useForm()
  const [params, setParams] = useState<IListClassResourceParams>({
    page_size: DEFAULT_PAGE_SIZE,
    page_index: DEFAULT_PAGE_NUMBER,
  })

  const { data, pagination, isLoading, handleChangeParams, setPagination } =
    useSappPaging({
      uniqueKey: ClassKey.ClassResource,
      queryFn: () =>
        ClassAPI.getClassResource(router.query.id as string, params),
      params,
    })

    const { isTeacher } = useUserRole()

  const handleResetFilter = () => {
    reset({ search_key: '', suffix_types: '' })
    setParams({
      page_size: DEFAULT_PAGE_SIZE,
    page_index: DEFAULT_PAGE_NUMBER,
    })
  }

  const onSubmit = () => {
    setParams( (prev) => ({
      ...prev,
      search_key: getValues('search_key') || undefined,
      suffix_types: getValues('suffix_types')?.value || undefined,
    }))
  }

    const canDownload = (record: IClassResource, isTeacher: boolean) => {
    const perms = record?.class_resource_permissions

    if (!perms) return false

    return isTeacher
      ? perms.teacher === 'DOWNLOAD'
      : perms.student === 'DOWNLOAD'
  }

  const columnsValue = [
    {
      title: 'File name',
      render: (record: IClassResource) => (
        <NameActionCell
          dataColumn={record?.name}
        />
      ),
      onCell: () => ({
        style: { cursor: 'pointer' },
      }),
    },
    {
      title: 'Type',
      render: (record: IClassResource) => (
        <NameNoActionCell dataColumn={record?.suffix_type} />
      ),
    },
    {
      title: 'Owner',
      render: (record: IClassResource) => (
        <NameNoActionCell dataColumn={record?.created_by_staff?.detail?.full_name} />
      ),
    },
    {
      title: 'Date',
      render: (record: IClassResource) => (
         <>
          {record?.created_at && (
            <div>Created: {formatDate(record?.created_at, 'DD-MM-YYYY HH:mm')}</div>
          )}
          {record?.updated_at && (
            <div>Updated: {formatDate(record?.updated_at, 'DD-MM-YYYY HH:mm')}</div>
          )}
        </>
      ),
    },
    {
      title: '',
     render: (record: IClassResource) => {
        const allowDownload = canDownload(record, isTeacher)
        return (
          <div
            className={clsx('flex justify-end', {
              'pointer-events-none opacity-40': !allowDownload,
            })}
          >
            <ActionCellV2
              className=""
              listAction={[
                {
                  icon: <DownloadIcon className="h-5 w-5" />,
                  nameAction: 'Download',
                  action: () => download(record.name, record.file_key),
                },
              ]}
            />
          </div>
        )
      },
    },
  ]

    const download = async (name: string, file_key: string) => {
      await UploadAPI.downloadFile({
        files: [
          {
            name: name,
            file_key: file_key,
          },
        ],
      })
    }
  

  return (
    <div>
      <LayoutFilter
        listFilter={<ClassResourceTeacherFilter control={control} />}
        loading={isLoading}
        onReset={handleResetFilter}
        onSubmit={onSubmit}
      />
      <SappTable
        handleChangeParams={handleChangeParams}
        columns={columnsValue}
        data={data?.data ?? []}
        pagination={pagination}
        setPagination={setPagination}
        loading={isLoading}
        titleTable={{
          title: `Class Resource List: ${data?.metadata?.total_records ?? 0}`,
          isShowTitle: true,
        }}
        isShowIndex
      />
    </div>
  )
}
