var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var template = require('./lib/template.js');
var path = require('path');
var sanitizeHtml = require('sanitize-html');
var mysql = require('mysql');

var db = mysql.createConnection({
    host:'localhost',
    user:'nodejs',
    password:'1111',
    database:'opentutorials'
});
db.connect();

var app = http.createServer(function(request, response) {
    var _url = request.url;
    var qs = require('querystring')
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    if(pathname === '/') {              // 루트일 때의 처리
        if(queryData.id === undefined) {            // 쿼리 스트링이 없을 때의 처리(홈일 때)
            db.query(`SELECT * FROM topic`, function(error, topics) {
                var title = 'Welcome';
                var description = 'Hello, Node.js';
                var list = template.list(topics);
                var html = template.HTML(title, list,
                    `<h2>${title}</h2>${description}`,
                    `<a href="/create">create</a>`
                    );
                console.log(topics);
                response.writeHead(200);
                response.end('Success');
            });
        } else {                            // 쿼리 스트링이 있을 때의 처리(홈이 아닐 때)
            fs.readdir('./data', function(error, filelist) {
              fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description) {
                var title = queryData.id;
                var sanitizedTitle = sanitizeHtml(title);
                var sanitizedDescription = sanitizeHtml(description);
                var list = template.list(filelist);
                var html = template.HTML(title, list, 
                    `<h2>${sanitizedTitle}</h2><p>${sanitizedDescription}</p>`,
                    `<a href="/create">create</a> 
                    <a href="/update?id=${sanitizedTitle}">update</a>
                    <form action="delete_process" method="post" onsubmit="return confirm('정말로 삭제하시겠습니까?');">
                        <input type="hidden" name="id", value="${sanitizedDescription}">
                        <input type="submit" value="delete">
                    </form>`
                    );
                response.writeHead(200);
                response.end(html);var list = '<ul>';
              
            
                });
            });
        }
        
    } else if(pathname === '/create') {
        // 글 생성 화면 구현
        fs.readdir(`./data`, function(error, filelist) {
            var title = 'WEB - create';
            var list = template.list(filelist);
            var html = template.HTML(title, list, `
                <form action="/create_process" method="post">
                    <p><input type="text" name="title" placeholder="title"></p>
                    <p>
                        <textarea name="description" placeholder="description"></textarea>
                    </p>
                    <p>
                        <input type="submit">
                    </p>
                </form>
                `, '');
            response.writeHead(200);
            response.end(html);
        });

    

    } else if (pathname === '/create_process') {
        var body = '';
        request.on('data', function(data) {
            body = body + data;
        });
        request.on('end', function() {
            var post = qs.parse(body);
            var title = post.title;
            var description = post.description;
            fs.writeFile(`data/${title}`, description, 'utf8', function(err) {
                response.writeHead(302, {Location: `/?id=${title}`});
                response.end();
            });
            // console.log(title);
            // console.log(description);
        });

    } else if (pathname === '/update') {
        // 수정 화면 처리 코드
        fs.readdir('./data', function(error, filelist) {
            fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description) {
              var title = queryData.id;
              var list = template.list(filelist);
                var html = template.HTML(title, list, `
                <form action="/update_process" method="post">
                <input type="hidden" name="id" value="${title}">
                    <p><input type="text" name="title" placeholder="title" value="${title}"></p>
                    <p>
                        <textarea name="description" placeholder="description">${description}</textarea>
                    </p>
                    <p>
                        <input type="submit">
                    </p>
                </form>
                `, 
                '<a href="/create">creat</a> <a href="/update?id=${title}">update</a>'
                );
              response.writeHead(200);
              response.end(html);
            });
        });
    } else if(pathname === '/update_process') {
        // 수정 내용 저장하는 코드
        var body = "";
        request.on('data', function(data) {
            body = body + data;
        });
        request.on('end', function() {
            var post = qs.parse(body);
            var id = post.id;
            var title = post.title;
            var description = post.description;
            fs.rename(`data/${id}`, `data/${title}`, function(error) {
                // fs.rename 블록 안에서 내용 수정 처리 구현
                fs.writeFile(`data/${title}`, description, 'utf8', function(err) {
                    response.writeHead(302, {Location: `/?id=${title}`});
                    response.end();
                });
            });
            // console.log(post);
            /*
            fs.writeFile(`data/${title}`, description, 'utf8', function(err) {
                response.writeHead(200);
                response.end('success');
            })
            */
        });
    } else if (pathname === '/delete_process') {
        var body = "";
        request.on('data', function(data) {
            body = body + data;
        });
        request.on('end', function() {
            var post = qs.parse(body);
            var id = post.id;
            fs.unlink(`data/${id}`, function(error) {
                response.writeHead(302, {Location: `/`});
                response.end();
            });
        });
    } else {                            // 루트가 아닐 때의 처리(404 오류 페이지)
        response.writeHead(404);
        response.end('Not found');
    }
});

app.listen(3000);

