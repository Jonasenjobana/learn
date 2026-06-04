const http = require('node:http');

const port = 3000;

const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(
    JSON.stringify({
      message: 'Hello Docker Day2',
      path: req.url,
    })
  );
});

server.listen(port, () => {
  console.log(`Server running at http://0.0.0.0:${port}`);
});
