var express = require('express');
var crypto = require('crypto');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next){
	res.render("login",{title:"注册"});
})
router.post('/', function(req, res, next) {
	var md5 = crypto.createHash('md5');
	var user=db.get('user');
	var Ulogn = req.body.Ulogn;
	var Upasswd=md5.update(req.body.Upasswd).digest('hex');
	user.findOne({Ulogn:Ulogn},function(err,docs){
		if(err){
			res.send("登录失败，稍候再试");
		}
		if(docs==null){
			res.send('用户不存在');	
		}else{
			if(Upasswd==docs.Upasswd){
				req.session.user=docs;
				//res.render("home",{ title:'首页' });
				res.location("home");
				res.redirect("home");
			}else{
				res.send('密码错误');
			}
		}
	});
});

router.post('/login',function(req, res, next){
	var md5 = crypto.createHash('md5');
	var user=db.get('user');
	var Ulogn = req.body.Ulogn;
	var Upasswd=md5.update(req.body.Upasswd).digest('hex');
	user.findOne({Ulogn:Ulogn},function(err,docs){
		if(err){
			res.send("登录失败，稍候再试");
		}
		if(docs==null){
			res.send('用户不存在');	
		}else{
			if(Upasswd==docs.Upasswd){
				req.session.user=docs;
				//res.render("home",{ title:'首页' });
				res.location("home");
				res.redirect("home");
			}else{
				res.send('密码错误');
			}
		}
	});
})


module.exports = router;
