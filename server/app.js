
let main = require('./main');
main.start();

const opn = require('opn');
opn('http://localhost:2020/client/index.html');
