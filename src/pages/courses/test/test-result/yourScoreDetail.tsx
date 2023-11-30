import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import ButtonSecondary from '@components/base/button/ButtonSecondary'
import Icon from '@components/icons'

interface CoursesProps {
  courses: any[]
}

const YourScoreDetail: React.FC = () => {
  return (
    <div className="shadow-[0px_2px_4px_0px_rgba(0,_0,_0,_0.08),_0px_0px_6px_0px_rgba(0,_0,_0,_0.02)] bg-white flex flex-col gap-10 w-full h-[983px] items-start pl-24 py-6">
      <div className="flex flex-col gap-8 w-5/6 items-start">
        <div className="flex flex-row justify-between w-full items-start">
          <div className="flex flex-col gap-6 w-2/5 h-16 items-start">
            <div className="text-xl font-['Inter'] font-bold leading-[25px] text-[#141414]">
              Your Score Details
            </div>
            <div className="flex flex-row justify-between ml-3 w-full items-start">
              <div className="flex flex-row gap-8 w-1/3 items-start">
                <div className="text-center text-sm font-['Inter'] font-semibold leading-[16.9px] text-[#a1a1a1]">
                  #
                </div>
                <div className="text-sm font-['Inter'] font-semibold leading-[16.9px] text-[#a1a1a1]">
                  Questions
                </div>
              </div>
              <div className="text-sm font-['Inter'] font-semibold leading-[16.9px] text-[#a1a1a1]">
                Section
              </div>
            </div>
          </div>
          <div className="flex flex-row mt-12 gap-[115px] w-2/5 items-start">
            <div className="text-sm font-['Inter'] font-semibold leading-[16.9px] text-[#a1a1a1] mr-1">
              Type
            </div>
            <div className="text-center text-sm font-['Inter'] font-semibold leading-[16.9px] text-[#a1a1a1]">
              Result
            </div>
            <div className="text-center text-sm font-['Inter'] font-semibold leading-[16.9px] text-[#a1a1a1]">
              Time Spent
            </div>
          </div>
        </div>
        <div className="flex flex-row ml-4 gap-20 w-full items-start">
          <div className="flex flex-row mr-px gap-8 w-1/5 items-start">
            <div className="text-center font-['Inter'] leading-[24px] text-[#141414]">
              1
            </div>
            <div className="font-['Inter'] leading-[24px] text-[#141414]">
              Quantitative methods
            </div>
          </div>
          <div className="flex flex-row gap-1 w-1/3 items-start">
            <div className="font-['Inter'] leading-[24px] text-[#141414]">
              Audit framework and regulation
            </div>
            <div className="font-['Inter'] leading-[24px] text-[#141414]">
              Matching
            </div>
          </div>
          <div className="flex flex-row gap-10 w-1/4 items-start">
            <div className="flex flex-row gap-6 w-3/5 items-start">
              <div
                id="Correct"
                className="font-['Inter'] leading-[24px] text-[#008000]"
              >
                Correct{' '}
              </div>
              <div className="flex flex-row gap-1 w-12 items-start">
                <img
                  src="https://file.rendit.io/n/OiFcovF8STzKyMYRzNk0.svg"
                  alt="Globe"
                  id="Globe"
                  className="mt-1 w-4"
                />
                <div className="font-['Inter'] leading-[24px] text-[#a1a1a1]">
                  29%
                </div>
              </div>
            </div>
            <div
              id="Element26"
              className="font-['Inter'] leading-[24px] text-[#141414]"
            >
              01:34{' '}
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-row ml-3 gap-10 w-5/6 items-start">
        <div className="flex flex-row gap-8 w-5/6 items-start">
          <div className="flex flex-row gap-8 w-4/5 items-start">
            <div className="text-center font-['Inter'] leading-[24px] text-[#141414]">
              2
            </div>
            <div className="flex flex-row gap-3 w-full items-start">
              <div className="flex flex-row gap-1 w-4/5 items-start">
                <div className="font-['Inter'] leading-[24px] text-[#141414]">
                  Audit framework and regulation
                </div>
                <div className="font-['Inter'] leading-[24px] text-[#141414]">
                  Planning and risk management
                </div>
              </div>
              <div className="font-['Inter'] leading-[24px] text-[#141414]">
                Multiple Choice
              </div>
            </div>
          </div>
          <div className="flex flex-row gap-6 w-1/6 items-start">
            <div
              id="Correct1"
              className="font-['Inter'] leading-[24px] text-[#008000]"
            >
              Correct{' '}
            </div>
            <div className="flex flex-row gap-1 w-12 items-start">
              <img
                src="https://file.rendit.io/n/w19PaEottpmJRY87zSwr.svg"
                alt="Globe1"
                id="Globe1"
                className="mt-1 w-4"
              />
              <div className="font-['Inter'] leading-[24px] text-[#a1a1a1]">
                29%
              </div>
            </div>
          </div>
        </div>
        <div
          id="Element27"
          className="font-['Inter'] leading-[24px] text-[#141414]"
        >
          01:34{' '}
        </div>
      </div>
      <div className="flex flex-row justify-between ml-3 w-5/6 items-start">
        <div className="flex flex-row gap-8 w-1/6 items-start">
          <div className="text-center font-['Inter'] leading-[24px] text-[#141414]">
            3
          </div>
          <div className="font-['Inter'] leading-[24px] text-[#141414]">
            Internal control
          </div>
        </div>
        <div className="flex flex-row gap-20 w-2/3 items-start">
          <div className="flex flex-row gap-1 w-1/2 items-start">
            <div className="font-['Inter'] leading-[24px] text-[#141414]">
              Audit framework and regulation
            </div>
            <div className="font-['Inter'] leading-[24px] text-[#141414]">
              Drag Drop
            </div>
          </div>
          <div className="flex flex-row gap-10 w-1/3 items-start">
            <div className="flex flex-row gap-6 w-3/5 items-start">
              <div
                id="Correct2"
                className="font-['Inter'] leading-[24px] text-[#008000]"
              >
                Correct{' '}
              </div>
              <div className="flex flex-row gap-1 w-12 items-start">
                <img
                  src="https://file.rendit.io/n/2XmkE5diIhpONeC70oKW.svg"
                  alt="Globe2"
                  id="Globe2"
                  className="mt-1 w-4"
                />
                <div className="font-['Inter'] leading-[24px] text-[#a1a1a1]">
                  29%
                </div>
              </div>
            </div>
            <div
              id="Element28"
              className="font-['Inter'] leading-[24px] text-[#141414]"
            >
              01:34{' '}
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-row justify-between ml-3 w-5/6 items-start">
        <div className="flex flex-row gap-8 w-2/5 items-start">
          <div className="text-center font-['Inter'] leading-[24px] text-[#141414]">
            4
          </div>
          <div className="flex flex-row gap-1 w-5/6 items-start">
            <div className="font-['Inter'] leading-[24px] text-[#141414]">
              Audit framework and regulation
            </div>
            <div className="font-['Inter'] leading-[24px] text-[#141414]">
              Audit evidence
            </div>
          </div>
        </div>
        <div className="flex flex-row gap-16 w-2/5 items-start">
          <div className="font-['Inter'] leading-[24px] text-[#141414]">
            One Choice
          </div>
          <div className="flex flex-row gap-10 w-3/5 items-start">
            <div className="flex flex-row gap-3 w-3/5 items-start">
              <div className="font-['Inter'] leading-[24px] text-[#d35563]">
                Incorrect
              </div>
              <div className="flex flex-row gap-1 w-12 items-start">
                <img
                  src="https://file.rendit.io/n/4zYbgN5iRQeK2jM97d9c.svg"
                  alt="Globe3"
                  id="Globe3"
                  className="mt-1 w-4"
                />
                <div className="font-['Inter'] leading-[24px] text-[#a1a1a1]">
                  29%
                </div>
              </div>
            </div>
            <div
              id="Element29"
              className="font-['Inter'] leading-[24px] text-[#141414]"
            >
              01:34{' '}
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-row justify-between ml-3 w-5/6 items-start">
        <div className="flex flex-row gap-20 w-2/3 items-start">
          <div className="flex flex-row gap-8 w-1/3 items-start">
            <div className="text-center font-['Inter'] leading-[24px] text-[#141414]">
              5
            </div>
            <div className="font-['Inter'] leading-[24px] text-[#141414]">
              Quantitative methods
            </div>
          </div>
          <div className="flex flex-row gap-1 w-1/2 items-start">
            <div className="font-['Inter'] leading-[24px] text-[#141414]">
              Audit framework and regulation
            </div>
            <div className="font-['Inter'] leading-[24px] text-[#141414]">
              Fill Up
            </div>
          </div>
        </div>
        <div className="flex flex-row gap-10 w-1/4 items-start">
          <div className="flex flex-row gap-6 w-3/5 items-start">
            <div
              id="Correct3"
              className="font-['Inter'] leading-[24px] text-[#008000]"
            >
              Correct{' '}
            </div>
            <div className="flex flex-row gap-1 w-12 items-start">
              <img
                src="https://file.rendit.io/n/XCn5Aj0TKoAsYE0lltg7.svg"
                alt="Globe4"
                id="Globe4"
                className="mt-1 w-4"
              />
              <div className="font-['Inter'] leading-[24px] text-[#a1a1a1]">
                29%
              </div>
            </div>
          </div>
          <div
            id="Element30"
            className="font-['Inter'] leading-[24px] text-[#141414]"
          >
            01:34{' '}
          </div>
        </div>
      </div>
      <div className="flex flex-row justify-between ml-3 w-5/6 items-start">
        <div className="flex flex-row gap-16 w-5/6 items-start">
          <div className="flex flex-row gap-8 w-5/6 items-start">
            <div className="text-center font-['Inter'] leading-[24px] text-[#141414]">
              6
            </div>
            <div className="flex flex-row gap-3 w-full items-start">
              <div className="flex flex-row gap-1 w-4/5 items-start">
                <div className="font-['Inter'] leading-[24px] text-[#141414]">
                  Audit framework and regulation
                </div>
                <div className="font-['Inter'] leading-[24px] text-[#141414]">
                  Planning and risk management
                </div>
              </div>
              <div className="font-['Inter'] leading-[24px] text-[#141414]">
                Constructed
              </div>
            </div>
          </div>
          <div className="font-['Inter'] leading-[24px] text-[#d35563]">
            Unfinished
          </div>
        </div>
        <div className="font-['Inter'] leading-[24px] text-[#141414]">---</div>
      </div>
      <div className="flex flex-row justify-between ml-3 w-5/6 items-start">
        <div className="flex flex-row gap-8 w-1/6 items-start">
          <div className="text-center font-['Inter'] leading-[24px] text-[#141414]">
            7
          </div>
          <div className="font-['Inter'] leading-[24px] text-[#141414]">
            Internal control
          </div>
        </div>
        <div className="flex flex-row justify-between w-2/3 items-start">
          <div className="flex flex-row gap-8 w-3/4 items-start">
            <div className="flex flex-row gap-1 w-4/5 items-start">
              <div className="font-['Inter'] leading-[24px] text-[#141414]">
                Audit framework and regulation
              </div>
              <div className="font-['Inter'] leading-[24px] text-[#141414]">
                Multiple Choice
              </div>
            </div>
            <div
              id="Correct4"
              className="font-['Inter'] leading-[24px] text-[#008000]"
            >
              Correct{' '}
            </div>
          </div>
          <div className="font-['Inter'] leading-[24px] text-[#a1a1a1]">
            29%
          </div>
          <div
            id="Element32"
            className="font-['Inter'] leading-[24px] text-[#141414]"
          >
            01:34{' '}
          </div>
        </div>
      </div>
      <div className="flex flex-row ml-3 gap-10 w-5/6 items-start">
        <div className="flex flex-row gap-10 w-5/6 items-start">
          <div className="flex flex-row gap-8 w-4/5 items-start">
            <div className="text-center font-['Inter'] leading-[24px] text-[#141414]">
              8
            </div>
            <div className="relative flex flex-row justify-end w-full items-start px-8">
              <div className="font-['Inter'] leading-[24px] text-[#141414] absolute top-0 left-0 h-6 w-[606px]">
                Analysing and interpreting the financial statements of single
                entities and groups
              </div>
              <div className="font-['Inter'] leading-[24px] text-[#141414] absolute top-0 left-64 h-6 w-56">
                Financial statement Analysis
              </div>
              <div className="font-['Inter'] leading-[24px] text-[#141414] relative">
                Drag Drop
              </div>
            </div>
          </div>
          <div className="flex flex-row gap-8 w-1/6 items-start">
            <div className="font-['Inter'] leading-[24px] text-[#d35563]">
              Incorrect
            </div>
            <div className="font-['Inter'] leading-[24px] text-[#a1a1a1]">
              29%
            </div>
          </div>
        </div>
        <div
          id="Element33"
          className="font-['Inter'] leading-[24px] text-[#141414]"
        >
          01:34{' '}
        </div>
      </div>
      <div className="flex flex-row justify-between ml-3 w-5/6 items-start">
        <div className="flex flex-row gap-8 w-2/5 items-start">
          <div className="text-center font-['Inter'] leading-[24px] text-[#141414]">
            9
          </div>
          <div className="flex flex-row gap-1 w-5/6 items-start">
            <div className="font-['Inter'] leading-[24px] text-[#141414]">
              Audit framework and regulation
            </div>
            <div className="font-['Inter'] leading-[24px] text-[#141414]">
              Internal control
            </div>
          </div>
        </div>
        <div className="flex flex-row gap-20 w-2/5 items-start">
          <div className="font-['Inter'] leading-[24px] text-[#141414]">
            Drag Drop
          </div>
          <div className="flex flex-row gap-10 w-3/5 items-start">
            <div className="flex flex-row gap-8 w-3/5 items-start">
              <div className="font-['Inter'] leading-[24px] text-[#d35563]">
                Incorrect
              </div>
              <div className="font-['Inter'] leading-[24px] text-[#a1a1a1]">
                29%
              </div>
            </div>
            <div
              id="Element34"
              className="font-['Inter'] leading-[24px] text-[#141414]"
            >
              01:34{' '}
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-row justify-between ml-2 w-5/6 items-start">
        <div className="flex flex-row gap-6 w-1/6 items-start">
          <div className="text-center font-['Inter'] leading-[24px] text-[#141414]">
            10
          </div>
          <div className="font-['Inter'] leading-[24px] text-[#141414]">
            Audit evidence
          </div>
        </div>
        <div className="flex flex-row justify-between w-2/3 items-start">
          <div className="flex flex-row gap-1 w-1/2 items-start">
            <div className="font-['Inter'] leading-[24px] text-[#141414]">
              Audit framework and regulation
            </div>
            <div className="font-['Inter'] leading-[24px] text-[#141414]">
              Fill Up
            </div>
          </div>
          <div className="flex flex-row justify-between w-1/3 items-start">
            <div
              id="Correct5"
              className="font-['Inter'] leading-[24px] text-[#008000]"
            >
              Correct{' '}
            </div>
            <div className="font-['Inter'] leading-[24px] text-[#a1a1a1]">
              29%
            </div>
            <div
              id="Element35"
              className="font-['Inter'] leading-[24px] text-[#141414]"
            >
              01:34{' '}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default YourScoreDetail
