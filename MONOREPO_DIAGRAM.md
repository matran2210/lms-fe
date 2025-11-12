# Sơ Đồ Cấu Trúc Monorepo - LMS Frontend

## Dependency Graph

```
┌─────────────────────────────────────────────────────────────────┐
│                      apps/lms                                   │
│              (LMS - Full Features)                             │
└─────────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────────┐
│                  apps/short-course                              │
│          (Short Course - Courses Only)                         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ both apps depend on
                              ▼
        ┌─────────────────────────────────────────────────┐
        │                                                 │
        │         SHARED PACKAGES                         │
        │                                                 │
        ├─────────────────────────────────────────────────┤
        │                                                 │
        │  ┌──────────────┐  ┌──────────────┐           │
        │  │ shared/types │  │shared/constants│         │
        │  └──────────────┘  └──────────────┘           │
        │         │                │                      │
        │         └────────┬───────┘                      │
        │                  ▼                              │
        │  ┌──────────────────────────────┐             │
        │  │      shared/utils            │             │
        │  └──────────────────────────────┘             │
        │         │                                      │
        │         ▼                                      │
        │  ┌──────────────────────────────┐             │
        │  │    shared/api-client         │             │
        │  └──────────────────────────────┘             │
        │         │                                      │
        │         ▼                                      │
        │  ┌──────────────────────────────┐             │
        │  │      shared/ui               │             │
        │  └──────────────────────────────┘             │
        │         │                                      │
        │         ▼                                      │
        │  ┌──────────────────────────────┐             │
        │  │     shared/hooks             │             │
        │  └──────────────────────────────┘             │
        │                                                 │
        │  ┌──────────────┐  ┌──────────────┐           │
        │  │shared/assets │  │shared/styles │           │
        │  └──────────────┘  └──────────────┘           │
        │                                                 │
        └─────────────────────────────────────────────────┘
                              │
                              │ depends on
                              ▼
        ┌─────────────────────────────────────────────────┐
        │                                                 │
        │      STATE MANAGEMENT PACKAGES                  │
        │                                                 │
        │  ┌──────────────┐  ┌──────────────┐           │
        │  │state/redux   │  │state/contexts │           │
        │  └──────────────┘  └──────────────┘           │
        │                                                 │
        └─────────────────────────────────────────────────┘
                              │
                              │ depends on
                              ▼
        ┌─────────────────────────────────────────────────┐
        │                                                 │
        │         FEATURE PACKAGES                         │
        │                                                 │
        │  ┌──────────────┐  ┌──────────────┐           │
        │  │feature/auth  │  │feature/user  │           │
        │  └──────────────┘  └──────────────┘           │
        │         │                │                      │
        │         └────────┬───────┘                      │
        │                  ▼                              │
        │  ┌──────────────────────────────┐             │
        │  │   feature/dashboard          │             │
        │  └──────────────────────────────┘             │
        │         │                                      │
        │         ▼                                      │
        │  ┌──────────────────────────────┐             │
        │  │   feature/courses            │◄───────────┐│
        │  │   (shared by both apps)       │            ││
        │  └──────────────────────────────┘            ││
        │         │                                      ││
        │         ├──────────────────────────────┐      ││
        │         │                              │      ││
        │         ▼                              ▼      ││
        │  ┌──────────────┐        ┌──────────────┐    ││
        │  │feature/tests │        │feature/      │    ││
        │  │(LMS only)    │        │entrance-test  │    ││
        │  └──────────────┘        │(LMS only)    │    ││
        │                          └──────────────┘    ││
        │         │                                      ││
        │         ├──────────────────────────────┐      ││
        │         │                              │      ││
        │         ▼                              ▼      ││
        │  ┌──────────────┐        ┌──────────────┐    ││
        │  │feature/event │        │feature/      │    ││
        │  │  -test       │        │calendar      │    ││
        │  │(LMS only)    │        │(LMS only)    │    ││
        │  └──────────────┘        └──────────────┘    ││
        │         │                                      ││
        │         ▼                                      ││
        │  ┌──────────────┐                             ││
        │  │feature/case  │                             ││
        │  │  -study      │                             ││
        │  │(LMS only)    │                             ││
        │  └──────────────┘                             ││
        │                                                 ││
        │  ┌──────────────┐  ┌──────────────┐           ││
        │  │feature/notif │  │feature/profile│           ││
        │  │  -ications   │  └──────────────┘           ││
        │  └──────────────┘                             ││
        │         │                                      ││
        │         ▼                                      ││
        │  ┌──────────────┐                             ││
        │  │feature/teacher│                            ││
        │  └──────────────┘                             ││
        │                                                 ││
        │  ┌──────────────┐  ┌──────────────┐           ││
        │  │feature/request│  │feature/calc  │           ││
        │  │     -s        │  │  -ulator    │           ││
        │  └──────────────┘  └──────────────┘           ││
        │                                                 ││
        │  ┌──────────────┐                             ││
        │  │feature/progress│                            ││
        │  └──────────────┘                             ││
        │                                                 ││
        └─────────────────────────────────────────────────┘│
                                                            │
                    (all features depend on shared packages)│
                                                            │
                    ┌──────────────────────────────────────┘
                    │
                    ▼
        ┌──────────────────────────────┐
        │    Shared Packages           │
        │  (types, utils, ui, etc.)    │
        └──────────────────────────────┘
```

