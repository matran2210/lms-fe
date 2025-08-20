import ButtonSecondary from '@components/base/button/ButtonSecondary'
import { trackGAEvent } from '@utils/google-analytics'
import { ICourseAction } from 'src/type/courses-3-level/course'

export default function CourseAction({
  determineButtonToShow,
  isActiveStudent,
  courseAction,
}: ICourseAction) {
  return (
    <div className="action relative flex w-full items-center justify-end lg:w-auto">
      {determineButtonToShow !== 'Disabled' ? (
        <ButtonSecondary
          title={
            determineButtonToShow === 'Active'
              ? 'Activate'
              : determineButtonToShow
          }
          full={false}
          size={'small'}
          className="ml-auto"
          onClick={() => {
            if (isActiveStudent) {
              courseAction()
            }
            trackGAEvent('CLick Button Course Item')
          }}
        />
      ) : (
        <div className="action relative flex h-8 items-center justify-end"></div>
      )}
    </div>
  )
}
