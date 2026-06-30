#!/bin/bash
rm -rf .vercel
rm -rf .turbo
# Dừng nếu có lỗi (tạm thời tắt khi deploy để bắt lỗi thủ công)
set -e

# Đường dẫn đến thư mục Vercel config
VERCEL_DIR=".vercel"
PROJECT_FILE="$VERCEL_DIR/project.json"

# Webhook và thông tin URL
DISCORD_WEBHOOK_URL="https://discord.com/api/webhooks/1372517387261181952/oBao4tFD7_H5R51bJAb5Kfu3dGS0TVS6n2sp3PEjqySgPKo0ifqpULd-mopBsK58guyP"
URL=https://dev-lms-test.vercel.app/

# Tạo thư mục .vercel nếu chưa tồn tại
if [ ! -d "$VERCEL_DIR" ]; then
  echo "📁 Creating .vercel directory..."
  mkdir "$VERCEL_DIR"
fi

# Tạo hoặc ghi đè file project.json
echo "📝 Creating project.json..."
cat > "$PROJECT_FILE" <<EOL
{
  "projectId":"prj_k395p3NaYFVKgZX4xzpYNGKg2zPL",
  "orgId":"team_JU0yCXAg41hvPS2acUIm6gEr"
}
EOL

# Deploy - bắt lỗi thủ công
echo "🚀 Deploying to Vercel dev..."
if vercel deploy --prod; then
  MESSAGE="Deployed sapp-lms-test success to: $URL at $(date '+%Y-%m-%d %H:%M:%S')"
else
  MESSAGE="Deployment FAILED for sapp-lms-test at $(date '+%Y-%m-%d %H:%M:%S')"
fi

# Gửi thông báo lên Discord
curl -H "Content-Type: application/json" \
  -X POST \
  -d "{\"content\": \"$MESSAGE\"}" \
  $DISCORD_WEBHOOK_URL

echo "🎯 Script finished!"
