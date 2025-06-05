type Props = {
  show: boolean
}

const YourAnswer = ({ show }: Props) => {
  return (
    <>
      {show && (
        <span className="inline-block max-h-5.5 whitespace-nowrap rounded-sm border border-[#DCDDDD] bg-[#ECF0FD] px-2 text-xs font-normal text-[#3964EA]">
          Your Answer
        </span>
      )}
    </>
  )
}

export default YourAnswer
