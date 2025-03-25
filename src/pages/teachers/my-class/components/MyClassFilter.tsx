import SappHookFormSelect from '@components/base/select/SappHookFormSelect'
import HookFormTextField from '@components/base/textfield/HookFormTextField'
interface MyClassFilterProps {
  placeholder?: string
  width?: string
  control?: any
  listUniverPrograms?: any
}

const MyClassFilter: React.FC<MyClassFilterProps> = ({
  placeholder = 'Search student',
  width = 'max-w-sm',
  control,
  listUniverPrograms,
}) => {
  return (
    <div className="flex gap-6">
      <HookFormTextField
        control={control}
        name="course_name"
        placeholder="Search course name"
        inputClassName="placeholder:text-sm placeholder:text-[#99A1B8]"
        style={{
          borderRadius: '6px',
          height: 40,
        }}
      />
      <SappHookFormSelect
        control={control}
        name="program"
        required
        className="select-single-custom w-full"
        placeholder="Program"
        options={listUniverPrograms}
      />
      <SappHookFormSelect
        control={control}
        name="univers_program_id"
        required
        className="select-single-custom w-full"
        placeholder="Status"
        options={listUniverPrograms}
      />
      <SappHookFormSelect
        control={control}
        name="univers_program_id"
        required
        className="select-single-custom w-full"
        placeholder="Belong to"
        options={listUniverPrograms}
      />
    </div>
  )
}

export default MyClassFilter
