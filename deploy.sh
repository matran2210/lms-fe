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
  "projectId": "prj_CfpiZxl2xPxu5S2x8XDqq0lZ61Vu",
  "orgId": "team_8w3Xngbztnty7zaKd1kaye1x"
}
EOL

# Deploy
echo "🚀 Deploying to Vercel production..."
vercel deploy --prod

echo "✅ Deployment complete!"
