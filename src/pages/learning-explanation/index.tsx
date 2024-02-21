import SAPPCheckbox from '@components/base/checkbox/SAPPCheckbox'
import { LAYOUT } from '@utils/constants'
import React from 'react'
import prev from '@assets/images/prev.svg'
import next from '@assets/images/next.svg'
import arrows from '@assets/images/arrows.svg'
import Image from 'next/image'

const LearningExplanation = () => {
  return (
    <div>
      <div className="bg-gray-3 h-[60px] flex justify-between items-center">
        <div></div>
        <div className="flex">
          <Image src={prev} alt="" priority={true} />
          <span className="text-bw-1 text-base font-normal mx-1">
            Question and Solution: 3 of 4
          </span>
          <Image src={next} alt="" priority={true} />
        </div>
        <div className="me-7">
          <Image src={arrows} alt="" priority={true} />
        </div>
      </div>

      <div className=" main max-w-[950px] my-0 mx-auto">
        <div className="mt-6 text-bw-1 font-normal text-base">
          Time value of money equates cash flows that occur on different dates.
          Cash flows in the future must be discounted at appropriate interest
          rates to find the equivalent present value. With a one-year interest
          rate of 5%, receiving $100 today is equivalent to receiving $105 in
          one year. Time value of money equates cash flows that occur on
          different dates. Cash flows in the future must be discounted at
          appropriate interest rates to find the equivalent present value.
        </div>
        <div className="mt-6 text-bw-1 font-normal text-base">
          Time value of money equates cash flows that occur on different dates.
          Cash flows in the future must be discounted at appropriate interest
          rates to find the equivalent present value. With a one-year interest
          rate of 5%, receiving $100 today is equivalent to receiving $105 in
          one year.
        </div>
        <div className="mt-6 text-bw-1 font-semibold text-base">
          Question: With a one-year interest rate of 5%, receiving $100 today is
          equivalent to receiving $105 in one year.
        </div>
        <div className="mt-4 flex items-center">
          <SAPPCheckbox state="error" onChange={() => {}} checked={true} />
          <div className="ms-3  text-state-error font-normal text-base">
            Cash flows in the future must be discounted at appropriate interest
            rates to find the equivalent.
          </div>
        </div>
        <div className="mt-4 flex items-center">
          <SAPPCheckbox state="error" onChange={() => {}} checked={false} />
          <div className="ms-3  text-bw-1 font-normal text-base">
            Cash flows in the future must be discounted at appropriate interest
            rates to find the equivalent.
          </div>
        </div>
        <div className="mt-4 flex items-center">
          <SAPPCheckbox state="success" onChange={() => {}} checked={true} />
          <div className="ms-3  text-state-success font-normal text-base">
            Cash flows in the future must be discounted at appropriate interest
            rates to find the equivalent.
          </div>
        </div>
        <div className="mt-6">
          <div className="bg-gray-4 px-6 pt-6 py-11">
            <div className="text-bw-1 font-semibold text-base">Solution</div>
            <div className="mt-4 text-bw-1 font-normal text-base">
              The total cost could be reduced with lower input rates or an
              increase in productivity of the inputs. Productivity vip gains
              will increase profitability, increase the market value of the
              company, and increase worker rewards.
            </div>
            <div className="mt-8 text-bw-1 font-normal text-base">
              Time value of money equates cash flows that occur on different
              dates. Cash flows in the future must be discounted at appropriate
              interest rates to find the equivalent present value. With a
              one-year interest rate of 5%, receiving $100 today is equivalent
              to receiving $105 in one year.
            </div>
            <div className="mt-8 text-bw-1 font-normal text-base">
              Time value of money equates cash flows that occur on different
              dates. Cash flows in the future must be discounted at appropriate
              interest rates to find the equivalent present value. With a
              one-year interest rate of 5%, receiving $100 today is equivalent
              to receiving $105 in one year. Time value of money equates cash
              flows that occur on different dates. Cash flows in the future must
              be discounted at appropriate interest rates to find the equivalent
              present value. The total cost could be reduced with lower input
              rates or an increase in productivity of the inputs. Productivity
              vip gains will increase profitability, increase the market value
              of the company, and increase worker rewards.
            </div>
            <div className="mt-8 text-bw-1 font-normal text-base">
              Time value of money equates cash flows that occur on different
              dates. Cash flows in the future must be discounted at appropriate
              interest rates to find the equivalent present value. With a
              one-year interest rate of 5%, receiving $100 today is equivalent
              to receiving $105 in one year. Time value of money equates cash
              flows that occur on different dates. Cash flows in the future must
              be discounted at appropriate interest rates to find the equivalent
              present value. The total cost could be reduced with lower input
              rates or an increase in productivity of the inputs. Productivity
              vip gains will increase profitability, increase the market value
              of the company, and increase worker rewards.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LearningExplanation
LearningExplanation.layout = LAYOUT.FULLSCREEN_LAYOUT
