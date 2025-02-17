import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  root: './src', // Đặt thư mục gốc của dự án (nếu cần)
  build: {
    outDir: 'build', // Thư mục đầu ra của build
  },
})
