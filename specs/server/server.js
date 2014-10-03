(function () {
    'use strict';

    var http = require('http'),
        url = require('url'),
        fs = require('fs'),

        server = http.createServer(function (req, res) {
            var pageUrl = url.parse(req.url).pathname;

            if ('/favicon.ico' === pageUrl) {
                res.writeHead(200, {'Content-Type': 'image/x-icon'});
                res.end();
                return;
            }

            fs.realpath('request/' + pageUrl, function (err, resolvedPath) {
                if (null !== err) {
                    res.writeHead(404);
                    res.write('404 not found');
                    res.end();
                } else {
                    fs.readFile(resolvedPath, function (errRead, data) {
                        if (null !== errRead) {
                            res.writeHead(404);
                            res.write('404 not found');
                            res.end();
                        } else {
                            res.writeHead(200, {'Content-Type': 'application/json'});
                            res.write(data);
                            res.end();
                        }
                    });
                }
            });
        });

    server.listen(8080);
}());