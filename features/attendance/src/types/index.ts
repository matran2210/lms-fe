// Attendance tracking feature type definitions

/**
 * Base attendance record interface
 */
export interface AttendanceRecord {
  id: string
  lessonId: string
  lessonTitle: string
  eventName: string
  className: string
  date: string
  status: 'attended' | 'absent'
  createdAt: string
  updatedAt: string
}

/**
 * Teaching attendance record with teacher-specific fields
 */
export interface TeachingAttendance extends AttendanceRecord {
  actualWorkload: number
  plannedWorkload: number
  teacherId: string
  teacherName: string
}

/**
 * Learning attendance record with student-specific fields
 */
export interface LearningAttendance extends AttendanceRecord {
  studentId: string
  studentName: string
  participationRate: number
  completionStatus: 'completed' | 'in-progress' | 'not-started'
}

/**
 * Student attendance record for student view
 */
export interface StudentAttendanceRecord {
  id: string
  lessonTitle: string
  eventName: string
  className: string
  date: string
  checkIn: string
  checkOut: string
  device: string
  status: 'Attended' | 'Absent'
}

/**
 * Filter criteria for attendance data
 */
export interface AttendanceFilters {
  eventId?: string
  classId?: string
  startDate?: string
  endDate?: string
  status?: 'attended' | 'absent' | 'all'
  searchQuery?: string
}

/**
 * Detailed attendance history for a specific lesson
 */
export interface AttendanceHistory {
  lessonId: string
  lessonTitle: string
  eventName: string
  className: string
  date: string
  records: AttendanceHistoryRecord[]
}

/**
 * Individual attendance history record
 */
export interface AttendanceHistoryRecord {
  id: string
  studentId: string
  studentName: string
  status: 'attended' | 'absent'
  timestamp: string
  notes?: string
}

/**
 * Attendance statistics for dashboard display
 */
export interface AttendanceStatistics {
  totalLessons: number
  attendedLessons: number
  absentLessons: number
  attendanceRate: number
  actualWorkload: number
  plannedWorkload: number
  workloadCompletionRate: number
}

/**
 * Student attendance statistics
 */
export interface StudentAttendanceStatistics {
  totalSessions: number
  attendedSessions: number
  absentSessions: number
  attendanceRate: number
}

/**
 * Pagination parameters for API requests
 */
export interface PaginationParams {
  page: number
  pageSize: number
  totalRecords?: number
  totalPages?: number
}

/**
 * API response wrapper for paginated attendance data
 */
export interface AttendanceResponse<T> {
  data: T[]
  pagination: PaginationParams
  statistics?: AttendanceStatistics
}

/**
 * API response for attendance history
 */
export interface AttendanceHistoryResponse {
  data: AttendanceHistory
}

/**
 * Filter options for dropdowns
 */
export interface FilterOption {
  value: string
  label: string
}

/**
 * Export request parameters
 */
export interface ExportParams {
  filters: AttendanceFilters
  format: 'csv' | 'excel'
  attendanceType: 'teaching' | 'learning'
}
