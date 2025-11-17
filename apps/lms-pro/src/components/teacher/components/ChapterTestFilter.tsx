import { SearchIcon } from '@assets/icons'
import { HookFormTextField } from '@lms/ui'
import { SappHookFormSelect } from '@lms/ui'
import { Control } from 'react-hook-form'
import { QUIZ_ATTEMPT_STATUS_AUTO } from '@lms/core'
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
        inputClassName="placeholder:text-sm placeholder:text-[#99A1B7] placeholder:font-medium"
        style={{
          borderRadius: '6px',
          height: 40,
        }}
      />
      <SappHookFormSelect
        control={control}
        name="status"
        isSelectCustom
        placeholder="Status"
        options={QUIZ_ATTEMPT_STATUS_AUTO}
      />
    </div>
  )
}

export default ChapterTestFilter
