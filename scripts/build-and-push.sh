#!/bin/bash
set -e

# ==== 配置项 ====
GITHUB_USER="brucehe3"
REPO_NAME="suna-frontend"
IMAGE_NAME="ghcr.io/$GITHUB_USER/$REPO_NAME:latest"
ENV_FILE="../frontend/.env.production"

# 检查 .env.production 是否存在
if [ ! -f "$ENV_FILE" ]; then
  echo "❌ $ENV_FILE not found!"
  exit 1
fi

echo "🔄 加载构建环境变量..."
export $(grep -v '^#' $ENV_FILE | xargs)

# 登录 GHCR
echo "🔐 登录 GitHub Container Registry..."
echo $GHCR_TOKEN | docker login ghcr.io -u $GITHUB_USER --password-stdin

# 构建镜像
echo "🚧 开始构建镜像：$IMAGE_NAME ..."
docker build \
  --build-arg NEXT_PUBLIC_ENV_MODE=$NEXT_PUBLIC_ENV_MODE \
  --build-arg NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL \
  --build-arg NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL \
  --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY \
  --build-arg NEXT_PUBLIC_BACKEND_URL=$NEXT_PUBLIC_BACKEND_URL \
  --build-arg NEXT_PUBLIC_URL=$NEXT_PUBLIC_URL \
  --build-arg NEXT_PUBLIC_GOOGLE_CLIENT_ID=$NEXT_PUBLIC_GOOGLE_CLIENT_ID \

  -t $IMAGE_NAME \
  ../frontend

# 推送镜像
echo "📤 推送镜像到 GHCR：$IMAGE_NAME ..."
docker push $IMAGE_NAME

echo "✅ 镜像构建并上传成功！"
