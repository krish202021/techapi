const express = require('express');
const app = express();
const connect = require('../../db_connect');
const connection = connect.con;
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var PHPUnserialize = require('php-unserialize');
const sendmail = require('sendmail')();
exports.test = function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify("Hello world"));
};

exports.save_contact = function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
	var value = req.body;
	var ip = (req.headers['x-forwarded-for'] || '').split(',').pop().trim() || req.socket.remoteAddress;
	var sql = `INSERT INTO contact_us (name, email, phone, message, industry, project_duration, project_type, website, ip_address) values('${value.name}', '${value.email}','${value.phone}','${value.message}','${value.industry}', '${value.project_duration}', '${value.project_type}','${value.website}', '${ip}')`;
	console.log(sql);
	//res.send(JSON.stringify({sql}));
	connection.query(sql, function (err, result, fields){
      if(err){
      	throw err;
	   }else{
	       const response = sendmail({
                from: `${value.email}`,
                to: 'info@techsgeeks.in',
                subject: 'Enquery',
                html: `Name : '${value.name}' <br> Email : '${value.email}' <br> Phone Number : '${value.phone}' <br> Project Type : '${value.project_type}' <br> Industry : '${value.industry}' <br> Project Duration : '${value.project_duration}' <br> Website : '${value.website}' <br> Message : '${value.message}' `,
              }, function(err, reply) {
                console.log(err && err.stack);
                console.dir(reply);
            });
	      res.send(JSON.stringify({"success":"success"}));
	   }
  	})
    
};

exports.get_social_link = function(req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var sql = "select * from social_link";
    connection.query(sql, function (err, result, fields){
        if(err){
            throw err;
        }else{
            res.send(JSON.stringify({result}))
        }
    })
}

exports.get_seo = function(req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var sql = `select * from seo_manager where page_id=${req.body.page_id}`;
    connection.query(sql, function (err, result, fields){
        if(err){
            throw err;
        }else{
            res.send(JSON.stringify({result}))
        }
    })
}

exports.blog = function(req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var page_no = req.params.page;
    var limit = (page_no-1)*10;
    
    var sql = `select blog.*, category.cat_name, category.id as cat_id from blog INNER JOIN category on blog.cat_id=category.id order by blog.created_at DESC limit ${limit}, 10`;
    //res.send(JSON.stringify(sql));
    connection.query(sql, function (err, result, fields) {
        if(err){
            throw err;
        }else {
            res.send(JSON.stringify({result}));
        }
    })
}


exports.get_cat_blog = function(req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var page_no = req.params.page;
    var limit = (page_no-1)*10;
    var id= req.params.id
    
    var sql = `select blog.*, category.cat_name, category.id as cat_id from blog INNER JOIN category on blog.cat_id=category.id where blog.cat_id=${id} order by blog.created_at DESC limit ${limit}, 10`;
    //res.send(JSON.stringify(sql));
    connection.query(sql, function (err, result, fields) {
        if(err){
            throw err;
        }else {
            res.send(JSON.stringify({result}));
        }
    })
}

exports.popular_blog = function(req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var sql = `select blog.*, category.cat_name, category.id as cat_id from blog INNER JOIN category on blog.cat_id=category.id order by blog.view DESC  limit 10`;
    //res.send(JSON.stringify(sql));
    connection.query(sql, function (err, result, fields) {
        if(err){
            throw err;
        }else {
            res.send(JSON.stringify({result}));
        }
    })
}

exports.get_tag = function(req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var tag = req.body.tag;
    var sql = `select * from tag where id in(${tag})`;
    //res.send(JSON.stringify(sql));
    connection.query(sql, function (err, result, fields) {
        if(err){
            throw err;
        }else {
            res.send(JSON.stringify({result}));
        }
    })
}

exports.blog_detail = function(req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var id = req.params.id;
    var sql = `select blog.*, category.cat_name, category.id as cat_id from blog INNER JOIN category on blog.cat_id=category.id where blog.id=${id}`;
    //res.send(JSON.stringify(sql));
    connection.query(sql, function (err, result, fields) {
        if(err){
            throw err;
        }else {
            const data = {res:result, tag:PHPUnserialize.unserialize(result[0].tags)}
            res.send(JSON.stringify(data));
        }
    })
}

exports.count_view = function(req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    const bodys = req.body;
    var sql = `SELECT view FROM blog where id = '${req.body.id}'`;
    connection.query(sql, function (err, result, fields){
        if(err){
          throw err;
       }else{
           var count = result[0]['view']+1;
           var update = `update blog set view='${count}' where id = '${req.body.id}'`;
           //res.send(JSON.stringify(update));
          connection.query(update, function (err, result, fields){
                if(err){
                  throw err;
              }else{
                  res.send(JSON.stringify("success"));
              }
          })
          
       }
    })
}

exports.blog_count = function(req, res, next) {
    res.setHeader('Content-Type', 'application/json');
   
    var sql = `select count(blog.id) as total from blog`;
    //res.send(JSON.stringify(sql));
    connection.query(sql, function (err, result, fields) {
        if(err){
            throw err;
        }else {
            res.send(JSON.stringify({result}));
        }
    })
}

exports.category_blog_count = function(req, res, next) {
    res.setHeader('Content-Type', 'application/json');
   
    var sql = `select count(blog.id) as total from blog where cat_id=${req.body.id}`;
    //res.send(JSON.stringify(sql));
    connection.query(sql, function (err, result, fields) {
        if(err){
            throw err;
        }else {
            res.send(JSON.stringify({result}));
        }
    })
}

exports.get_category = function(req, res, next) {
    res.setHeader('Content-Type', 'application/json');
   
    var sql = `select * from category`;
    //res.send(JSON.stringify(sql));
    connection.query(sql, function (err, result, fields) {
        if(err){
            throw err;
        }else {
            res.send(JSON.stringify({result}));
        }
    })
}
