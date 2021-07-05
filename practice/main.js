const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

/*
var http = require('http');
var url = require('url');

var template = require('./lib/template.js');
var topic = require('./lib/topic');
var author = require('./lib/author');

var app = http.createServer(function(request, response) {
    var _url = request.url;
    var qs = require('querystring')
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    if(pathname === '/') {              // 루트일 때의 처리
        if(queryData.id === undefined) {            // 쿼리 스트링이 없을 때의 처리(홈일 때)
            topic.home(request, response);
        } else {                            // 쿼리 스트링이 있을 때의 처리(홈이 아닐 때)
            topic.page(request, response);
        }
        
    } else if(pathname === '/create') {
        // 글 생성 화면 구현
        topic.create(request, response);

    } else if (pathname === '/create_process') {
        topic.create_process(request, response);

    } else if (pathname === '/update') {
        // 수정 화면 처리 코드
        topic.update(request, response);

    } else if(pathname === '/update_process') {
        // 수정 내용 저장하는 코드
        topic.update_process(request, response);

    } else if (pathname === '/delete_process') {
        topic.delete_process(request, response);

    } else if (pathname === '/author') {
        author.home(request, response);

    } else if (pathname === '/author/create_process') {
        author.create_process(request, response);

    } else if (pathname === '/author/update') {
        author.update(request, response);

    } else if (pathname === '/author/update_process') {
        author.update_process(request, response);
        
    } else if(pathname === '/author/delete_process') {
      author.delete_process(request, response);
        
    } else {                            // 루트가 아닐 때의 처리(404 오류 페이지)
        response.writeHead(404);
        response.end('Not found');
    }
});

app.listen(3000);
*/


