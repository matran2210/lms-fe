# Cấu Trúc Monorepo cho LMS Frontend

## Tổng quan

Dự án bao gồm 2 Next.js applications:

### 1. LMS App (Full Features)

- Authentication & User Management
- Dashboard
- Courses & Learning
- Tests & Quizzes
- Entrance Test
- Event Test
- Calendar & Scheduling
- Notifications
- Profile & Settings
- Teacher Management
- Case Study
- Calculator
- My Requests
- Progress & Results

### 2. Short Course App (Courses Only)

- Authentication & User Management (shared)
- Courses & Learning (simplified version)

## Cấu trúc Monorepo đề xuất

```
lms-fe/
├── .husky/
├── apps/
│   ├── lms/                          # LMS Application (full features)
│   │   ├── src/
│   │   │   ├── pages/                # Next.js pages
│   │   │   │   ├── courses/
│   │   │   │   ├── test/
│   │   │   │   ├── entrance-test/
│   │   │   │   ├── event-test/
│   │   │   │   ├── calendar/
│   │   │   │   ├── teachers/
│   │   │   │   ├── profile/
│   │   │   │   └── ...
│   │   │   └── middleware.ts
│   │   ├── public/
│   │   ├── next.config.js
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── ...
│   │
│   └── lms-finhub/                       # Lms-Finhub Application (Shour Course)
│       ├── src/
│       │   ├── pages/                # Next.js pages
│       │   │   ├── courses/
│       │   │   ├── profile/
│       │   │   └── certificate/
│       │   └── middleware.ts
│       ├── public/
│       ├── next.config.js
│       ├── package.json
│       └── tsconfig.json
│
├── libs/                             # LIBRARY LAYER
│   ├── ui/                           # Atomic shared components (Button, Text, Collapse, Drawer, Modal) (non-business)
│   │   ├── components/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── ModalResizable.tsx    # generic resizable modal
│   │   │   ├── Tooltip.tsx
│   │   │   ├── Dropdown.tsx
│   │   │   └── index.ts
│   │   ├── layouts/
│   │   │   ├── AppLayout.tsx
│   │   │   ├── DashboardLayout.tsx
│   │   │   └── ...
│   │   └── index.ts
│   ├── utils/                         # Utility functions
│   ├── hooks/                         # Shared React hooks
│   ├── api-client/                    # API client & request utilities
│   ├── core/
│   │   ├── constants/
│   │   │   ├── routes.ts
│   │   │   ├── env.ts
│   │   │   └── index.ts
│   │   ├── config/
│   │   │   ├── axios.config.ts
│   │   │   └── theme.config.ts
│   │   ├── types/
│   │   │   ├── api-response.ts
│   │   │   └── common.ts
│   │   └── index.ts
│   ├── state/                         # Global state management
│   │   ├── redux/
│   │   │   ├── src/
│   │   │   │   ├── store.ts
│   │   │   │   ├── hook.ts
│   │   │   │   └── types/
│   │   │   ├── package.json
│   │   │   └── tsconfig.json
│   │   │
│   │   └── contexts/                  # React Context providers
│   │       ├── src/
│   │       │   ├── SocketContext.tsx
│   │       │   └── index.tsx
│   │       ├── package.json
│   │       └── tsconfig.json
│   ├── learning/                      # Libs learning for all apps (More unique: ModalResizeable for only Course,...)
│   │   ├── data-access/               # gọi API course, test, bài học
│   │   ├── hooks/                     # useCourseProgress, useExam...
│   │   ├── ui/                        # các component riêng cho learning (CourseCard, LessonView…)
│   │   ├── utils/
│   ├── assets/                        # Static assets
│   │   ├── fonts/
│   │   ├── icons/
│   │   ├── images/
│   │   └── lotties/
│   └── styles/                        # Global styles & themes
│
├── features/                          # FEATURE LAYER — kết hợp UI + domain + logic
│   ├── auth/                          # Authentication & Authorization
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── RouteGuard.tsx
│   │   │   │   ├── InputCodeForm.tsx
│   │   │   │   └── Countdown.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useAuth.ts
│   │   │   ├── services/
│   │   │   │   └── auth.service.ts
│   │   │   ├── types/
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── courses/                       # Courses & Learning
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── mycourses/         # My Courses components
│   │   │   │   ├── courses/           # Course list components
│   │   │   │   ├── learning/          # Learning activity components
│   │   │   │   └── highlights/
│   │   │   ├── hooks/
│   │   │   │   ├── useCourseStatus.tsx
│   │   │   │   ├── useInitialSections.tsx
│   │   │   │   └── useSectionData.tsx
│   │   │   ├── services/
│   │   │   │   └── course.service.ts
│   │   │   ├── redux/
│   │   │   │   ├── slice/
│   │   │   │   │   ├── CourseActivity/
│   │   │   │   │   ├── ActivityQuiz/
│   │   │   │   │   └── NotesList/
│   │   │   │   └── services/
│   │   │   ├── contexts/
│   │   │   │   ├── CourseNoteContext.tsx
│   │   │   │   └── PreviousSectionRouteContext.tsx
│   │   │   ├── types/
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── tests/                         # Tests & Quizzes
│   ├── case-study/                    # Case Study
│   ├── calendar/                      # Calendar & Scheduling
│   ├── notifications/                 # Notifications
│   ├── profile/                       # Profile & Settings
│   ├── calculator/                    # Calculator
│
├── tools/                             # Build tools & scripts
│   ├── eslint-config/
│   ├── typescript-config/
│   ├── tailwind-config/
│   └── prettier-config/
│
├── .gitignore
├── package.json                       # Root package.json (workspace)
├── pnpm-workspace.yaml                # hoặc yarn.lock / package-lock.json
├── turbo.json                         # Turborepo config
├── tsconfig.json                      # Root TypeScript config
└── README.md
```

