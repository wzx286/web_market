var express = require('express');
var app = express();
var fs = require('fs');

app.use(express.static(__dirname+"/.."));//将server文件夹所在上级目录设为根目录，即http://127.0.0.1:8082/
 
app.get("/items",function(req,res){
	fs.readFile("json/item_ex.json",function(err,data){
		if(err)
			return console.log(err);
		console.log("读取商品信息成功！");
		res.send(data);
	});
	
});

app.get("/shop-car",function(req,res){
	console.log("用户"+req.query.username1+"请求查看购物车信息");
	var usr=req.query.username1;//只返回该用户的购物车信息
	console.log(usr);
	fs.readFile("shoppingCAR/"+usr+".json",function(err,data){
		if(err)
			return console.log(err);
		console.log("读取购物车信息成功！"+usr);
		// console.log(JSON.parse(data)[usr][0].id);
		res.send(data);
	});
});

app.get("/shop-car-delete",function(req,res){
	
	var usr=req.query.username1;//只返回该用户的购物车信息
	var id=req.query.id;
	fs.readFile("shoppingCAR/"+usr+".json",function(err,data){
		if(err)
			return console.log(err);
		
		var d=JSON.parse(data);
		var i;
		for (i = d.length - 1; i >= 0; i--) {
			if(d[i].id==id)break;
		}
		
		if(i!=-1){
			// delete d[i];
			d.splice(i,1);
			
		}
		fs.writeFile("shoppingCAR/"+usr+".json",JSON.stringify(d),function(err){
			if(err){
				console.log(err);
				res.send("del_fail");
			}
			else{
				console.log("删除成功！");
				res.send("del_success");
			}			
		});
	});
});

app.get("/shop-car-add",function(req,res){
	console.log(req.query.newItem);
	var usr=req.query.username1;//只返回该用户的购物车信息
	var newItem=JSON.parse(req.query.newItem);
	
	fs.readFile("shoppingCAR/"+usr+".json",function(err,data){
		if(err)
			return console.log(err);
		
		var d=JSON.parse(data);
		d.push(newItem);
		fs.writeFile("shoppingCAR/"+usr+".json",JSON.stringify(d),function(err){
			if(err){
				console.log(err);
				res.send("add_fail");
			}
			else{
				console.log("添加成功");
				res.send("add_success");
			}
			
		});
		
		
	});
});

app.get("/checkUSER",function(req,res){
	var u=req.query.u;
	fs.readFile("UserData/user_login.json",function(err,data){
		if (err) {return console.log(err)}
		var d=JSON.parse(data);
		if(!(u in d)){
			res.send("");
		}else{
			res.send("用户名已存在");
		}
	});
});

app.get("/moreRecm",function(req,res){
	var start=req.query.start-1;
	var length=req.query.length;
	var arr=[];

	fs.readFile("json/item_ex.json",function(err,data){
		if (err) {return console.log(err)}
		var d=JSON.parse(data).items_ex1;
		var len=d.length;
		console.log("len="+len);
		for(var i=start;i<len,length>0;i++,length--){
			arr.push(d[i]);
			console.log("length="+length);
		}
		res.send(arr);
		
	});
});
 
var server = app.listen(8082, function () {
 
  var host = server.address().address
  var port = server.address().port
 
  console.log(" http://%s:%s", host, port)
 
});

