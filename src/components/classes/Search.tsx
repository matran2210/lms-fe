import { Input } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import SappHookFormSelect from '@components/base/select/SappHookFormSelect'
import HookFormSelect from '@components/base/select/HookFormSelect'
import HookFormTextField from '@components/base/textfield/HookFormTextField'
interface SearchStudentInputProps {
  placeholder?: string
  width?: string
  control?: any
  listUniverPrograms?: any
}

const SearchStudentInput: React.FC<SearchStudentInputProps> = ({
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
        inputClassName="placeholder:font-normal placeholder:text-[#99A1B7] placeholder:text-[14px] "
        style={{
          borderRadius: '6px',
          height: 40,
        }}
      />
      <SappHookFormSelect
        control={control}
        name="univers_program_id"
        required
        className="select-single-custom w-full"
        placeholder="Select one option"
        options={listUniverPrograms}
      />
      <SappHookFormSelect
        control={control}
        name="univers_program_id"
        required
        className="select-single-custom w-full"
        placeholder="Select one option"
        options={listUniverPrograms}
      />
      <SappHookFormSelect
        control={control}
        name="univers_program_id"
        required
        className="select-single-custom w-full"
        placeholder="Select one option"
        options={listUniverPrograms}
      />
    </div>
  )
}

export default SearchStudentInput
