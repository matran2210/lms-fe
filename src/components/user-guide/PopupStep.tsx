import SappButton from '@components/base/button/SappButton'
import Image, { StaticImageData } from 'next/image'
import { useRef } from 'react'
import { useAppDispatch } from 'src/redux/hook'
import { decrement, increment, reset } from 'src/redux/slice/Course/UserGuide'

type Props = {
  content: string
  index: number
  total: number
  className?: string
  titleButtonNext?: string
  title?: string
  imgSrc?: StaticImageData
  isEnd?: boolean
}

const PopupStep = ({
  content,
  index,
  total,
  className = 'top-0 left-0',
  titleButtonNext,
  title,
  imgSrc,
  isEnd,
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
    dispatch(reset())

    if (confirmDialogRef.current) {
      confirmDialogRef.current.classList.add('animate-jump-out')
      confirmDialogRef.current.classList.add('pointer-events-none')
    }
    // Remove hidden scroll when close user guide
    document.body.style.removeProperty('padding-right')
    document.body.classList.remove('overflow-hidden')
  }

  return (
    <>
      <div
        ref={confirmDialogRef}
        className={`absolute z-50 animate-jump-in rounded-xl bg-white p-4 ${className} w-[315px] text-bw-13`}
      >
        <div>
          {imgSrc && (
            <div className="mb-4 rounded-full">
              <Image
                src={imgSrc}
                alt={`Tour guide step ${index} - ${title}`}
                className="rounded-lg"
                layout="responsive"
              />
            </div>
          )}
          <h6 className="mb-3 text-lg font-bold">{title}</h6>
          <span className="text-base font-normal">{content}</span>
          <div
            className={`mt-5 flex items-center ${index === 1 ? 'justify-end' : 'justify-between'}`}
          >
            {isEnd === true ? (
              <SappButton
                title="Finish"
                className="px-5 py-2"
                size="small"
                isPadding={false}
                childClass="text-medium-sm"
                onClick={previousStep}
              />
            ) : (
              <>
                {index !== 1 && (
                  <SappButton
                    title="Previous"
                    className="px-5 py-2"
                    size="small"
                    isPadding={false}
                    childClass="text-medium-sm"
                    onClick={previousStep}
                  />
                )}
                <SappButton
                  title={titleButtonNext || 'Next'}
                  className="ml-3 bg-primary-3 px-5 py-2"
                  size="small"
                  isPadding={false}
                  childClass="text-medium-sm"
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
                  i + 1 === index ? 'bg-primary' : 'bg-gray-15'
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
