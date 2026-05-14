'use client'
import { ChartPieCutIcon, UserCheckIcon, UserCloseIcon, UsersGroupIcon } from '@lms/assets'
import { Progress } from 'antd'
import React from 'react'

export interface AttendanceStatisticsProps {
    totalSessions: number
    attendedSessions: number
    absentSessions: number
    attendanceRate: number
}

const AttendanceStatistics: React.FC<AttendanceStatisticsProps> = ({
    totalSessions,
    attendedSessions,
    absentSessions,
    attendanceRate
}) => {
    return (
        <div className="flex justify-start items-center gap-6">
            <div className="flex-1 self-stretch p-6 bg-white rounded-2xl shadow-small flex justify-center items-start gap-4">
                <div className="p-1.5 bg-primary rounded-md flex justify-start items-center gap-2.5">
                    <div className="w-6 h-6 relative">
                        <UsersGroupIcon />
                    </div>
                </div>
                <div className="flex-1 self-stretch inline-flex flex-col justify-between items-start">
                    <div className="self-stretch flex flex-col justify-start items-start gap-2">
                        <div className="self-stretch justify-center text-gray-800 text-lg font-semibold">Total</div>
                    </div>
                    <div className="text-center justify-center"><span className="text-primary text-xl font-semibold">{totalSessions} </span><span className="text-primary text-sm font-medium">Class Sessions</span></div>
                </div>
            </div>
            <div className="flex-1 p-6 bg-white rounded-2xl shadow-small flex justify-center items-start gap-4">
                <div className="p-1.5 bg-info rounded-md flex justify-start items-center gap-2.5">
                    <div className="w-6 h-6 relative">
                        <UserCheckIcon />
                    </div>
                </div>
                <div className="flex-1 self-stretch inline-flex flex-col justify-between items-start">
                    <div className="self-stretch flex flex-col justify-start items-start gap-2">
                        <div className="self-stretch justify-center text-gray-800 text-lg font-semibold">Attended</div>
                    </div>
                    <div className="self-stretch flex flex-col justify-start items-start gap-1">
                        <div className="justify-center"><span className="text-gray-400 text-base font-medium">{attendedSessions}/{totalSessions} </span><span className="text-gray-400 text-sm font-medium">Class Sessions</span></div>
                        <div data-property-1="30" data-state="On" className="self-stretch rounded-[100px] flex flex-col justify-start items-start gap-2.5 overflow-hidden">
                            <Progress size="small" percent={!totalSessions ? 0 : Number((attendedSessions / totalSessions) * 100) || 0} showInfo={false} strokeColor="#22aaff" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex-1 p-6 bg-white rounded-2xl shadow-small flex justify-center items-start gap-4">
                <div className="p-1.5 bg-error rounded-md flex justify-start items-center gap-2.5">
                    <div className="w-6 h-6 relative">
                        <UserCloseIcon />
                    </div>
                </div>
                <div className="flex-1 self-stretch inline-flex flex-col justify-between items-start">
                    <div className="self-stretch flex flex-col justify-start items-start gap-2">
                        <div className="self-stretch justify-center text-gray-800 text-lg font-semibold">Absent</div>
                    </div>
                    <div className="self-stretch flex flex-col justify-start items-start gap-1">
                        <div className="justify-center"><span className="text-gray-400 text-base font-medium">{absentSessions}/{totalSessions} </span><span className="text-gray-400 text-sm font-medium">Class Sessions</span></div>
                        <div data-property-1="20" data-state="On" className="self-stretch rounded-[100px] flex flex-col justify-start items-start gap-2.5 overflow-hidden">
                            <Progress size="small" percent={!totalSessions ? 0 : Number((absentSessions / totalSessions) * 100) || 0} showInfo={false} strokeColor="#f80903" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex-1 self-stretch p-6 bg-white rounded-2xl shadow-small flex justify-center items-start gap-4">
                <div className="p-1.5 bg-success rounded-md flex justify-start items-center gap-2.5">
                    <div className="w-6 h-6 relative">
                        <ChartPieCutIcon />
                    </div>
                </div>
                <div className="flex-1 self-stretch inline-flex flex-col justify-between items-start">
                    <div className="self-stretch flex flex-col justify-start items-start gap-2">
                        <div className="self-stretch justify-center text-gray-800 text-lg font-semibold">Attendance Rate</div>
                    </div>
                    <div className="text-center justify-center text-success text-xl font-semibold">{attendanceRate}%</div>
                </div>
            </div>
        </div>
    )
}

export default AttendanceStatistics
