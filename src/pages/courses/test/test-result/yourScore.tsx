import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import ButtonSecondary from '@components/base/button/ButtonSecondary'
import Icon from '@components/icons'

interface CoursesProps {
  courses: any[]
}

const YourScore: React.FC = () => {
  return (
    <div className="shadow-[0px_2px_4px_0px_rgba(0,_0,_0,_0.08),_0px_0px_6px_0px_rgba(0,_0,_0,_0.02)] bg-white flex flex-col justify-center gap-10 w-full items-start px-24 py-6">
      <div className="flex flex-row justify-between ml-px w-full items-start">
        <div className="flex flex-col gap-6 w-1/6 items-start">
          <div className="text-xl font-['Inter'] font-bold leading-[25px] text-[#141414]">
            Your Score
          </div>
          <div className="text-6xl font-['Inter'] font-bold leading-[76.8px] text-[#ffb800]">
            85%
          </div>
        </div>
        <div className="flex flex-row mt-16 gap-1 w-1/6 items-start">
          <img
            src="https://file.rendit.io/n/XnLyBdd8onI3Zbp3i20X.svg"
            alt="Globe"
            id="Globe"
            className="w-4"
          />
          <div className="font-['Inter'] leading-[19.2px] text-[#a1a1a1] mt-px">
            Global Average 79%
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-6 w-full items-start">
        <div className="text-xl font-['Inter'] font-bold leading-[25px] text-[#141414] ml-px">
          Your Performance by Topic Area
        </div>
        <div className="flex flex-col gap-4 w-full items-start">
          <div className="flex flex-row gap-6 w-full items-start">
            <div className="flex flex-row mt-4 gap-5 w-16 items-start">
              <div className="text-center text-sm font-['Inter'] leading-[16.9px] text-[#141414]">
                Available Points
              </div>
              <div className="flex flex-col mt-5 gap-4 w-8 h-12 items-start">
                <div className="text-sm font-['Inter'] leading-[16.9px] text-[#141414]">
                  70%
                </div>
                <div className="text-sm font-['Inter'] leading-[16.9px] text-[#141414]">
                  50%
                </div>
              </div>
            </div>
            <div className="relative flex flex-col gap-6 w-5/6 items-start pt-5 pb-10">
              <div
                id="Line"
                className="border-solid border-[#a1a1a1] w-full h-px absolute top-12 left-0 border-t border-b-0 border-x-0"
              />
              <div
                id="Line2"
                className="border-solid border-[#a1a1a1] w-px h-40 absolute top-0 left-4 border-r border-l-0 border-y-0"
              />
              <img
                src="https://file.rendit.io/n/SvT7L0OWjPCGP74N60sk.svg"
                alt="Group4"
                className="relative ml-[441px] w-16"
              />
              <div className="relative flex flex-col gap-5 w-full h-16 items-start">
                <div className="flex flex-row justify-between w-5/6 items-start mb-px ml-10">
                  <img
                    src="https://file.rendit.io/n/SvT7L0OWjPCGP74N60sk.svg"
                    alt="Group1"
                    className="mb-1 w-16"
                  />
                  <img
                    src="https://file.rendit.io/n/SvT7L0OWjPCGP74N60sk.svg"
                    alt="Group6"
                    className="mt-1 w-16"
                  />
                </div>
                <div className="flex flex-col gap-px w-full items-start">
                  <div className="relative flex flex-row justify-end w-full items-start px-56">
                    <div
                      id="Line1"
                      className="border-solid border-[#a1a1a1] w-full h-px absolute top-px left-0 border-t border-b-0 border-x-0"
                    />
                    <img
                      src="https://file.rendit.io/n/SvT7L0OWjPCGP74N60sk.svg"
                      alt="Group5"
                      className="relative w-16"
                    />
                  </div>
                  <img
                    src="https://file.rendit.io/n/SvT7L0OWjPCGP74N60sk.svg"
                    alt="Group3"
                    className="ml-[307px] w-16"
                  />
                </div>
                <img
                  src="https://file.rendit.io/n/SvT7L0OWjPCGP74N60sk.svg"
                  alt="Group2"
                  className="ml-[174px] w-16"
                />
              </div>
            </div>
          </div>
          <div className="flex flex-row ml-px gap-5 w-full items-start">
            <div className="flex flex-col mt-3 gap-10 w-20 h-20 items-start">
              <div className="text-center text-sm font-['Inter'] leading-[16.9px] text-[#141414] ml-px">
                Topic Area
              </div>
              <div className="text-sm font-['Inter'] leading-[16.9px] text-[#141414]">
                Topic Weight
              </div>
            </div>
            <div className="bg-[#f9f9f9] flex flex-col justify-center gap-1 w-5/6 items-start px-6 py-3">
              <div className="flex flex-row gap-16 w-full items-start">
                <div className="flex flex-row mr-1 gap-8 w-1/4 items-start">
                  <div className="text-sm font-['Inter'] font-medium leading-[16.9px] text-[#141414] mt-px">
                    Alternative
                    <br />
                    Investment and
                    <br />
                    Derivatives
                  </div>
                  <div
                    id="CorporateFinance"
                    className="text-sm font-['Inter'] font-medium leading-[16.9px] text-[#141414]"
                  >
                    Corporate
                    <br />
                    Finance
                  </div>
                </div>
                <div className="text-sm font-['Inter'] font-medium leading-[16.9px] text-[#141414]">
                  Economics
                </div>
                <div className="flex flex-row gap-16 w-1/2 items-start">
                  <div
                    id="EquityInvestment"
                    className="text-sm font-['Inter'] font-medium leading-[16.9px] text-[#141414]"
                  >
                    Equity <br />
                    Investment
                  </div>
                  <div className="flex flex-row gap-12 w-3/5 items-start">
                    <div className="text-sm font-['Inter'] font-medium leading-[16.9px] text-[#141414]">
                      Ethical & <br />
                      Professional
                      <br />
                      Standards
                    </div>
                    <div
                      id="EquityInvestment1"
                      className="text-sm font-['Inter'] font-medium leading-[16.9px] text-[#141414]"
                    >
                      Equity <br />
                      Investment
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-row gap-24 w-5/6 items-start">
                <div className="text-sm font-['Inter'] leading-[16.9px] text-[#a1a1a1] mr-2">
                  4%
                </div>
                <div className="text-sm font-['Inter'] leading-[16.9px] text-[#a1a1a1]">
                  18%
                </div>
                <div className="text-sm font-['Inter'] leading-[16.9px] text-[#a1a1a1] mr-px">
                  15%
                </div>
                <div className="text-sm font-['Inter'] leading-[16.9px] text-[#a1a1a1] mr-2">
                  5%
                </div>
                <div className="text-sm font-['Inter'] leading-[16.9px] text-[#a1a1a1] mr-px">
                  21%
                </div>
                <div className="text-sm font-['Inter'] leading-[16.9px] text-[#a1a1a1]">
                  17%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default YourScore
