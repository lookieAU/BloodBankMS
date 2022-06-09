const express = require('express');


const app = express();

app.set('view engine', 'pug');

app.set('views', 'views');
const path = require('path');

const bodyParser = require('body-parser');
const cors = require('cors');

const indexRouter = require('./routes/index');
const adminRouter = require('./routes/admin');
const errorRouter = require('./routes/error');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(adminRouter.router);

app.use(indexRouter);
app.use(errorRouter);

app.listen(3000);

