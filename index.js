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

function sessionCheck (requ, resu){
    if (requ.session.user_id==null) {
        bind.toFile('tpl/index.tpl', {name: 'ospite'}, function(data){
            resu.writeHead(200, {'Content-Type':'text/html'});
            resu.end(data);
        });
    }
}


/**
 * @brief main page, provides website presentation and a way to log-in or to go into the dashboard/menu choiche page if logged in
 * @return the index.tpl page like it is normally, with the name of the user logged in
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
 * @brief checks wheter the user is logged in ad administrator, customer or not logged in at all.
 * @return a page for logging if the user is not yet logged in, or the dashboard for the admin or the page for choosing the menu
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
        if(req.session.user_id == 'admin'){
            CreateAdminPrenotationTable(req, res);
        }
        else CreateUserMenuTable(req, res);
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
 * @brief log in page, this page will create a session if the user exists in the database
 * @return the main page of the website or the log in page if user data are wrong/not existing
 */
app.post('/login', function(req, res) 
{
	
	console.log("Founded radio: " + req.body.username + ", password: " + req.body.password);
    
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
 * @brief takes the menu choice for the whole week for the user logged in and inserts it in the database
 * @return a page which notifies if the operation is ended successfully or not
 */
app.post('/order', function(req, res) 
{
    sessionCheck(req, res);
	//da cercare radio button di tipo giorno+pranzo/cena
	console.log("Founded launch: " + req.body.lunlaunch + ", " + req.body.marlaunch + ", " + req.body.merlaunch + ", " + req.body.giolaunch + ", " + req.body.venlaunch + ", " + req.body.sablaunch + ", " + req.body.domlaunch + ", " + "dinner: " + req.body.lundinner + ", " + req.body.mardinner + ", " + req.body.merdinner + ", " + req.body.giodinner + ", " + req.body.vendinner + ", " + req.body.sabdinner + ", " + req.body.domdinner);
    
    var queryString = "insert into prenotations values ('" + req.session.user_id + "', " + req.body.lunlaunch + ", " + req.body.marlaunch + ", " + req.body.merlaunch + ", " + req.body.giolaunch + ", " + req.body.venlaunch + ", " + req.body.sablaunch + ", " + req.body.domlaunch + ", " + req.body.lundinner + ", " + req.body.mardinner + ", " + req.body.merdinner + ", " + req.body.giodinner + ", " + req.body.vendinner + ", " + req.body.sabdinner + ", " + req.body.domdinner + ")";
    
	pg.connect(connString, function(err, client, done) {
		
		console.log("connected to db");
		//create table	
		client.query(queryString, function(err, result) {
		  done();
			
		  if (err){ 
			   console.error(err); 
			   res.send("Error " + err); 
		   }
		  else{ 
              bind.toFile('tpl/successpage.tpl', {}, function(data){
                  res.writeHead(200, {'Content-Type':'text/html'});
                  res.end(data);
                  });
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
    var text='';
    pg.connect(connString, function(err, client, done) {
		
		console.log("connected to db");
		//create table	
		client.query('select * from menu;', function(err, result) {
		  done();
			
		  if (err){ 
			   console.error(err); 
			   res.send("Error " + err); 
		   }
		  else{ 
              console.log(result.rows.length);
              text+='<h3>Pranzo:</h3><br><div class="datagrid"><table id="menuTable1" class="datagrid" style="width: 100%"><thead><tr><th>Giorno</th><th>Primo</th><th>Secondo</th><th>Contorno</th><th>Calorie</th><th>Scelta</th></tr></thead>';
              for(i=0;i<result.rows.length/2;i++) {
                  text+='<tr><td>'+result.rows[i].giorno+'</td>'+'<td>'+result.rows[i].primo+'</td>'+'<td>'+result.rows[i].secondo+'</td>'+'<td>'+result.rows[i].contorno+'</td>'+'<td>'+result.rows[i].calorie+'</td>'+'<td>'+'<input type="radio" name="'+result.rows[i].giorno+result.rows[i].lord+'" value="'+result.rows[i].nvariante+'"/>'+'</td>'+'</tr>';
              }
              text+='</table></div><br>';
              text+='<h3>Cena:</h3><br><div class="datagrid"><table id="menuTable2" style="width: 100%"><thead><tr><th>Giorno</th><th>Primo</th><th>Secondo</th><th>Contorno</th><th>Calorie</th><th>Scelta</th></tr></thead>';
              for(i=result.rows.length/2;i<result.rows.length;i++) {
                  text+='<tr><td>'+result.rows[i].giorno+'</td>'+'<td>'+result.rows[i].primo+'</td>'+'<td>'+result.rows[i].secondo+'</td>'+'<td>'+result.rows[i].contorno+'</td>'+'<td>'+result.rows[i].calorie+'</td>'+'<td>'+'<input type="radio" name="'+result.rows[i].giorno+result.rows[i].lord+'" value="'+result.rows[i].nvariante+'"/>'+'</td>'+'</tr>';
              }
              text+='</table></div>';
              bind.toFile('tpl/menuchoiche.tpl', {name:req.session.user_id, table: text}, function(data){
                  res.writeHead(200, {'Content-Type':'text/html'});
                  res.end(data);
              });	
          }
		});
    });
}

function CreateAdminPrenotationTable (req, res){
    var text='';
    pg.connect(connString, function(err, client, done) {
		
		console.log("connected to db");
		//create table	
		client.query('select * from prenotations;', function(err, result) {
		  done();
			
		  if (err){ 
			   console.error(err); 
			   res.send("Error " + err); 
		   }
		  else{ 
              console.log(result.rows.length);
              text+='<h3>Prenotazioni:</h3><br><div class="datagrid"><table class="datagrid" style="width: 100%; text-align: center"><thead><tr><th>Utente</th><th colspan="2">Lunedì</th><th colspan="2">Martedì</th><th colspan="2">Mercoledì</th><th colspan="2">Giovedì</th><th colspan="2">Venerdì</th><th colspan="2">Sabato</th><th colspan="2">Domenica</th></tr>';
              text+='<tr><th></th><th>Pranzo</th><th>Cena</th><th>Pranzo</th><th>Cena</th><th>Pranzo</th><th>Cena</th><th>Pranzo</th><th>Cena</th><th>Pranzo</th><th>Cena</th><th>Pranzo</th><th>Cena</th><th>Pranzo</th><th>Cena</th></tr></thead>';
              for(i=0;i<result.rows.length/2;i++) {
                  text+='<tr><td>'+result.rows[i].name+'</td>'+'<td>'+result.rows[i].lunlaunch+'</td>'+'<td>'+result.rows[i].lundinner+'</td>'+'<td>'+result.rows[i].marlaunch+'</td>'+'<td>'+result.rows[i].mardinner+'</td>'+'<td>'+result.rows[i].merlaunch+'</td>'+'<td>'+result.rows[i].merdinner+'</td>'+'<td>'+result.rows[i].giolaunch+'</td>'+'<td>'+result.rows[i].giodinner+'</td>'+'<td>'+result.rows[i].venlaunch+'</td>'+'<td>'+result.rows[i].vendinner+'</td>'+'<td>'+result.rows[i].sablaunch+'</td>'+'<td>'+result.rows[i].sabdinner+'</td>'+'<td>'+result.rows[i].domlaunch+'</td>'+'<td>'+result.rows[i].domdinner+'</td>'+'</tr>';
              }
              text+='</table></div><br>';
              bind.toFile('tpl/adminpage.tpl', {table: text}, function(data){
                  res.writeHead(200, {'Content-Type':'text/html'});
                  res.end(data);
            });
          }
		});
    });
}


app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
