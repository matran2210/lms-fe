import { formatNumber } from '@lms/utils'
import { isNull, isUndefined } from 'lodash'
import Image from 'next/image'
interface IProps {
  score?: number
  className?: string
  classScore?: string
  classGlobal?: string
  classCountAll?: string
  globalAverage?: number | string
  isGraded?: boolean
}

const TotalScore = ({
  score,
  className = '',
  classScore = '',
  classGlobal = '',
  classCountAll = '',
  globalAverage = '',
  isGraded,
}: IProps) => {
  return (
    <div
      className={`${className} flex w-full flex-row flex-wrap justify-between bg-white xl:mb-6 2xl:mb-8`}
    >
      <div className="flex w-full flex-row justify-between">
        <div className="block">
          <div className="mb-3 text-xl font-semibold text-gray-800 xl:font-medium">
            {isGraded ? 'Overall Score' : 'Multiple Choice Score'}
          </div>
          <div
            className={`${classScore} font-inter text-6xl font-bold text-primary xl:text-6xl`}
          >
            {!isNull(score) && !isUndefined(score) ? formatNumber(score) : '--'}
            %
          </div>
        </div>
        <div className="flex items-end">
          <div
            className={`${classGlobal} mb-2 flex w-fit flex-row items-center gap-1`}
          >
            <Image
              src="https://file.rendit.io/n/XnLyBdd8onI3Zbp3i20X.svg"
              width={16}
              height={16}
              alt="Globe"
            />
            <div className={`text-sm leading-4.9 text-gray ${classCountAll}`}>
              Global Average {globalAverage}%
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TotalScore
