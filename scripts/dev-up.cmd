@echo off
setlocal

cd /d "%~dp0.."

if not exist .env (
  copy .env.example .env >nul
  echo Created .env from .env.example
)

docker compose up -d db
if errorlevel 1 exit /b 1

set DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:55432/tasks_db?schema=public
node scripts\wait-for-db.mjs
if errorlevel 1 exit /b 1

call npm run prisma:migrate:deploy
if errorlevel 1 exit /b 1

echo Database is ready. Start the API with: npm run dev
endlocal
