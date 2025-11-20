#!/bin/bash
rm -rf .vercel

# Dừng nếu có lỗi (tạm thời tắt khi deploy để bắt lỗi thủ công)
set -e

# Đường dẫn đến thư mục Vercel config
VERCEL_DIR=".vercel"
PROJECT_FILE="$VERCEL_DIR/project.json"

# Webhook và thông tin URL
DISCORD_WEBHOOK_URL="https://discord.com/api/webhooks/1440893708936413205/BfTGcrmzSAwcMRsah-Bn7uBuUN2gLlkiiw7YC-L1qGOX-RusC4WxiE4i9GP6rMoDwT2b"
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
  "projectId":"prj_zS5V1DDmRXtNXgnux25k4XieVweM",
  "orgId":"team_JU0yCXAg41hvPS2acUIm6gEr"
}
EOL

# Deploy - bắt lỗi thủ công
echo "🚀 Deploying to Vercel dev..."
if vercel deploy --prod; then
  MESSAGE="Deployed sapp-lms-finhub success to: $URL at $(date '+%Y-%m-%d %H:%M:%S')"
else
  MESSAGE="Deployment FAILED for sapp-lms-finhub at $(date '+%Y-%m-%d %H:%M:%S')"
fi

# Gửi thông báo lên Discord
curl -H "Content-Type: application/json" \
  -X POST \
  -d "{\"content\": \"$MESSAGE\"}" \
  $DISCORD_WEBHOOK_URL

echo "🎯 Script finished!"
