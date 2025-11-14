Hướng dẫn làm việc với Monorepo (Git Subtree)

File này ghi lại các lệnh git subtree chuẩn để thêm và đồng bộ code cho các dự án con (apps) trong monorepo này.

Cấu trúc thư mục

/apps: Chứa các ứng dụng con (ví dụ: lms-pro, finhub). Mỗi ứng dụng này được quản lý như một subtree.

/libs: Chứa các thư viện dùng chung (UI, utils, assets...).

/features: Chứa các "feature" nghiệp vụ dùng chung.

1. Thêm một App/Dự án mới (git subtree add)

Đây là quy trình để "nhúng" code từ một repo Git bên ngoài (ví dụ: một app React/Next.js) vào thư mục /apps của monorepo.

Lệnh quan trọng: git subtree add

Cú pháp

git subtree add --prefix=<đường_dẫn_trong_monorepo> <url_repo_con> <tên_nhánh> --squash

Các bước thực hiện

Đứng ở thư mục gốc (root) của monorepo (lms-fe).

Chạy lệnh add, thay thế các giá trị cho đúng:

git subtree add --prefix=apps/ten-app-moi [https://github.com/user/ten-app-moi.git](https://github.com/user/ten-app-moi.git) main --squash

Giải thích tham số:

--prefix=apps/ten-app-moi:

Đây là đường dẫn bên trong monorepo mà bạn muốn đặt code của app con vào.

Ví dụ: apps/lms-pro, apps/finhub.

https://github.com/user/ten-app-moi.git:

Đây là URL của repo Git (repo con) mà bạn muốn thêm vào.

main:

Tên nhánh (branch) của repo con mà bạn muốn kéo code về (ví dụ: main, master, staging, develop).

--squash:

Rất quan trọng! Tham số này sẽ "nén" toàn bộ lịch sử commit của repo con thành một commit duy nhất khi thêm vào monorepo. Điều này giúp giữ lịch sử của monorepo sạch sẽ, không bị lẫn hàng ngàn commit rác từ app con.

2. Đồng bộ Code từ App con (git subtree pull)

Đây là quy trình để cập nhật code mới nhất từ repo con (ví dụ: lms-pro) vào monorepo của bạn.

Lệnh quan trọng: git subtree pull

Cú pháp

git subtree pull --prefix=<đường_dẫn_trong_monorepo> <url_repo_con> <tên_nhánh> --squash

Các bước thực hiện

Đứng ở thư mục gốc (root) của monorepo.

Chạy lệnh pull cho app mà bạn muốn đồng bộ:

Ví dụ (đồng bộ app lms-pro từ nhánh staging):

git subtree pull --prefix=apps/lms-pro [https://github.com/user/lms-pro.git](https://github.com/user/lms-pro.git) staging --squash

Giải thích:

Lệnh pull dùng các tham số y hệt như lệnh add.

Nó sẽ tìm nạp (fetch) code mới nhất từ nhánh staging của repo con và "merge" (trộn) vào thư mục apps/lms-pro của bạn.

Dùng --squash cũng rất quan trọng để giữ lịch sử sạch.

3. (Nâng cao) Đẩy Code từ Monorepo lên App con (git subtree push)

Nếu bạn sửa code của lms-pro ngay bên trong monorepo và muốn "đẩy" (push) những thay đổi đó LÊN LẠI repo lms-pro gốc.

Lệnh quan trọng: git subtree push

Cú pháp

git subtree push --prefix=<đường_dẫn_trong_monorepo> <url_repo_con> <tên_nhánh>

Ví dụ

git subtree push --prefix=apps/lms-pro [https://github.com/user/lms-pro.git](https://github.com/user/lms-pro.git) main

Lệnh này sẽ lấy toàn bộ commit liên quan đến apps/lms-pro và đẩy chúng lên nhánh main của repo con.

Hướng dẫn "Tạo Link Export" cho Package (libs/ features/)

Đây là quy trình 5 bước bắt buộc để tạo một package mới (ví dụ: @lms/utils) và làm cho nó có thể được import từ một package khác (ví dụ: @lms/feature-calculator).

Nếu bạn làm thiếu 1 trong 5 bước này, bạn sẽ gặp lỗi Cannot find module.

Tóm tắt 5 file cần kiểm tra:

pnpm-workspace.yaml (Ở gốc): pnpm có "thấy" thư mục (libs, features) không?

package.json của Gói Mới (ví dụ: libs/utils/package.json): Package mới tên là gì? "Cổng vào" (main) ở đâu?

index.ts (Cổng vào) (ví dụ: libs/utils/index.ts): Gói này export (cho phép) những code gì ra ngoài?

tsconfig.base.json (Ở tools/): TypeScript có "lối tắt" (paths) để tìm package này không?

package.json của Gói Dùng (ví dụ: features/calculator/package.json): Package calculator đã "xin phép" (khai báo dependencies) để dùng utils chưa?

VÍ DỤ: Tạo package @lms/utils

Giả sử chúng ta muốn tạo một package libs/utils (tên @lms/utils) chứa hàm formatDate và dùng nó trong features/calculator (file features/calculator/package.json).

Bước 1: Kiểm tra pnpm-workspace.yaml (Làm 1 lần)

Đảm bảo file pnpm-workspace.yaml ở thư mục gốc (D:\lms-fe-1\lms-fe\) đã "thấy" thư mục libs/.

packages:

- 'apps/\*'
- 'libs/\*' # <-- Phải có dòng này
- 'features/\*' # <-- Phải có dòng này

(File của bạn (file pnpm-workspace.yaml) đã có dòng này, nên bước này OK)

Bước 2: Tạo Package Mới (Tạo 3 file)

Đi đến thư mục libs/. Tạo thư mục utils. Bên trong libs/utils, tạo 3 file:

A. File code thật (libs/utils/formatDate.ts):

export const formatDate = (date: Date): string => {
// ... (code định dạng ngày)
return date.toISOString().split('T')[0];
};

B. File package.json (File định danh):
Tạo file libs/utils/package.json để khai báo tên và "cổng vào".

{
"name": "@lms/utils",
"version": "1.0.0",
"private": true,
"main": "./index.ts", // <-- Cổng vào
"types": "./index.ts", // <-- Cổng vào cho Types
"scripts": {
"lint": "eslint ."
},
"peerDependencies": {
// (Gói này không cần React)
}
}

C. File tsconfig.json (File kế thừa):
Tạo file libs/utils/tsconfig.json để "kế thừa" cấu hình chung.

{
"extends": "../../tools/typescript-config/tsconfig.base.json"
}

Bước 3: Cập nhật "Cổng vào" (index.ts)

Bây giờ, bạn phải tạo file libs/utils/index.ts (file mà package.json đã khai báo là main). File này có nhiệm vụ export hàm formatDate ra ngoài.

// File: libs/utils/index.ts
export _ from './formatDate';
// (Nếu có file khác thì export _ from './anotherUtil';)

Bước 4: Dạy TypeScript "Lối tắt" (Sửa tsconfig.base.json)

pnpm đã biết utils ở đâu, nhưng TypeScript (VSCode) chưa biết. Bạn cần cập nhật file tools/typescript-config/base.json (file tools/typescript-config/base.json) để thêm "lối tắt" (path alias).

{
"compilerOptions": {
"baseUrl": ".",
"paths": {
"@lms/assets": ["libs/assets/index.ts"],
"@lms/ui": ["libs/ui/index.ts"],
// THÊM DÒNG NÀY:
"@lms/utils": ["libs/utils/index.ts"]
}
}
}

Bước 5: Khai báo Phụ thuộc và Cài đặt

Package utils đã sẵn sàng. Giờ bạn phải "xin phép" cho calculator được dùng nó.

A. Sửa features/calculator/package.json (file features/calculator/package.json):
Thêm @lms/utils vào dependencies:

{
"name": "@lms/feature-calculator",
"dependencies": {
"@lms/assets": "workspace:_",
"@lms/ui": "workspace:_",
"@lms/utils": "workspace:\*" // <-- THÊM DÒNG NÀY
}
// ... (peerDependencies, devDependencies...)
}

B. Chạy pnpm install:
Quay lại thư mục gốc (lms-fe-1/lms-fe/) và chạy:

pnpm install

Lệnh này sẽ đọc tất cả package.json, "liên kết" @lms/utils vào node_modules của calculator.

C. Sử dụng:
Bây giờ, trong file features/calculator/src/logic/calculate.ts (hoặc calcButton.tsx (file calcButton.tsx)), bạn đã có thể import thành công:

import { formatDate } from '@lms/utils';

// ...
