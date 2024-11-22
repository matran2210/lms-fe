import { formatNumber } from '@utils/formatNumber'
import { isNull, isUndefined } from 'lodash'
import Image from 'next/image'
interface IProps {
  score: number
  className?: string
  classScore?: string
  classGlobal?: string
  classCountAll?: string
  globalAverage?: number | string
  isGraded?: boolean
  gradedScore?: number
}

const TotalScore = ({
  score,
  className = '',
  classScore = '',
  classGlobal = '',
  classCountAll = '',
  globalAverage = '',
  isGraded,
  gradedScore,
}: IProps) => {
  return (
    <div
      className={`${className} flex w-full flex-row flex-wrap justify-between bg-white xl:mb-6 2xl:mb-8`}
    >
      <div className="flex w-full flex-row justify-between">
        <div className="block">
          <div className="mb-3 text-xl font-semibold text-bw-1 xl:font-medium">
            {isGraded ? 'Overall' : 'Multiple Choice Score'}
          </div>
          <div
            className={`${classScore} font-inter text-6xl font-bold text-primary xl:text-6xl`}
          >
            {isGraded && !isNull(gradedScore) && !isUndefined(gradedScore)
              ? formatNumber(gradedScore)
              : score !== undefined
                ? formatNumber(score)
                : '--'}
            %
          </div>
        </div>
        <div className="flex flex-row">
          <div
            className={`${classGlobal} flex w-fit flex-row items-start gap-1`}
          >
            <Image
              src="https://file.rendit.io/n/XnLyBdd8onI3Zbp3i20X.svg"
              width={16}
              height={16}
              alt="Globe"
            />
            <div className={`text-sm leading-4.9 text-gray-1 ${classCountAll}`}>
              Global Average {globalAverage}%
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TotalScore
