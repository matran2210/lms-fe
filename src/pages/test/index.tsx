import ButtonCancelSubmit from '@components/base/button/ButtonCancelSubmit'
import PaginationSAPP from '@components/base/pagination/PaginationSAPP'
import { formatTime } from '@components/common/timer'
import { LAYOUT } from '@utils/constants'
import { useState } from 'react'
const Test = () => {
  const [currentPage, setCurrentPage] = useState<any>(1)
  return (
    <div>
      {/* Header */}
      <div className="flex justify-between py-4 px-6">
        <div className="text-bw-1 text-xl font-bold">Name</div>
        <div className="text-bw-1 text-xl font-bold">{formatTime(0)}</div>
        <ButtonCancelSubmit
          className={'flex gap-4 flex-row-reverse'}
          // color={color}
          submit={{
            title: 'Finish',
            size: 'medium',
            loading: false,
            disabled: false,
            onClick: () => {},
            //   full: fullWidthBtn,
          }}
          cancel={{
            title: 'Quit',
            size: 'medium',
            onClick: () => {},
            loading: false,
            //   full: fullWidthBtn,
          }}
        ></ButtonCancelSubmit>
      </div>
      {/* End Header */}
      <div className="px-6">
        <PaginationSAPP
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalItems={35}
          type="row"
          pageSize={1}
        />
      </div>
    </div>
  )
}

// eslint-disable-next-line import/no-unused-modules
export default Test
Test.layout = LAYOUT.FULLSCREEN_LAYOUT
