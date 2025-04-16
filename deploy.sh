#!/bin/bash

# Dừng nếu có lỗi
set -e

# Đường dẫn đến thư mục Vercel config
VERCEL_DIR=".vercel"
PROJECT_FILE="$VERCEL_DIR/project.json"

# Tạo thư mục .vercel nếu chưa tồn tại
if [ ! -d "$VERCEL_DIR" ]; then
  echo "📁 Creating .vercel directory..."
  mkdir "$VERCEL_DIR"
fi

# Tạo hoặc ghi đè file project.json
echo "📝 Creating project.json..."
cat > "$PROJECT_FILE" <<EOL
{
  "projectId":"prj_CfpiZxl2xPxu5S2x8XDqq0lZ61Vu",
  "orgId":"team_JU0yCXAg41hvPS2acUIm6gEr"
}
EOL

# Deploy
echo "🚀 Deploying to Vercel production..."
vercel deploy --prod

# Send notification to Discord
DISCORD_WEBHOOK_URL="https://discord.com/api/webhooks/1361177434338361386/wB6p0irut7xbnBWlJz1bkoF8mec5cah5ZJ53-wChx5ty5BAf2G9JizaaaeRNiT-tcC4X"
URL=https://dev-lms.sapp.edu.vn
MESSAGE="Deployed sapp-lms-dev success to: $URL at $(date '+%Y-%m-%d %H:%M:%S')"

curl -H "Content-Type: application/json" \
  -X POST \
  -d "{\"content\": \"$MESSAGE\"}" \
  $DISCORD_WEBHOOK_URL

echo "✅ Deployment complete!"
