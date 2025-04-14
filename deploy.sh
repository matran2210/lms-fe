#!/bin/bash

# Dừng script nếu có lỗi
set -e

echo "🚀 Deploying to Vercel production..."
vercel deploy --prod

echo "✅ Deployment complete!"