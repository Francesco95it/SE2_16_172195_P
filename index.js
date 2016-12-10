//express lib
var express = require('express');
//general lib
var app = express();
//manages sessions
var session = require('express-session')

var pg = require('pg');

var util = require('util');

var bind = require('bind');

var connString = 'postgres://golapeatakjkcv:c2a37d36c3cfdaf68f1c516133ffe7d01a450ca45b14b3e9e2506a599e1483d0@ec2-23-21-169-238.compute-1.amazonaws.com:5432/dba7n4n8sgegn?ssl=true' || process.env.DATABASE_URL;

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


/**
 * @brief main page, provides website presentation and a way to log-in or to go into the dashboard if logged in
 * @return the index.tpl page like it is normally
 */
app.get('/', function(req, res) 
{
    var defaultValues={
        name:'ospite'
    };
    var values={

    };
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
  	}

	bind.toFile('tpl/index.tpl', logged?values:defaultValues, function(data){
        res.writeHead(200, {'Content-Type':'text/html'});
		res.end(data);
    });
  	
});

/**
 * @brief log in page, this page will create a session if it is not present ( i.e. it will log in a user)
 * @return a page with notification that auser is logged in, or a page which says that the user is already logged in.
 */
app.get('/logcheck', function(req, res) 
{
    var defaultValues={
        err: null
    };
    var values={
    };
	if (req.session.user_id != null) 
	{
    	text = CreateUserMenuTable(req, res);
  	}
	else
	{
        bind.toFile('tpl/login.tpl', defaultValues, function(data){
            res.writeHead(200, {'Content-Type':'text/html'});
            res.end(data);
        });		
	}
});

/**
 * @brief log in page, this page will create a session if it is not present ( i.e. it will log in a user)
 * @return a page with notification that auser is logged in, or a page which says that the user is already logged in.
 */
app.post('/login', function(req, res) 
{
	
	console.log("Founded username: " + req.body.username + ", password: " + req.body.password);
    
    console.log("Trying to connect to db");
	pg.connect(connString, function(err, client, done) {
		
		console.log("connected to db");
		//create table	
		client.query('select * from users', function(err, result) {
		  done();
			
		  if (err){ 
			   console.error(err); 
			   res.send("Error " + err); 
		   }
		  else{ 
              var flag=true;
              console.log(result.rows.length);
              for(i=0;i<result.rows.length;i++) {
                    console.log(result.rows[i].name);
                    if(req.body.username==result.rows[i].name && req.body.password==result.rows[i].password){
                        req.session.user_id = req.body.username;
                        flag=false;
                        bind.toFile('tpl/index.tpl', {name: req.body.username}, function(data){
                            res.writeHead(200, {'Content-Type':'text/html'});
                            res.end(data);
                        });	
                    }
              }
              if(flag){
                  bind.toFile('tpl/login.tpl', {err: 'Dati inseriti non corretti. Riprovare.'}, function(data){
                      res.writeHead(200, {'Content-Type':'text/html'});
                      res.end(data);
                  });
              }
		   }
		});
    });
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

function CreateUserMenuTable (req, res){
    var table='';
    pg.connect(connString, function(err, client, done) {
		
		console.log("connected to db");
		//create table	
		client.query('select * from menu where lord=\'launch\';', function(err, result) {
		  done();
			
		  if (err){ 
			   console.error(err); 
			   res.send("Error " + err); 
		   }
		  else{ 
              console.log(result.rows.length);
              text+='<table><tr><th>Giorno</th><th>Primo</th><th>Secondo</th><th>Contorno</th><th>Calorie</th></tr>';
              for(i=0;i<result.rows.length;i++) {
                  text+='<tr><td>'+result.rows[i].giorno+'</td>'+'<td>'+result.rows[i].primo+'</td>'+'<td>'+result.rows[i].secondo+'</td>'+'<td>'+result.rows[i].contorno+'</td>'+'<td>'+result.rows[i].calorie+'</td>'+'<td>'+'<input type="radio" name="'+result.rows[i].giorno+'" value="'+result.rows[i].nvariante+'"/>'+'</td>'+'</tr>';
              }
              text+='</table>';
              console.log('Tabella: '+text);
              bind.toFile('tpl/menuchoiche.tpl', {name:req.session.user_id, table: text}, function(data){
                  res.writeHead(200, {'Content-Type':'text/html'});
                  res.end(data);
              });	
          }
		});
    });
    return table;
}


app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
