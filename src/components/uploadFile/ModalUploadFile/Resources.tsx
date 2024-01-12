import { Select } from 'antd'
import { format } from 'date-fns'
import { debounce } from 'lodash'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { ResourcesAPI } from 'src/apis/resources'
import { FORMAT_DATETIME } from 'src/constants'
import useChecked from 'src/hooks/use-checked'
import useCourseFilter from 'src/hooks/use-course-filter'
import { IMeta } from 'src/type'
import { displayBytes, formatDateToISOString } from 'src/utils'
import SappTable from '../../SappTable'
import SAPPCheckbox from '../../checkbox/SAPPCheckbox'
import HookFormDateTime from '../../datetime/HookFormDateTime'
import PagiantionSAPP from '../../pagination/PagiantionSAPP'
import SAPPRadio from '../../radiobutton/SAPPRadio'
import HookFormSelectAntd from '../../select/HookFormSelectAntd'
import HookFormTextField from '../../textfield/HookFormTextField'
import { IResource, UPLOAD_TYPE } from './UploadFileInterface'
const { Option } = Select
const headers = [
  {
    label: 'File',
    key: 'file',
    className: 'min-w-250px',
  },
  {
    label: 'Size',
    key: 'size',
    className: 'min-w-150px mw-200px w-200px',
  },
  {
    label: 'Created At',
    key: 'created_at',
    className: 'min-w-150px mw-200px w-150px',
  },
]

type Props = {
  setResource: (e: {
    listDataChecked: IResource[] | IResource
    unCheckedListData?: IResource[]
  }) => void
  isMultiple?: boolean
  fileChecked?: any
  fileType: keyof typeof UPLOAD_TYPE
  getDefaultChecked?: (resources: IResource[]) => IResource[]
}

interface ISearchForm {
  page_index?: number
  page_size?: number
  search_key?: string
  course?: string
  part?: string
  chapter?: string
  unit?: string
  activity?: string
  sortType?: string
  fromDate?: string | null
  toDate?: string | null
  suffix_types?: string
}

export const FILTER_RESOURCE_SORT_BY = [
  {
    label: 'Document',
    value: 'Document',
  },
  {
    label: 'Image',
    value: 'Image',
  },
  {
    label: 'Video',
    value: 'Video',
  },
]

// const children = {
//   course: ['part', 'chapter', 'unit', 'activity'],
//   part: ['chapter', 'unit', 'activity'],
//   chapter: ['unit', 'activity'],
//   unit: ['activity'],
// }
/**
 * @description Tab chọn recourse của upload file
 *
 * @param {Props} {setResource, isMultiple, fileChecked, fileType}
 * @return {*}
 */
