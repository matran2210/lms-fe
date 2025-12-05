import { defaultStatusEventTest } from '@lms/core'
import { FilterCourse } from '@lms/feature-courses'

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
