const express = require('express');

const app = express();
const path = require('path');

const bodyParser = require('body-parser');

const indexRouter = require('./routes/index');
const adminRouter = require('./routes/admin');
const errorRouter = require('./routes/error');

app.use(bodyParser.urlencoded({extended: false}));

app.use(adminRouter);

app.use(indexRouter);
app.use(errorRouter);

app.listen(8080);
