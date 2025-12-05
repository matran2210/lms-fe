find . -name "node_modules" -type d -prune -exec rm -rf {} +
find . -name ".next" -type d -prune -exec rm -rf {} +
find . -name "dist" -type d -prune -exec rm -rf {} +
pnpm store prune --force
rm -f pnpm-lock.yaml
pnpm install
