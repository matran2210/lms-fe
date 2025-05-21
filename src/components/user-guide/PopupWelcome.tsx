import ButtonText from '@components/base/button/ButtonText'
import SappButton from '@components/base/button/SappButton'
import { RefObject } from 'react'
import SappModal from 'src/components/base/modal/SappModal'
import { HandShake } from 'src/components/icons'
import { UserGuide } from 'src/constants'
import { CoursesAPI } from 'src/pages/api/courses'
import { useAppDispatch } from 'src/redux/hook'
import { clearGuideState, increment } from 'src/redux/slice/Course/UserGuide'

type Props = {
  confirmDialogOverLayRef: RefObject<HTMLDivElement>
}

const PopupWelcome = ({ confirmDialogOverLayRef }: Props) => {
  const dispatch = useAppDispatch()
  const handleNextStep = async () => {
    dispatch(increment())
    await activeUserGuide()
  }

  async function activeUserGuide() {
    try {
      await CoursesAPI.userGuideActive()
    } catch (error) {}
  }
  const closeUserGuide = () => {
    if (confirmDialogOverLayRef.current) {
      confirmDialogOverLayRef.current.classList.add('animate-fade-out-overlay')
      confirmDialogOverLayRef.current.classList.add('pointer-events-none')
    }
    // Remove hidden scroll when close user guide
    document.body.style.removeProperty('padding-right')
    document.body.classList.remove('overflow-hidden')
    setTimeout(() => {
      dispatch(clearGuideState())
    }, 50)
  }

  return (
    <>
      <SappModal
        open={true}
        okButtonCaption={'Yes'}
        cancelButtonCaption={'No'}
        size="max-w-[540px]"
        position="center"
        showHeader={false}
        showFooter={false}
        childClass={'text-center p-'}
        overlayClass={'!hidden'}
        isContentFull={true}
        refClass={
          'animate-jump-in relative transform overflow-hidden shadow-xl transition-all rounded-xl'
        }
      >
        <div className="flex flex-col items-center p-10 text-bw-13">
          <HandShake />
          <h2 className="mb-8 mt-10 text-3xl font-bold ">
            {UserGuide.TITLE_WELCOME}
          </h2>
          <span className="text-medium-s">{UserGuide.CONTENT_WELCOME}</span>
          <SappButton
            title={UserGuide.CONTENT_BUTTON}
            full={true}
            className="mt-10"
            size="medium"
            onClick={() => handleNextStep()}
          />
          <ButtonText
            title={'Skip'}
            className="mt-3"
            onClick={closeUserGuide}
          />
        </div>
      </SappModal>
    </>
  )
}

export default PopupWelcome
