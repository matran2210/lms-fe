import { Input } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import SappHookFormSelect from '@components/base/select/SappHookFormSelect'
import HookFormSelect from '@components/base/select/HookFormSelect'
import HookFormTextField from '@components/base/textfield/HookFormTextField'
interface StudentFilterProps {
  placeholder?: string
  width?: string
  control?: any
  listUniverPrograms?: any
}

const StudentFilter: React.FC<StudentFilterProps> = ({
  placeholder = 'Search student',
  width = 'max-w-sm',
  control,
  listUniverPrograms,
}) => {
  return (
    <div className="flex gap-6">
      <HookFormTextField
        control={control}
        name="class_name"
        placeholder="Search course name"
        inputClassName="placeholder:text-sm placeholder:text-[#99A1B8]"
        style={{
          borderRadius: '6px',
          height: 40,
        }}
      />
    </div>
  )
}

export default StudentFilter
