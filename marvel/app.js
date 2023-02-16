var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var app = express();
var md5 = require('md5');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const fetch = import('node-fetch');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var xhr = new XMLHttpRequest();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');

});

app.get('/cercar', (req, res) => {
  res.sendFile(__dirname + '/cercar.html');

});

io.on('connection', (socket) => { 
  let url="https://gateway.marvel.com:443/v1/public/";
  let privateKey="2bfb960a6dcdfc26cc5d114dc8b61a0eb4fa2189";
  let publicKey="88cf2b13d56278fb815edae1c64a3d79";
  let ts="1";
  let hash=md5(ts+privateKey+publicKey);
  let name;
  
  socket.on('search',function(n){
    name=n;
    api=getURL();
    xhr.open("GET",api); 
    xhr.send();
    xhr.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200){          
        socket.emit('complet',JSON.parse(this.responseText).data.results);
      }
    }
  })
  function getURL(){
    let api=`${url}`;
    api+='characters?&';
    if(name!=""){
        api+=`nameStartsWith=${name}&`;
    }
    api+=`limit=1&ts=${ts}&apikey=${publicKey}&hash=${hash}`;
    return api;
  }
  socket.on('comics',function(id){
    let uri=`${url}comics?characters=${id}&limit=100&ts=${ts}&apikey=${publicKey}&hash=${hash}`;
    xhr.open("GET",uri); 
    xhr.send(); 
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200){
            socket.emit('comics_response',JSON.parse(this.responseText).data.results);
        }
    }
  })

  
  console.log('Petició feta amb éxit'); 
  socket.on('disconnect', () => {
      console.log('usuari desconnectat');
    });
});


http.listen(3003, () => {
  console.log("Iniciat"); 
})

app.get('/buscar',(req,res)=>{
  
})













// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
