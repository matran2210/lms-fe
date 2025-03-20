import { useState } from 'react'
import { Checkbox, DatePicker, Input, InputNumber, Tree } from 'antd'
const EditProgress = () => {
  const [checkedKeys, setCheckedKeys] = useState<string[]>([
    '0-0-0',
    '0-0-1-0',
    '0-0-1-1',
  ])

  const onCheck = (checkedKeysValue: any) => {
    setCheckedKeys(checkedKeysValue)
  }

  const treeData = [
    {
      title: 'Section',
      key: '0-0',
      children: [
        {
          title: 'Subsection 1',
          key: '0-0-0',
          children: [
            { title: 'Unit 1', key: '0-0-0-0' },
            { title: 'Unit 2', key: '0-0-0-1' },
            { title: 'Unit 3', key: '0-0-0-2' },
          ],
        },
        {
          title: 'Subsection 2',
          key: '0-0-1',
          children: [
            { title: 'Unit 1', key: '0-0-1-0' },
            { title: 'Unit 2', key: '0-0-1-1' },
          ],
        },
      ],
    },
    { title: 'Section', key: '0-1' },
    { title: 'Section', key: '0-2' },
  ]

  return (
    <div>
      <div className="mb-4">
        <label className="mb-1 block font-bold text-gray-700">
          Ngày Học <span className="text-red-500">*</span>
        </label>
        <DatePicker className="w-full" placeholder="Chọn ngày học" />
      </div>
      <div className="mb-4">
        <label className="mb-1 block font-bold text-gray-700">
          Số Giờ <span className="text-red-500">*</span>
        </label>
        <InputNumber className="w-full" min={1} defaultValue={3} />
      </div>
      <div className="mb-4">
        <label className="mb-1 block font-bold text-gray-700">Note</label>
        <Input.TextArea placeholder="Please enter note" />
      </div>
      <div className="mb-4">
        <label className="mb-1 block font-bold text-gray-700">
          Content completed <span className="text-red-500">*</span>
        </label>
        <Tree
          checkable
          defaultExpandAll
          checkedKeys={checkedKeys}
          onCheck={onCheck}
          treeData={treeData}
          className="custom-tree"
        />
      </div>
    </div>
  )
}

export default EditProgress
