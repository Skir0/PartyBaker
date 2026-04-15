import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

export default defineConfig({
    plugins: [
        react(),
        // Это единственный плагин для полифиллов, который тебе нужен
        nodePolyfills({
            // В новых версиях плагина это делается так:
            include: ['buffer', 'process'],
            globals: {
                Buffer: true,
                process: true,
            },
        }),
    ],
    server: {
        allowedHosts: true,
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
    },
})



