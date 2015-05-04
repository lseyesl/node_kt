var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var mongo = require('mongodb');
var monk = require('monk');
db = monk('localhost:27017/myWb');


var formidable = require('formidable');

var routes = require('./routes/index');
var usr = require('./routes/usr');
var login = require('./routes/login');
var register = require('./routes/register');
var home = require('./routes/home');
var userlist = require('./routes/userlist');
var pro = require('./routes/pro'); 
var test = require('./routes/test');

var session = require('express-session');
var MongoStore = require('connect-mongo')(session);


//var settings = require('../settings');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
	secret:'myWb',
 	resave:false,
	saveUninitialized:true,
	cookie:{maxAge:1000*60*60*24*30,path:'/'},
	store:new MongoStore({
		db:'myWb',
		host:'localhost',
		collection:'session',
		auto_reconnect:true
	})
}));

app.use('/', routes);
app.use('/usr', usr);
app.use('/login', login);
app.use('/register',register);
app.use('/home', home);
app.use('/userlist',userlist);
app.use('/pro',pro);
app.use('/img',express.static(path.join(__dirname, 'public/images')));
app.use('/test',test);
/*
app.use(multer({
	dest:'./public/images/uavatar',
	rename:function(fieldname,filename,req,res){
		return req.session.user['_id'];
	},
	changeDest:function(dest,req,res){
		//'./public/images/userUpload/'+req.session.user['_id'];
		var stat = null;
		try{
			stat= fs.statSync(dest);
		}catch(err){
			fs.mkdirSync(dest);
		}
		
		if(stat && !stat.isDirectory()){
			throw new Error('Directory cannot be created')
		}
		return dest;
	}
}));
*/

/*
app.use(function(req,res,next){
	req.db=db;
	next();
})
*/

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
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
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


Aho=null;
Aho=function(req,res,next){
	if(!req.session.user){
		res.redirect('/');
		res.location('/');
	}
}




module.exports = app;
