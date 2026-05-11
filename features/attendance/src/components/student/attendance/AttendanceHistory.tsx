'use client'
import React from 'react'
import clsx from 'clsx'
import { AttendanceRecord } from './AttendanceTable'

interface AttendanceHistoryProps {
  isOpen: boolean
  onClose: () => void
  record: AttendanceRecord | null
}

const AttendanceHistory: React.FC<AttendanceHistoryProps> = ({
  isOpen,
  onClose,
  record,
}) => {
  if (!record) return null

  return (
    <div
      className={clsx(
        'h-full overflow-y-auto rounded-xl shadow-small bg-white p-8 transition-opacity duration-300',
        isOpen ? 'opacity-100' : 'opacity-0',
      )}
    >
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div className="flex flex-col gap-4">
          <h3 className="text-2xl font-semibold text-gray-900">
            Attendance History
          </h3>
          <p className="text-sm text-gray-600">
            This Attendance History for Lesson {record.lessonTitle}
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 transition-colors hover:text-gray-600"
          aria-label="Close"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18 6L6 18M6 6l12 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* Details */}
      <div className="flex flex-col gap-10">
        {/* Date, Check in/out, Device */}
        <div className="flex flex-col gap-6">
          {/* Date */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-900">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15.8333 3.33334H4.16667C3.24619 3.33334 2.5 4.07953 2.5 5.00001V16.6667C2.5 17.5872 3.24619 18.3333 4.16667 18.3333H15.8333C16.7538 18.3333 17.5 17.5872 17.5 16.6667V5.00001C17.5 4.07953 16.7538 3.33334 15.8333 3.33334Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M13.3333 1.66666V4.99999"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M6.66667 1.66666V4.99999"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2.5 8.33334H17.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>Date:</span>
            </div>
            <div className="text-sm text-gray-900">{record.date}</div>
          </div>

          {/* Check in - Check out */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-900">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10 18.3333C14.6024 18.3333 18.3333 14.6024 18.3333 10C18.3333 5.39763 14.6024 1.66666 10 1.66666C5.39763 1.66666 1.66667 5.39763 1.66667 10C1.66667 14.6024 5.39763 18.3333 10 18.3333Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10 5V10L13.3333 11.6667"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>Check in - Check out:</span>
            </div>
            <div className="text-sm text-gray-900">
              {record.checkIn} - {record.checkOut}
            </div>
          </div>

          {/* Device */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-900">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5.83333 1.66666H14.1667C15.0871 1.66666 15.8333 2.41285 15.8333 3.33332V16.6667C15.8333 17.5871 15.0871 18.3333 14.1667 18.3333H5.83333C4.91286 18.3333 4.16667 17.5871 4.16667 16.6667V3.33332C4.16667 2.41285 4.91286 1.66666 5.83333 1.66666Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10 15H10.0083"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>Device:</span>
            </div>
            <div className="text-sm text-gray-900">{record.device}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AttendanceHistory
