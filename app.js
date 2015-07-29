var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var routes = require('./routes/index');
var methodOverride = require('method-override');
var session = require('express-session');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(partials());
// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser('Quiz 2015'));
app.use(session());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Helpers dinámicos:
app.use (function(req,res,next){

  // Guardar path en session.redir para después de login
  if (!req.path.match(/\/login|\/logout/)){
    req.session.redir = req.path;
  }

  // Hacer visible req.session en las vistas
  res.locals.session = req.session;
  next();
})

//-------------------------
//tiempo de sesion
//Con ayuda de Juan Ignacio Gil Palacios

 app.use(function(req, res, next) {
     if(req.session.user){// si estamos en una sesion
         if(!req.session.marcatiempo){//primera vez se pone la marca de tiempo
             req.session.marcatiempo=(new Date()).getTime();
             req.session.plazo=120;//ponemos 120 segundos para que pueda controlarse la caducidad de la sesion
         }else{
             if((new Date()).getTime()-req.session.marcatiempo > 120000){//se pasó el tiempo y eliminamos la sesión (2min=120000ms)
                 delete req.session.user;     //eliminamos el usuario
                delete req.session.marcatiempo;    //eliminamos la marca de tiempo
            }else{//hay actividad se pone nueva marca de tiempo
                req.session.marcatiempo=(new Date()).getTime();
                req.session.plazo=120;//ponemos 120 segundos para que pueda controlarse la caducidad de la sesion
            }
        }
    }
    next();
});
//-----------

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Encontrado');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err, errors: []
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}, errors: []
    });
});


module.exports = app;
