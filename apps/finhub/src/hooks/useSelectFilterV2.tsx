import { DefaultOptionType } from 'antd/es/select'
import { debounce, get } from 'lodash'
import { useEffect, useMemo, useState } from 'react'
import { IMetaData, IResponse } from 'src/type'
import {
  IQueryParams,
  IResponseData,
  IResponseDataWithMetadata,
  QueryKey,
  SearchField,
} from 'src/type/common'

const DEBOUNCED_NUMBER = 300

interface IFilter {
  loading: boolean
  data: DefaultOptionType[]
  metadata?: IMetaData
  search?: string
}

const defaultValue = {
  loading: false,
  data: [],
  search: '',
}

interface IProps {
  fetchAPI: (
    queryParams: IQueryParams,
  ) => Promise<IResponse<IResponseDataWithMetadata | IResponseData[]>>
  queryKey?: QueryKey
  queryFields?: (keyof IResponseData)[]
  searchField?: SearchField
  separator?: string
  customDisplayName?: (item: IResponseData) => string
  initialData?: DefaultOptionType[]
  customId?: (item: IResponseData) => string | number
}

const useSelectFilterV2 = ({
  fetchAPI,
  queryKey,
  queryFields = ['name'],
  searchField = 'search',
  separator = ' - ',
  customDisplayName,
  initialData = [],
  customId,
}: IProps) => {
  const [dataList, setDataList] = useState<IFilter>(defaultValue)

  useEffect(() => {
    if (!initialData?.length) return

    setDataList((prev) => ({
      ...prev,
      data: initialData,
    }))
  }, [initialData])

  const getData = async (
    searchValue?: string,
    page_index: number = 1,
    page_size: number = 10,
  ) => {
    try {
      setDataList((e) => ({
        ...e,
        loading: true,
      }))

      const otherParams: Record<string, unknown> = {}
      if (searchValue) {
        otherParams[searchField] = searchValue
      }

      const response = await fetchAPI({
        page_index,
        page_size,
        otherParams,
      })

      const dataSource =
        queryKey && queryKey in response.data
          ? response.data[queryKey]
          : Array.isArray(response.data)
            ? response.data
            : []

      const data: DefaultOptionType[] = dataSource.map(
        (item: IResponseData) => {
          const displayName = customDisplayName
            ? customDisplayName(item)
            : queryFields
                .map((field) => get(item, field as string))
                .filter((value) => ![undefined, null].includes(value))
                .join(separator)

          const id = customId ? customId(item) : item.id

          return {
            id,
            name: displayName,
          }
        },
      )

      setDataList((prev: IFilter) => {
        const newData =
          searchValue !== prev.search
            ? data
            : [...prev.data, ...data].filter(
                (obj, index, self) =>
                  self.findIndex((o) => o.id === obj.id) === index,
              )

        const finalData = [...initialData, ...newData].filter(
          (obj, index, self) =>
            self.findIndex((o) => o.id === obj.id) === index,
        )

        return {
          ...prev,
          metadata: Array.isArray(response.data)
            ? undefined
            : response.data.metadata,
          loading: false,
          data: finalData,
        }
      })
    } catch (error) {
      setDataList((e: IFilter) => ({
        ...e,
        loading: false,
      }))
    }
  }

  const debounceGetData = debounce(getData, DEBOUNCED_NUMBER)

  const handleNextPage = () => {
    const total_pages = dataList.metadata?.total_pages
    const page_index = dataList.metadata?.page_index
    const page_size = dataList.metadata?.page_size
    if (total_pages && page_index && page_index < total_pages) {
      getData(dataList.search, page_index + 1, page_size)
    }
  }

  const debouncedHandleNextPage = debounce(handleNextPage, DEBOUNCED_NUMBER)

  const useSelectFilterResult = useMemo(
    () => ({
      dataList,
      setDataList,
      getData,
      debounceGetData,
      handleNextPage: debouncedHandleNextPage,
    }),
    [dataList, fetchAPI],
  )
  return useSelectFilterResult
}

export default useSelectFilterV2
