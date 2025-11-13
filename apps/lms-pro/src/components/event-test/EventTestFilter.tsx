import FilterCourse from '@components/mycourses/FilterCourse'
import { defaultStatusEventTest } from 'src/constants'

const EventTestFilter = ({ count }: { count: number }) => {
  return (
    <div className="flex filter">
      <div className="flex self-center pl-6 filter">
        <FilterCourse
          totalResult={count || 0}
          listFilter={[
            {
              name: 'attempt_status',
              placeholder: 'Status',
              options: defaultStatusEventTest,
            },
          ]}
        />
      </div>
    </div>
  )
}

export default EventTestFilter
