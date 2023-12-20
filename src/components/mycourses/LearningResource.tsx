/* eslint-disable react-hooks/exhaustive-deps */
import { DownloadIcon } from '@assets/icons'
import SappDrawer from '@components/base/SappDrawer'
import HookFormSelect from '@components/base/select/HookFormSelect'
import { bytesToKilobyte, cleanParamsAPI } from '@utils/index'
import getConfig from 'next/config'
import { useRouter } from 'next/router'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import CourseAPI from 'src/pages/api/courses'
import { IResouceDetail, ISectionDetail } from 'src/type/courses'
const { publicRuntimeConfig } = getConfig()
export const { apiURL } = publicRuntimeConfig

interface IProps {
  open: boolean
  setOpenResource: Dispatch<SetStateAction<boolean>>
}

const DEFAULT_PAGESIZE = 20

const LearningResource = ({ open, setOpenResource }: IProps) => {
  const [resources, setResources] = useState<IResouceDetail>()
  const router = useRouter()
  const [selectedSection, setSelectedSection] = useState<any>(null)
  const [selectedSubsection, setSelectedSubsection] = useState<any>(null)
  const [selectedUnit, setSelectedUnit] = useState<any>(null)
  const [selectedActivity, setSelectedActivity] = useState<any>(null)

  const handleDropdownChange = (
    selectedOption: any,
    setFunction: any,
    resetFunction: any,
  ) => {
    setFunction(selectedOption)

    // Reset the downstream dropdowns if a reset function is provided
    if (resetFunction) {
      resetFunction(null)
    }
  }

  useEffect(() => {
    if (selectedSection?.value === '') {
      setSelectedSubsection(null)
      setSelectedUnit(null)
      setSelectedActivity(null)
    }
  }, [selectedSection?.value])

  const onClose = () => {
    document.body.style.overflow = 'auto'
    setOpenResource(false)
    setSelectedSubsection(null)
    setSelectedUnit(null)
    setSelectedActivity(null)
    setSelectedSection(null)
  }

  const [sections, setSections] = useState<ISectionDetail>()

  async function getCourseSections() {
    try {
      const res = await CourseAPI.getCourseSectionList(router.query.courseId)
      setSections(res?.data)
      setSelectedSubsection(null)
      setSelectedUnit(null)
      setSelectedActivity(null)
    } catch (error) {}
  }

  useEffect(() => {
    if(router.query.courseId && open){
      getCourseSections()
    }
  }, [open])

  const [subSections, setSubsections] = useState<any>()

  async function getCourseSubsections() {
    try {
      const res = await CourseAPI.getCourseSubsectionList(
        1,
        10,
        'CHAPTER',
        selectedSection.value,
      )
      setSubsections(res?.data)
      setSelectedUnit(null)
      setSelectedActivity(null)
    } catch (error) {}
  }

  useEffect(() => {
    if(selectedSection?.value !== '') {
      getCourseSubsections()
    }
  }, [selectedSection])

  const [unit, setUnit] = useState<ISectionDetail>()

  async function getCourseUnit() {
    try {
      const res = await CourseAPI.getCourseSubsectionList(
        1,
        10,
        'UNIT',
        selectedSubsection.value,
      )
      setUnit(res?.data)
      setSelectedActivity(null)
    } catch (error) {}
  }

  useEffect(() => {
    getCourseUnit()
  }, [selectedSubsection])

  const [activity, setActivity] = useState<ISectionDetail>()

  async function getCourseActivity() {
    try {
      const res = await CourseAPI.getCourseSubsectionList(
        1,
        10,
        'ACTIVITY',
        selectedUnit.value,
      )
      setActivity(res?.data)
    } catch (error) {}
  }

  useEffect(() => {
    getCourseActivity()
  }, [selectedUnit])

  const params = cleanParamsAPI({
    sub_id:
      selectedActivity?.value ||
      selectedUnit?.value ||
      selectedSubsection?.value ||
      selectedSection?.value ||
      '',
  });

  useEffect(() => {
    if (open && router.query.courseId) {
      CourseAPI.getCourseResource(router.query.courseId, DEFAULT_PAGESIZE, params).then((res) =>
        setResources(res?.data),
      )
    }
  }, [open, selectedSection?.value, selectedSubsection?.value, selectedUnit?.value, selectedActivity?.value])

  const [pageIndex, setPageIndex] = useState(DEFAULT_PAGESIZE);

  const fetchData = async (params?: Object) => {
    try {
      const res = await CourseAPI.getCourseResource(router.query.courseId, pageIndex, params);
      setResources(res?.data);
      setPageIndex((prevPageIndex) => prevPageIndex + DEFAULT_PAGESIZE);
    } catch (error) {
      // Handle error if needed
    }
  };
  
  // Attach a scroll event listener to fetch more data when scrolling to the bottom
  useEffect(() => {
    const containerDiv:any = document.getElementById('sapp-drawer'); // Replace 'your-container-id' with the actual ID of your container div
  
    const handleScroll = () => {
      if (
        containerDiv &&
        containerDiv.clientHeight + containerDiv.scrollTop === containerDiv.scrollHeight && router.query.courseId
      ) {
        fetchData(params);
      }
    };
  
    containerDiv?.addEventListener('scroll', handleScroll);
  
    return () => containerDiv?.removeEventListener('scroll', handleScroll);
  }, [pageIndex]);

  const DEFAULT_SELECT = [{label: 'All', value: ''}]

  const download = async (name: string, file_key: string) => {
    await CourseAPI.downloadResource({files: [
    {
      name: name,
      file_key: file_key
    }
  ]})
  }

  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(10);

  const loadMoreOptions = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      // Fetch additional items from the API with an increased page_size
      const response = await fetch(`your-api-endpoint?page_size=${page + 10}`);
      const newData = await response.json();

      // Update the options with the new data
      setSections((prevOptions: any) => [...prevOptions, ...newData] as any);
      setPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.error('Error loading more options', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Load initial options when the component mounts
    loadMoreOptions();
  }, []);

  const handleMenuScrollToBottom = ({ target }: any) => {
    // Check if the user has scrolled to the bottom of the menu
    if (target.scrollHeight - target.scrollTop === target.clientHeight) {
      // Load more options when scrolling to the bottom
      loadMoreOptions();
    }
  };
  return (
    <SappDrawer
      isOpen={open}
      message="Bạn có chắc chán muốn hủy không?"
      onClose={onClose}
      title="Resource"
      footer={false}
    >
      <div className="flex justify-between">
        <HookFormSelect
          className="w-52"
          placeholder="Section"
          value={selectedSection}
          onChange={(selectedOption) =>
            handleDropdownChange(
              selectedOption,
              setSelectedSection,
              setSelectedSubsection,
            )
          }
          options={sections && DEFAULT_SELECT.concat(sections?.sections?.map((section) => ({
            label: section.name,
            value: section.id,
          })))}
          onMenuScrollToBottom={handleMenuScrollToBottom}
        />
        <HookFormSelect
          className="w-52"
          placeholder="Subsection"
          value={selectedSubsection}
          onChange={(selectedOption) =>
            handleDropdownChange(
              selectedOption,
              setSelectedSubsection,
              setSelectedUnit,
            )
          }
          options={
            selectedSection
              ? subSections?.sections?.map((section: any) => ({
                  label: section.name,
                  value: section.id,
                }))
              : []
          }
          isDisabled={selectedSection?.value === ''}
        />
        <HookFormSelect
          className="w-52"
          placeholder="Unit"
          value={selectedUnit}
          onChange={(selectedOption) =>
            handleDropdownChange(
              selectedOption,
              setSelectedUnit,
              setSelectedActivity,
            )
          }
          options={
            selectedSubsection
              ? unit?.sections?.map((section: any) => ({
                  label: section.name,
                  value: section.id,
                }))
              : []
          }
          isDisabled={selectedSection?.value === ''}
        />
        <HookFormSelect
          className="w-52"
          placeholder="Activity"
          value={selectedActivity}
          onChange={(selectedOption) =>
            handleDropdownChange(selectedOption, setSelectedActivity, null)
          }
          options={
            selectedUnit
              ? activity?.sections?.map((section: any) => ({
                  label: section.name,
                  value: section.id,
                }))
              : []
          }
          isDisabled={selectedSection?.value === ''}
        />
      </div>

      {resources?.resources?.map((resource: any) => (
        <div key={resource.id}>
          <div className=" mt-6 p-6" style={{ border: '1px solid #DCDDDD' }}>
            <div className="flex justify-between items-center">
              <div>
                <div className="font-normal text-base text-bw-1">
                  {resource?.name}
                </div>
                <div className="text-gray-1 font-normal text-base">
                  {bytesToKilobyte(resource?.size)}
                </div>
              </div>
              <a className="cursor-pointer" onClick={() => download(resource.name, resource.file_key)}>
                <DownloadIcon />
              </a>
            </div>
          </div>
        </div>
      ))}
    </SappDrawer>
  )
}

export default LearningResource
