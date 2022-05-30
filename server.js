require('dotenv').config();
const http = require('http');
const fs = require('fs');
var mime = require('mime-types');

const serveStatic = function(req, res) {
    var filename = req.url.replace('/', '') || 'index.html';
    var file = `${__dirname}/${process.env.STATIC}/${filename}`;
    if (fs.existsSync(file)) {
        var data = fs.readFileSync(file);
        res.setHeader("Content-type", mime.lookup(file))
        res.writeHead(200);
        res.end(data);
        return true;
    } else {
        return false;
    }
}

const getRect = function(lat, lon, sizeKm) {
    var sizeLat = sizeKm / 111.111;
    var sizeLon = sizeKm / (111.111 * Math.cos((lat * Math.PI) / 180));
    return [
      [lat + sizeLat/2, lon - sizeLon/2],
      [lat - sizeLat/2, lon - sizeLon/2],
      [lat - sizeLat/2, lon + sizeLon/2],
      [lat + sizeLat/2, lon + sizeLon/2]
    ]
}

const randomCoords = function(rect) {
    if (!rect) return [0,0];
  
    var maxLat = rect[0][0];
    var minLat = rect[1][0];
    var minLon = rect[0][1];
    var maxLon = rect[3][1];
  
    var randomLat = minLat + Math.random() * (maxLat - minLat);
    var randomLon = minLon + Math.random() * (maxLon - minLon);
  
    return [randomLat, randomLon];
}

const requestListener = function (req, res) {
    var notFound = false;
    res.setHeader('Access-Control-Allow-Origin', '*');
    if (req.url.startsWith('/') && req.method == 'GET') {
        notFound = !serveStatic(req, res);
    }

    if (req.url.startsWith('/getcoords') && req.method == 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Headers', '*');
        res.writeHead(200);
        res.end();
        return;
    }
    if (req.url.startsWith('/getcoords') && req.method == 'POST') {
        let body = [];
        req.on('data', (chunk) => body.push(chunk))
           .on('end', () => {
                body = Buffer.concat(body).toString();
                var latLong = JSON.parse(body);

                var rect = getRect(latLong.lat, latLong.lon, 2);
                var coords = randomCoords(rect);
                res.writeHead(200);
                res.end(JSON.stringify({
                    lat: coords[0],
                    lon: coords[1]
                    // rect: rect
                }));
            }
        );
    }

    if (notFound) {
        res.writeHead(404);
        res.end()
    }
}

const server = http.createServer(requestListener);
server.listen(process.env.PORT);