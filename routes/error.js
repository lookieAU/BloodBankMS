const express = require('express');

const router = express.Router();
const path = require('path');

const rootdir = require('../util/path');

router.use((req,res,next) => {
    console.log("Error Page");
    res.render('error');
});

module.exports = router;