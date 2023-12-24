var connect = require('connect');
var serveStatic = require('serve-static');
const {Howl, Howler} = require('howler');
connect()
    .use(serveStatic("../Commissaire"))
    .listen(8080, () => console.log('Page running on: http://localhost:8080/index.html'));