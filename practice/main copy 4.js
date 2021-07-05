var http = require('http');
var fs = require('fs');
var url = require('url');


var app = http.createServer(function(request, response) {
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    var title = queryData.id;


    if(pathname === '/') {              // 루트일 때의 처리
        if(queryData.id === undefined) {            // 쿼리 스트링이 없을 때의 처리(홈일 때)
            fs.readdir('./data', function(error, filelist) {
              var title = 'Welcome';
              var description = 'Hello. Node.Js';
              var list = '<ul>';
              var i = 0;
              while (i < filelist.length) {
                  list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
                  i = i + 1;
              }
              list = list + '</ul>';
                var template = `
                    <!doctype html>
                    <html>
                        <head>
                            <title>WEB1 - ${title}</title>
                            <meta charset="utf-8">
                        </head>
                        <body>
                        <h1><a href="/">WEB</a></h1>
                        ${list}
                        <h2>${title}</h2>
                        <p>${description}</p>
                        </body>
                    </html>
                    `
                    response.writeHead(200);
                    response.end(template); // template 문자열 응답 

            });
        } else {                            // 쿼리 스트링이 있을 때의 처리(홈이 아닐 때)
            fs.readdir('./data', function(error, filelist) {
              var list = '<ul>';
              var i = 0;
              while (i < filelist.length) {
                  list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
                  i = i + 1;
              }
              list = list + '</ul>';
            fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description) {
                var title = queryData.id;
                var template =  `
                <!doctype html>
                <html>
                    <head>
                        <title>WEB1 - ${title}</title>
                        <meta charset="utf-8">
                    </head>
                    <body>
                    <h1><a href="/">WEB</a></h1>
                    <ul>
                        <li><a href="/?id=HTML">HTML</a></li>
                        <li><a href="/?id=CSS">CSS</a></li>
                        <li><a href="/?id=JavaScript">JavaScript</a></li>
                    </ul>
                    <h2>${title}</h2>
                    <p>${description}</p>
                    </body>
                </html>
                `;
                response.writeHead(200);
                response.end(template);
            });
        });
    }
        
} else {                            // 루트가 아닐 때의 처리(404 오류 페이지)
        response.writeHead(404);
        response.end('Not found');
    }
});

app.listen(3000);

