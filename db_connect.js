var mysql = require("mysql");

const con = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database: "ztrxwlrp_tech_geeks"
});
module.exports = {con}