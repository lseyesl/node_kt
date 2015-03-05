var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	Aho(req,res,next);
	var s_user=req.session.user;
	var db_user=null;
	var db_attention=null;
	var user_result=[];
	db.get('user').find({},function(err,docs){
		db_user=docs;
		db.get('attention').find({'Uid':s_user._id},function(err,docs){
			db_attention=docs;
			for(var i=0;i<db_user.length;i++){
				var _user=db_user[i];
				for(var j=0;j<db_attention.length;j++){
					if(_user._id==db_attention[j]['attUid']){
						_user['isatt']=true;
						break;
					}
				}
				if(!_user['isatt']){
					_user['isatt']=false;
				}
				if(_user['_id']==s_user['_id']){
					continue;
				}
				user_result.push(_user);		
			}
			console.log(db_user);
	
	
			console.log(db_attention);
	
			res.render('userlist', { title: '用户列表' ,user:s_user,userlist:user_result});
		});
	});
	
});

router.post('/removeAtt',function(req, res, next){
	var s_user = req.session.user;
	var attUid = req.body.attUid;
	var db_att = db.get('attention');
	var query={"Uid":s_user['_id'],"attUid":attUid};
	db_att.find(query,function(err,doc){
		if(doc.length){
			db_att.remove(query,function(err,doc){
				if(err){
					res.send('失败');
				}else{
					res.send('成功');
				}
			})
		}
	})
})

router.post('/addAtt',function(req, res, next){
	console.log('--------addAtt--------');
	var s_user = req.session.user;
	var attUid = req.body.attUid;
	var db_att = db.get('attention');
	var query={"Uid":s_user['_id'],"attUid":attUid};
	console.log(query);
	db_att.find(query,function(err,doc){
		console.log(err,doc,doc==[],doc.length);
		if(!doc.length){
			console.log('---go---');
			db_att.insert(query,function(err,doc){
				if(err){
					res.send('失败');
				}else{
					res.send('成功');
				}
			})
		}
	})
})




module.exports = router;
