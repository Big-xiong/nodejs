var http = require('http');
var mysql = require('mysql');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var multer = require('multer');

// 创建服务器
var server = app.listen(8008,function(){
	var host = server.address().address
  	var port = server.address().port 
  	console.log("应用实例，访问地址为 http://%s:%s", host, port);
});

// 创建数据库
var connection;
function createCon(){
	connection = mysql.createConnection({
		host     : 'localhost',
		user     : 'root',
		password : '',
		database : 'test'
	});
}

// 获取商品列表的数据
app.get('/goods',function(req,res){
	var pageCount = (req.query.page-1)*10;
	createCon();
	connection.connect();
	connection.query('SELECT * FROM shoe limit '+pageCount+',10', function (error, results, fields) {
	    if (error) throw error;
	    // 打印报错结果
	  	// console.log('The solution is: ', results);
		res.send(results);
		connection.end();
	});
  	res.append("Access-Control-Allow-Origin", "*");
});

//获取详情页的数据
app.use(bodyParser.urlencoded({
	extended: false
}));
app.post('/detail',function(req,res){
	var id = req.body.id;
	// console.log(id);
	createCon();
	connection.connect();
	connection.query('SELECT * FROM shoe where id='+id, function (error, results, fields) {
	    if (error) throw error;
	    // 打印报错结果
	  	// console.log('The solution is: ', results);
		res.send(results);
		connection.end();
	});
  	res.append("Access-Control-Allow-Origin", "*");
});

// 上传头像
app.use(express.static('uploads'));
var storage = multer.diskStorage({
	//设置上传后文件路径
	destination: function(req, file, cb){
		cb(null, './uploads')
	},
	//给上传文件重命名，获取添加后缀名
	filename: function(req, file, cb) {
		var fileFormat = (file.originalname).split(".");
		//给图片加上时间戳格式防止重名名
		//比如把 abc.jpg图片切割为数组[abc,jpg],然后用数组长度-1来获取后缀名
		cb(null, file.fieldname + '-' + Date.now() + "." + fileFormat[fileFormat.length - 1]);
	}
});
var upload = multer({
	storage: storage
});
app.post('/upload-single', upload.any(), function(req, res, next) {	
	console.log(req.files);
	res.append("Access-Control-Allow-Origin","*");
	res.send({
		success:'ok',
		path:req.files
	});
});

// 注册用户判断
app.post('/reg',function(req,res){
	var name = req.body.name;
	var psw = req.body.psw;
	createCon();
	connection.connect();
	connection.query('SELECT id FROM client where name='+name, function (error, results, fields) {
	    console.log(results);
	    if(results.length == 0){
	  		connection.query('insert into client(name,password) values("'+name+'","'+psw+'")', function (error, jieguo, fields) {
				if (error) throw error;
	  			console.log('The solution is: ', jieguo);
				connection.end();
			});
	    }
		res.send(results);
	    // 打印报错结果
	  	// console.log('The solution is: ', results);
	});
  	res.append("Access-Control-Allow-Origin", "*");
});

// 用户登录判断
app.post('/login',function(req,res){
	var name = req.body.name;
	var psw = req.body.psw;
	createCon();
	connection.connect();
	connection.query('SELECT password,id FROM client where name='+name, function (error, results, fields) {
	    console.log(results);
	    console.log(psw);
	    if(results[0].password == psw){
			connection.end();
			res.send(results);
	    }else{
	    	connection.end();
			res.send('no');
	    }
	    // 打印报错结果
	  	// console.log('The solution is: ', results);
	});
  	res.append("Access-Control-Allow-Origin", "*");
});