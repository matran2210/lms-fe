# Quy trình Release chuẩn (npm + Git, protected `staging`)

Tài liệu này mô tả **quy trình release chuẩn, nghiêm ngặt** cho dự án sử dụng **npm**, **git tag**, và **protected branch (`staging`)**.
Mục tiêu: **version không loạn – tag đúng commit – CI/CD chạy đúng code**.

---

## 1. Phạm vi áp dụng

Áp dụng cho các dự án có đặc điểm:

- Sử dụng **npm / package.json**
- Release theo **semantic versioning** (`x.y.z`)
- Nhánh `staging` (hoặc `main`) **bị chặn push trực tiếp**
- Mọi thay đổi phải đi qua **Pull Request**

---

## 2. Nguyên tắc bắt buộc (KHÔNG ĐƯỢC PHÁ)

1. ❌ Không sửa tay `version` trong `package.json`
2. ❌ Không chạy `npm version` ở `feature/*`, `bugfix/*`
3. ❌ Không chạy `npm version` trực tiếp trên `staging`
4. ✅ Chỉ bump version bằng `npm version`
5. ✅ Mọi thay đổi version **phải đi qua PR**
6. ✅ Tag phải trỏ đúng commit nằm trên `staging`

Vi phạm các nguyên tắc trên sẽ dẫn đến:

- tag lệch commit
- version bị loạn
- CI/CD chạy sai code

---

## 3. Quy trình release chuẩn (BẮT BUỘC)

### Bước 1: Phát triển & merge code

```text
feature/* fix/*  →  staging
```

- Code xong, test xong
- Merge qua Pull Request
- ❌ **Không bump version**

---

### Bước 2: Tạo release branch từ `staging`

```bash
git checkout staging
git pull
git checkout -b release/x.y.z
```

Ví dụ:

```bash
git checkout -b release/1.4.9
```

---

### Bước 3: Bump version (CHỈ ở release branch)

```bash
npm version patch   # hoặc minor / major
```

Lệnh này sẽ **tự động**:

- cập nhật `package.json` (+ `package-lock.json` nếu có)
- tạo **commit version**
- tạo **git tag `vX.Y.Z`**

⚠️ Không commit thêm lần nữa.

---

### Bước 4: Push release branch + tag

```bash
git push origin release/x.y.z --follow-tags
```

---

### Bước 5: Merge release vào `staging`

```text
release/x.y.z  →  staging
```

- Tạo Pull Request
- Review
- Merge

Sau bước này:

- `staging` có commit bump version
- tag `vX.Y.Z` trỏ đúng code release

---

### Bước 6: Publish

```bash
npm publish
```

(Thực hiện sau khi PR release đã merge)

---

### Bước 7: update lên version mới nhất của package ở monorepo

```bash
pnpm -r up @sapp-fe/explanation-package@latest
```

---

## 5. Những flow SAI (TUYỆT ĐỐI TRÁNH)

❌ `npm version` ở `feature/*`
❌ `npm version` trực tiếp trên `staging`
❌ Sửa tay version trong `package.json`
❌ Force push tag
❌ Publish trước khi merge vào `staging`

---

## 6. Checklist trước khi release

- [ ] Tất cả feature / bugfix đã merge vào `staging`
- [ ] Đang đứng ở `release/x.y.z`
- [ ] `git status` clean
- [ ] Bump version bằng `npm version`
- [ ] Push branch + tag
- [ ] PR `release → staging` đã merge

---

## 7. Ghi nhớ cốt lõi

> **Code merge một lần – Version merge một lần** > **Release là sự kiện đặc biệt, không làm tuỳ tiện**
