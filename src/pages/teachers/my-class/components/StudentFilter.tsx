import HookFormTextField from '@components/base/textfield/HookFormTextField'
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
        placeholder="Search student"
        inputClassName="placeholder:text-sm placeholder:text-[#99A1B7] placeholder:font-medium"
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
