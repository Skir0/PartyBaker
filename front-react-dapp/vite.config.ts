import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

export default defineConfig({
    plugins: [
        react(),
        nodePolyfills(),
    ],
    server: {
        // 1. Разрешаем Ngrok
        allowedHosts: true,

        // 2. Настраиваем прокси
        proxy: {
            // Все запросы, начинающиеся с /api, пойдут на Go
            '/api': {
                target: 'http://localhost:8080', // Адрес твоего Go-сервера
                changeOrigin: true,
                secure: false,
            },
            // Если у тебя есть путь /health, его тоже можно проксировать
            '/health': {
                target: 'http://localhost:8080',
                changeOrigin: true,
            }
        }
    }
})