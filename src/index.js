// Unitok Web - Landing Page Server
console.log('Unitok Web application starting...');

const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  let filePath;
  
  // Check if request is for an asset file
  if (req.url.startsWith('/assets/')) {
    filePath = path.join(__dirname, '..', req.url);
  } else {
    // Serve the landing page for all other routes
    filePath = path.join(__dirname, '../public/index.html');
  }
  
  // Determine content type based on file extension
  const ext = path.extname(filePath);
  const contentTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.mp4': 'video/mp4',
    '.webm': 'video/webm',
    '.ogg': 'video/ogg'
  };
  
  const contentType = contentTypes[ext] || 'text/plain';
  
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('File not found');
      return;
    }
    
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Landing page server running on http://localhost:${PORT}`);
  console.log('Visit the URL above to see your landing page');
});
