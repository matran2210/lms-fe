import { memo, useEffect, useState } from 'react'
import { Tree, TreeDataNode, TreeProps } from 'antd'
import { IContentCompleted, ICourseSections } from '@lms/core'
import { UseFormSetValue } from 'react-hook-form'
import styles from './styles.module.scss'
import { SwitcherClosed, SwitcherExpanded } from '@assets/icons'

interface TreeTicketProps {
  isView?: boolean
  dataTreeNotConvert: IContentCompleted[]
  setValue: UseFormSetValue<any>
}

const getCompletedKeys = (data: ICourseSections[]): string[] => {
  let result: string[] = []

  data.forEach((item) => {
    if (item.is_completed) {
      result.push(item.key as string)
    }
    if (item?.children?.length > 0) {
      result = result.concat(getCompletedKeys(item.children))
    }
  })

  return result
}
const convertToTreeData = (
  data: IContentCompleted[],
  parentKey: string = '_',
) => {
  return data.map((schedule) => {
    // them id parent cho các id item không bị trùng
    const currentKey = `${parentKey}${schedule.class_schedule_id}`
    const isMain = schedule.main
    return {
      title: (
        <>
          {schedule.class_schedule_name || schedule.schedule_name}
          {isMain && (
            <span className="badge ml-3 rounded-md bg-[#ECF0FD] px-2 px-4 py-1 text-sm font-medium text-[#3964EA]">
              Main
            </span>
          )}
        </>
      ),
      key: currentKey,
      is_completed: schedule.is_completed,
      children: schedule.course_sections.map((section: ICourseSections) =>
        convertSection(section, currentKey),
      ),
    }
  })
}

const convertSection: any = (
  section: ICourseSections,
  parentKey: string = '',
) => {
  const currentKey = `${parentKey}_${section.id}`
  return {
    title: section.name,
    key: currentKey,
    is_completed: section.is_completed,
    children: section?.children?.map((child: ICourseSections) =>
      convertSection(child, currentKey),
    ),
  }
}

const getAllKeys = (treeData: TreeDataNode[]): string[] => {
  let keys: string[] = []

  treeData.forEach((node) => {
    keys.push(node.key as string)
    if (node.children && node.children.length > 0) {
      keys = keys.concat(getAllKeys(node.children))
    }
  })

  return keys
}

const TreeProgress = ({
  isView,
  dataTreeNotConvert,
  setValue,
}: TreeTicketProps) => {
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([])
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([])
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([])
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true)
  const [treeData, setTreeData] = useState<TreeDataNode[]>([])

  const onExpand: TreeProps['onExpand'] = (expandedKeysValue) => {
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    setExpandedKeys(expandedKeysValue)
    setAutoExpandParent(false)
  }

  const onCheck: TreeProps['onCheck'] = (checkedKeysValue) => {
    const newCheckedKeys = checkedKeysValue as string[]
    setCheckedKeys(checkedKeysValue as React.Key[])
    setValue('checkedNodes', newCheckedKeys, { shouldValidate: true })
  }

  const onSelect: TreeProps['onSelect'] = (selectedKeysValue, info) => {
    setSelectedKeys(selectedKeysValue)
  }

  useEffect(() => {
    const dataCVTree: any = convertToTreeData(dataTreeNotConvert)
    setTreeData(dataCVTree)
    const completedKeys = getCompletedKeys(dataCVTree)
    setCheckedKeys(completedKeys)
    setValue('checkedNodes', completedKeys)
    setExpandedKeys(getAllKeys(dataCVTree))
  }, [dataTreeNotConvert])

  return (
    <Tree
      checkable={!isView}
      onExpand={onExpand}
      expandedKeys={expandedKeys}
      autoExpandParent={autoExpandParent}
      onCheck={onCheck}
      checkedKeys={checkedKeys}
      onSelect={onSelect}
      selectedKeys={selectedKeys}
      treeData={treeData}
      className={styles.lessonFormTree}
      switcherIcon={({ expanded }) =>
        expanded ? <SwitcherExpanded /> : <SwitcherClosed />
      }
    />
  )
}

export default memo(TreeProgress)