## Chi tiết Migration Plan

### Phase 1: Setup Monorepo Infrastructure

1. **Cài đặt Monorepo tools:**
   - Turborepo (hoặc Nx)
   - pnpm workspaces (hoặc yarn workspaces)
   - TypeScript project references

2. **Tạo root configuration:**
   - `turbo.json` - Build pipeline configuration
   - `pnpm-workspace.yaml` - Workspace definition
   - Root `tsconfig.json` - Base TypeScript config
   - Root `package.json` - Workspace dependencies

### Phase 2: Extract Shared Packages

**Thứ tự ưu tiên:**

1. **@lms/shared-types** - Types & interfaces
2. **@lms/shared-constants** - Constants
3. **@lms/shared-utils** - Utility functions
4. **@lms/shared-ui** - UI components
5. **@lms/shared-api-client** - API client
6. **@lms/shared-hooks** - React hooks
7. **@lms/shared-assets** - Static assets
8. **@lms/shared-styles** - Global styles

### Phase 3: Extract Feature Packages

**Thứ tự ưu tiên (dựa trên dependencies):**

1. **@lms/feature-auth** - Authentication (independent)
2. **@lms/feature-user** - User management
3. **@lms/feature-notifications** - Notifications
4. **@lms/feature-courses** - Courses (large, core feature) - shared by both apps
5. **@lms/feature-tests** - Tests & Quizzes (LMS only)
6. **@lms/feature-entrance-test** - Entrance Test (LMS only)
7. **@lms/feature-event-test** - Event Test (LMS only)
8. **@lms/feature-calendar** - Calendar (LMS only)
9. **@lms/feature-profile** - Profile
10. **@lms/feature-teacher** - Teacher management (LMS only)
11. **@lms/feature-calculator** - Calculator (independent, LMS only)
12. **@lms/feature-requests** - My Requests (LMS only)
13. **@lms/feature-case-study** - Case Study (LMS only)
14. **@lms/feature-progress** - Progress & Results (LMS only)

### Phase 4: Extract Apps

1. **Create apps/lms:**
   - Move current pages to `apps/lms/src/pages`
   - Include all features: courses, tests, event-test, entrance-test, calendar, etc.
   - Update imports to use package aliases
   - Configure Next.js for monorepo

2. **Create apps/short-course:**
   - Create new Next.js app structure
   - Only include courses feature
   - Share auth and user features from packages
   - Simplified course components (no tests, calendar, etc.)

### Phase 5: Configure Apps

- Update imports to use package aliases in both apps
- Configure Next.js to work with monorepo
- Update build scripts for both apps
- Setup different environment configs for each app

