import ButtonPrimary from '@components/base/button/ButtonPrimary'
import React from 'react'

interface MultipleQuestionProps {
  data: {
    id: number
    status: string
    type: string
  }[]
}

const MultipleQuestion: React.FC<MultipleQuestionProps> = ({ data }) => {
  const renderBoxes = (type: string) => {
    const filteredData = data.filter((item) => item.type === type)

    const renderBoxItems = filteredData.map((item) => {
      let className =
        'text-center font-sans font-medium leading-8.5 border-solid flex flex-row justify-center pt-3 w-16 h-16 items-start border'

      if (item.status === 'true') {
        className += ' text-state-success border-success'
      } else {
        className += ' text-danger border-error'
      }

      return (
        <div key={item.id} className={className}>
          {item.id}
        </div>
      )
    })

    return (
      <div className="w-full">
        <div className="text-xl font-bold mb-4">{type}</div>
        <div className="flex flex-col gap-3 w-full items-start">
          {renderBoxItems}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white flex flex-col justify-between max-w-[420px] h-[991px] items-start pl-6 py-6">
      <div className="flex flex-col gap-10 w-full items-start">
        <div className="flex flex-col gap-6 w-full items-start">
          {renderBoxes('Multiple Question')}
          {renderBoxes('Constructed Questions')}
        </div>
      </div>
      <div className="flex justify-between mt-auto w-full">
        <div className="mr-4 w-[200px]">
          <div className="inline-block h-4 w-4 rounded-full bg-success mr-1"></div>
          <span className="text-state-success font-light">Correct</span>
        </div>
        <div className="mr-4 w-[200px]">
          <div className="inline-block h-4 w-4 rounded-full bg-error mr-1 "></div>
          <span className="text-danger font-light">Incorrect</span>
        </div>
        <div className="flex justify-end mt-auto w-full pr-7">
          <ButtonPrimary title={'Quit'} />
        </div>
      </div>
    </div>
  )
}

export default MultipleQuestion
