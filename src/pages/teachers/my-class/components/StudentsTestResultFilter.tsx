import { SearchIcon } from '@assets/icons'
import HookFormTextField from '@components/base/textfield/HookFormTextField'
import SappHookFormSelect from '@components/base/select/SappHookFormSelect'
import { Control } from 'react-hook-form'
interface StudentsTestResultFilterProps {
  control: Control<any>
}

const StudentsTestResultFilter: React.FC<StudentsTestResultFilterProps> = ({
  control,
}) => {
  return (
    <div className="grid grid-cols-4 gap-4">
      <HookFormTextField
        control={control}
        name="text"
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
        name="type"
        required
        className="select-single-custom w-full"
        placeholder="Type"
        options={[]}
      />
      <SappHookFormSelect
        control={control}
        name="univers_program_id"
        required
        className="select-single-custom w-full"
        placeholder="Manual Grading"
        options={[]}
      />
    </div>
  )
}

export default StudentsTestResultFilter
