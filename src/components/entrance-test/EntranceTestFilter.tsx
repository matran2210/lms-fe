import FilterCourse from '@components/mycourses/FilterCourse'
import { defaultStatusEnstraceTest } from 'src/constants'

const EntranceTestFilter = ({ count }: { count: number }) => {
  return (
    <div className="flex filter">
      <div className="flex self-center pl-6 filter">
        <FilterCourse
          totalResult={count || 0}
          listFilter={[
            {
              name: 'attempt_status',
              placeholder: 'Status',
              options: defaultStatusEnstraceTest,
            },
          ]}
        />
      </div>
    </div>
  )
}

export default EntranceTestFilter
