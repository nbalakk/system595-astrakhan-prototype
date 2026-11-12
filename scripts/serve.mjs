import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
const root = path.resolve('dist');
const port = Number(process.env.PORT || 5950);
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.ttf': 'font/ttf', '.txt': 'text/plain; charset=utf-8' };
http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost');
    let pathname = decodeURIComponent(url.pathname);
    // A second mount verifies repository-subpath behaviour without changing the build.
    if (pathname === '/prototype') { res.writeHead(302, { Location: '/prototype/' }); res.end(); return; }
    if (pathname.startsWith('/prototype/')) pathname = pathname.slice('/prototype'.length);
    let file = path.resolve(root, '.' + pathname);
    if (file !== root && !file.startsWith(root + path.sep)) throw new Error('Path outside distribution');
    const info = await stat(file);
    if (info.isDirectory()) {
      if (!url.pathname.endsWith('/')) { res.writeHead(302, { Location: url.pathname + '/' + url.search }); res.end(); return; }
      file = path.join(file, 'index.html');
    }
    const content = await readFile(file);
    res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-cache', 'X-Content-Type-Options': 'nosniff' });
    res.end(content);
  } catch { res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }); res.end('Страница не найдена'); }
}).listen(port, '127.0.0.1', () => console.log(`Prototype: http://127.0.0.1:${port}/\nRepository-subpath test: http://127.0.0.1:${port}/prototype/`));
