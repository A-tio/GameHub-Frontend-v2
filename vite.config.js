import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


export default defineConfig({
  plugins: [react(), tailwindcss(),],
  server: {
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'Content-Security-Policy':
        " script-src 'self' 'unsafe-inline' https://apis.google.com https://www.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://firestore.googleapis.com https://identitytoolkit.googleapis.com; frame-ancestors 'none';"
    }
  }
})
