const http = require('http');
const url = require('url');
const fs = require('fs');

// npm i mime-types
const lookup = require('mime-types').lookup;

const port = 3000;

const server = http.createServer((req, res) => {
    // Obtener el url solicitado
    const parsedURL = url.parse(req.url, true);

    // Limpia el url quitandole la primera y última diagonal
    let path = parsedURL.path.replace(/^\/+|\/+$/g, '');
    
    // Si es nulo redirige al index.html
    path = path || 'index.html';

    // Ruta completa del archivo
    const file = __dirname + '/public/' + path;
    fs.readFile(file, (error, data) => {
        if (error) {
            res.writeHead(404);
            res.write('Error: Este no es el archivo que estás buscando');
        } else {
            res.setHeader('X-Content-Options', 'nosniff');
            const mime = lookup(path);
            res.writeHead(200, { 'Content-Type': mime });
            res.write(data);
        }
        res.end();
    });
});

server.listen(port, error => {
    if (error) {
        console.log('Ocurrio un error ', error);
    } else {
        console.log(`Servidor corriendo en localhost:${port}`);
    }
});