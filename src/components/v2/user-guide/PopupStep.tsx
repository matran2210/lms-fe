import ButtonPrimary from '@components/base/button/ButtonPrimary'
import ButtonText from '@components/base/button/ButtonText'
import Lottie from 'lottie-react'
import Image, { StaticImageData } from 'next/image'
import { useRef } from 'react'
import { useAppDispatch } from 'src/redux/hook'
import { decrement, increment } from 'src/redux/slice/Course/UserGuide'

type Props = {
  content: string
  index: number
  total: number
  className?: string
  titleButtonNext?: string
  title?: string
  handleCancel?: () => void
  imgSrc?: StaticImageData | object
  imgType?: 'static' | 'animation'
  isEnd?: boolean
}

const PopupStep = ({
  content,
  index,
  total,
  className = 'top-0 left-0',
  titleButtonNext,
  handleCancel,
  title,
  imgSrc,
  isEnd,
  imgType = 'animation',
}: Props) => {
  const dispatch = useAppDispatch()

  const nextStep = () => {
    dispatch(increment())
  }

  const previousStep = () => {
    dispatch(decrement())
  }
  const confirmDialogRef = useRef<HTMLDivElement>(null)
  const handleClose = () => {
    if (confirmDialogRef.current) {
      confirmDialogRef.current.classList.add('animate-jump-out')
      confirmDialogRef.current.classList.add('pointer-events-none')
    }
    // Remove hidden scroll when close user guide
    document.body.style.removeProperty('padding-right')
    document.body.classList.remove('overflow-hidden')
    handleCancel && handleCancel()
  }

  return (
    <>
      <div
        ref={confirmDialogRef}
        className={`absolute z-50 animate-jump-in rounded-xl bg-white p-4 ${className} w-[315px] text-gray-v2-800`}
      >
        <div>
          <div className={imgSrc && `mb-4`}>
            {(imgType === 'static' && typeof imgSrc === 'string') ||
            (typeof imgSrc === 'object' &&
              imgSrc !== null &&
              'src' in imgSrc) ? (
              <Image
                src={imgSrc as StaticImageData}
                alt={`Tour guide step ${index} - ${title}`}
                className="rounded-lg"
                layout="responsive"
              />
            ) : null}

            {imgType === 'animation' && imgSrc && (
              <Lottie animationData={imgSrc} loop={true} />
            )}
          </div>

          <h6 className="mb-3 text-lg font-bold">{title}</h6>
          <span className="text-base font-normal">{content}</span>
          <div
            className={`mt-3 flex items-center ${index === 1 ? 'justify-end' : 'justify-between'}`}
          >
            {isEnd === true ? (
              <ButtonPrimary
                title="Finish"
                size="small"
                onClick={handleClose}
                className="min-w-[84px]"
              />
            ) : (
              <>
                {index !== 1 && (
                  <ButtonText
                    title="Previous"
                    size="small"
                    onClick={previousStep}
                  />
                )}
                <ButtonPrimary
                  title={titleButtonNext || 'Next'}
                  className="ml-3 min-w-[84px]"
                  size="small"
                  onClick={index === total ? handleClose : nextStep}
                />
              </>
            )}
          </div>
          <div className="mt-4 flex justify-center gap-1">
            {Array.from({ length: total }, (_, i) => (
              <div
                key={i}
                className={`aspect-square h-[6px] w-[6px] rounded-full ${
                  i + 1 === index ? 'bg-primary' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default PopupStep
