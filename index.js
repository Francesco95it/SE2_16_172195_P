//express lib
var express = require('express');
//general lib
var app = express();
//manages sessions
var session = require('express-session')

var pg = require('pg');

var util = require('util');

var bind = require('bind');

//POST
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
//JSON post
app.use(bodyParser.json());

app.set('port', (process.env.PORT || 5000));

//use sessions
app.use(session({ 
	//required, used to prevent tampering
	secret: 'string for the hash', 
	//set time of validity of cookies
	cookie: { maxAge: 60000 }
}));


app.get('/scripts.js', function (req, res) {
    res.sendFile('scripts/scripts.js', {root:__dirname});
});

app.get('/style.css', function (req, res) {
    res.sendFile('tpl/style.css', {root:__dirname});
});

var defaulValues={
    name='Ospite'
};
var values={
    
};

/**
 * @brief main page, provides website presentation and a way to log-in or to go into the dashboard if logged in
 * @return the index.tpl page like it is normally
 */
app.get('/', function(req, res) 
{
    var logged;
	//check if the session exists
	if (req.session.user_id!=null) {
		//print the greetings with the content of the session
        logged = true;
		values={
            name: req.session.user_id
        };
	}
	else {
        logged = false;
    	text = 'You are not authorized to view this page';
  	}

	bind.toFile('tpl/index.tpl', logged?values:defaulValues, function(data){
        res.writeHead(200, {'Content-Type':'text/html'});
		res.end(data);
    });
	/*var text = "";
	
	
	
	//write res
	res.writeHead(200, {'Content-Type': 'text/html'});	
    res.end(text);*/
  	
});

/**
 * @brief log in page, thia page will create a session if it is not present ( i.e. it will log in a user)
 * @return a page with notification that auser is logged in, or a page which says that the user is already logged in.
 */
app.get('/login', function(req, res) 
{
	var text = "";
	
	//check if the session exists
	if (req.session.user_id != null) 
	{
    	text = 'You are already logged in';
  	}
	else
	{
		text = 'logged in';
		req.session.user_id = "Francesco";
    	//res.redirect('/my_secret_page');
		
	}
	
	//write res
	res.writeHead(200, {'Content-Type': 'text/html'});	
    res.end(text);
});

/**
 * @brief log out page
 * @return a page with notification that user is logged out, or a page which says that the user is already logged out.
 */
app.get('/logout', function(req, res) 
{
	var text = "";
	
	//check if the session exists
	if (req.session.user_id !=null) 
	{
    	text = 'logged out';
		req.session.user_id = null;
  	}
	else
	{
		text = 'You are already logged out';
		
	}
	
	//write res
	res.writeHead(200, {'Content-Type': 'text/html'});	
    res.end(text);
});


app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
