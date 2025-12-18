import { SearchIcon } from '@lms/assets'
import { CLASS_SUFFIX_TYPE } from '@lms/core'
import { HookFormTextField, SappHookFormSelect } from '@lms/ui'
import { Control } from 'react-hook-form'
interface IProps {
  control: Control<any>
}

const ClassResourceTeacherFilter: React.FC<IProps> = ({
  control,
}) => {
  return (
    <div className="grid grid-cols-4 gap-4">
      <HookFormTextField
        control={control}
        name="search_key"
        placeholder={'Search class resource'}
        placeholderIcon={<SearchIcon />}
        inputClassName="placeholder:text-sm placeholder:text-[#99A1B7] placeholder:font-medium"
        style={{
          borderRadius: '6px',
          height: 40,
        }}
      />
      <SappHookFormSelect
        control={control}
        name="suffix_types"
        isSelectCustom
        placeholder="Type"
        options={CLASS_SUFFIX_TYPE}
      />
    </div>
  )
}

export default ClassResourceTeacherFilter
