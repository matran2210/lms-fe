// import {
//   CloseNone,
//   DownloadMinimalistic,
//   OutlineText,
//   OutlineVideo,
// } from '@lms/assets'
// import { bytesToKilobyte, cleanParamsAPI } from '@utils/index'
// import getConfig from 'next/config'
// import { useEffect, useState, useCallback, useRef } from 'react'
// import { IResourceDetail, IResource } from 'src/type/courses'
// import TextSkeleton from '@components/base/skeleton/TextSkeleton'
// import { isEmpty } from 'lodash'
// import NoData from '@components/common/NoData'
// import { UploadAPI } from 'src/pages/api/upload'
// import { useForm } from 'react-hook-form'
// import { useMasterFinanceContext } from '@contexts/MasterFinance'
// import { useRouter } from 'next/router'
// import useSelectFilterV2 from 'src/hooks/useSelectFilterV2'
// import { CoursesAPI } from 'src/pages/api/courses'
// import SAPPSelectV3 from '../select/SAPPSelectV3'
// import SAPPDrawerV3 from '../drawer/SAPPDrawerV3'

// const { publicRuntimeConfig } = getConfig()
// export const { apiURL } = publicRuntimeConfig

// const getIconResource = (fileName: string): JSX.Element => {
//   const fileExtension = fileName.split('.').pop() || ''
//   if (
//     ['mp4', 'mov', 'avi', 'wmv', 'flv', 'mpeg', 'mpg', 'm4v'].includes(
//       fileExtension,
//     )
//   )
//     return <OutlineVideo />
//   return <OutlineText />
// }

// const DEFAULT_SECTION_OPTION = {
//   label: 'All Section',
//   value: '',
// }

// const DEFAULT_PAGE_INDEX = 1
// const DEFAULT_PAGESIZE = 10

// type CourseResourceFormType = {
//   section?: string
//   subsection?: string
//   activity?: string
// }

// const CourseResource: React.FC = () => {
//   const { isOpenCourseResource, setIsOpenCourseResource } =
//     useMasterFinanceContext()
//   const [resources, setResources] = useState<IResourceDetail>()
//   const [loading, setLoading] = useState<boolean>(false)
//   const [pageIndex, setPageIndex] = useState(DEFAULT_PAGE_INDEX)
//   const { control, watch, getValues, setValue, reset } =
//     useForm<CourseResourceFormType>({
//       defaultValues: {
//         section: undefined,
//         subsection: undefined,
//         activity: undefined,
//       },
//     })
//   const scrollRef = useRef<HTMLDivElement>(null)
//   const router = useRouter()
//   const courseId = (router.query.courseId || router.query.id || '') as string

//   const section = watch('section')
//   const subsection = watch('subsection')
//   const activity = watch('activity')

//   // Section select
//   const {
//     dataList: sectionDataList,
//     getData: getSections,
//     debounceGetData: debounceGetSections,
//     handleNextPage: handleNextSectionsPage,
//   } = useSelectFilterV2({
//     fetchAPI: ({ page_index, page_size }) =>
//       CoursesAPI.getCourseSectionList(courseId, page_size, page_index),
//     queryKey: 'sections',
//   })

//   // Subsection select
//   const {
//     dataList: subsectionDataList,
//     setDataList: setSubsectionDataList,
//     debounceGetData: debounceGetSubsections,
//     handleNextPage: handleNextSubsectionsPage,
//   } = useSelectFilterV2({
//     fetchAPI: ({ page_index, page_size }) =>
//       CoursesAPI.getCourseSubsectionList(
//         page_size,
//         'CHAPTER',
//         section,
//         courseId,
//         page_index,
//       ),
//     queryKey: 'sections',
//   })

//   // Activity select
//   const {
//     dataList: activityDataList,
//     setDataList: setActivityDataList,
//     debounceGetData: debounceGetActivities,
//     handleNextPage: handleNextActivitiesPage,
//   } = useSelectFilterV2({
//     fetchAPI: ({ page_index, page_size }) =>
//       CoursesAPI.getCourseSubsectionList(
//         page_size,
//         'ACTIVITY',
//         subsection,
//         courseId,
//         page_index,
//       ),
//     queryKey: 'sections',
//   })

//   useEffect(() => {
//     if (!isOpenCourseResource) return

//     const fetchData = async () => {
//       getSections()
//     }

//     fetchData()
//   }, [isOpenCourseResource])
//   const requestOngoingRef = useRef(false)
//   const getResources = async (nextPageIndex: number = DEFAULT_PAGE_INDEX) => {
//     if (requestOngoingRef.current) return
//     requestOngoingRef.current = true
//     const sub_id =
//       getValues('activity') || getValues('subsection') || getValues('section')
//     const params = cleanParamsAPI({
//       sub_id: sub_id,
//       page_index: nextPageIndex,
//       page_size: DEFAULT_PAGESIZE,
//     })

//     setLoading(true)
//     const res = await CoursesAPI.getCourseResource(
//       router.query.courseId || router.query.id,
//       params,
//     )
//     if (res?.data.resources && nextPageIndex !== DEFAULT_PAGE_INDEX) {
//       setResources((prevResources) => ({
//         meta: res?.data?.meta,
//         resources: [
//           ...((prevResources?.resources ?? []) as IResource[]),
//           ...((res?.data?.resources ?? []) as IResource[]),
//         ],
//       }))
//     } else {
//       setResources(res.data)
//     }
//     requestOngoingRef.current = false
//     setPageIndex(nextPageIndex)
//     setLoading(false)
//   }

