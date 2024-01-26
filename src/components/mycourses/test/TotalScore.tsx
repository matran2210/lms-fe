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
      className={`${className} bg-white flex flex-wrap flex-row justify-between w-full mb-6`}
    >
      <div className="block">
        <div className="text-xl font-medium leading-6.2 text-bw-1">
          Your Score
        </div>
        <div
          className={`${classScore} text-6px font-bold text-primary mt-2 font-inter`}
        >
          <>{score}%</>
        </div>
      </div>
      <div className={`${classGlobal} flex flex-row gap-1 w-fit items-start`}>
        <img
          src="https://file.rendit.io/n/XnLyBdd8onI3Zbp3i20X.svg"
          alt="Globe"
          id="Globe"
          className="w-4"
        />
        <div className={`text-base leading-4.9 text-gray-1 ${classCountAll}`}>
          Global Average {globalAverage}%
        </div>
      </div>
    </div>
  )
}

export default TotalScore
