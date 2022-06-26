const express  = require('express');
const mysql = require('mysql');
const router = express.Router();
const path = require('path');
const rootDir = require('../util/path');
const {nanoid} = require('nanoid');
router.use(express.json());
const con = require('../util/db');
const { CONNREFUSED } = require('dns');
const adminRouter = require('./admin');
const { group } = require('console');


var requestid,userid,donorid,recipientid,donationid,statusid;
var bloodInfoStatus = "Not Submitted";

var pincodes = [];
var fname,lname,email,resident,city,pincode,phone;
var bloodGroupProfile = "NULL";
var req_arr = [];

router.get('/register',(req,res,next) => {
    console.log('Registration Page');
    res.render(path.join(rootDir, 'views', 'register.pug'));
});

router.get('/login',(req,res,next) => {
    console.log('Login Page');
    const userid = adminRouter.userid;
    res.render(('login'), {userid: userid});
    // res.sendFile(path.join(rootDir, 'views', 'login.html'));
});

router.get('/profile',(req,res,next)=> {
    console.log('Profile landing Page');
    var pin_result,match_pins = [],requests;

    // const fname = adminRouter.fname;
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
                con.query(`SELECT distinct(pincode) FROM blood_info`, (err,results,fields) => {
                    if(err) throw err;
                    let rec = Object.values(JSON.parse(JSON.stringify(results)));
                    pin_result = rec.map(item => item.pincode);
                    let a = pincodes.length;
                    let b = pin_result.length;
                    for(let i=0;i<a;i++){
                        let c=0;
                        for(let j=0;j<b;j++){
                            if(pincodes[i] == pin_result[j]){
                                c++;
                            }

                        }
                        if(c>0){
                            match_pins = match_pins + pincodes[i];
                            c=0;
                        }
                    }
                    con.query(`SELECT * FROM blood_info WHERE pincode="600064"`,(err,results,fields) => {
                        if(err) throw err;
                        let rec = Object.values(JSON.parse(JSON.stringify(results)));
                        requests = rec.map(item => item.request_id);
                        var hospital_contact = rec.map(item => item.hospital_contact);
                        var hospital_name = rec.map(item => item.hospital_name);

                        req_arr = requests;
                        // console.log(requests.length);
                        // console.log(requests[0]);
                        console.log(req_arr.length);
                        console.log(match_pins);
                        var l = requests.length;
                        // for(var i=0;i<l;i++){
                        //     req_arr.append(requests[i]);
                        // }
                        // console.log(typeof(req_arr));
                        res.render(('profile'), {requests: req_arr,hosp_contact: hospital_contact,hosp_name: hospital_name, donationID: ["One","Two","Three"], Date: ["One","Two","Three"], type: ["One","Two","Three"]});
                    });

                });
                // for (k in pincodes){
                //     con.query(`SELECT distinct(pincode) FROM blood_info WHERE pincode = "${k}"`,(err,results,fields) => {
                //         if(err) throw err;
                //         let rec = Object.values(JSON.parse(JSON.stringify(results)));
                //         let matched_pincodes = rec.map(item => item.pincode);
                //     });
                // }

            });
        });


    
    });
    
    // console.log(testRequests);
    
});
router.get('/confirm-request-0', (req,res,next) => {
    var request_fk = req_arr[0];
    con.query(`SELECT donation_id FROM request_form WHERE request_id = "${request_fk}"`, (err,results,fields) => {
        if(err) throw err;
        let rec = Object.values(JSON.parse(JSON.stringify(results)));
        var donation_fk = rec.map(item => item.donation_id);
    });
});



router.get(('/request-form'), (req,res,next) => {
    console.log('Request form');
    res.render(('request'),{bloodInfoStatus: "Not submitted"});
});
router.get(('/profile-info'),(req,res,next) => {
    console.log('Profile Info page');
    // var test = "Some Value";
    con.query(`SELECT blood_group FROM donor WHERE user_id = "${userid}"`, (err,results,fields) => {
        if(err) throw err;
        let result = Object.values(JSON.parse(JSON.stringify(results)));
        bloodGroupFetched = result.map(item => item.blood_group);
        console.log(userid);
        console.log(result);
        console.log(bloodGroupFetched);
        if(bloodGroupFetched[0] != null){
            bloodGroupProfile = bloodGroupFetched[0];
        }
        console.log(bloodGroupProfile);
        res.render(('profile-info'),{fname: fname,lname: lname, email: email, resident: resident,  city: city, pincode: pincode, phone: phone, bloodGroup: bloodGroupProfile});
    });
    
})

