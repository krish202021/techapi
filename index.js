const express = require('express');
const app = express();
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
const cors = require("cors");
app.use(bodyParser.json())

app.use(cors());

app.use(cors({
    methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH']
}));

const user = require('./src/user/userController');

app.use('/tgsapi/user',user);


app.listen(8000,()=>console.log('server running'));