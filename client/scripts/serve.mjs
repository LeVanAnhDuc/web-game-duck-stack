import { createReadStream, statSync } from 'node:fs'
import { createServer } from 'node:http'
import { extname, join, normalize, resolve, sep } from 'node:path'

/**
 * Serves a build folder the way GitHub Pages does, for the regression suite in
 * ../automation-testing (its playwright.config.ts webServer starts it):
 *
 *   node scripts/serve.mjs <port> <dir>
 *
 * A plain static server rather than `vite preview`: preview needs the same
 * VITE_BASE_PATH the build used, and Node's server is concurrent, so parallel
 * Playwright workers do not starve it into failures that read like app bugs.
 */
const PORT = Number(process.argv[2] ?? 4173)
const ROOT = resolve(process.argv[3] ?? '.e2e/pages')

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
}

createServer((req, res) => {
  const url = new URL(req.url ?? '/', 'http://localhost')
  // normalise, then stay inside ROOT: a test server must not read the repository
  const rel = normalize(decodeURIComponent(url.pathname)).replace(/^([/\\])+/, '')
  let file = join(ROOT, rel)
  if (file !== ROOT && !file.startsWith(ROOT + sep)) {
    res.writeHead(403).end('forbidden')
    return
  }
  try {
    if (statSync(file).isDirectory()) file = join(file, 'index.html')
    statSync(file)
  } catch {
    res.writeHead(404).end('not found')
    return
  }
  res.writeHead(200, {
    'content-type': TYPES[extname(file)] ?? 'application/octet-stream',
    'cache-control': 'no-store',
  })
  createReadStream(file).pipe(res)
}).listen(PORT, '127.0.0.1', () => {
  process.stdout.write(`serving ${ROOT} on http://127.0.0.1:${PORT}\n`)
})
