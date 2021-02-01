const mysql = require('mysql');
const http = require('http');

const port = process.env.PORT || 3000;

//mysql://b4e7f2fbf8aa92:89923471@us-cdbr-east-03.cleardb.com/heroku_1abbed335eaacbe?reconnect=true//
const dbConfigHeroku = {
	host: "us-cdbr-east-03.cleardb.com",
	user: "b4e7f2fbf8aa92",
	password: "89923471",
	database: "heroku_1abbed335eaacbe",
	multipleStatements: false,
	reconnect: true
};


const dbConfigLocal={
	host: "127.0.0.1",
	user: "root",
	password: "2155",
	multipleStatements: false,
	reconnect: true
}


if (process.env.IS_HEROKU){
	var database = mysql.createPool(dbConfigHeroku);
}
else{
	var database = mysql.createPool(dbConfigLocal);	
}

database.getConnection((err, dbConnection) => {
	if (!err) {
		console.log("Successfully connected to MySQL");
	}
	else {
		console.log("Error Connecting to MySQL");
		console.log(err);
	}
});


http.createServer(function(req, res) {
	console.log("page hit");
	database.getConnection(function (err, dbConnection) {
		if (err) {
			//Send an HTTP Status code of 500 for server error.
			res.writeHead(500, {'Content-Type': 'text/html'});
			//write the HTML
			res.end('<!doctype html><html><head></head><body><div>Database error, check the Heroku logs for the details.</div></body></html>');
			console.log("Error connecting to mysql");
		}
		else {
			dbConnection.query("SHOW VARIABLES LIKE 'version';", (err, result) => {
				if (err) {
					//Send an HTTP Status code of 500 for server error.
					res.writeHead(500, {'Content-Type': 'text/html'});
					//write the HTML
					res.end('<!doctype html><html><head></head><body><div>Database error, check the Heroku logs for the details.</div></body></html>');
					console.log("Error reading from mysql");
					console.log(err);
				}
				else { //success
					//Send an HTTP Status code of 200 for success!
					res.writeHead(200, {'Content-Type': 'text/html'});
					//write the HTML
					res.end('<!doctype html><html><head></head><body><div>Connected to the database, check the Heroku logs for the results.</div></body></html>');

					//Output the results of the query to the Heroku Logs
					console.log(result);
				}
			});
			dbConnection.release();
		}
	});
}).listen(port);