//   useEffect(() => {
//     if (!isOpenCourseResource) return
//     getResources()
//   }, [section, subsection, activity])

//   const onClose = useCallback(() => {
//     setIsOpenCourseResource(false)
//     reset()
//   }, [setIsOpenCourseResource, reset])

//   const download = useCallback(async (name: string, file_key: string) => {
//     await UploadAPI.downloadFile({
//       files: [
//         {
//           name: name,
//           file_key: file_key,
//         },
//       ],
//     })
//   }, [])

//   useEffect(() => {
//     setValue('subsection', undefined)
//     setValue('activity', undefined)
//     setSubsectionDataList((prev) => ({
//       ...prev,
//       data: [],
//     }))
//     setActivityDataList((prev) => ({
//       ...prev,
//       data: [],
//     }))
//   }, [section])

//   useEffect(() => {
//     setValue('activity', undefined)
//     setActivityDataList((prev) => ({
//       ...prev,
//       data: [],
//     }))
//   }, [subsection])

//   useEffect(() => {
//     const scrollEl = scrollRef.current
//     if (!scrollEl) return

//     const handleScroll = () => {
//       const { scrollTop, scrollHeight, clientHeight } = scrollEl
//       if (scrollTop + clientHeight + 200 >= scrollHeight) {
//         if (
//           (router.query.courseId || router.query.id) &&
//           isOpenCourseResource
//         ) {
//           const nextPageIndex = pageIndex + 1
//           if (Number(resources?.meta?.total_pages) >= nextPageIndex) {
//             getResources(nextPageIndex)
//           }
//         }
//       }
//     }

//     scrollEl.addEventListener('scroll', handleScroll)
//     return () => scrollEl.removeEventListener('scroll', handleScroll)
//   }, [pageIndex, getResources])

//   const heightContent = 'calc(100vh - 294px)'

//   return (
//     <SAPPDrawerV3
//       open={isOpenCourseResource}
//       handleCancel={onClose}
//       title="Course Resource"
//       footer
//       rootClassName="learning-resource-drawer"
//       className="rounded-2xl"
//       width={673}
//       customTitle={
//         <div className="flex items-center justify-between p-8">
//           <div className="text-2xl font-semibold text-bw-1">
//             Course Resource
//           </div>
//           <div className="cursor-pointer" onClick={onClose}>
//             <CloseNone />
//           </div>
//         </div>
//       }
//     >
//       <div className="grid grid-cols-1 gap-2 xl:grid-cols-3">
//         <SAPPSelectV3
//           control={control}
//           name="section"
//           placeholder="Section"
//           className="h-11"
//           defaultValue={''}
//           onFocus={() => debounceGetSections()}
//           options={[
//             DEFAULT_SECTION_OPTION,
//             ...sectionDataList.data?.map((e) => ({
//               value: e.id,
//               label: e.name,
//             })),
//           ]}
//           onMenuScrollToBottom={handleNextSectionsPage}
//         />
//         <SAPPSelectV3
//           control={control}
//           name="subsection"
//           placeholder="Subsection"
//           className="h-11"
//           defaultValue={subsection}
//           onFocus={() => debounceGetSubsections()}
//           options={subsectionDataList.data?.map((e) => ({
//             value: e.id,
//             label: e.name,
//           }))}
//           disabled={!section}
//           onMenuScrollToBottom={handleNextSubsectionsPage}
//         />
//         <SAPPSelectV3
//           control={control}
//           name="activity"
//           placeholder="Activity"
//           className="h-11"
//           defaultValue={activity}
//           onFocus={() => debounceGetActivities()}
//           options={activityDataList.data?.map((e) => ({
//             value: e.id,
//             label: e.name,
//           }))}
//           disabled={!subsection}
//           onMenuScrollToBottom={handleNextActivitiesPage}
//         />
//       </div>

//       <div
//         className="mt-8 flex flex-col gap-y-4 overflow-y-auto"
//         ref={scrollRef}
//         style={{
//           maxHeight: heightContent,
//         }}
//       >
//         {!isEmpty(resources?.resources) ? (
//           <>
//             {resources?.resources?.map((resource: IResource) => (
//               <div
//                 key={resource.id}
//                 className="flex items-center justify-between rounded-lg bg-shade-text-100 px-4 py-3 hover:bg-shade-primary-50"
//               >
//                 <div className="flex min-w-0 flex-1 items-center gap-x-3">
//                   {getIconResource(resource?.name)}
//                   <div className="min-w-0 flex-1">
//                     <div className="truncate text-base font-medium text-shade-text-800">
//                       {resource?.name}
//                     </div>
//                     <div className="text-sm font-normal text-shade-text-500">
//                       {bytesToKilobyte(resource?.size, 'kb')}
//                     </div>
//                   </div>
//                 </div>
//                 <a
//                   className="ml-3 flex-shrink-0 font-bold text-shade-icon hover:text-shade-primary-500"
//                   onClick={() => download(resource.name, resource.file_key)}
//                 >
//                   <DownloadMinimalistic />
//                 </a>
//               </div>
//             ))}{' '}
//           </>
//         ) : (
//           <div className="flex min-h-[calc(100vh-12rem)] items-center justify-center">
//             <NoData />
//           </div>
//         )}
//       </div>
//     </SAPPDrawerV3>
//   )
// }

// export default CourseResource
