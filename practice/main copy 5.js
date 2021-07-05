var http = require('http');
var fs = require('fs');
var url = require('url');

function templateHTML(title, list, body) {
    return `
    <!doctype html>
    <html>
        <head>
            <title>WEB1 - ${title}</title>
            <meta charset="utf-8">
        </head>
        <body>
            <h1><a href="/">WEB</a></h1>
            ${list}
            <a href="/create">create</a>
            ${body}
        </body>
    </html>
    `
}

function templateList(filelist) {
    var list = '<ul>';
    var i = 0;
    while (i < filelist.length) {
        list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
        i = i + 1;
    }
    list = list + '</ul>';
    return list;
}


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
            var list = templateList(filelist);
            var template = templateHTML(title, list, `<h2>${title}</h2><p>$${description}</p>`);
                response.writeHead(200);
                response.end(template); // template 문자열 응답 

            });
        } else {                            // 쿼리 스트링이 있을 때의 처리(홈이 아닐 때)
            fs.readdir('./data', function(error, filelist) {
              fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description) {
                var title = queryData.id;
                var list = templateList(filelist);
                var template = templateHTML(title, list, `<h2>${title}</h2><p>$${description}</p>`);
                response.writeHead(200);
                response.end(template);var list = '<ul>';
              
            
                });
            });
        }
        
    } else if(pathname === '/create') {
        // 글 생성 화면 구현
        fs.readdir(`./data`, function(error, filelist) {
            var title = 'WEB - create';
            var list = templateList(filelist);
            var template = templateHTML(title, list, `
                <form action="http://localhost:3000/create_process" method="post">
                    <p><input type="text" name="title" placeholder="title"></p>
                    <p>
                        <textarea name="description" placeholder="description"></textarea>
                    </p>
                    <p>
                        <input type="submit">
                    </p>
                </form>
                `);
            response.writeHead(200);
            response.end(template);
        });
    } else {                            // 루트가 아닐 때의 처리(404 오류 페이지)
        response.writeHead(404);
        response.end('Not found');
    }
});

app.listen(3000);

