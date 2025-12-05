# Hướng Dẫn Link Local Package vào Monorepo

Tài liệu này hướng dẫn đầy đủ cách **link package vào monorepo** trong monorepo dùng PNPM link.

---

# 1. Mở cmd tới đường dẫn local-package cần link vào monorepo

## 1.1. Cài đặt pnpm mới nhất

```
npm install -g pnpm@latest
```

---

## 1.2. Kiểm tra version pnpm

```
pnpm -v
```

---

## 1.3. Tạo bản linked cho local-package sử dụng pnpm link

```
pnpm link
```

# 2. Kết nối bản linked của local-package vào monorepo

## 2.1. Mở cmd tới đường dẫn app/web cần kết nối

```
pnpm link <local-package-name>
```

# 3. Bỏ linked local-package

## 3.1. Unlink bản linked local-package

```
pnpm unlink  <local-package-name>
```

## 3.2. Quay lại dùng npm

```
pnpm add <local-package-name>
```
