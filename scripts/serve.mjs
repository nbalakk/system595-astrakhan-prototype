import http from 'node:http';
import { createReadStream } from 'node:fs';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
const root = path.resolve('dist');
const port = Number(process.env.PORT || 5950);
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.vtt': 'text/vtt; charset=utf-8', '.mp4': 'video/mp4', '.png': 'image/png', '.jpg': 'image/jpeg', '.ttf': 'font/ttf', '.txt': 'text/plain; charset=utf-8' };
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
    if (path.extname(file) === '.mp4') {
      const { size } = await stat(file);
      const headers = { 'Content-Type': 'video/mp4', 'Accept-Ranges': 'bytes', 'Cache-Control': 'no-cache' };
      let start = 0;
      let end = size - 1;
      if (req.headers.range) {
        const bounds = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range);
        if (bounds && (bounds[1] || bounds[2])) {
          start = bounds[1] ? Number(bounds[1]) : Math.max(0, size - Number(bounds[2]));
          if (bounds[1] && bounds[2]) end = Math.min(end, Number(bounds[2]));
        } else {
          start = size;
        }
        if (start > end) { res.writeHead(416, { ...headers, 'Content-Range': 'bytes */' + size }); res.end(); return; }
        headers['Content-Range'] = `bytes ${start}-${end}/${size}`;
      }
      res.writeHead(req.headers.range ? 206 : 200, { ...headers, 'Content-Length': end - start + 1 });
      if (req.method === 'HEAD') { res.end(); return; }
      const stream = createReadStream(file, { start, end });
      res.on('close', () => stream.destroy());
      stream.on('error', () => res.destroy());
      stream.pipe(res);
      return;
    }
    const content = await readFile(file);
    res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-cache', 'X-Content-Type-Options': 'nosniff' });
    res.end(content);
  } catch { res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }); res.end('Страница не найдена'); }
}).listen(port, '127.0.0.1', () => console.log(`Prototype: http://127.0.0.1:${port}/\nRepository-subpath test: http://127.0.0.1:${port}/prototype/`));
