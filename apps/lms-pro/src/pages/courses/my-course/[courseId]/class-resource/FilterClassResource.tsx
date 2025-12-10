import { SAPPSelectV2 } from '@lms/ui'
import { useForm } from 'react-hook-form'

const FilterClassResource = () => {
  const { control } = useForm()
  return (
    <div className="flex justify-end gap-4">
      <div className="flex gap-2">
        <SAPPSelectV2
          control={control}
          name="type"
          placeholder="Type"
          options={[]}
          className="w-[143px]"
        />
        <SAPPSelectV2
          control={control}
          name="lesson"
          placeholder="Lesson"
          className="w-[143px]"
          options={[]}
        />
      </div>
    </div>
  )
}

export default FilterClassResource
