# Attendance Feature

Feature quản lý và theo dõi điểm danh cho giáo viên trong hệ thống LMS Pro.

## Cấu trúc thư mục

```
features/attendance/
├── src/
│   ├── components/
│   │   └── teacher/
│   │       └── attendance/          # Components cho attendance UI
│   ├── constants/
│   │   └── routes.ts                # Route constants
│   ├── contexts/                    # React Context cho UI state
│   ├── hooks/                       # Custom React Query hooks
│   ├── pages/
│   │   └── teachers/
│   │       └── attendance/
│   │           └── index.tsx        # Main attendance page
│   ├── services/                    # API service layer
│   ├── types/
│   │   └── index.ts                 # TypeScript type definitions
│   ├── index.ts                     # Feature module export
│   └── routes.tsx                   # Route configuration
├── package.json
├── tsconfig.json
└── .eslintrc.json
```

## Kiến trúc

Feature này sử dụng:
- **React Query (v3)** cho server state management và data fetching
- **React Context** cho UI state management (filters, selectedLesson, activeTab)
- **TypeScript** cho type safety
- **Tailwind CSS** cho styling

## Routes

- `/teachers/attendance` - Trang chính của attendance tracking

## Components chính (sẽ được implement)

- `AttendanceLayout` - Layout chính với tab navigation
- `TeachingAttendanceTab` - Tab điểm danh giảng dạy
- `LearningAttendanceTab` - Tab điểm danh học tập
- `FilterSection` - Bộ lọc dữ liệu
- `AttendanceTable` - Bảng hiển thị dữ liệu điểm danh
- `AttendanceHistorySidebar` - Sidebar hiển thị lịch sử chi tiết

## Custom Hooks (sẽ được implement)

- `useTeachingAttendance` - Fetch teaching attendance data
- `useLearningAttendance` - Fetch learning attendance data
- `useAttendanceHistory` - Fetch attendance history details
- `useExportAttendance` - Export attendance data

## Context (sẽ được implement)

- `AttendanceContext` - Quản lý UI state:
  - filters (Event, Class, Date, Status)
  - selectedLesson
  - activeTab (teaching/learning)
  - sidebarOpen
  - pagination

## API Services (sẽ được implement)

- `getTeachingAttendance(filters, pagination)` - Lấy dữ liệu teaching attendance
- `getLearningAttendance(filters, pagination)` - Lấy dữ liệu learning attendance
- `getAttendanceHistory(lessonId)` - Lấy lịch sử chi tiết
- `exportAttendanceData(filters)` - Export dữ liệu

## Development

Xem file `.kiro/specs/attendance-tracking/tasks.md` để biết chi tiết các task implementation.

## Dependencies

Feature này phụ thuộc vào các workspace packages:
- `@lms/assets` - Icons và images
- `@lms/core` - Core utilities và constants
- `@lms/ui` - UI components (LayoutTeacher, etc.)
- `@lms/utils` - Utility functions
- `@lms/hooks` - Shared hooks
- `@lms/contexts` - Shared contexts
- `@lms/hoc` - Higher-order components (withAuthorization)
