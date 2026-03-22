import http from 'http';

const port = Number(process.env.PORT) || 4000;

const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok' }));
    return;
  }

  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Book Earth API skeleton');
});

server.listen(port, () => {
  console.log(`Book Earth API listening on http://localhost:${port}`);
});
