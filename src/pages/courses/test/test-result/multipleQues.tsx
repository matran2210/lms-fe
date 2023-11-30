import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import ButtonSecondary from '@components/base/button/ButtonSecondary'
import Icon from '@components/icons'

interface CoursesProps {
  courses: any[]
}

const MultipleQuestion: React.FC = () => {
  return (
    <div className="shadow-[0px_2px_4px_0px_rgba(0,_0,_0,_0.08),_0px_0px_6px_0px_rgba(0,_0,_0,_0.02)] bg-white flex flex-col justify-between w-full h-[991px] items-start pl-6 py-6">
      <div className="flex flex-col gap-10 w-full items-start">
        <div className="flex flex-col gap-6 w-full items-start">
          <div className="text-xl font-['Inter'] font-bold leading-[25px] text-[#141414]">
            Multiple Questions
          </div>
          <div className="flex flex-col justify-between gap-3 w-full items-start">
            <div className="flex flex-row justify-between w-full items-start">
              <div className="text-center font-['Inter'] font-medium leading-[33px] text-[#008000] border-solid border-[#008000] flex flex-row justify-center pt-3 w-16 h-16 items-start border">
                1
              </div>
              <div className="text-center font-['Inter'] font-medium leading-[33px] text-[#d35563] border-solid border-[#d35563] flex flex-row justify-center pt-3 w-16 h-16 items-start border">
                2
              </div>
              <div className="text-center font-['Inter'] font-medium leading-[33px] text-[#008000] border-solid border-[#008000] flex flex-row justify-center pt-3 w-16 h-16 items-start border">
                3
              </div>
              <div className="text-center font-['Inter'] font-medium leading-[33px] text-[#d35563] border-solid border-[#d35563] flex flex-row justify-center pt-3 w-16 h-16 items-start border">
                4
              </div>
              <div className="text-center font-['Inter'] font-medium leading-[33px] text-[#008000] border-solid border-[#008000] flex flex-row justify-center pt-3 w-16 h-16 items-start border">
                5
              </div>
            </div>
            <div className="flex flex-row justify-between w-full items-start">
              <div className="text-center font-['Inter'] font-medium leading-[33px] text-[#d35563] border-solid border-[#d35563] flex flex-row justify-center pt-3 w-16 h-16 items-start border">
                6
              </div>
              <div className="text-center font-['Inter'] font-medium leading-[33px] text-[#d35563] border-solid border-[#d35563] flex flex-row justify-center pt-3 w-16 h-16 items-start border">
                7
              </div>
              <div className="text-center font-['Inter'] font-medium leading-[33px] text-[#008000] border-solid border-[#008000] flex flex-row justify-center pt-3 w-16 h-16 items-start border">
                8
              </div>
              <div className="text-center font-['Inter'] font-medium leading-[33px] text-[#008000] border-solid border-[#008000] flex flex-row justify-center pt-3 w-16 h-16 items-start border">
                9
              </div>
              <div className="text-center font-['Inter'] font-medium leading-[33px] text-[#008000] border-solid border-[#008000] flex flex-row justify-center pt-3 w-16 h-16 items-start border">
                10
              </div>
            </div>
            <div className="flex flex-row justify-between w-full items-start">
              <div className="text-center font-['Inter'] font-medium leading-[33px] text-[#008000] border-solid border-[#008000] flex flex-row justify-center pt-3 w-16 h-16 items-start border">
                11
              </div>
              <div className="text-center font-['Inter'] font-medium leading-[33px] text-[#d35563] border-solid border-[#d35563] flex flex-row justify-center pt-3 w-16 h-16 items-start border">
                12
              </div>
              <div className="text-center font-['Inter'] font-medium leading-[33px] text-[#008000] border-solid border-[#008000] flex flex-row justify-center pt-3 w-16 h-16 items-start border">
                13
              </div>
              <div className="text-center font-['Inter'] font-medium leading-[33px] text-[#d35563] border-solid border-[#d35563] flex flex-row justify-center pt-3 w-16 h-16 items-start border">
                14
              </div>
              <div className="text-center font-['Inter'] font-medium leading-[33px] text-[#008000] border-solid border-[#008000] flex flex-row justify-center pt-3 w-16 h-16 items-start border">
                15
              </div>
            </div>
            <div className="flex flex-row justify-between w-full items-start">
              <div className="text-center font-['Inter'] font-medium leading-[33px] text-[#d35563] border-solid border-[#d35563] flex flex-row justify-center pt-3 w-16 h-16 items-start border">
                16
              </div>
              <div className="text-center font-['Inter'] font-medium leading-[33px] text-[#d35563] border-solid border-[#d35563] flex flex-row justify-center pt-3 w-16 h-16 items-start border">
                17
              </div>
              <div className="text-center font-['Inter'] font-medium leading-[33px] text-[#008000] border-solid border-[#008000] flex flex-row justify-center pt-3 w-16 h-16 items-start border">
                18
              </div>
              <div className="text-center font-['Inter'] font-medium leading-[33px] text-[#008000] border-solid border-[#008000] flex flex-row justify-center pt-3 w-16 h-16 items-start border">
                19
              </div>
              <div className="text-center font-['Inter'] font-medium leading-[33px] text-[#008000] border-solid border-[#008000] flex flex-row justify-center pt-3 w-16 h-16 items-start border">
                20
              </div>
            </div>
            <div className="flex flex-row justify-between w-full items-start">
              <div className="text-center font-['Inter'] font-medium leading-[33px] text-[#008000] border-solid border-[#008000] flex flex-row justify-center pt-3 w-16 h-16 items-start border">
                21
              </div>
              <div className="text-center font-['Inter'] font-medium leading-[33px] text-[#d35563] border-solid border-[#d35563] flex flex-row justify-center pt-3 w-16 h-16 items-start border">
                22
              </div>
              <div className="text-center font-['Inter'] font-medium leading-[33px] text-[#008000] border-solid border-[#008000] flex flex-row justify-center pt-3 w-16 h-16 items-start border">
                23
              </div>
              <div className="text-center font-['Inter'] font-medium leading-[33px] text-[#d35563] border-solid border-[#d35563] flex flex-row justify-center pt-3 w-16 h-16 items-start border">
                24
              </div>
              <div className="text-center font-['Inter'] font-medium leading-[33px] text-[#008000] border-solid border-[#008000] flex flex-row justify-center pt-3 w-16 h-16 items-start border">
                25
              </div>
            </div>
            <div className="flex flex-row justify-between w-full items-start">
              <div className="text-center font-['Inter'] font-medium leading-[33px] text-[#d35563] border-solid border-[#d35563] flex flex-row justify-center pt-3 w-16 h-16 items-start border">
                26
              </div>
              <div className="text-center font-['Inter'] font-medium leading-[33px] text-[#d35563] border-solid border-[#d35563] flex flex-row justify-center pt-3 w-16 h-16 items-start border">
                27
              </div>
              <div className="text-center font-['Inter'] font-medium leading-[33px] text-[#008000] border-solid border-[#008000] flex flex-row justify-center pt-3 w-16 h-16 items-start border">
                28
              </div>
              <div className="text-center font-['Inter'] font-medium leading-[33px] text-[#008000] border-solid border-[#008000] flex flex-row justify-center pt-3 w-16 h-16 items-start border">
                29
              </div>
              <div className="text-center font-['Inter'] font-medium leading-[33px] text-[#008000] border-solid border-[#008000] flex flex-row justify-center pt-3 w-16 h-16 items-start border">
                30
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-row gap-3 w-full items-start">
          <div className="flex flex-col gap-6 w-4/5 items-start">
            <div className="text-xl font-['Inter'] font-bold leading-[25px] text-[#141414]">
              Constructed Questions
            </div>
            <div className="flex flex-row justify-between w-full items-start">
              <div className="text-center font-['Inter'] font-medium leading-[33px] text-[#008000] border-solid border-[#008000] flex flex-row justify-center pt-3 w-16 h-16 items-start border">
                31
              </div>
              <div className="text-center font-['Inter'] font-medium leading-[33px] text-[#d35563] border-solid border-[#d35563] flex flex-row justify-center pt-3 w-16 h-16 items-start border">
                32
              </div>
              <div className="text-center font-['Inter'] font-medium leading-[33px] text-[#008000] border-solid border-[#008000] flex flex-row justify-center pt-3 w-16 h-16 items-start border">
                33
              </div>
              <div className="text-center font-['Inter'] font-medium leading-[33px] text-[#d35563] border-solid border-[#d35563] flex flex-row justify-center pt-3 w-16 h-16 items-start border">
                34
              </div>
            </div>
          </div>
          <div className="text-center font-['Inter'] font-medium leading-[33px] text-[#008000] border-solid border-[#008000] flex flex-row justify-center mt-12 pt-3 w-16 h-16 items-start border">
            35
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-6 w-full h-16 items-start">
        <div
          id="Line"
          className="border-solid border-[#dcdddd] w-full h-px border-t border-b-0 border-x-0"
        />
        <div className="flex flex-row gap-8 w-full items-start">
          <div className="flex flex-row mt-2 gap-6 w-3/5 items-start">
            <div className="flex flex-row gap-1 w-20 items-start">
              <img
                src="https://file.rendit.io/n/2WkV7PCFLn41xjnzORSu.svg"
                alt="Ellipse"
                id="Ellipse"
                className="mt-1 w-4"
              />
              <div className="text-right font-['Inter'] leading-[25px] text-[#008000]">
                Correct
              </div>
            </div>
            <div className="flex flex-row gap-1 w-24 items-start">
              <img
                src="https://file.rendit.io/n/3qRHfkTQSNTXYONnsQ0M.svg"
                alt="Ellipse1"
                id="Ellipse1"
                className="mt-1 w-4"
              />
              <div className="font-['Inter'] leading-[25px] text-[#d35563]">
                Incorrect
              </div>
            </div>
          </div>
          <div className="text-center text-sm font-['Inter'] font-semibold leading-[16.9px] text-white bg-[#ffb800] flex flex-row justify-center pt-3 w-1/3 h-10 items-start">
            Quit
          </div>
        </div>
      </div>
    </div>
  )
}

export default MultipleQuestion
