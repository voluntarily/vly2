// Load the http module to create an http server.
const http = require('http')

// Configure our HTTP server to respond with Hello World to all requests.
const server = http.createServer((request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/plain' })
  response.end('Hello World\n')
})

server.listen(8001) // defaults to 127.0.0.1

// Put a friendly message on the terminal
console.log('Server running at http://127.0.0.1:8001/')
