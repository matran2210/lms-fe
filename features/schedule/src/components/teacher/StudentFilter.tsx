import { SearchIcon } from '@lms/assets'
import { HookFormTextField } from '@lms/ui'
import { Control } from 'react-hook-form'
interface StudentFilterProps {
  control: Control<any>
}

const StudentFilter: React.FC<StudentFilterProps> = ({ control }) => {
  return (
    <div className="flex gap-6">
      <HookFormTextField
        control={control}
        name="text"
        placeholder={'Search student'}
        placeholderIcon={<SearchIcon />}
        inputClassName="placeholder:text-sm placeholder:text-accent placeholder:font-medium"
        style={{
          borderRadius: '6px',
          height: 40,
          width: 330,
        }}
      />
    </div>
  )
}

export default StudentFilter
