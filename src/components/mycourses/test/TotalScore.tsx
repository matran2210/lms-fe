import Image from 'next/image'
interface IProps {
  score: Number
  className?: string
  classScore?: string
  classGlobal?: string
  classCountAll?: string
  globalAverage?: number | string
}

const TotalScore = ({
  score,
  className = '',
  classScore = '',
  classGlobal = '',
  classCountAll = '',
  globalAverage = '',
}: IProps) => {
  return (
    <div
      className={`${className} bg-white flex flex-wrap flex-row justify-between w-full xl:mb-6 pr-6`}
    >
      <div className="flex flex-row justify-between w-full">
        <div className="block">
          <div className="text-6xl xl:text-xl font-semibold xl:font-medium text-bw-1">
            Multiple Choice Score
          </div>
          <div
            className={`${classScore} text-5.5xl xl:text-6xl font-bold text-primary mt-2 font-inter`}
          >
            <>{Math.floor(score as number)}%</>
          </div>
        </div>
        <div className="flex flex-row">
          <div
            className={`${classGlobal} flex flex-row gap-1 w-fit items-start`}
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