## Package Structure Detail

### Apps Layer
```
apps/
├── lms/                          # LMS Application (Full Features)
│   ├── pages/                    # Next.js pages (Pages Router)
│   │   ├── courses/
│   │   ├── test/
│   │   ├── entrance-test/
│   │   ├── event-test/
│   │   ├── calendar/
│   │   ├── teachers/
│   │   └── ...
│   ├── public/
│   └── package.json
│
└── short-course/                 # Short Course Application (Courses Only)
    ├── pages/                    # Next.js pages
    │   └── courses/              # Only courses pages
    ├── public/
    └── package.json
```

### Shared Packages Layer
```
packages/shared/
├── types/         # TypeScript interfaces & types
├── constants/     # App-wide constants
├── utils/         # Utility functions
├── api-client/    # HTTP client & interceptors
├── ui/            # Reusable UI components
├── hooks/         # Shared React hooks
├── assets/        # Fonts, icons, images, lotties
└── styles/        # Global SCSS, Tailwind config
```

### State Management Layer
```
packages/state/
├── redux/         # Redux store, slices, services
└── contexts/      # React Context providers
```

### Feature Packages Layer
```
packages/features/
├── auth/          # Authentication & authorization
├── user/           # User management
├── dashboard/      # Dashboard
├── courses/        # Courses & learning (LARGEST)
├── tests/          # Tests & quizzes
├── calendar/       # Calendar & scheduling
├── notifications/ # Notifications
├── profile/        # Profile & settings
├── teacher/        # Teacher features
├── requests/       # My requests
├── calculator/     # Calculator
├── event-test/     # Event test
├── case-study/     # Case study
└── progress/       # Progress & results
```

## File Mapping từ Current Structure

### Current → Monorepo Mapping

| Current Path | Monorepo Package | Target Path | App |
|-------------|------------------|-------------|-----|
| `src/type/*` | `@lms/shared-types` | `packages/shared/types/src/*` |
| `src/constants/*` | `@lms/shared-constants` | `packages/shared/constants/src/*` |
| `src/utils/*` | `@lms/shared-utils` | `packages/shared/utils/src/*` |
| `src/services/*` | `@lms/shared-api-client` | `packages/shared/api-client/src/*` |
| `src/adapters/*` | `@lms/shared-api-client` | `packages/shared/api-client/src/adapters/*` |
| `src/components/base/*` | `@lms/shared-ui` | `packages/shared/ui/src/components/base/*` |
| `src/components/common/*` | `@lms/shared-ui` | `packages/shared/ui/src/components/common/*` |
| `src/components/layout/*` | `@lms/shared-ui` | `packages/shared/ui/src/components/layout/*` |
| `src/hooks/*` | `@lms/shared-hooks` | `packages/shared/hooks/src/*` |
| `src/assets/*` | `@lms/shared-assets` | `packages/shared/assets/src/*` |
| `src/styles/*` | `@lms/shared-styles` | `packages/shared/styles/src/*` |
| `src/redux/store.ts` | `@lms/state-redux` | `packages/state/redux/src/store.ts` |
| `src/redux/slice/*` | `@lms/state-redux` | `packages/state/redux/src/slice/*` |
| `src/redux/services/*` | `@lms/state-redux` | `packages/state/redux/src/services/*` |
| `src/contexts/*` | `@lms/state-contexts` | `packages/state/contexts/src/*` |
| `src/components/auth/*` | `@lms/feature-auth` | `packages/features/auth/src/components/*` |
| `src/components/mycourses/*` | `@lms/feature-courses` | `packages/features/courses/src/components/mycourses/*` |
| `src/components/courses/*` | `@lms/feature-courses` | `packages/features/courses/src/components/courses/*` |
| `src/components/test/*` | `@lms/feature-tests` | `packages/features/tests/src/components/test/*` |
| `src/components/quiz/*` | `@lms/feature-tests` | `packages/features/tests/src/components/quiz/*` |
| `src/components/calendar/*` | `@lms/feature-calendar` | `packages/features/calendar/src/components/calendar/*` |
| `src/components/notification/*` | `@lms/feature-notifications` | `packages/features/notifications/src/components/*` |
| `src/components/profile/*` | `@lms/feature-profile` | `packages/features/profile/src/components/*` |
| `src/components/teacher/*` | `@lms/feature-teacher` | `packages/features/teacher/src/components/*` |
| `src/components/request/*` | `@lms/feature-requests` | `packages/features/requests/src/components/*` |
| `src/components/calculator/*` | `@lms/feature-calculator` | `packages/features/calculator/src/components/*` |
| `src/components/entrance-test/*` | `@lms/feature-tests` | `packages/features/tests/src/components/entrance-test/*` |
| `src/components/event-test/*` | `@lms/feature-event-test` | `packages/features/event-test/src/components/*` |
| `src/components/case-study/*` | `@lms/feature-case-study` | `packages/features/case-study/src/components/*` |
| `src/pages/courses/*` | `apps/lms` | `apps/lms/src/pages/courses/*` | LMS |
| `src/pages/test/*` | `apps/lms` | `apps/lms/src/pages/test/*` | LMS |
| `src/pages/entrance-test/*` | `apps/lms` | `apps/lms/src/pages/entrance-test/*` | LMS |
| `src/pages/event-test/*` | `apps/lms` | `apps/lms/src/pages/event-test/*` | LMS |
| `src/pages/calendar/*` | `apps/lms` | `apps/lms/src/pages/calendar/*` | LMS |
| `src/pages/teachers/*` | `apps/lms` | `apps/lms/src/pages/teachers/*` | LMS |
| Courses pages (simplified) | `apps/short-course` | `apps/short-course/src/pages/courses/*` | Short Course |

