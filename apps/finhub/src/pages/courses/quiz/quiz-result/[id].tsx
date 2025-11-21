import { QuizResults } from '@lms/feature-courses'
import { FullScreenLayout } from '@lms/ui'
import { CoursesAPI } from '@pages/api/courses'
import { PageLink } from 'src/constants/routes'
import withAuthorization from 'src/HOC/withAuthorization'
import { UserType } from 'src/redux/types/User/urser'
import { MENU_BOTTOM, MENU_ITEMS, MENU_ITEMS_EVENT } from 'src/constants/routes'

const QuizResultPage = () => {
  return (
    <FullScreenLayout title="Quiz result">
      <QuizResults
        api={CoursesAPI}
        pageLink={PageLink}
        menuBottom={MENU_BOTTOM}
        menuItems={MENU_ITEMS}
        menuItemsEvent={MENU_ITEMS_EVENT}
      />
    </FullScreenLayout>
  )
}

export default withAuthorization([UserType.STUDENT])(QuizResultPage)
