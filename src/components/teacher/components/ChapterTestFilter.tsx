import { SearchIcon } from '@assets/icons'
import HookFormTextField from '@components/base/textfield/HookFormTextField'
import SappHookFormSelect from '@components/base/select/SappHookFormSelect'
import { Control } from 'react-hook-form'
import { QUIZ_ATTEMPT_STATUS_AUTO } from 'src/constants'
interface ChapterTestFilterProps {
  control: Control<any>
}

const ChapterTestFilter: React.FC<ChapterTestFilterProps> = ({ control }) => {
  return (
    <div className="grid grid-cols-4 gap-4">
      <HookFormTextField
        control={control}
        name="search"
        placeholder={'Search student'}
        placeholderIcon={<SearchIcon />}
        inputClassName="placeholder:text-sm placeholder:text-gray-11 placeholder:font-medium"
        style={{
          borderRadius: '6px',
          height: 40,
        }}
      />
      <SappHookFormSelect
        control={control}
        name="status"
        isCustom
        placeholder="Status"
        options={QUIZ_ATTEMPT_STATUS_AUTO}
      />
    </div>
  )
}

export default ChapterTestFilter
