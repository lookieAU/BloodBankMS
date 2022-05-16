const express  = require('express');
const mysql = require('mysql');
const router = express.Router();
const path = require('path');
const rootDir = require('../util/path');
const {nanoid} = require('nanoid');
router.use(express.json());
const con = require('../util/db');
const { CONNREFUSED } = require('dns');

var pincodes = [];

router.get('/register',(req,res,next) => {
    console.log('Registration Page');
    res.sendFile(path.join(rootDir, 'views', 'register.html'));
});

router.get('/login',(req,res,next) => {
    console.log('Login Page');
    res.json({message : "Connected from Node"});
    // res.sendFile(path.join(rootDir, 'views', 'login.html'));
});

router.post('/searchpincode', (req,res,next) => {
    var pincode = req.body.pincode;
    console.log(req.body);
    con.query(`SELECT latitude FROM pincode_list WHERE pincode = "${pincode}"`, (err,results,fields) => {
        if(err) throw err;
        let rec = Object.values(JSON.parse(JSON.stringify(results)));
        let latitude = rec.map(item => item.latitude);
        console.log(latitude);

        con.query(`SELECT longitude FROM pincode_list WHERE pincode = "${pincode}"`, (err,results,fields) => {
            if(err) throw err;
            let rec = Object.values(JSON.parse(JSON.stringify(results)));
            let longitude = rec.map(item => item.longitude);
            console.log(longitude);

            con.query(`SELECT distinct(pincode) FROM pincode_list WHERE (3958*3.1415926*sqrt((latitude-"${latitude}")*(latitude-${latitude}) + cos(latitude/57.29578)*cos("${latitude}"/57.29578)* (longitude-"${longitude}")*(longitude-"${longitude}"))/180) <= 3.1086;`,(err,results,fields) => {
                if(err) throw err;
                let rec = Object.values(JSON.parse(JSON.stringify(results)));
                pincodes = rec.map(item => item.pincode);

            //  res.status(200).send({data : pincodes}); 
            console.log(pincodes);
            exports.pincodes = pincodes;
            res.redirect('/');

            });
        });


    
    });



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
        let fname = newResult.map(item => item.fname);
        console.log(newResult);
        res.send(`<h2>Welcome ${fname}</h2>`);
    });

    

});

exports.router = router;

exports.pincodes = pincodes;
