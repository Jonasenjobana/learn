const http = require('node:http');

const port = 3000;

const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(
    JSON.stringify({
      message: 'Hello Docker Compose Day3',
      path: req.url,
      mysql: {
        host: process.env.MYSQL_HOST,
        port: process.env.MYSQL_PORT,
        database: process.env.MYSQL_DATABASE,
      },
      redis: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
      },
    })
  );
});

server.listen(port, () => {
  console.log(`Server running at http://0.0.0.0:${port}`);
});
