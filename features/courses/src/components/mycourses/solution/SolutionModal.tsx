import React from 'react'
import { SappModal } from "@lms/ui";
import { Dispatch, FC, SetStateAction } from "react";
import { Icon } from '@lms/assets'
import HeadingSolution from "./HeadingSolution";
import SolutionModalContent from "./SolutionModalContent";

// define the props for the confirm dialog component
export type EntrancePopupProps = {
  open: boolean;
  setOpen?: Dispatch<SetStateAction<boolean>>;
};

// create the confirm dialog component
const SolutionModal: FC<EntrancePopupProps> = ({ open, setOpen }) => {
  // Config ListResults
  const topics1Column = {
    topic:
      "<p>Time value of money equates cash flows that occur on different dates. Cash flows in the future must be discounted at appropriate interest rates to find the equivalent present value. With a one-year interest rate of 5%, receiving $100 today is equivalent to receiving $105 in one year. Time value of money equates cash flows that occur on different dates. Cash flows in the future must be discounted at appropriate interest rates to find the equivalent present value.</p><p>Time value of money equates cash flows that occur on different dates. Cash flows in the future must be discounted at appropriate interest rates to find the equivalent present value. With a one-year interest rate of 5%, receiving $100 today is equivalent to receiving $105 in one year.</p>",
  };

  const topics2Column = {
    topic:
      '<div class="content"><p>River Manufacturing is one of many companies in an industry that make a food product. Deep River units are identical up to the point they are labeled. Deep River produces its labeled brand, which sells for $2.20 per unit, and “house brands” for seven different grocery chains which sell for $2.00 per unit. Each grocery chain sells both the Deep River brand and its house brand. The best characterization of Deep River’s market is:</p><p>Time value of money equates cash flows that occur on different dates. Cash flows in the future must be discounted at appropriate interest rates to find the equivalent present value. With a one-year interest rate of 5%, receiving $100 today is equivalent to receiving $105 in one year.</p><p>River Manufacturing is one of many companies in an industry that make a food product. Deep River units are identical up to the point they are labeled. Deep River produces its labeled brand, which sells for $2.20 per unit, and “house brands” for seven different grocery chains which sell for $2.00 per unit. Each grocery chain sells both the Deep River brand and its house brand. The best characterization of Deep River’s market is:</p><img src="https://cdn-dev.sapp.edu.vn/user/user-7bc33a23-ea7e-4771-ace8-dd3d443525b2/1701335465864_AVATAR.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=YR49Y7YONQ082E4HT8O6%2F20231130%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Date=20231130T091106Z&X-Amz-Expires=3600&X-Amz-Signature=190818217b831315e71517d6c87529eb15d870a52eef53eec4eece24fc5f9bf2&X-Amz-SignedHeaders=host&x-id=GetObject" /><p>Time value of money equates cash flows that occur on different dates. Cash flows in the future must be discounted at appropriate interest rates to find the equivalent present value. With a one-year interest rate of 5%, receiving $100 today is equivalent to receiving $105 in one year.</p><p>River Manufacturing is one of many companies in an industry that make a food product. Deep River units are identical up to the point they are labeled. Deep River produces its labeled brand, which sells for $2.20 per unit, and “house brands” for seven different grocery chains which sell for $2.00 per unit. Each grocery chain sells both the Deep River brand and its house brand. The best characterization of Deep River’s market is:</p><p>Time value of money equates cash flows that occur on different dates. Cash flows in the future must be discounted at appropriate interest rates to find the equivalent present value. With a one-year interest rate of 5%, receiving $100 today is equivalent to receiving $105 in one year.</p></div>',
  };

  // const solutions1Column = {
  //   solution:
  //     '<p>The total cost could be reduced with lower input rates or an increase in productivity of the inputs. Productivity vip gains will increase profitability, increase the market value of the company, and increase worker rewards.</p><p>Time value of money equates cash flows that occur on different dates. Cash flows in the future must be discounted at appropriate interest rates to find the equivalent present value. With a one-year interest rate of 5%, receiving $100 today is equivalent to receiving $105 in one year.</p><p>Time value of money equates cash flows that occur on different dates. Cash flows in the future must be discounted at appropriate interest rates to find the equivalent present value. With a one-year interest rate of 5%, receiving $100 today is equivalent to receiving $105 in one year. Time value of money equates cash flows that occur on different dates. Cash flows in the future must be discounted at appropriate interest rates to find the equivalent present value. The total cost could be reduced with lower input rates or an increase in productivity of the inputs. Productivity vip gains will increase profitability, increase the market value of the company, and increase worker rewards.</p><p>Time value of money equates cash flows that occur on different dates. Cash flows in the future must be discounted at appropriate interest rates to find the equivalent present value. With a one-year interest rate of 5%, receiving $100 today is equivalent to receiving $105 in one year. Time value of money equates cash flows that occur on different dates. Cash flows in the future must be discounted at appropriate interest rates to find the equivalent present value. The total cost could be reduced with lower input rates or an increase in productivity of the inputs. Productivity vip gains will increase profitability, increase the market value of the company, and increase worker rewards.</p>',
  // }

  const solutions2Column = {
    solution:
      "<p>The total cost could be reduced with lower input rates or an increase in productivity of the inputs. Productivity vip gains will increase profitability, increase the market value of the company, and increase worker rewards.</p><p>Time value of money equates cash flows that occur on different dates. Cash flows in the future must be discounted at appropriate interest rates to find the equivalent present value. With a one-year interest rate of 5%, receiving $100 today is equivalent to receiving $105 in one year.</p><p>Time value of money equates cash flows that occur on different dates. Cash flows in the future must be discounted at appropriate interest rates to find the equivalent present value. With a one-year interest rate of 5%, receiving $100 today is equivalent to receiving $105 in one year. Time value of money equates cash flows that occur on different dates. Cash flows in the future must be discounted at appropriate interest rates to find the equivalent present value. The total cost could be reduced with lower input rates or an increase in productivity of the inputs. Productivity vip gains will increase profitability, increase the market value of the company, and increase worker rewards.</p><p>Time value of money equates cash flows that occur on different dates. Cash flows in the future must be discounted at appropriate interest rates to find the equivalent present value. With a one-year interest rate of 5%, receiving $100 today is equivalent to receiving $105 in one year. Time value of money equates cash flows that occur on different dates. Cash flows in the future must be discounted at appropriate interest rates to find the equivalent present value. The total cost could be reduced with lower input rates or an increase in productivity of the inputs. Productivity vip gains will increase profitability, increase the market value of the company, and increase worker rewards.</p><p>Time value of money equates cash flows that occur on different dates. Cash flows in the future must be discounted at appropriate interest rates to find the equivalent present value. With a one-year interest rate of 5%, receiving $100 today is equivalent to receiving $105 in one year. Time value of money equates cash flows that occur on different dates. Cash flows in the future must be discounted at appropriate interest rates to find the equivalent present value. The total cost could be reduced with lower input rates or an increase in productivity of the inputs. Productivity vip gains will increase profitability, increase the market value of the company, and increase worker rewards.</p><p>Time value of money equates cash flows that occur on different dates. Cash flows in the future must be discounted at appropriate interest rates to find the equivalent present value. With a one-year interest rate of 5%, receiving $100 today is equivalent to receiving $105 in one year. Time value of money equates cash flows that occur on different dates. Cash flows in the future must be discounted at appropriate interest rates to find the equivalent present value. The total cost could be reduced with lower input rates or an increase in productivity of the inputs. Productivity vip gains will increase profitability, increase the market value of the company, and increase worker rewards.</p><p>Time value of money equates cash flows that occur on different dates. Cash flows in the future must be discounted at appropriate interest rates to find the equivalent present value. With a one-year interest rate of 5%, receiving $100 today is equivalent to receiving $105 in one year. Time value of money equates cash flows that occur on different dates. Cash flows in the future must be discounted at appropriate interest rates to find the equivalent present value. The total cost could be reduced with lower input rates or an increase in productivity of the inputs. Productivity vip gains will increase profitability, increase the market value of the company, and increase worker rewards.</p>",
  };

  const handleOnClick = () => {
    setOpen && setOpen(false);
  };

  return (
    <>
      <SappModal
        open={open}
        setOpen={setOpen}
        size="solution w-full"
        refClass="max-h-100vh h-full animate-jump-in relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all top-1/2 -translate-y-1/2"
        childClass=""
        parentChildClass=""
        footerButtonClassName="justify-center flex flex-row-reverse"
        color="danger"
        showHeader={false}
        showFooter={false}
      >
        <HeadingSolution question="Question and Solution: 3 of 4" />
        <div
          className="close-action absolute right-4 top-2 cursor-pointer p-4"
          onClick={() => {
            handleOnClick();
          }}
        >
          <Icon type="arrows" />
        </div>

        {/* // Demo solution popup 1 column and 2 column */}
        {/* <SolutionModalContent topic={topics1Column.topic} solution={solutions1Column.solution} type1column={true} /> */}
        <SolutionModalContent
          topic={topics2Column?.topic}
          solution={solutions2Column?.solution}
          type1column={false}
        />
      </SappModal>
    </>
  );
};

export default SolutionModal;
