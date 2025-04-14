import HookFormDateRange from '@components/base/datetime/HookFormDateRange'
import SappDrawer from '@components/base/SappDrawer'
import SappHookFormSelect from '@components/base/select/SappHookFormSelect'
import HookFormTextField from '@components/base/textfield/HookFormTextField'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/router'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { getUserInformation, userReducer } from 'src/redux/slice/User/User'
import { useAppDispatch, useAppSelector } from 'src/redux/hook'
import { VALIDATE_REQUIRED } from '@utils/helpers/ValidateMessage'
import { z } from 'zod'
import { IDefaultFormAddProgress, IExplorerNode } from '../../../type/progress'
import Accodian from '@components/my-class/progress-form/AccodianItem'
import SAPPCheckbox from '@components/base/checkbox/SAPPCheckbox'
import { TreeHelper } from 'src/helper/tree'

const defaultValues = {
  lesson: '',
  section: '',
  note: '',
}

interface ICourseSection {
  checked: boolean
  children: ICourseSection[]
  code: string
  id: string
  is_original: boolean
  name: string
  is_excepted: boolean
}

export interface IProps {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  reloadPage: () => void
}

function FormAddProgress({ open, setOpen, reloadPage }: IProps) {
  const router = useRouter()
  const params = router.query?.id
  const isEdit = false
  const dispatch = useAppDispatch()
  const [loading, setLoading] = useState<boolean>(false)
  const [initialStatus, setInitialStatus] = useState<string>()
  const [existedTeacher, setExistedTeacher] = useState<boolean>(false)
  const { user } = useAppSelector(userReducer)
  const [checkedAll, setCheckedAll] = useState(true)
  const [explorerData, setExplorerData] = useState<IExplorerNode[]>([])

  const validationSchema = z.object({
    lesson: z
      .string({ required_error: VALIDATE_REQUIRED })
      .trim()
      .min(1, VALIDATE_REQUIRED),
    soGio: z
      .array(z.date(), { required_error: VALIDATE_REQUIRED })
      .refine((val) => val.length === 2, {
        message: VALIDATE_REQUIRED,
      }),
    section: z
      .string({ required_error: VALIDATE_REQUIRED })
      .trim()
      .min(1, VALIDATE_REQUIRED),
    note: z.string().optional(),
  })

  const useFormProp = useForm<IDefaultFormAddProgress>({
    resolver: zodResolver(validationSchema),
    mode: 'onSubmit',
    defaultValues,
  })

  const {
    handleSubmit: handleSubmitForm,
    control,
    setValue,
    getValues,
    setError,
  } = useFormProp

  const handleSubmit = handleSubmitForm(async (formData) => {})

  const loadData = async () => {}

  useLayoutEffect(() => {
    loadData()
  }, [params])

  useEffect(() => {
    dispatch(getUserInformation())
  }, [])

  // form checkbox
  const checkAll = (status: boolean) => {
    setCheckedAll(status)
    // let checkedAll = true
    for (let e of explorerData) {
      toggleChecked(explorerData, e.id, status)
    }
    return true
  }

  // A function that takes an array of data and an id of a node
  function toggleChecked(data: IExplorerNode[], id: string, checked: boolean) {
    // A helper function that recursively finds the node with the given id and returns it
    function findNode(data: IExplorerNode[], id: string): IExplorerNode | null {
      for (let node of data) {
        if (node.id === id) {
          return node
        } else if (node.children && node.children.length > 0) {
          let result = findNode(node.children, id)
          if (result) {
            return result
          }
        }
      }
      return null
    }

    // A helper function that recursively updates the checked status of the node and its children
    function updateNode(node: IExplorerNode, checked: boolean) {
      node.checked = checked
      if (node.children && node.children.length > 0) {
        for (let child of node.children) {
          updateNode(child, checked)
        }
      }
    }

    // A helper function that recursively updates the checked status of the node and its ancestors
    function updateAncestors(
      nodes: IExplorerNode[],
      node: IExplorerNode,
    ): void {
      if (node.parent_id) {
        const parent = findNode(nodes, node.parent_id)
        if (parent && parent.children) {
          const oneChecked = parent.children.some((child) => child.checked)
          parent.checked = oneChecked
          updateAncestors(nodes, parent)
        }
      }
    }

    // Find the node with the given id
    let node = findNode(data, id)
    if (node) {
      // Toggle the checked status of the node
      //   let checked = !node.checked
      // Update the node and its children
      updateNode(node, checked)
      // Update the node and its ancestors
      updateAncestors(data, node)
    }
    return data
  }

  const handleChecked = (e: string, status: boolean) => {
    setExplorerData((prev: IExplorerNode[]) => {
      const oldData = [...prev]
      const newData = toggleChecked(oldData, e, status)
      return newData
    })
  }

  let resExcept: (ICourseSection & { checked: boolean })[]
  useEffect(() => {
    // if (id) {
    async function fetchCourseList() {
      // if (id) {
      setLoading(true)
      try {
        const res = {
          success: true,
          data: [
            {
              id: '02c4db5c-f45d-40e7-9314-520492aa611e',
              created_at: '2024-11-13T07:41:53.219Z',
              name: 'Section 1',
              short_name: null,
              code: 'course normal acca f4 test supporter_S0',
              is_public: true,
              course_section_type: 'PART',
              display_icon: null,
              cta_status: 'BEGIN',
              course_id: 'dad71325-d2b4-4f12-b0c2-d8c8f2d1fa12',
              parent_id: null,
              is_preview_locked: false,
              is_showing_locked: false,
              position: 1,
              position_updated_at: '2024-11-13T07:41:53.219Z',
              is_original: true,
            },
            {
              id: '7901be10-feaa-45f5-9a82-f00da5a21c0e',
              created_at: '2024-11-13T07:41:57.377Z',
              name: 'Subsection 1',
              short_name: null,
              code: 'course normal acca f4 test supporter_S0_SS0',
              is_public: true,
              course_section_type: 'CHAPTER',
              display_icon: null,
              cta_status: 'BEGIN',
              course_id: 'dad71325-d2b4-4f12-b0c2-d8c8f2d1fa12',
              parent_id: '02c4db5c-f45d-40e7-9314-520492aa611e',
              is_preview_locked: false,
              is_showing_locked: false,
              position: 1,
              position_updated_at: '2024-11-13T07:41:57.377Z',
              is_original: true,
            },
            {
              id: '091079ad-0628-41ce-8e3e-eb52a14491a1',
              created_at: '2024-11-13T07:42:03.184Z',
              name: 'Unit 1',
              short_name: null,
              code: 'course normal acca f4 test supporter_S0_SS0_U0',
              is_public: true,
              course_section_type: 'UNIT',
              display_icon: null,
              cta_status: 'BEGIN',
              course_id: 'dad71325-d2b4-4f12-b0c2-d8c8f2d1fa12',
              parent_id: '7901be10-feaa-45f5-9a82-f00da5a21c0e',
              is_preview_locked: false,
              is_showing_locked: false,
              position: 1,
              position_updated_at: '2024-11-13T07:42:03.184Z',
              is_original: true,
            },
            {
              id: '6430ef50-8c3c-450f-a565-1ab9e0fcd577',
              created_at: '2024-11-13T07:42:09.575Z',
              name: 'Activity 1',
              short_name: null,
              code: 'course normal acca f4 test supporter_S0_SS0_U0_A0',
              is_public: true,
              course_section_type: 'ACTIVITY',
              display_icon: 'TEXT',
              cta_status: 'BEGIN',
              course_id: 'dad71325-d2b4-4f12-b0c2-d8c8f2d1fa12',
              parent_id: '091079ad-0628-41ce-8e3e-eb52a14491a1',
              is_preview_locked: false,
              is_showing_locked: false,
              position: 1,
              position_updated_at: '2024-11-13T07:42:09.575Z',
              is_original: true,
            },
            {
              id: '39ddc884-63be-4059-a341-c27d0588fca7',
              created_at: '2024-11-13T07:43:21.809Z',
              name: 'Midterm test 1',
              short_name: null,
              code: 'j2z4OneJ',
              is_public: true,
              course_section_type: 'MID_TERM_TEST',
              display_icon: null,
              cta_status: 'BEGIN',
              course_id: 'dad71325-d2b4-4f12-b0c2-d8c8f2d1fa12',
              parent_id: null,
              is_preview_locked: false,
              is_showing_locked: false,
              position: 2,
              position_updated_at: '2024-11-13T07:43:21.809Z',
              is_original: true,
            },
          ],
        }
        const newData = res.data?.map((item: any) => {
          return {
            ...item,
            checked: item.id === '39ddc884-63be-4059-a341-c27d0588fca7',
          }
        })

        setExplorerData(
          TreeHelper.convertFromArray(newData ?? [], {
            convert_original: true,
          }) as IExplorerNode[],
        )
      } catch (err) {
      } finally {
        setLoading(false)
      }
    }

    // }

    // if (id) {
    fetchCourseList()
    // } else {
    //   setExplorerData([])
    // }
  }, [])

  useEffect(() => {
    setCheckedAll(findNodeUnChecked(explorerData))
  }, [explorerData])

  function findNodeUnChecked(data: IExplorerNode[]): boolean {
    for (let node of data) {
      if (node.checked === false) {
        return false
      } else if (node.children && node.children.length > 0) {
        let result = findNodeUnChecked(node.children)
        if (!result) {
          return result
        }
      }
    }
    return true
  }

  return (
    <SappDrawer
      isOpen={open}
      message="Bạn có chắc chán muốn hủy không?"
      onClose={() => setOpen(false)}
      title={`${router.query.id ? 'Edit' : 'Add'} Progress`}
      footer={true}
      btnSubmitTile="Save"
      confirmOnClose={true}
      sizeTextBtn="medium"
      handleSubmit={handleSubmit}
      heightBody={'h-[calc(100vh-146px)]'}
    >
      <div className="mb-6">
        <div className="grid w-full grid-cols-2 gap-x-6">
          <div>
            <SappHookFormSelect
              control={control}
              label="Lesson"
              name="lesson"
              placeholder="Please choose"
              required
              className="text-base font-medium"
              options={[]}
            />
          </div>
          <div>
            <HookFormDateRange
              control={control}
              required
              label="Số Giờ"
              name="soGio"
              placeholder
              format="YYYY-MM-DD | HH:mm:ss"
              showTime
              className="text-sm"
            />
          </div>
        </div>
      </div>
      <div className="mb-6">
        <SappHookFormSelect
          control={control}
          label="Section"
          name="section"
          placeholder="Please choose"
          required
          className="text-base font-medium"
          options={[]}
        />
      </div>
      <div className="mb-6">
        <HookFormTextField
          label={'Note'}
          className="sapp-h-45px fs-6"
          control={control}
          name="note"
          placeholder={'Please enter'}
        ></HookFormTextField>
      </div>

      <label className="mb-2 block text-base font-medium">
        <span className="required">{'Content completed'}</span>
      </label>
      <div className="mb-8 mt-5 flex items-center gap-3">
        <SAPPCheckbox
          checked={checkedAll}
          onChange={() => {
            checkAll(!checkedAll)
          }}
          state="primary"
        />
        <div className="sapp-text-truncate-1 sapp-text-primary fw-semibold fs-6">
          Select All{' '}
          {explorerData?.length > 0 ? `(${explorerData?.length})` : ''}
        </div>
      </div>
      <div>
        {explorerData &&
          explorerData.map((item: IExplorerNode, index: number) => {
            return (
              <Accodian
                explorer={item}
                type={'process'}
                action={handleChecked}
                key={item.id}
              />
            )
          })}
      </div>
    </SappDrawer>
  )
}

export default FormAddProgress
