var express = require('express');
var app = express();

var notes = [{content: "Do something", done:false}];
var i = 0;
var alert;

//post method configuration
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });

//session
var session = require('express-session');
app.use(session({
	secret: 'asfawes7a1asdasd123ndsdwslt6ggtgftgf',
	resave: false,
	saveUninitialized: true,
	cookie: { maxAge: 1000 * 60 * 60 * 24 * 365 },
	unset: 'destroy'
}));


//ejs
app.set('view engine', 'ejs');

//Set views folder to root
app.set('views', './views');

//set folder saves static files (image, css,...)
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/'));

//Render index of page
app.get('/', function (req, res) {
	alert = null;
	res.render('login', { alert });
});

//Check if user logins or not
app.post('/todo', urlencodedParser, function (req, res) {
	alert = null;
	var username = req.body.username;
	var password = req.body.password;
	if (!req.session.username) {
		if (username == '1660691' && password == 'kocopass') {
			req.session.username = username;
			req.session.todo = notes;
			return res.render('todo', { notes });
		}
		alert = 'Username or password is not correct.';
		res.render('login', { alert });
	} else {
		notes = req.session.todo || [];
		console.log(req.session.todo);
		res.render('todo', { notes });
	}
});

//Add node by post method
app.post('/todo/add', urlencodedParser, function (req, res) {
	var text = req.body.note;
	if (text) {
		var note = {
			content: text,
			done: false
		}
		notes.push(note);
	}
	res.render('todo', { notes });
});

//Add node by connecting directly
app.get('/todo/add',function (req, res) {
	if (!req.session.username)
		res.redirect('/');
	else res.redirect('/todo');
});

//Connect to todo page by get method
app.get('/todo', function (req, res) {
	if (req.session.username)
		return res.render('todo', { notes });
	return res.redirect('/');
});

app.post('/todo/done', urlencodedParser,function (req, res) {
	var index = req.body.done;
	notes[index].done = true;
	return res.render('todo', { notes });
});

app.get('/todo/done', function (req, res) {
	if (!req.session.username)
		res.redirect('/');
	else res.redirect('/todo');
});

app.get('/logout', function (req, res) {
	if (typeof(req.session.username) !== 'undefined')
		delete req.session.username;
	return res.redirect('/');
});

app.listen(3000, function () {
	console.log('app is running at port 3000');
});
