import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import fs from 'fs'

function registrationSaverPlugin() {
  return {
    name: 'registration-saver-middleware',
    configureServer(server) {
      server.middlewares.use('/api/save-registration', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'Method Not Allowed' }))
          return
        }
        try {
          const chunks = []
          for await (const chunk of req) chunks.push(chunk)
          const bodyStr = Buffer.concat(chunks).toString('utf-8')
          const data = JSON.parse(bodyStr || '{}')

          const { firstName, lastName, email, fileUrl, timestamp } = data
          if (!firstName || !lastName || !email) {
            res.statusCode = 400
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: 'Missing required fields' }))
            return
          }

          const rootDir = process.cwd()
          const outDir = path.join(rootDir, 'registrations')
          // Ensure directory exists (recursive is safe even if it already exists)
          fs.mkdirSync(outDir, { recursive: true })

          const safeFirst = String(firstName).trim().replace(/[^a-z0-9_-]+/gi, '_')
          const safeLast = String(lastName).trim().replace(/[^a-z0-9_-]+/gi, '_')
          const rawTs = timestamp || new Date().toISOString()
          const ts = String(rawTs).replace(/[^a-z0-9_-]/gi, '-')
          const fileName = `${safeFirst}_${safeLast}_${ts}.txt`
          const filePath = path.join(outDir, fileName)

          const content = [
            'Enhanced ACIS — Download Registration',
            `Timestamp: ${timestamp || new Date().toISOString()}`,
            `First Name: ${firstName}`,
            `Last Name: ${lastName}`,
            `Email: ${email}`,
            `File: ${fileUrl || ''}`,
            '',
            'This record confirms your registration before download.'
          ].join('\n')

          fs.writeFileSync(filePath, content, { encoding: 'utf-8' })

          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ ok: true, savedPath: filePath }))
        } catch (err) {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'Failed to save registration', details: String(err) }))
        }
      })
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  // Use dynamic base to support GitHub Pages without breaking local dev
  base: process.env.VITE_BASE || '/',
  plugins: [react(), tailwindcss(), registrationSaverPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
