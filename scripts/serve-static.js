const http = require('http');
const fs = require('fs');
const path = require('path');

const root = path.resolve(process.argv[3] || path.join(__dirname, '..'));
const port = Number(process.argv[2] || 4173);
const mime = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8'
};

function resolveRequest(url) {
  const cleanUrl = decodeURIComponent(url.split('?')[0]);
  const requested = cleanUrl === '/' ? '/index.html' : cleanUrl;
  const absolute = path.normalize(path.join(root, requested));

  if (!absolute.startsWith(root)) return path.join(root, '404.html');
  if (fs.existsSync(absolute) && fs.statSync(absolute).isFile()) return absolute;
  return path.join(root, '404.html');
}

const server = http.createServer((request, response) => {
  const file = resolveRequest(request.url || '/');
  const ext = path.extname(file).toLowerCase();
  response.writeHead(file.endsWith('404.html') && request.url !== '/404.html' ? 404 : 200, {
    'Content-Type': mime[ext] || 'application/octet-stream',
    'Cache-Control': 'no-store'
  });
  fs.createReadStream(file).pipe(response);
});

server.listen(port, '127.0.0.1', () => {
  console.log(`Local preview: http://127.0.0.1:${port}`);
});
