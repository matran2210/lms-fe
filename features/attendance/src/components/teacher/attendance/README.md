# Teacher Attendance Components

This directory contains the tab components for the Teacher Attendance feature.

## Components

### TeachingAttendance

The Teaching Attendance tab displays:
- **Overview Section**: 
  - **Pie Chart** (using `EChart` from @lms/ui): Interactive donut chart showing:
    - Total Lessons (center text)
    - Attended (green segment)
    - Actual Workload (orange segment)
    - Remaining (gray segment)
  - **Legends**: Color-coded legend with counts for each category
- **Statistics Cards**: 
  - Total Lessons: Shows total class sessions (40)
  - Attended: Shows attended sessions with progress bar (20/40)
  - Actual Workload: Shows actual workload with progress bar (3/40)
  - Standard Workload: Shows standard workload (40)
  - Workload Ratio: Shows the ratio (26.6600/40)
- **Filters**: Class, Lesson, Date, and Status filters with Clear and Apply buttons
- **Data Table** (using `SappTable` from @lms/ui): Displays attendance records with columns:
  - No, Class, Lesson, Date, Check In, Check Out, Act. Workload, Action
- **Pagination**: Integrated with SappTable component
- **Action Dropdown Menu**: Click the three dots icon to open a dropdown menu with "Attendance History" option
- **Side Panel**: When "Attendance History" is clicked, a side panel appears next to the table showing detailed information

### LearningAttendance

The Learning Attendance tab displays:
- **Statistics Cards** (4 cards in a row):
  - Total Lessons: Shows total class sessions (40)
  - Attended: Shows attended sessions with progress bar (30/40 - 75%)
  - Absent: Shows absent sessions with progress bar (3/40 - 7.5%)
  - Attendance Rate: Shows overall attendance rate (87.5%)
- **Filters**: Class, Lesson, Date, and Status filters with Clear and Apply buttons
- **Data Table** (using `SappTable` from @lms/ui): Displays attendance records with columns:
  - No, Class, Lesson, Date, Check In, Check Out, Status (using `SAPPBadge`), Action
- **Pagination**: Integrated with SappTable component
- **Action Dropdown Menu**: Click the three dots icon to open a dropdown menu with "Attendance History" option
- **Side Panel**: When "Attendance History" is clicked, a side panel appears next to the table showing detailed information

**Status Badge Types:**
- `Attended` - Green badge (success type)
- `Absent` - Red badge (error type)

## Usage

```tsx
import { TeachingAttendance, LearningAttendance } from '@/components/teacher/attendance'

// In your page component
<TeachingAttendance />
// or
<LearningAttendance />
```

## Layout

Both components use a **side-by-side layout**:
- When the attendance history panel is closed, the table takes full width
- When opened, the table width shrinks and the side panel (400px) appears on the right
- Smooth transition animation (300ms) when opening/closing
- The side panel displays detailed attendance information without overlaying the table

## Design Reference

