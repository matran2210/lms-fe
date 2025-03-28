import { SearchIcon } from '@assets/icons'
import HookFormTextField from '@components/base/textfield/HookFormTextField'
import SappHookFormSelect from '@components/base/select/SappHookFormSelect'
import { Control } from 'react-hook-form'
import { convertQuizType } from '@utils/index'
import { QUIZ_GRADING_METHOD, TEST_TYPE_ENUM } from '@utils/constants'
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
        inputClassName="placeholder:text-sm placeholder:text-gray-11 placeholder:font-medium"
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
        options={Object.keys(TEST_TYPE_ENUM).map((key) => ({
          label: convertQuizType(key),
          value: TEST_TYPE_ENUM[key as keyof typeof TEST_TYPE_ENUM],
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