## Package Dependencies Map

### Apps Dependencies

```
apps/lms (Full Features)
  ├── @lms/shared-ui
  ├── @lms/shared-utils
  ├── @lms/shared-types
  ├── @lms/shared-constants
  ├── @lms/shared-hooks
  ├── @lms/shared-api-client
  ├── @lms/shared-assets
  ├── @lms/shared-styles
  ├── @lms/state-redux
  ├── @lms/state-contexts
  ├── @lms/feature-auth
  ├── @lms/feature-user
  ├── @lms/feature-dashboard
  ├── @lms/feature-courses
  ├── @lms/feature-tests
  ├── @lms/feature-entrance-test
  ├── @lms/feature-event-test
  ├── @lms/feature-calendar
  ├── @lms/feature-notifications
  ├── @lms/feature-profile
  ├── @lms/feature-teacher
  ├── @lms/feature-requests
  ├── @lms/feature-calculator
  ├── @lms/feature-case-study
  └── @lms/feature-progress

apps/short-course (Courses Only)
  ├── @lms/shared-ui
  ├── @lms/shared-utils
  ├── @lms/shared-types
  ├── @lms/shared-constants
  ├── @lms/shared-hooks
  ├── @lms/shared-api-client
  ├── @lms/shared-assets
  ├── @lms/shared-styles
  ├── @lms/state-redux
  ├── @lms/state-contexts
  ├── @lms/feature-auth
  ├── @lms/feature-user
  └── @lms/feature-courses  (simplified version)

@lms/feature-courses
  ├── @lms/shared-ui
  ├── @lms/shared-utils
  ├── @lms/shared-types
  ├── @lms/shared-api-client
  ├── @lms/state-redux
  └── @lms/state-contexts

@lms/feature-tests
  ├── @lms/shared-ui
  ├── @lms/shared-utils
  ├── @lms/shared-types
  ├── @lms/shared-api-client
  └── @lms/state-redux

[... và các dependencies khác tương tự]
```

## Configuration Files Examples

### Root package.json

```json
{
  "name": "lms-fe-monorepo",
  "version": "1.0.0",
  "private": true,
  "workspaces": ["apps/*", "packages/*"],
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "lint": "turbo run lint",
    "type-check": "turbo run type-check"
  },
  "devDependencies": {
    "turbo": "^1.10.0",
    "typescript": "^5.5.4"
  }
}
```

### pnpm-workspace.yaml

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

### turbo.json

```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^lint"]
    },
    "type-check": {
      "dependsOn": ["^type-check"]
    }
  }
}
```

## Benefits của Monorepo Structure

1. **Code Reusability**: Shared packages có thể được tái sử dụng
2. **Independent Development**: Mỗi feature có thể phát triển độc lập
3. **Better Testing**: Test từng package riêng biệt
4. **Type Safety**: TypeScript project references đảm bảo type safety
5. **Faster Builds**: Turborepo caching và parallel builds
6. **Clear Dependencies**: Dễ dàng quản lý dependencies giữa các packages
7. **Scalability**: Dễ dàng thêm features mới hoặc tách apps mới (admin, mobile web)

## Migration Checklist

- [ ] Setup monorepo infrastructure (Turborepo, pnpm workspaces)
- [ ] Create shared packages structure
- [ ] Extract types package
- [ ] Extract constants package
- [ ] Extract utils package
- [ ] Extract UI components package
- [ ] Extract API client package
- [ ] Extract hooks package
- [ ] Extract assets package
- [ ] Extract styles package
- [ ] Extract state management packages
- [ ] Extract feature packages (theo thứ tự ưu tiên)
- [ ] Create apps/lms with all features
- [ ] Create apps/short-course with courses only
- [ ] Update imports in both apps to use packages
- [ ] Update CI/CD pipeline
- [ ] Update documentation
- [ ] Test all features
- [ ] Performance optimization

## Notes

- Giữ nguyên cấu trúc `pages/` trong Next.js app để tránh breaking changes
- Có thể migrate dần sang App Router trong tương lai
- Mỗi package nên có `package.json`, `tsconfig.json` riêng
- Sử dụng TypeScript project references để đảm bảo type safety
- Cân nhắc versioning strategy cho packages (semantic versioning)
