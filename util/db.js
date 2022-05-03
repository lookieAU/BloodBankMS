const mysql = require('mysql');

const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'CRUD'
});

con.connect((err) => {
    if(err){
        console.log("error connecting to DB");
    }
    else{
        console.log("connection established");
    }
});

module.exports = con;

