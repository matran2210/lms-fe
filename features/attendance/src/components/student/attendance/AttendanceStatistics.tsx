'use client'
import { ChartPieCutIcon, UserCheckIcon, UserCloseIcon, UsersGroupIcon } from '@lms/assets'
import React from 'react'

export interface AttendanceStatisticsProps {
  totalSessions: number
  attendedSessions: number
  absentSessions: number
  attendanceRate: number
}

const AttendanceStatistics: React.FC<AttendanceStatisticsProps> = () => {
  return (
    <div className="flex justify-start items-center gap-6">
    <div className="flex-1 self-stretch p-6 bg-white rounded-2xl shadow-[0px_4px_20px_0px_rgba(41,41,41,0.05)] flex justify-center items-start gap-4">
        <div className="p-1.5 bg-primary rounded-md flex justify-start items-center gap-2.5">
            <div className="w-6 h-6 relative">
                <UsersGroupIcon />
            </div>
        </div>
        <div className="flex-1 self-stretch inline-flex flex-col justify-between items-start">
            <div className="self-stretch flex flex-col justify-start items-start gap-2">
                <div className="self-stretch justify-center text-gray-800 text-lg font-semibold font-['Roboto'] leading-7">Total</div>
            </div>
            <div className="text-center justify-center"><span className="text-primary text-xl font-semibold font-['Roboto'] leading-7">40 </span><span className="text-primary text-sm font-medium font-['Roboto'] leading-5">Class Sessions</span></div>
        </div>
    </div>
    <div className="flex-1 p-6 bg-white rounded-2xl shadow-[0px_4px_20px_0px_rgba(41,41,41,0.05)] flex justify-center items-start gap-4">
        <div className="p-1.5 bg-info rounded-md flex justify-start items-center gap-2.5">
            <div className="w-6 h-6 relative">
                <UserCheckIcon />
            </div>
        </div>
        <div className="flex-1 self-stretch inline-flex flex-col justify-between items-start">
            <div className="self-stretch flex flex-col justify-start items-start gap-2">
                <div className="self-stretch justify-center text-gray-800 text-lg font-semibold font-['Roboto'] leading-7">Attended</div>
            </div>
            <div className="self-stretch flex flex-col justify-start items-start gap-1">
                <div className="justify-center"><span className="text-gray-400 text-base font-medium font-['Roboto'] leading-6">20/40 </span><span className="text-gray-400 text-sm font-medium font-['Roboto'] leading-5">Class Sessions</span></div>
                <div data-property-1="30" data-state="On" className="self-stretch h-1.5 relative rounded-[100px] overflow-hidden">
                    <div className="w-96 h-1.5 left-0 top-0 absolute bg-gray-200 rounded-[100px] inline-flex flex-col justify-start items-start gap-2.5">
                        <div className="w-32 h-1.5 bg-info rounded-[100px]" />
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div className="flex-1 p-6 bg-white rounded-2xl shadow-[0px_4px_20px_0px_rgba(41,41,41,0.05)] flex justify-center items-start gap-4">
        <div className="p-1.5 bg-error rounded-md flex justify-start items-center gap-2.5">
            <div className="w-6 h-6 relative">
                <UserCloseIcon />
            </div>
        </div>
        <div className="flex-1 self-stretch inline-flex flex-col justify-between items-start">
            <div className="self-stretch flex flex-col justify-start items-start gap-2">
                <div className="self-stretch justify-center text-gray-800 text-lg font-semibold font-['Roboto'] leading-7">Absent</div>
            </div>
            <div className="self-stretch flex flex-col justify-start items-start gap-1">
                <div className="justify-center"><span className="text-gray-400 text-base font-medium font-['Roboto'] leading-6">02/40 </span><span className="text-gray-400 text-sm font-medium font-['Roboto'] leading-5">Class Sessions</span></div>
                <div data-property-1="20" data-state="On" className="self-stretch rounded-[100px] flex flex-col justify-start items-start gap-2.5 overflow-hidden">
                    <div className="self-stretch h-1.5 bg-gray-200 rounded-[100px] flex flex-col justify-start items-start gap-2.5">
                        <div className="w-24 h-1.5 bg-error rounded-[100px]" />
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div className="flex-1 self-stretch p-6 bg-white rounded-2xl shadow-[0px_4px_20px_0px_rgba(41,41,41,0.05)] flex justify-center items-start gap-4">
        <div className="p-1.5 bg-success rounded-md flex justify-start items-center gap-2.5">
            <div className="w-6 h-6 relative">
                <ChartPieCutIcon />
            </div>
        </div>
        <div className="flex-1 self-stretch inline-flex flex-col justify-between items-start">
            <div className="self-stretch flex flex-col justify-start items-start gap-2">
                <div className="self-stretch justify-center text-gray-800 text-lg font-semibold font-['Roboto'] leading-7">Attendance Rate</div>
            </div>
            <div className="text-center justify-center text-success text-xl font-semibold font-['Roboto'] leading-7">87.5%</div>
        </div>
    </div>
</div>
  )
}

export default AttendanceStatistics
