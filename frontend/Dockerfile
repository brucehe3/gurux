FROM node:20-slim

WORKDIR /app


# 声明可传入的构建参数
ARG NEXT_PUBLIC_ENV_MODE
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG NEXT_PUBLIC_BACKEND_URL
ARG NEXT_PUBLIC_URL
ARG NEXT_PUBLIC_GOOGLE_CLIENT_ID

# 设置环境变量（构建阶段和运行阶段都能使用）
ENV NEXT_PUBLIC_ENV_MODE=$NEXT_PUBLIC_ENV_MODE
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV NEXT_PUBLIC_BACKEND_URL=$NEXT_PUBLIC_BACKEND_URL
ENV NEXT_PUBLIC_URL=$NEXT_PUBLIC_URL
ENV NEXT_PUBLIC_GOOGLE_CLIENT_ID=$NEXT_PUBLIC_GOOGLE_CLIENT_ID


# Copy package files first for better layer caching
COPY package*.json ./

# Install build dependencies for node-gyp
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    make \
    g++ \
    build-essential \
    pkg-config \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev \
    && rm -rf /var/lib/apt/lists/*

RUN npm install

# Copy the frontend code
COPY . .

RUN npm run build

EXPOSE 3000

# Default command is dev, but can be overridden in docker-compose
CMD ["npm", "start"]