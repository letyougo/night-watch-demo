
var express = require('express')
var url = require('url')
var app = express()
app.use(require('cookie-parser')())
app.use(function (req, res) {
    if(!req.cookies.serviceToken){
        var url = 'http%3a%2f%2fstaging.b.mi.com%3a8000%2f'
        res.redirect('https://account.xiaomi.com/pass/serviceLogin?callback='+url)
    }
})

app.get('/',function (req,res) {

    res.send(url.encodeURl('hello'))
})

app.listen(8000)