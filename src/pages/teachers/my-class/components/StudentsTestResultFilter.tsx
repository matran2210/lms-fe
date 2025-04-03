import { SearchIcon } from '@assets/icons'
import HookFormTextField from '@components/base/textfield/HookFormTextField'
import SappHookFormSelect from '@components/base/select/SappHookFormSelect'
import { Control } from 'react-hook-form'
import { QUIZ_TYPE } from 'src/type/classes'
import { convertQuizType } from '@utils/index'
import { QUIZ_GRADING_METHOD } from '@utils/constants'
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
        name="quiz_type"
        required
        className="select-single-custom w-full"
        placeholder="Type"
        options={Object.keys(QUIZ_TYPE).map((key) => ({
          label: convertQuizType(key),
          value: QUIZ_TYPE[key as keyof typeof QUIZ_TYPE],
        }))}
      />
      <SappHookFormSelect
        control={control}
        name="grading_method"
        required
        className="select-single-custom w-full"
        placeholder="Manual Grading"
        options={QUIZ_GRADING_METHOD}
      />
    </div>
  )
}

export default StudentsTestResultFilter
