var express = require('express');
var crypto = require('crypto');
var router = express.Router();

/* GET register page. */
router.get('/', function(req, res, next) {
	res.render('register', { title: '注册' });
});

router.post('/addUser',function(req, res, next){
	var Ualais=req.body.Ualais;
	var Ulogn=req.body.Ulogn;
	var Upasswd=req.body.Upasswd;
	var Usex=req.body.Usex;
	var Uinfo=req.body.Uinfo;
  //console.log(db);
	//console.log(db.get('user'));
	var md5 = crypto.createHash('md5');
	var Upasswd_md5=md5.update(Upasswd).digest('hex');

  var user = db.get('user');
	user.find({"Ualais":Ualais},function(err,docs){
		if(docs.length){
			res.send("此昵称已存在");	
		}else{
			user.find({"Ulogn":Ulogn},function(err,docs){
				if(docs.length){
					res.send("此邮箱已注册");
				}else{
					var Udatetime=new Date();
					var Uimages='mo_user.jpg';
					//var Uimages=path.join('public/images/.mo_user.jpg');
					var Ublog=Ualais;
					user.insert({
						"Ualais":Ualais,
						"Ulogn":Ulogn,
						"Upasswd":Upasswd_md5,
						"Usex":Usex,
						"Uinfo":Uinfo,
						"Uimages":Uimages,
						"Udatetime":Udatetime,
						"Ublog":Ublog
					},function(err,doc){
						if(err){
							res.send("注册失败！请稍候再试。");
						}else{
							req.session.user = doc;
							//res.location("home");
							res.redirect("/home");
						}
					});
				}
			});
		}
	});

	
});

module.exports = router;
