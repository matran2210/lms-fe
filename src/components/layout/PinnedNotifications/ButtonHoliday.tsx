import React from 'react'

interface IProps {
  title: string
  onClick: () => void
  showButtonPrimay?: boolean
}

const ButtonHoliday = ({
  title,
  onClick,
  showButtonPrimay = false,
}: IProps) => {
  return (
    <>
      {showButtonPrimay ? (
        <button
          className={`bg-[#FFE095] font-semibold text-[#B40010] md:h-[28px] md:w-[130px] md:text-[10px] xl:h-[36px] xl:w-[160px] xl:text-sm`}
          onClick={onClick}
        >
          {title}
        </button>
      ) : (
        <button
          className={`bg-white font-semibold text-[#B40010] md:h-[28px] md:w-[130px] md:text-[10px] xl:h-[36px] xl:w-[160px] xl:text-sm`}
          onClick={onClick}
        >
          {title}
        </button>
      )}
    </>
  )
}

export default ButtonHoliday
