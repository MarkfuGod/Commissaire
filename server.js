var connect = require('connect');
var serveStatic = require('serve-static');

connect()
    .use(serveStatic("../roguelikeDev"))
    .listen(8080, () => console.log('Page running on: http://localhost:8080/index.html'));