// router.get(('/blood-info'), (req,res,next) => {
//     console.log("Blood info page");
//     res.render('bloodInfo');
// });









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
    userid = nanoid(10);
    donorid = nanoid(10);
    recipientid = nanoid(10);

    var checkregister = "NULL";

    var fname = req.body.fname;
    var lname = req.body.lname;
    var email = req.body.email;
    var resident = req.body.resident;
    var city = req.body.city;
    var state = 'Tamil Nadu';
    var pincode = req.body.pincode;
    var id_number = req.body.ID;
    var phone = req.body.phone;
    var will = req.body.willing;
    var passkey = req.body.Password;
    var dob = req.body.dob;

    var sql = "INSERT INTO registered_user VALUES ?";
    var values =[[userid,fname,lname,email,resident,city,state,pincode,phone,id_number,will,passkey]];

    if(will == 'Yes' || will == "yes" || will == "YES" ){
        var sql_additional = "INSERT INTO donor(donor_id,user_id,dob,eligibility) VALUES ?";
        var values_additional =[[donorid, userid, dob, 'Yes']];
    }
    else{
        var sql_additional = "INSERT INTO recipient VALUES ?";
        var values_additional =[[recipientid, userid]];
    }

    
    con.query(sql,[values],(err) => {
        if(err) throw err;
        console.log("Values Inserted in Registered User");

        con.query(sql_additional,[values_additional],(err) => {
            if(err) throw err;
            console.log("values inserted in Donor/Recipient");
        });
    });

    res.redirect('/');
});

router.post('/loginuser', (req,res,next) => {
    var username = req.body.Username;
    var passkey = req.body.Password;
    console.log(username,passkey);



    con.query(`SELECT * FROM registered_user WHERE email =  "${username}" AND passkey = "${passkey}"`, (err,result,fields) => {
        // let fname = "NULL";
        if(err) throw err;
        console.log(result);
        let newResult = Object.values(JSON.parse(JSON.stringify(result)));
        if (newResult.length == 0){
            userid = 'NULL';
            exports.userid = userid;
            res.redirect('/login');
            
        }
        else{
            userid = newResult[0].user_id;
            fname = newResult[0].fname;
            lname = newResult[0].lname;
            email = newResult[0].email;
            resident = newResult[0].residential;
            city = newResult[0].city;
            pincode = newResult[0].pincode;
            phone = newResult[0].phone;
            console.log(userid);
            console.log(newResult);
            bloodGroupProfile = "NULL";
            res.redirect('/profile');
        }

        
    });

    // res.redirect('/login');

    

});

router.post('/request-form', (req,res,next) => {
    var requestDate = req.body.requestdate;
    var proofOfRequest = 'Tobefilledlater';
    donationid = nanoid(10);
    statusid = nanoid(10);
    var requestStatus = 'On';

    var sql = `INSERT INTO request_form (donation_id,request_date,request_id,user_id,request_status) VALUES ?`;
    var values = [[donationid,requestDate,requestid,userid,requestStatus]];
    con.query(sql,[values],(err) => {
        if(err) throw err;
        console.log('Values inserted into Request form table');
        // var sql_additional_2 = `INSERT INTO donation_status (donation_id,status_id,user_id) VALUES ?`;
        // var values_additional_2 = [[donationid,statusid,userid]];

        // con.query(sql_additional_2,[values_additional_2],(err) => {
        //     if (err) throw err;
        //     console.log('Values inserted into Donation status table');
        // });
        // // var requestStatus = "Added";
        bloodInfoStatus = "Not submitted";
        res.redirect('/profile');
    });

});

router.post('/blood-info', (req,res,next) => {
    var bloodType = req.body.bloodType;
    var hospitalName = req.body.hospitalName;
    var hospitalContact = req.body.hospitalContact;
    var pincode = req.body.pincode;
    var bloodPlatelets = req.body.bloodPlatelets;

    requestid = nanoid(10);

    var sql = `INSERT INTO blood_info VALUES ?`;
    var values = [[requestid,bloodType,hospitalContact,hospitalName,pincode,bloodPlatelets]];
    con.query(sql,[values],(err) => {
        if(err) throw err;
        console.log('Values inserted into Blood Info table');
        res.render(('request'), {bloodInfoStatus: "Submitted"});
    });
});
router.post('/add-blood-group', (req,res,next) => {
    bloodGroupProfile = req.body.bloodgroup;
    var sql = `UPDATE donor SET blood_group = "${bloodGroupProfile}" WHERE user_id = "${userid}"`;
    // var values =[[bloodGroupProfile]];
    con.query(sql,(err) => {
        if(err) throw err;
        console.log("Blood Group updated");
        res.redirect('/profile-info');
    });

});

exports.router = router;

exports.pincodes = pincodes;

exports.userid = userid;
