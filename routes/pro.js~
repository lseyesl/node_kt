var express = require('express');
var crypto = require('crypto');
var router = express.Router();
var formidable = require('formidable');
var path = require('path');
var fs = require('fs');



/* GET home page. */
router.get('/', function(req, res, next) {
	Aho(req,res,next);
	var user=req.session.user;
	console.log(user,'\n');
	res.render('pro',{title:"个人资料",user:user});
});
/*个人信息修改*/
router.post('/editUser',function(req, res, next){
	var s_usr = req.session.user;
	var Uid = s_usr._id;
	var db_user=db.get('user');
	var Ualais = req.body.Ualais;
	var Ulogn = req.body.Ulogn;
	var Usex = req.body.Usex;
	var Uinfo = req.body.Uinfo;
	var query ={
		"Ualais":Ualais,
		"Ulogn":Ulogn,
		"Usex":Usex,
		"Uinfo":Uinfo
	}
	db_user.update({"_id":Uid},{$set:query},function(err,docs){
		if(err){
			res.send('失败');			
		}else{
			res.send('成功');
			req.session.user=null;
			s_usr['Ualais']=Ualais;
			s_usr['Ulogn']=Ulogn;
			s_usr['Usex']=Usex;
			s_usr['Uinfo']=Uinfo;
			req.session.user=s_usr;
			//console.log(req.session.user['Ualais'],req.session.user,'\n');
			req.session.save(function(err){
				if(err){
					console.log('修改失败，请重试');
				}else{
					console.log('成功');
				}	
			})
		}
	})
})
/*密码修改*/
router.post('/editPwd',function(req, res, next){
	var s_usr = req.session.user;
	var Uid = s_usr._id;
	var db_user=db.get('user');
	var Upasswd = req.body.Upwd;
	var nUpwd = req.body.nUpwd;
	var nUpwd2 = req.body.nUpwd2;
	var md5 = crypto.createHash('md5');
	var md5_2 = crypto.createHash('md5');
	var Upasswd_md5=md5.update(Upasswd).digest('hex');
	var nUpswd_md5=md5_2.update(nUpwd).digest('hex');
	if(nUpwd!==nUpwd2){
		res.send('两次输入新密码不一样');
	}
	
	var query ={
		"Upasswd":nUpswd_md5
	}
	db_user.find({"_id":Uid,"Upasswd":Upasswd_md5},function(err,docs){
		if(docs.length>0){
			db_user.update({"_id":Uid},{$set:query},function(err,docs){
				if(err){
					res.send('失败');			
				}else{
					res.send('成功');
					req.session.user=null;
					s_usr['Upasswd']=nUpswd_md5;
					req.session.user=s_usr;
					//console.log(req.session.user['Ualais'],req.session.user,'\n');
					req.session.save(function(err){
						if(err){
							console.log('失败');
						}else{
							console.log('成功');
						}	
					})
				}
			})
		}else{
			res.send("原密码错误");
		}
	})
	
})
/*头像修改*/
router.post('/editUpic',function(req, res, next){
	//console.log('req',req);
	//console.log('files',req.files);
	var s_usr = req.session.user;
	var Uid = s_usr._id;
	var db_user=db.get('user');
	var form = new formidable.IncomingForm();
	form.encoding = 'utf-8';
	var _path=path.join(__dirname,'').split('/').slice(0,-1).join('/');
	form.uploadDir =  _path+'/public/tmp';
	//form.multiples = true;
	form.keepExtensions = true; //保留后缀
	//console.log(form);
	console.log('form--------start\n');
/*
	var post={};
	var file = {};
	form.on('field',function(field,value){
		if(form.type == 'multipart'){
			if(field in post){
				if(util.isArray(post[field])===false){
					post[field]=[post[field]];
				}
				post[field].push(value);
			}
		}
		post[filed] = value;
	}).on('file',function(field,file){
		console.log('file',file);
		console.log('path',file.path);
		file[field]=file;
	}).on('end',function(){
		
	});
	form.parse(req);
*/
	
	form.parse(req,function(err,fields,files){
		//console.log(fields,files);
		if(err){
			res.send({txt:'上传失败'});
			return;	
		}
		var extName ='';//后缀名
		console.log('wenjian',files.fulAvatar);
		switch(files.fulAvatar.type){
			case 'image/pjpeg':
				extName = 'jpg';
				break;
			case 'image/jpeg':
				extName = 'jpg';
				break;
			case 'image/png':
				extName = 'png';
				break;
			case 'image/x-png':
				extName = 'png';
				break;
		}
		console.log('extName',extName);
		if(extName.length == 0){
			res.send({txt:'上传失败'});
			return;
		}
		var avatarName = req.session.user['_id']+'.'+extName;
		console.log('avatarName',avatarName,'\n');
		var newPath = _path+'/public/images/uavatar/' + avatarName;
		console.log('newPath',newPath,'\n');
		fs.rename(files.fulAvatar.path,newPath,function(err){
			if(err){
				res.send({txt:'上传失败'});
			}
			var Uimages='/uavatar/'+avatarName;
			db_user.update({'_id':s_usr['_id']},{$set:{'Uimages':Uimages}},function(err,docs){
				if(err){
					res.send({txt:'上传失败'});
				}else{
					req.session.user=null;
					s_usr['Uimages']=Uimages;
					req.session.user=s_usr;
					//console.log(req.session.user['Ualais'],req.session.user,'\n');
					req.session.save(function(err){
						if(err){
							res.send({txt:'上传失败'});
						}else{
							res.send({txt:'成功',U_url:'img'+Uimages});
						}	
					})
				}
			})
		});
		
	});
	
	
})


module.exports = router;