Based on Figma design: 
- Main tabs: [SAPP | LMS Pro - Teacher](https://www.figma.com/design/fXzPUUJFM6IEcJtXTx7Nxc/SAPP-%7C-LMS-Pro---Teacher?node-id=5226-21532)
- Attendance History side panel: [SAPP | LMS Pro - Teacher](https://www.figma.com/design/fXzPUUJFM6IEcJtXTx7Nxc/SAPP-%7C-LMS-Pro---Teacher?node-id=5226-20869)

## Features

- Responsive layout using Tailwind CSS
- **Interactive Pie Chart** using `EChart` from @lms/ui:
  - Donut chart visualization
  - Tooltip on hover showing values and percentages
  - Color-coded segments for different categories
  - Center text showing total count
- **Filter components** from @lms/ui:
  - `FilterGrid` - Grid layout for filters
  - `SAPPInput` - Text input fields
  - `SAPPSelect` - Dropdown select
  - `SAPPRangePicker` - Date range picker
  - `SAPPButtonCustom` - Action buttons (Reset/Search)
- **SappTable component** from @lms/ui for consistent table styling
- **NameNoActionCell component** from @lms/ui for table cell rendering
- **SAPPBadge component** from @lms/ui for status badges:
  - Color-coded badges (success/error types)
  - Consistent styling across the application
  - Type-safe badge mapping
- **TableActionCell component** from @lms/ui for action dropdown menu:
  - Three dots icon that opens a dropdown menu
  - "Attendance History" option to view details
  - Auto-closes after selection
- **Side-by-side layout** for attendance history:
  - Table shrinks when side panel opens
  - Smooth transition animation (300ms)
  - Side panel (400px width) with detailed information
  - Close button to dismiss the panel
- Pagination controls integrated with SappTable
- Status badges for attendance records (Learning Attendance)
- Progress bars for visual representation of statistics
- Action buttons for each record with click handlers
- Form state management with react-hook-form

## Technical Details

### Dependencies
- `SappTable` from `@lms/ui` - Main table component
- `TableActionCell` from `@lms/ui` - Action dropdown menu component
- `NameNoActionCell` from `@lms/ui` - Cell renderer component
- `SAPPBadge` from `@lms/ui` - Badge component for status display
- `SAPPBadge` from `@lms/ui` - Badge component for status display
- `FilterGrid` from `@lms/ui` - Filter layout component
- `SAPPInput` from `@lms/ui` - Input field component
- `SAPPSelect` from `@lms/ui` - Select dropdown component
- `SAPPRangePicker` from `@lms/ui` - Date range picker component
- `SAPPButtonCustom` from `@lms/ui` - Button component
- `EChart` from `@lms/ui` - Chart component (for pie chart visualization)
- `ColumnsType` from `antd/es/table` - Type definition for table columns
- `EChartsOption` from `echarts` - Type definition for chart options
- `useForm` from `react-hook-form` - Form state management

### Data Structure

**TeachingAttendance Record:**
```typescript
interface AttendanceRecord {
  id: number
  class: string
  lesson: string
  date: string
  checkIn: string
  checkOut: string
  actualWorkload: string
}
```

**LearningAttendance Record:**
```typescript
interface LearningAttendanceRecord {
  id: number
  class: string
  lesson: string
  date: string
  checkIn: string
  checkOut: string
  status: 'Attended' | 'Absent'
}
```

**AttendanceHistory Record:**
```typescript
interface AttendanceHistoryRecord {
  id: number
  class: string
  lesson: string
  date: string
  checkIn: string
  checkOut: string
  actualWorkload?: string  // Optional, only for Teaching Attendance
  device: string
  status?: 'Attended' | 'Absent'  // Optional, only for Learning Attendance
}
```

**Filter Form:**
```typescript
interface FilterForm {
  class?: string
  lesson?: string
  rangeDate?: any[]
  status?: any
}
```

**Status Badge Mapping:**
```typescript
const statusToBadge = {
  Attended: {
    label: 'Attended',
    type: 'success' as const,
  },
  Absent: {
    label: 'Absent',
    type: 'error' as const,
  },
}
```

### Filter Implementation

Both components use the same filter structure:
- **Class** - Text input for class name search
- **Lesson** - Text input for lesson name search
- **Date Range** - Date range picker for filtering by date
- **Status** - Dropdown select for attendance status (All/Attended/Absent)

Filter actions:
- **Reset** - Clears all filters and resets form
- **Search** - Applies filters and fetches filtered data

### Attendance History Implementation

The attendance history side panel is implemented using the following pattern:

1. **State Management**:
   ```typescript
   const [drawerOpen, setDrawerOpen] = useState(false)
   const [selectedRecord, setSelectedRecord] = useState<AttendanceHistoryRecord | null>(null)
   ```

2. **Action Handler**:
   ```typescript
   const handleOpenHistory = (record: AttendanceRecord) => {
     setSelectedRecord({
       ...record,
       device: 'Desktop - Chrome Browser', // Mock device info
     })
     setDrawerOpen(true)
   }
   ```

3. **Table Column with Dropdown Menu**:
   ```typescript
   {
     title: 'Action',
     render: (record) => (
       <TableActionCell>
         {(closeDropdown) => (
           <div
             className="cursor-pointer px-4 py-3 text-gray-700 hover:bg-gray-50"
             onClick={() => {
               handleOpenHistory(record)
               closeDropdown()
             }}
           >
             Attendance History
           </div>
         )}
       </TableActionCell>
     ),
   }
   ```

4. **Side-by-Side Layout**:
   ```typescript
   <div className="flex w-full gap-6">
     {/* Main Content - Table Section */}
     <div className={clsx(
       'flex-1 transition-all duration-300 ease-in-out',
       drawerOpen ? 'min-w-0' : 'w-full',
     )}>
       {/* Table and filters */}
     </div>

     {/* Side Panel */}
     <div className={clsx(
       'transition-all duration-300 ease-in-out',
       drawerOpen ? 'w-[400px]' : 'w-0',
     )}>
       {drawerOpen && (
         <div className="h-full overflow-y-auto rounded-xl border border-gray-200 bg-white p-6">
           {/* Attendance details */}
         </div>
       )}
     </div>
   </div>
   ```

**How it works:**
- Click the three dots icon in the Action column
- A dropdown menu appears with "Attendance History" option
- Click "Attendance History" to open the side panel
- The table width shrinks smoothly (transition animation)
- Side panel (400px) appears on the right with detailed information
- Click the X button in the side panel to close it
- The table expands back to full width

## Next Steps

To integrate with real data:
1. Replace mock data with API calls using `useQuery` from react-query
2. Implement `handleFilter` function to call API with filter parameters
3. Implement `handleResetFilter` to clear filters and refetch data
4. Add loading states (already integrated with `isLoading` state)
5. Add error handling for API calls
6. Implement real device detection for attendance history
7. Connect pagination to API parameters
8. Add URL query params sync for filters (like in PersonalScheduleTab example)
9. Fetch actual attendance history data when opening the drawer
10. Add more action options in the action menu (if needed)
