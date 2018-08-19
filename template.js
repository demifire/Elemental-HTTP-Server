module.exports = {
    getTemplate
};
    
function getTemplate(){
    return `<!DOCTYPE html>
    <html lang="en">
        <head>
          <meta charset="UTF-8">
          <title>The Elements - ${parsedBody.name}</title>
          <link rel="stylesheet" href="/css/styles.css">
        </head>
        <body>
          <h1>${parsedBody.name}</h1>
          <h2>${parsedBody.abbr}</h2>
          <h3>${parsedBody.number}</h3>
          <p>${parsedBody.description}</p>
          <p><a href="/">back</a></p>
        </body>
    </html>`;
}
    
