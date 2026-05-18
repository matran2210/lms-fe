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

interface StatisticCardProps {
    title: string
    icon: React.ReactNode
    iconClassName: string
    stretch?: boolean
    children: React.ReactNode
}

interface SessionStatisticContentProps {
    value: number
    total: number
    progressColor: string
}

const StatisticCard: React.FC<StatisticCardProps> = ({
    title,
    icon,
    iconClassName,
    stretch = false,
    children
}) => (
    <div className={`w-full ${stretch ? 'self-stretch ' : ''}p-6 bg-white rounded-2xl shadow-small flex justify-center items-start gap-4`}>
        <div className={`p-1.5 rounded-md flex justify-start items-center gap-2.5 ${iconClassName}`}>
            <div className="w-6 h-6 relative">{icon}</div>
        </div>
        <div className="flex-1 self-stretch inline-flex flex-col justify-between items-start">
            <div className="self-stretch flex flex-col justify-start items-start gap-2">
                <div className="self-stretch justify-center text-gray-800 text-lg font-semibold">{title}</div>
            </div>
            {children}
        </div>
    </div>
)

const SessionStatisticContent: React.FC<SessionStatisticContentProps> = ({
    value,
    total,
    progressColor
}) => (
    <div className="self-stretch flex flex-col justify-start items-start gap-1">
        <div className="justify-center">
            <span className="text-gray-400 text-base font-medium">{value}/{total} </span>
            <span className="text-gray-400 text-sm font-medium">Class Sessions</span>
        </div>
        <div data-property-1="30" data-state="On" className="self-stretch rounded-[100px] flex flex-col justify-start items-start gap-2.5 overflow-hidden">
            <Progress size="small" percent={!total ? 0 : Number((value / total) * 100) || 0} showInfo={false} strokeColor={progressColor} />
        </div>
    </div>
)

const AttendanceStatistics: React.FC<AttendanceStatisticsProps> = ({
    totalSessions,
    attendedSessions,
    absentSessions,
    attendanceRate
}) => {
    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            <StatisticCard title="Total" icon={<UsersGroupIcon />} iconClassName="bg-primary" stretch>
                <div className="text-center justify-center">
                    <span className="text-primary text-xl font-semibold">{totalSessions} </span>
                    <span className="text-primary text-sm font-medium">Class Sessions</span>
                </div>
            </StatisticCard>
            <StatisticCard title="Attended" icon={<UserCheckIcon />} iconClassName="bg-info">
                <SessionStatisticContent value={attendedSessions} total={totalSessions} progressColor="#22aaff" />
            </StatisticCard>
            <StatisticCard title="Absent" icon={<UserCloseIcon />} iconClassName="bg-error">
                <SessionStatisticContent value={absentSessions} total={totalSessions} progressColor="#f80903" />
            </StatisticCard>
            <StatisticCard title="Attendance Rate" icon={<ChartPieCutIcon />} iconClassName="bg-success" stretch>
                <div className="text-center justify-center text-success text-xl font-semibold">{attendanceRate}%</div>
            </StatisticCard>
        </div>
    )
}

export default AttendanceStatistics
