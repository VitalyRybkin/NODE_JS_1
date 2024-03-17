const http = require("http");
const fs = require('fs');

let pageList = new Map()
function pageNotFound(res) {
    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    res.statusCode = 404;
    res.end('<h1>404. Страница не найдена!</h1>');
}

function pageVisiting(page) {
    pageList.set(page, pageList.get(page) + 1)
    for (let [key, value] of pageList) {
        console.log(key + ": " + value)
    }
}

let server = http.createServer((req, res) => {
    if (req.url === '/') {
        fs.access('./templates/main.html', fs.constants.R_OK, (err) => {
            if (err) pageNotFound(res)
            else {
                fs.createReadStream('./templates/main.html').pipe(res)
                pageVisiting('main')
            }
        })
    }
    else if (req.url === '/about') {
        fs.access('./templates/about.html', fs.constants.R_OK, (err) => {
            if (err) pageNotFound(res)
            else {
                fs.createReadStream('./templates/about.html').pipe(res)
                pageVisiting(req.url.substring(1, req.url.length))
            }
        })
    }
    else pageNotFound(res)
})

const PORT = 3000
const HOST = 'localhost'

server.listen(PORT, HOST, () => {
    console.log(`Сервер запущен по адресу: ${HOST}:${PORT}`)
    fs.readdir('./templates',(err, files) => {
        files.forEach((elem) => {
            let to = elem.indexOf('.');
            let newPageName = elem.substring(0, to);
            pageList.set(newPageName, 0)
        })

    })
})
