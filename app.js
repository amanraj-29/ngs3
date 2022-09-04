var express = require('express');
var app = express();
var path = require('path');

// const compression = require('compression');
// const cookieParser = require('cookie-parser');
__dirname = '.';
// app.use(cookieParser());
// app.use(compression({ threshold: 0 }));

app.use(express.static(path.join(__dirname, './dist/aws-s3-bucket')));

app.get('*', (req, res) => {
    res.header('Referrer-Policy', 'origin');
    res.status(200).sendFile(path.resolve(__dirname, './dist/aws-s3-bucket/index.html'));
});

const port = (3000);
app.set('port', port);
var server = app.listen(port, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log(host, port);
});