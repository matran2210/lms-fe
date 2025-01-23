import { CloseIcon } from '@assets/icons'
import FullScreenLayout from '@components/layout/FullScreenLayout'
import QuizResult from '@components/quiz/quiz-result'

const QuizResultPage = () => {
  return (
    <FullScreenLayout title="Quiz result">
      <div className="m-auto max-w-screen-lg overflow-x-auto overflow-y-hidden px-6">
        <div
          className="absolute right-6 top-[18px]  z-10 ml-auto cursor-pointer"
          // onClick={() => {
          //   router.back()
          // }}
        >
          <CloseIcon className="transform stroke-bw-1 transition-all duration-300 ease-in-out group-hover:stroke-primary" />
        </div>
        <QuizResult />
      </div>
    </FullScreenLayout>
  )
}

export default QuizResultPage
