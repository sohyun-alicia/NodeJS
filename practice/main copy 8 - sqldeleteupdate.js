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
                response.writeHead(200);
                response.end(html);
            });
        } else {                            // 쿼리 스트링이 있을 때의 처리(홈이 아닐 때)
            db.query(`SELECT * FROM topic`, function(error, topics) {
                if (error) {
                    throw error;
                }
                db.query(`SELECT * FROM topic WHERE id=?`, [queryData.id], function(error2, topic) {
                    if (error2) {
                        throw error2;
                    }
                    console.log(topic[0].title);
                    var title = topic[0].title;
                    var description = topic[0].description;
                    var list = template.list(topics);
                    var html = template.HTML(title, list,
                        `<h2>${title}</h2>${description}`,
                        `<a href="/create">create</a>
                            <a href="/update?id=${queryData.id}">update</a>
                            <form action="delete_process" method="post">
                                <input type="hidden" name="id" value="${queryData.id}">
                                <input type="submit" value="delete">
                            </form>`
                        );
                    response.writeHead(200);
                    response.end(html);
                });
            });
        }
        
    } else if(pathname === '/create') {
        // 글 생성 화면 구현
        db.query(`SELECT * FROM topic`, function(error, topics) {
            var title = 'Create';
            var list = template.list(topics);
            var html = template.HTML(title, list,
                `
                <form action="/create_process" method="post">
                    <p><input type="text" name="title" placeholder="title"></p>
                    <p>
                        <textarea name="description" placeholder="description"></textarea>
                    </p>
                    <p>
                        <input type="submit">
                    </p>
                </form>
                `,
                `<a href="/create">create</a>`
                );
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
            db.query(`
                INSERT INTO topic(title, description, created, author_id)
                    VALUES(?, ?, NOW(), ?)`,
                [post.title, post.description, 1],
                function(error, result) {
                    if(error) {
                        throw error;
                    }
                    response.writeHead(302, {Location: `/?id=${result.insertId}`});
                    response.end();
                })
        });

    } else if (pathname === '/update') {
        // 수정 화면 처리 코드
        db.query(`SELECT * FROM topic`, function(error, topics) {
            if(error) {
                throw error;
            }
            db.query(`SELECT * FROM topic WHERE id=?`, [queryData.id], function(error2, topic) {
                if(error2) {
                    throw error2;
                }
                var list = template.list(topics);
                var html = template.HTML(topic[0].title, list, 
                    `
                    <form action="/update_process" method="post">
                    <input type="hidden" name="id" value="${topic[0].id}">
                        <p><input type="text" name="title" placeholder="title" value="${topic[0].title}"></p>
                        <p>
                            <textarea name="description" placeholder="description">${topic[0].description}</textarea>
                        </p>
                        <p>
                            <input type="submit">
                        </p>
                    </form>
                    `, 
                    `<a href="/create">creat</a> <a href="/update?id=${topic[0].id}">update</a>`
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
            db.query(`UPDATE topic SET title=?, description=?, author_id=1 WHERE id=?`, 
                [post.title, post.description, post.id], function(error, result) {
                    response.writeHead(302, {Location: `/?id=${post.id}`});
                    response.end();
                });
            });
            
    } else if (pathname === '/delete_process') {
        var body = "";
        request.on('data', function(data) {
            body = body + data;
        });
        request.on('end', function() {
            var post = qs.parse(body);
            db.query(`DELETE FROM topic WHERE id = ?`, [post.id], function(error, result) {
                if(error) {
                    throw error;
                }
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

