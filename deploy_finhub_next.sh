#!/bin/bash
rm -rf .vercel

# Dừng nếu có lỗi (tạm thời tắt khi deploy để bắt lỗi thủ công)
set -e

# Đường dẫn đến thư mục Vercel config
VERCEL_DIR=".vercel"
PROJECT_FILE="$VERCEL_DIR/project.json"

# Webhook và thông tin URL
URL=https://dev-finhub.vercel.app/

# Tạo thư mục .vercel nếu chưa tồn tại
if [ ! -d "$VERCEL_DIR" ]; then
  echo "📁 Creating .vercel directory..."
  mkdir "$VERCEL_DIR"
fi

# Tạo hoặc ghi đè file project.json
echo "📝 Creating project.json..."
cat > "$PROJECT_FILE" <<EOL
{
  "projectId":"prj_0rcbcTVkg4JEyyI2RQ7jGUzAfi5G",
  "orgId":"team_JU0yCXAg41hvPS2acUIm6gEr"
}
EOL


echo "🎯 Script finished!"
