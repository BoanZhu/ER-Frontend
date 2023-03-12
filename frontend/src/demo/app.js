// const http = require('http');
// var fs = require('fs');

const hostname = '127.0.0.1';
const port = 3000;

// // const server = http.createServer((req, res) => {
  
// //   res.setHeader('Content-Type', 'text/plain');
// //   res.end('Hello World');
// // });

// const server = http.createServer(function(req, res) {
//     // res.statusCode = 200;
//     fs.readFile('./index.html', function (err, data){
//         res.writeHead(200, {'Content-Type': 'text/html', 'Content-Length': data.length});
//         res.write(data);
//         res.end();
//     });
// }).listen(8000);

// server.listen(port, hostname, () => {
//   console.log(`Server running at http://${hostname}:${port}/`);
// });

const express = require('express');
const app = express();

app.get('/', function(request, response){
    response.sendFile(__dirname + '/index.html');
});

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
