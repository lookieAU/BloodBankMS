const express  = require('express');
const mysql = require('mysql');
const router = express.Router();
const path = require('path');
const rootDir = require('../util/path');
const {nanoid} = require('nanoid');

const con = require('../util/db');

router.get('/register',(req,res,next) => {
    console.log('Registration Page');
    res.sendFile(path.join(rootDir, 'views', 'register.html'));
});

router.get('/login',(req,res,next) => {
    console.log('Login Page');
    res.sendFile(path.join(rootDir, 'views', 'login.html'));
});

router.post('/adduser',(req,res,next) => {
    console.log(req.body);
    var newid = nanoid(10);

    var fname = req.body.fname;
    var lname = req.body.lname;
    var email = req.body.email;
    var resident = req.body.resident;
    var city = req.body.city;
    var state = req.body.state;
    var pincode = req.body.pincode;
    var id_number = req.body.ID;
    var phone = req.body.phone;
    var will = req.body.willing;
    var passkey = req.body.Password;

    var sql = "INSERT INTO registered_user VALUES ?";
    var values =[[newid,fname,lname,email,resident,city,state,pincode,phone,id_number,will,passkey]];

    
    con.query(sql,[values],(err) => {
        if(err) throw err;
        console.log("Values Inserted");
    });

    res.redirect('/');
});

router.post('/loginuser', (req,res,next) => {
    var username = req.body.Username;
    var passkey = req.body.Password;


    con.query(`SELECT * FROM registered_user WHERE email =  "${username}" AND passkey = "${passkey}"`, (err,result,fields) => {
        if(err) throw err;
        let newResult = Object.values(JSON.parse(JSON.stringify(result)));
        let name = newResult.map(item => item.fname);
        console.log(newResult);
        res.send(`<h2>Welcome ${name}</h2>`);
    });

    

});

module.exports = router;