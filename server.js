const http = require('http');
const PORT = process.env.PORT || 8080;
const fs = require('fs');
const qs = require('querystring');

const server = http.createServer((req, res) => {
  console.log('req.method', req.method);
  console.log('req.headers', req.headers);
  console.log('req.url', req.url);
  if (req.method === 'POST') {
    if (req.url === '/elements') {
      let body = [];
      req
        .on('data', chunk => {
          body.push(chunk);
        })
        .on('end', chunk => {
          // console.log(Buffer, 'this is the Buffer');
          body = Buffer.concat(body).toString();
          console.log('body', body);
          let parsedBody = qs.parse(body);

          const responseBodyContents = `<!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <title>The Elements - ${parsedBody.name}</title>
            <link rel="stylesheet" href="/css/styles.css">
          </head>
          <body>
            <h1>${parsedBody.elementName}</h1>
            <h2>${parsedBody.elementSymbol}</h2>
            <h3>Atomic number ${parsedBody.elementAtomicNumber}</h3>
            <p>${parsedBody.elementDescription}</p>
            <p><a href="/">back</a></p>
          </body>
          </html>`;
          console.log(parsedBody);
          if(parsedBody.elementName &&
            parsedBody.elementSymbol &&
            parsedBody.elementAtomicNumber &&
            parsedBody.elementDescription
          ){
            fs.writeFile(
              `./public/${parsedBody.elementName}.html`,
              responseBodyContents,
              err => {
                if (err) {
                  res.writeHead(500);
                  res.write('{status: Request Denied}');
                  res.end();
                }
                res.writeHead(200, { 'Content-Type': 'application/json'});
                res.write('{Success: true}');
                res.end();
              }
            );
            rewriteIndexHtmlFile((err) => {
              if (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Internal server error.' }));
              } else {
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true }));
              }
            })
          }
        });
    }
  }

  if (req.method === 'GET') {
    if (req.url && req.url !== '/' && req.url !== '/css/styles.css') {
      fs.readFile(`./public${req.url}`, 'utf-8', (err, data) => {
        res.writeHead(200, { 'content-type': 'text/html' });
        res.write(data);
        res.end();
      });
    }
    else if (req.url === '/') {
      fs.readFile('./public/index.html', 'utf-8', (err, data) => {
        if (err){
          sendResponse(res, './public/404.html', 404);
        }
        res.writeHead(200, { 'content-type': 'text/html' });
        res.write(data);
        res.end();
      });
    }
    else if (req.url === '/css/styles.css') {
      fs.readFile('./public/css/styles.css', 'utf-8', (err, data) => {
        res.writeHead(200, { 'content-type': 'text/css' });
        res.write(data);
        res.end();
      });
    }
    else {
      fs.readFile('./public/404.html', 'utf-8', (err, data) => {
        res.writeHead(200, { 'content-type': 'text/css' });
        res.write(data);
        res.end();
      });
    }
  }
});

server.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});



function constructIndexHtmlContent(allElementalHtmlFiles) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>The Elements</title>
  <link rel="stylesheet" href="/css/styles.css">
</head>
<body>
  <h1>The Elements</h1>
  <h2>These are all the known elements.</h2>
  <h3>Here are ${allElementalHtmlFiles.length}</h3>
  <ol>${createListNodes(allElementalHtmlFiles)}</ol>
</body>
</html>`;
}
