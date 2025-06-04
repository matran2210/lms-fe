type Props = {
  show: boolean
}

const YourAnswer = ({ show }: Props) => {
  return (
    <>
      {show && (
        <span className="inline-block max-h-5.5 whitespace-nowrap rounded-sm border border-gray-2 bg-blue-100 px-2 text-ssm font-normal text-blue-500">
          Your Answer
        </span>
      )}
    </>
  )
}

export default YourAnswer
