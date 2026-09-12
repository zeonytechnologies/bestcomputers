import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import fs from 'fs'
import path from 'path'
import { pathToFileURL } from 'url'

// Custom plugin to serve Vercel /api routes locally during npm run dev
const vercelApiMiddleware = () => ({
  name: 'vercel-api-middleware',
  configureServer(server) {
    // Manually load .env.local into process.env for the local API routes
    try {
      const envFile = fs.readFileSync(path.resolve('.env.local'), 'utf-8');
      envFile.split('\n').forEach(line => {
        const [key, ...val] = line.split('=');
        if (key && val.length > 0) {
          process.env[key.trim()] = val.join('=').trim();
        }
      });
    } catch (e) {
      console.log('No .env.local found for local API routes');
    }

    server.middlewares.use(async (req, res, next) => {
      if (req.url.startsWith('/api/')) {
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        req.on('end', async () => {
          if (body) {
            try { req.body = JSON.parse(body); } catch(e) {}
          }
          
          const route = req.url.split('?')[0]; // e.g. /api/send-reset-otp
          const absolutePath = path.resolve(process.cwd(), `.${route}.js`);
          
          try {
            // Convert to a proper file:// URL to bypass Vite's temp dir compilation issues
            const fileUrl = pathToFileURL(absolutePath).href;
            const module = await import(`${fileUrl}?update=${Date.now()}`);
            const handler = module.default;
            
            // Mock Vercel res methods
            res.status = (code) => { res.statusCode = code; return res; };
            res.json = (data) => {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(data));
            };
            
            await handler(req, res);
          } catch (err) {
            console.error(`Error executing ${route}:`, err);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: 'Internal Server Error' }));
          }
        });
      } else {
        next();
      }
    });
  }
})

export default defineConfig({
  plugins: [react(), vercelApiMiddleware()],
})