const Resources = ({
  setResource,
  isMultiple,
  fileChecked,
  getDefaultChecked,
  fileType,
}: Props) => {
  const [loading, setLoading] = useState(false)
  const [resources, setResources] = useState<IResource[]>([])
  const [meta, setMeta] = useState<IMeta>()
  const {
    checkedList,
    toggleCheck,
    toggleCheckAll,
    isCheckedAll,
    listDataChecked,
    setDefaultChecked,
    listDataUnChecked,
  } = useChecked<IResource>(resources)

  const searchValues = useRef<ISearchForm>({ page_index: 1, page_size: 10 })

  const { control, setValue } = useForm<ISearchForm>({
    defaultValues: {
      sortType:
        FILTER_RESOURCE_SORT_BY.find((e) => e.label.toUpperCase() === fileType)
          ?.value || '',
    },
  })

  useEffect(() => {
    getResources(searchValues.current)
    getCourses()
  }, [])

  useLayoutEffect(() => {
    if (listDataChecked) {
      setResource({ listDataChecked, unCheckedListData: listDataUnChecked })
    } else {
      setResource({ listDataChecked: listDataChecked?.[0] })
    }
  }, [listDataChecked, listDataUnChecked])

  useEffect(() => {
    if (fileChecked) {
      setDefaultChecked(fileChecked)
    }
  }, [fileChecked])
  /**
   * @description Lấy resource cho table list
   *
   * @param {{
   *     search_key?: string
   *     currenPage?: number
   *     size?: number
   *     fromDate?: string
   *     toDate?: string
   *     dateField?: string
   *     course_section_id?: string
   *   }} params
   */
  const getResources = async (params: ISearchForm) => {
    try {
      setLoading(true)
      const response = await ResourcesAPI.getList({
        ...params,
        ...(fileType !== 'ALL'
          ? { suffix_types: UPLOAD_TYPE[fileType].suffixType }
          : {
              suffix_types:
                UPLOAD_TYPE[params.suffix_types?.toLocaleUpperCase() || 'ALL']
                  ?.suffixType || undefined,
            }),
      })
      if (response?.data) {
        setResources(response.data.resources)
        if (getDefaultChecked) {
          // Tạo một object có key là các id của listDataChecked
          const listDataCheckedObject = listDataChecked.reduce(
            (obj, item) => {
              if (item.id) {
                obj[item.id] = true
              }
              return obj
            },
            {} as { [key: string]: boolean },
          )

          const listDataUnCheckedObject = listDataUnChecked.reduce(
            (obj, item) => {
              if (item.id) {
                obj[item.id] = true
              }
              return obj
            },
            {} as { [key: string]: boolean },
          )
          // Lọc ra những item trong getDefaultChecked(response.data.resources) có id không tồn tại trong object trên
          const filteredGetDefaultChecked = getDefaultChecked(
            response.data.resources,
          ).filter((item) => {
            return !listDataCheckedObject[item.id]
          })
          // Nối hai mảng lại thành defaultChecked
          const defaultChecked = listDataChecked
            .concat(filteredGetDefaultChecked)
            .filter((item) => {
              return !listDataUnCheckedObject[item.id]
            })
          setDefaultChecked(defaultChecked)
        }
        setMeta(response.data.meta)
      }
    } finally {
      setLoading(false)
    }
  }
  /**
   * @description filer table recourse khi có phân trang, search, filter
   *
   * @param {{
   *     search_key?: string
   *     page_index?: number
   *     page_size?: number
   *     fromDate?: string
   *     toDate?: string
   *     dateField?: string
   *     course_section_id?: string
   *   }} {
   *     search_key,
   *     page_index,
   *     page_size,
   *     fromDate,
   *     toDate,
   *     dateField = 'created_at',
   *     course_section_id,
   *   }
   */
  const handleFilter = ({
    search_key,
    page_index,
    page_size,
    fromDate,
    toDate,
    dateField = 'created_at',
    suffix_types,
    course_section_id,
  }: {
    search_key?: string
    page_index?: number
    page_size?: number
    fromDate?: string | null
    toDate?: string | null
    dateField?: string
    course_section_id?: string
    suffix_types?: string
  }) => {
    searchValues.current = {
      ...searchValues.current,
      page_index: 1,
      ...(search_key !== undefined && { search_key }),
      ...(page_index !== undefined && { page_index }),
      ...(page_size !== undefined && { page_size }),
      ...(fromDate !== undefined && { fromDate }),
      ...(toDate !== undefined && { toDate }),
      ...(dateField !== undefined && { dateField }),
      ...(course_section_id !== undefined && { course_section_id }),
      ...(suffix_types !== undefined && { suffix_types }),
    }
    getResources(searchValues.current)
  }
  const debouncedHandleFilter = debounce(handleFilter, 500)
  const {
    listCourse,
    setListCourse,
    getListSort,
    debouncedGetListSort,
    clearChildren,
    getCourses,
    debouncedGetCourses,
  } = useCourseFilter(setValue, handleFilter)

  return (
    <Container fluid>
      <Row className="row-gap-3">
        {/* begin:: filter */}
        {/* <div className='col-sm-6 px-0'> */}
        <Col xl={4} sm={4}>
          <div className="card-title justify-content-center mb-0 mx-0">
            <HookFormTextField
              control={control}
              name="search_key"
              placeholder="Search"
              defaultValue={''}
              className="sapp-h-45px"
              onChange={(e) => {
                debouncedHandleFilter({ search_key: e.target.value || '' })
              }}
            />
          </div>
        </Col>
        <Col xl={2} sm={4}>
          <HookFormSelectAntd
            name="course"
            placeholder="Course"
            control={control}
            size="large"
            className="sapp-h-45px"
            showSearch
            onSearch={async (e) => {
              debouncedGetCourses(e)
              return
            }}
            onChange={(e: any) => {
              if (e === undefined) {
                return
              }
              getListSort({ parentId: e, type: 'part', parentType: 'course' })
            }}
            loading={listCourse.course.loading}
            allowClear
            onClear={() => {
              setListCourse(clearChildren('course'))
            }}
          >
            {listCourse.course.data?.map((e) => {
              return (
                <Option key={e.id} value={e.id}>
                  {e.name}
                </Option>
              )
            })}
          </HookFormSelectAntd>
        </Col>
        <Col xl={2} sm={4}>
          <HookFormSelectAntd
            name="part"
            placeholder="Part"
            control={control}
            size="large"
            showSearch
            className="sapp-h-45px"
            loading={listCourse.part.loading}
            onSearch={async (e) => {
              debouncedGetListSort({
                type: 'part',
                name: e,
                parentId: listCourse.course.id,
                parentType: 'course',
              })
              return
            }}
            onChange={(e: any) => {
              if (e === undefined) {
                return
              }
              getListSort({ parentId: e, type: 'chapter', parentType: 'part' })
            }}
            allowClear
            onClear={() => {
              setListCourse(clearChildren('part'))
            }}
          >
            {listCourse.part.data?.map((e) => {
              return (
                <Option key={e.id} value={e.id}>
                  {e.name}
                </Option>
              )
            })}
          </HookFormSelectAntd>
        </Col>
        <Col xl={2} sm={4}>
          <HookFormSelectAntd
            name="chapter"
            placeholder="Chapter"
            control={control}
            size="large"
            className="sapp-h-45px"
            showSearch
            loading={listCourse.chapter.loading}
            onSearch={async (e) => {
              debouncedGetListSort({
                type: 'chapter',
                name: e,
                parentId: listCourse.part.id,
                parentType: 'part',
              })
              return
            }}
            onChange={(e: any) => {
              if (e === undefined) {
                return
              }
              getListSort({ parentId: e, type: 'unit', parentType: 'chapter' })
            }}
            allowClear
            onClear={() => {
              setListCourse(clearChildren('chapter'))
            }}
          >
            {listCourse.chapter.data?.map((e) => {
              return (
                <Option key={e.id} value={e.id}>
                  {e.name}
                </Option>
              )
            })}
          </HookFormSelectAntd>
        </Col>

        <Col xl={2} sm={4}>
          <HookFormSelectAntd
            name="unit"
            placeholder="Unit"
            control={control}
            size="large"
            className="sapp-h-45px"
            showSearch
            loading={listCourse.unit.loading}
            onSearch={async (e) => {
              debouncedGetListSort({
                type: 'unit',
                name: e,
                parentId: listCourse.chapter.id,
                parentType: 'chapter',
              })
              return
            }}
            onChange={(e: any) => {
              if (e === undefined) {
                return
              }
              getListSort({ parentId: e, type: 'activity', parentType: 'unit' })
            }}
            allowClear
            onClear={() => {
              setListCourse(clearChildren('unit'))
            }}
          >
            {listCourse.unit.data?.map((e) => {
              return (
                <Option key={e.id} value={e.id}>
                  {e.name}
                </Option>
              )
            })}
          </HookFormSelectAntd>
        </Col>
        <Col xl={2} sm={4}>
          <HookFormSelectAntd
            name="activity"
            placeholder="Activity"
            control={control}
            size="large"
            className="sapp-h-45px"
            showSearch
            loading={listCourse.activity.loading}
            onSearch={async (e) => {
              debouncedGetListSort({
                type: 'activity',
                name: e,
                parentId: listCourse.unit.id,
                parentType: 'unit',
              })
              return
            }}
            onChange={(e: any) => {
              setListCourse((c) => ({
                ...c,
                activity: { ...c.activity, id: e },
              }))
              handleFilter({
                course_section_id: e || null,
              })
            }}
            allowClear
            onClear={() => {
              clearChildren('activity')
            }}
          >
            {listCourse.activity.data?.map((e) => {
              return (
                <Option key={e.id} value={e.id}>
                  {e.name}
                </Option>
              )
            })}
          </HookFormSelectAntd>
        </Col>
        <Col xl={2} sm={4}>
          <HookFormSelectAntd
            name="sortType"
            placeholder="Type"
            control={control}
            size="large"
            className="sapp-h-45px"
            onChange={(e: any) => {
              handleFilter({ suffix_types: e })
            }}
            {...(!fileType || fileType === 'ALL'
              ? {
                  allowClear: true,
                  onClear: () => handleFilter({ suffix_types: 'ALL' }),
                }
              : {})}
          >
            {FILTER_RESOURCE_SORT_BY.map((status) => (
              <Option
                disabled={
                  status.label.toUpperCase() !== fileType && fileType !== 'ALL'
                }
                key={status.label}
                value={status.value}
              >
                {status.label}
              </Option>
            ))}
          </HookFormSelectAntd>
        </Col>
        <Col xl={2} sm={4}>
          <HookFormDateTime
            control={control}
            name="fromDate"
            placeholder="From date"
            onChange={(e) => {
              handleFilter({
                fromDate: formatDateToISOString(e, 'fromDate'),
              })
            }}
          />
        </Col>
        <Col xl={2} sm={4}>
          <HookFormDateTime
            control={control}
            name="toDate"
            placeholder="To date"
            onChange={(e) =>
              handleFilter({
                toDate: formatDateToISOString(e, 'toDate'),
              })
            }
          />
        </Col>
        {/* end:: filter */}
      </Row>
      <SappTable
        headers={headers}
        loading={false}
        isCheckedAll={isCheckedAll}
        onChange={() => {
          toggleCheckAll(!isCheckedAll)
        }}
        data={resources}
        hasCheckAll={isMultiple ? true : false}
      >
        <>
          {resources?.map((resource, i) => {
            const isChecked = checkedList.includes(resource.id)
            return (
              <tr key={resource.id}>
                <td>
                  {isMultiple ? (
                    <SAPPCheckbox
                      checked={isChecked}
                      onChange={() => {
                        toggleCheck(resource.id)
                      }}
                    />
                  ) : (
                    <SAPPRadio
                      checked={isChecked}
                      onChange={() => {
                        toggleCheckAll(false)
                        toggleCheck(resource.id)
                      }}
                    />
                  )}
                </td>
                <td>
                  <div className="sapp-text-truncate-1">{resource.name}</div>
                </td>
                <td>
                  {displayBytes(resource?.size ? Number(resource.size) : 0)}
                </td>
                <td>
                  {resource?.created_at
                    ? `${format(
                        new Date(resource.created_at),
                        FORMAT_DATETIME,
                      )}`
                    : '-'}
                </td>
              </tr>
            )
          })}
        </>
      </SappTable>
      <PagiantionSAPP
        currentPage={meta?.page_index || 1}
        pageSize={meta?.page_size}
        totalItems={meta?.total_records}
        handlePaginationChange={(currenPage: any, size: any) => {
          handleFilter({ page_index: currenPage, page_size: size })
        }}
      />
    </Container>
  )
}

export default Resources
