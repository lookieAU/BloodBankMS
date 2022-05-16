const express  = require('express');

const path = require('path');
const rootDir = require('../util/path');
const router = express.Router();
const adminRouter = require('./admin');


router.get('/',(req,res,next) => {
    console.log('Main Page');
    const pincodes = adminRouter.pincodes;
    console.log(pincodes);
    res.render('index', {pins: pincodes, tableTitle: "Available Pincodes"});
    // res.status(200).send('Hey the response is coming');
});

module.exports = router;