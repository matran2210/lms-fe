# Setup Instructions

## Cài đặt Dependencies

Sau khi tạo feature attendance, cần chạy lệnh sau để cài đặt dependencies:

```bash
pnpm install
```

Lệnh này sẽ:
1. Cài đặt tất cả peer dependencies được khai báo trong `package.json`
2. Link các workspace packages (`@lms/assets`, `@lms/core`, `@lms/ui`, etc.)
3. Tạo symlinks cho feature trong `node_modules/@lms/feature-attendance`

## Kiểm tra Feature đã hoạt động

1. Khởi động dev server:
```bash
pnpm dev
```

2. Truy cập URL:
```
http://localhost:3000/teachers/attendance
```

3. Bạn sẽ thấy trang placeholder với message "Feature under development"

## Module đã được đăng ký

Feature attendance đã được đăng ký trong:
- `apps/lms-pro/src/app/module-registry.ts` - Module registry
- `apps/lms-pro/src/constants/routers.ts` - Route constants
- `libs/ui/layout/MenuItemsList/TeacherMenu.tsx` - Menu item (đã có sẵn)

## Next Steps

Sau khi setup xong, bạn có thể bắt đầu implement các tasks trong:
```
.kiro/specs/attendance-tracking/tasks.md
```

Task tiếp theo là Task 2: Implement React Query hooks and AttendanceContext