## Import Path Changes

### Before (Current)
```typescript
import { Button } from '@components/base/button/ButtonPrimary'
import { formatDate } from '@utils/common'
import { IUser } from 'src/type/user'
import { PageLink } from 'src/constants'
```

### After (Monorepo) - Both Apps
```typescript
import { Button } from '@lms/shared-ui'
import { formatDate } from '@lms/shared-utils'
import { IUser } from '@lms/shared-types'
import { PageLink } from '@lms/shared-constants'
```

### LMS App Only Features
```typescript
// apps/lms only
import { TestComponent } from '@lms/feature-tests'
import { EntranceTestComponent } from '@lms/feature-entrance-test'
import { EventTestComponent } from '@lms/feature-event-test'
import { CalendarComponent } from '@lms/feature-calendar'
```

### Short Course App (Simplified)
```typescript
// apps/short-course only
import { CourseComponent } from '@lms/feature-courses'
// No tests, calendar, entrance-test, event-test imports
```

## Build Flow

```
1. Build shared packages (parallel)
   ├── types
   ├── constants
   ├── utils
   ├── api-client
   ├── ui
   ├── hooks
   ├── assets
   └── styles

2. Build state packages (parallel)
   ├── redux
   └── contexts

3. Build feature packages (parallel, depends on shared + state)
   ├── auth
   ├── user
   ├── dashboard
   ├── courses
   ├── tests
   └── ...

4. Build app (depends on all packages)
   └── web
```

## Migration Priority

### Priority 1: Foundation
- [x] Setup monorepo infrastructure
- [ ] Extract shared-types
- [ ] Extract shared-constants
- [ ] Extract shared-utils

### Priority 2: Core Shared
- [ ] Extract shared-api-client
- [ ] Extract shared-ui
- [ ] Extract shared-hooks
- [ ] Extract shared-assets
- [ ] Extract shared-styles

### Priority 3: State Management
- [ ] Extract state-redux
- [ ] Extract state-contexts

### Priority 4: Independent Features
- [ ] Extract feature-auth
- [ ] Extract feature-calculator

### Priority 5: Core Features
- [ ] Extract feature-user
- [ ] Extract feature-dashboard
- [ ] Extract feature-notifications

### Priority 6: Large Features
- [ ] Extract feature-courses (LARGEST)
- [ ] Extract feature-tests

### Priority 7: Remaining Features
- [ ] Extract feature-calendar
- [ ] Extract feature-profile
- [ ] Extract feature-teacher
- [ ] Extract feature-requests
- [ ] Extract feature-event-test
- [ ] Extract feature-case-study
- [ ] Extract feature-progress

### Priority 8: Finalization
- [ ] Refactor apps/web
- [ ] Update CI/CD
- [ ] Documentation
- [ ] Testing

