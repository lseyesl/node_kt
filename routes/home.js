var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	Aho(req,res,next);
	var user=req.session.user;
	var wb_list=null;
	var db_msg=db.get('message');
	var db_attention=db.get('attention');
	var db_user=db.get('user');
	var wb_atten=null;
	//var wb_tmp=null;
	db_msg.find({"Uid":req.session.user['_id']},function(err,docs){
		if(err){
			res.send("读取失败，请稍后再试");
		}else{			
			for(var i=0;i<docs.length;i++){
				docs[i]['Uimages']=req.session.user.Uimages;
				docs[i]['Ualais']=req.session.user.Ualais;
			}
			//console.log('本人的消息',docs);
			wb_list=docs;
			//console.log(wb_tmp);
			db_attention.find({"Uid":req.session.user['_id']},function(err,docs){
				if(err){
					res.send("读取失败，请稍后再试");
				}else{
					//console.log('本人的关注',docs);
					wb_atten=docs;
					var num=0;
					for(var i=0;i<wb_atten.length;i++){
						var att=wb_atten[i];
						console.log('关注人id',att['attUid']);
						(function(){
							var local_att=att;
							console.log(local_att['attUid']);
							db_msg.find({'Uid':local_att['attUid']},function(err,docs){
								if(err){
									res.send("读取失败，请稍后再试");					
								}else{
									var meg =docs;
									console.log(local_att['attUid']);
									db_user.find({'_id':local_att['attUid']},function(err,us){
										if(err){
											res.send("读取失败，请稍后再试");
										}else{
											console.log(us[0].Ualais);
											for(var i=0;i<meg.length;i++){
												meg[i]['Uimages']=us[0].Uimages;
												meg[i]['Ualais']=us[0].Ualais;
											}
											//console.log("加工的消息",meg);
											wb_list=wb_list.concat(meg);
											//console.log('_____',wb_list);	
											num++;
										}
									})
								}
							})
						})(att);
						
					}
					function zj(){
						console.log(num,wb_atten.length)
						if(num==wb_atten.length){
							console.log(wb_list);
							wb_list.sort(function(a,b){
								if(a.Mdatetime>=b.Mdatetime){
									return -1;
								}else{
									return 1;
								}
							})
							res.render('home', { title: '登录' ,user:user,wblist:wb_list});
						}else{
							setTimeout(zj,500);
						}				
					}
					zj();							
				}
			})
		}
	})
});

router.post('/publish',function(req, res, next){
	var Uid = req.session.user._id;
	var Mcontent = req.body.Mcontent;
	var Mdatetime = new Date();
	var Mreply = 0;
	var Mcopy = 0;
	var Mhttp = req.session.user.Ualais+'_'+Mdatetime;
	var message = db.get('message');
	var obj={
		"Uid":Uid,
		"Mcontent":Mcontent,
		"Mhttp":Mhttp,
		"Mreply":Mreply,
		"Mcopy":Mcopy,
		"Mdatetime":Mdatetime
	};
	message.insert(obj,function(err,doc){
		if(err){
			res.send({type:"失败",value:null});
		}else{
			obj['Uimages']=req.session.user.Uimages;
			obj['Ualais']=req.session.user.Ualais;
			res.send({type:"成功",value:obj});
		}
	})
	//console.log()；
})


module.exports = router;
