import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': '/src',
            '@app': '/src/app',
            '@pages': '/src/pages',
            '@components': '/src/components',
            '@assets': '/src/assets',
            '@constants': '/src/constants',
            '@shared': '/src/shared',
        },
    },
})
