interface IProps {
  score: Number
  className?: string
  classScore?: string
  classGlobal?: string
}

const TotalScore = ({
  score,
  className = '',
  classScore = '',
  classGlobal = '',
}: IProps) => {
  return (
    <div
      className={`${className} bg-white flex flex-row justify-between w-full mb-6`}
    >
      <div className="block">
        <div className="text-xl font-bold leading-6.2 text-bw-1">
          Your Score
        </div>
        <div className={`${classScore} text-6px font-bold text-primary mt-2`}>
          <>{score}%</>
        </div>
      </div>
      <div
        className={`${classGlobal} flex flex-row mt-16 gap-1 w-fit items-start`}
      >
        <img
          src="https://file.rendit.io/n/XnLyBdd8onI3Zbp3i20X.svg"
          alt="Globe"
          id="Globe"
          className="w-4"
        />
        <div className="text-base leading-4.9 text-gray-1">
          Global Average 79%
        </div>
      </div>
    </div>
  )
}

export default TotalScore
