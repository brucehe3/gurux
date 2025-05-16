# GuruX 安装指南

GuruX 是一个开源 AI Agent 框架，基于 Suna 项目构建。你可以将 GuruX 完全自托管在本地或远程服务器上，以下是部署步骤。

---

## 环境要求

- Python 3.11+
- Node.js 18+
- Docker（可选，用于一键部署）
- Supabase 项目（用于数据库与鉴权）
- Redis 数据库
- LLM API 密钥（如 OpenAI / Anthropic / OpenRouter 等）
- Daytona API 密钥（用于沙箱执行）

---

## 步骤一：准备 Supabase 项目

1. 访问 [https://supabase.com](https://supabase.com)，新建一个项目；
2. 保存以下信息以备配置使用：
   - Project URL
   - Anon key
   - Service Role key；
3. 安装 Supabase CLI：
   ```bash
   npm install -g supabase
````

---

## 步骤二：运行 Redis（本地）

```bash
cd backend
docker compose up redis
```

---

## 步骤三：克隆并配置项目

```bash
git clone https://github.com/your-username/gurux.git
cd gurux
```

### 配置 backend 环境变量

```bash
cd backend
cp .env.example .env
```

编辑 `.env` 文件并填写如下信息：

```env
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_SSL=False

DAYTONA_API_KEY=
DAYTONA_SERVER_URL=https://app.daytona.io/api

OPENAI_API_KEY=
ANTHROPIC_API_KEY=
```

---

## 步骤四：初始化 Supabase 数据库

```bash
supabase login
supabase link --project-ref your_project_ref
supabase db push
```

---

## 步骤五：配置 frontend 环境变量

```bash
cd ../frontend
cp .env.example .env.local
```

编辑 `.env.local`：

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000/api
NEXT_PUBLIC_URL=http://localhost:3000
```

---

## 步骤六：安装依赖

```bash
# 安装前端依赖
cd frontend
npm install

# 安装后端依赖
cd ../backend
poetry install
```

---

## 步骤七：启动应用

**方式一：本地分开运行**

```bash
# 启动前端
cd frontend
npm run dev

# 启动后端
cd ../backend
poetry run python3.11 api.py
```

**方式二：使用 Docker Compose**

```bash
docker compose up
```

---

## 访问 GuruX

打开浏览器访问：

```
http://localhost:3000
```

注册一个新账户后，即可开始使用。

---

## 后续开发建议

GuruX 项目未来将加入以下特性：

* LangChain 工具集成
* 自定义 Agent 构建器
* 向量搜索与记忆系统（基于 Supabase & pgvector）
* 插件式工具链系统

欢迎关注并参与共建！
