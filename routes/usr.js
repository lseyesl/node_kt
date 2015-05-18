var express = require('express');
var dateFormat = require('dateformat');
var router = express.Router();

/* GET users listing. */
//个人信息
router.get('/', function(req, res, next) {
	//console.log(req.originalUrl,req.params,req.path,req.query);
	Aho(req,res,next);
	//console.log(req);
	//console.log(req.params.id,req.params,req);
	//var id = id;
	//var id=req.originalUrl.split('/')[2];
	//if(id==''||id==undefined){
	var id=req.session.user['_id'];	
    var usr=req.seeion.user;
	//}
	var db_user=db.get('user');
	var db_msg=db.get('message');
	var db_copy=db.get('copy');
	var arr_user=null;
	var arr_message=null;
	db_user.find({'_id':id},function(err,docs){
		console.log(1,id);
		if(err){
			res.send('失败');
		}else{
			if(docs.length<1){
				res.location("home");
				res.redirect("home");
			}
			console.log(2);
			arr_user=docs[0];
			console.log(2222);
			arr_user.Udatetime=dateFormat(docs[0].Udatetime, " mmmm dS, yyyy, h:MM:ss TT");
			console.log('arr_user',arr_user);
			console.log(2222);
			db_msg.find({'Uid':id},function(err,_msg){
				if(err){
					res.send('失败');
				}else{
					console.log(3);					
					arr_message=_msg;
					var Num=0;
					console.log(arr_message.length,'arr_message');
					if(arr_message.length==0){
						console.log(arr_user,arr_message);
						res.render('usr',{title:arr_user.Ualais+'的微薄',usr:usr,arr_user:arr_user,arr_message:arr_message});
					}else{
						console.log(4);
						for(var i=0;i<arr_message.length;i++){
							(function(num){
								var ms=arr_message[num];
								db_copy.find({'Mid':ms['_id']},function(err,copy){
									if(err){
										res.send('失败');
									}else{
										console.log(5,copy.length);
										if(copy.length>0){
											db_msg.find({'_id':copy[0]['CMid']},function(err,doc){
												if(err){
													res.send('失败');
												}else{
													db_user.find({'_id':doc[0]['Uid']},function(err,us){
														if(err){
																res.send('失败');															
														}else{
																arr_message[num]['orgin_msg']={'Ualais':us[0]['Ualais'],'Rcontent':doc[0]['Rcontent']};
																Num++;
																if(Num==arr_message.length){
																	console.log('over2');
																	res.render('usr',{title:arr_user.Ualais+'的微薄',usr:usr,arr_user:arr_user,arr_message:arr_message});
																}
														}
													})
												}
											})
										}else{
											Num++;
											if(Num==arr_message.length){
												console.log('over');
												console.log(arr_user,arr_message);
												res.render('usr',{title:arr_user.Ualais+'的微薄',usr:usr,arr_user:arr_user,arr_message:arr_message});
											}	
										}
									}
								})
							})(i)
						}	
					}
				}
			})
		}
	})
});

//个人信息
router.get('/:id', function(req, res, next) {
	//console.log(req.originalUrl,req.params,req.path,req.query);
	Aho(req,res,next);
	//console.log(req);
	//console.log(req.params.id,req.params,req);
	//var id = id;
	var id=req.originalUrl.split('/')[2];
	var usr=req.seeion.user;
	var db_user=db.get('user');
	var db_msg=db.get('message');
	var db_copy=db.get('copy');
	var arr_user=null;
	var arr_message=null;
	db_user.find({'_id':id},function(err,docs){
		console.log(1,id);
		if(err){
			res.send('失败');
		}else{
			if(docs.length<1){
				res.location("home");
				res.redirect("home");
			}
			console.log(2);
			arr_user=docs[0];
			console.log(2222);
			arr_user.Udatetime=dateFormat(docs[0].Udatetime, " mmmm dS, yyyy, h:MM:ss TT");
			console.log('arr_user',arr_user);
			console.log(2222);
			db_msg.find({'Uid':id},function(err,_msg){
				if(err){
					res.send('失败');
				}else{
					console.log(3);
					arr_message=_msg;
					var Num=0;
					console.log(arr_message.length,'arr_message');
					if(arr_message.length==0){
						console.log(arr_user,arr_message);
						res.render('usr',{title:arr_user.Ualais+'的微薄',usr:usr,arr_user:arr_user,arr_message:arr_message});
					}else{
						console.log(4);
						for(var i=0;i<arr_message.length;i++){
							(function(num){
								var ms=arr_message[num];
								db_copy.find({'Mid':ms['_id']},function(err,copy){
									if(err){
										res.send('失败');
									}else{
										console.log(5,copy.length);
										if(copy.length>0){
											db_msg.find({'_id':copy[0]['CMid']},function(err,doc){
												if(err){
													res.send('失败');
												}else{
													db_user.find({'_id':doc[0]['Uid']},function(err,us){
														if(err){
																res.send('失败');															
														}else{
																arr_message[num]['orgin_msg']={'Ualais':us[0]['Ualais'],'Rcontent':doc[0]['Rcontent']};
																Num++;
																if(Num==arr_message.length){
																	console.log('over2');
																	res.render('usr',{title:arr_user.Ualais+'的微薄',usr:usr,arr_user:arr_user,arr_message:arr_message});
																}
														}
													})
												}
											})
										}else{
											Num++;
											if(Num==arr_message.length){
												console.log('over');
												console.log(arr_user,arr_message);
												res.render('usr',{title:arr_user.Ualais+'的微薄',usr:usr,arr_user:arr_user,arr_message:arr_message});
											}	
										}
									}
								})
							})(i)
						}	
					}
				}
			})
		}
	})
});

module.exports = router;
