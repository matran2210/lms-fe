import { SearchIcon } from '@lms/assets'
import { QUIZ_GRADING_METHOD, TEST_TYPE_ENUM } from '@lms/core'
import { HookFormTextField, SappHookFormSelect } from '@lms/ui'
import { convertQuizType } from '@lms/utils'
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
        name="quiz_name"
        placeholder={'Search test/quiz'}
        placeholderIcon={<SearchIcon />}
        inputClassName="placeholder:text-sm placeholder:text-accent placeholder:font-medium"
        style={{
          borderRadius: '6px',
          height: 40,
        }}
      />
      <SappHookFormSelect
        control={control}
        name="quiz_type"
        isSelectCustom
        placeholder="Type"
        options={Object.keys(TEST_TYPE_ENUM).map((key) => ({
          label: convertQuizType(key),
          value: TEST_TYPE_ENUM[key as keyof typeof TEST_TYPE_ENUM],
        }))}
      />
      <SappHookFormSelect
        control={control}
        name="grading_method"
        isSelectCustom
        placeholder="Manual Grading"
        options={QUIZ_GRADING_METHOD}
      />
    </div>
  )
}

export default StudentsTestResultFilter
