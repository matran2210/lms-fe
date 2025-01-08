# PROJECT

- **_Luôn viết mã sạch_**
- **_Nghĩ trước khi code_**
- **_Code có tâm_**
- **_Sẵn sàng dạy nhau_**
- **_Trách nhiệm với công việc_**
- **_Chủ động thảo luận_**

## Run Locally

Clone the project

```bash
  git clone https://link-to-project
```

Go to the project directory

```bash
  cd my-project
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run dev
```

# Hướng dẫn lấy API Key cho TinyMCE

## Bước 1: Truy cập và đăng nhập

- Truy cập: **[https://www.tiny.cloud/auth/login/](https://www.tiny.cloud/auth/login/)**
- Đăng nhập bằng Gmail: **[Hướng dẫn](https://prnt.sc/PYH0yHygVR7k)**

## Bước 2: Lấy API Key

- Sau khi đăng nhập, API Key sẽ hiển thị tại trang **Dashboard**: **[Xem ví dụ](https://prnt.sc/7a5XNvjac9y0)**

## Bước 3: Sử dụng API Key

1. Sao chép API Key.
2. Dán vào file **.env** của dự án:
   NEXT_PUBLIC_TINY_EDITDER_API_KEY=YOUR_API_KEY **(key ở ảnh https://prnt.sc/7a5XNvjac9y0)**
