var express = require('express');
var async = require('async');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	Aho(req,res,next);
	var user=req.session.user;
	var wb_list=null;
	var db_msg=db.get('message');
	var db_attention=db.get('attention');
	var db_like=db.get('like');
	var db_reply=db.get('reply');
	var db_user=db.get('user');
	var db_copy=db.get('copy');
	var wb_atten=null;
	//var wb_tmp=null;
	//获取所有消息
	//获取自己的所有消息
	db_msg.find({"Uid":req.session.user['_id']},function(err,docs){
		if(err){
			res.send("读取失败，请稍后再试");
		}else{			
			for(var i=0;i<docs.length;i++){
				docs[i]['Uimages']=req.session.user.Uimages;
				docs[i]['Ualais']=req.session.user.Ualais;
			}
			console.log('本人的消息',docs);
			wb_list=docs;
			//console.log(wb_tmp);
			//关注表获取内容
			//获取自己关注过的人的信息
			db_attention.find({"Uid":req.session.user['_id']},function(err,docs){
				if(err){
					res.send("读取失败，请稍后再试");
				}else{
					console.log('本人的关注',docs);
					wb_atten=docs;
					var aNum=0;
					var bNum=0;
					function a(){
						console.log('a',wb_atten);
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
										//console.log(local_att['attUid']);
										db_user.find({'_id':local_att['attUid']},function(err,us){
											if(err){
												res.send("读取失败，请稍后再试");
											}else{
												//console.log(us[0].Ualais);
												for(var i=0;i<meg.length;i++){
													meg[i]['Uimages']=us[0].Uimages;
													meg[i]['Ualais']=us[0].Ualais;
												}
												//console.log("加工的消息",meg);
												wb_list=wb_list.concat(meg);
												//console.log('_____',wb_list);	
												aNum++;
												console.log(aNum,wb_atten.length);
												if(aNum==wb_atten.length){
													b();
												}
											}
										})
									}
								})
							})(att);
						}
					}
					function b(){
						console.log('b',wb_list,wb_list.length);
						var NUM=wb_list.length;
						wb_list.sort(function(a,b){
							if(a.Mdatetime>=b.Mdatetime){
								return -1;
							}else{
								return 1;
							}
						})
						//console.log('b2',wb_list,wb_list.length);
						for(var i =0;i<wb_list.length;i++){
							(function(num_i){
									var msg=wb_list[num_i];
									msg['isLike']=false;
									msg['orgin_msg']=null;
									var Mid=msg['_id'].toString();
									var query={"Mid":Mid,"CUid":msg['Uid'],"Uid":user['_id']};
									console.log(msg,query,'\n');
									db_like.find(query,function(err,docs){
										//console.log('like',docs);
										if(err){
											res.send("读取失败，请稍后再试");
										}
										console.log(docs);
										if(docs.length>0){
											wb_list[num_i]['isLike']=true;
											console.log('就是这个')
										}
										
										db_copy.find({'Mid':Mid},function(err,_msg){
											console.log('Mid',Mid);
											if(err){
												res.send("读取失败，请稍后再试");
											}else{
												if(_msg.length){
													var CMid=_msg[0]['CMid'];
													console.log('CMid',CMid);
													db_msg.find({'_id':CMid},function(err,_org_msg){
														if(err){
															res.send("读取失败，请稍后再试");
														}else{
															var _txt=_org_msg[0]['Rcontent'];
															var _org_id=_org_msg[0]['Uid'];
															db_user.find({'_id':_org_id},function(err,_org_Ualais){
																if(err){
																	res.send("读取失败，请稍后再试");
																}else{
																	var Uname=_org_Ualais[0]['Ualais'];
																	msg['orgin_msg']={'Ualais':Uname,'Rcontent':_txt};
																}
																bNum++;
																//console.log(bNum);
																if(bNum==NUM){
																	c();
																}
															})
														}
													})
												}else{
													bNum++;
													//console.log(bNum);
													if(bNum==NUM){
														c();
													}
												}	
											}
										})
										/*
										console.log(msg['_id'],'消息id');
										db_reply.find({'Mid':msg['_id']},function(err,docs){
											console.log(docs,'消息评论');
											if(err){
												res.send("读取失败，请稍后再试");
											}
											wb_list[num_i]['reply']=docs;
											bNum++;
											//console.log(bNum);
											if(bNum==NUM){
												c();
											}
										})*/
									})
							})(i)
							
						}
					}
					function c(){
						console.log('end',wb_list);
						res.render('home', { title: '主页' ,user:user,wblist:wb_list});
					}
					if(wb_atten.length){
						console.log('functiion A');
						a();
					}else{
						if(wb_list.length){
							console.log('functiion B');
							b();
						}else{
							console.log('functiion C');
							c();
						}
						
					}
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
	var Mlike =0;
	var Mhttp = req.session.user.Ualais+'_'+Mdatetime;
	var message = db.get('message');
	var obj={
		"Uid":Uid,
		"Mcontent":Mcontent,
		"Mhttp":Mhttp,
		"Mreply":Mreply,
		"Mcopy":Mcopy,
		"Mlike":Mlike,
		"Mdatetime":Mdatetime
	};
	//把发布的信息存到消息表中
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
//点赞
router.post('/addz',function(req, res, next){
	var Mid=req.body.Mid;
	var CUid=req.body.CUid;
	var Uid=req.session.user._id;
	var db_Like=db.get('like');
	var db_msg=db.get('message');
	//把点赞的消息存到表中，再消息表更新
	db_Like.insert({"Uid":Uid,"Mid":Mid,"CUid":CUid},function(err,docs){
		if(err){
			res.send('失败');	
		}
		db_msg.find({"_id":Mid},function(err,docs){
			if(err){
				res.send('失败');
			}
				console.log(docs);
				var Mlike=parseInt(docs[0]['Mlike']);
				Mlike++;
				db_msg.update({"_id":Mid},{$set:{"Mlike":Mlike}},function(){
					if(err){
						res.send('失败');
					}
					res.send('成功');
				})
				
		})
	
	})
})
//取消赞
router.post('/rmz',function(req, res, next){
	var Mid=req.body.Mid;
	var CUid=req.body.CUid;
	var Uid=req.session.user._id;
	var db_Like=db.get('like');
	var db_msg=db.get('message');
	db_Like.remove({"Uid":Uid,"Mid":Mid,"CUid":CUid},function(err,docs){
		if(err){
			res.send('失败');	
		}
		db_msg.find({"_id":Mid},function(err,docs){
			if(err){
				res.send('失败');
			}
				console.log(docs);
				var Mlike=parseInt(docs[0]['Mlike']);
				Mlike--;
				db_msg.update({"_id":Mid},{$set:{"Mlike":Mlike}},function(){
					if(err){
						res.send('失败');
					}
					res.send('成功');
				})
				
		})
	
	})
})
//评论
router.post('/reply',function(req, res, next){
	var Uid=req.session.user._id;
	var Mid=req.body.Mid;
	var Rcontent=req.body.msgtxt;
	var db_reply=db.get('reply');
	var db_msg=db.get('message');
	var data=new Date();
	var query={'Mid':Mid,'Uid':Uid,'Rcontent':Rcontent,'Rdatetime':data};
	db_reply.insert(query,function(err,docs){
		if(err){
			res.send('失败');
		}else{
			db_msg.find({'_id':Mid},function(err,docs){
				console.log(docs);
				if(err){
					res.send('失败');
				}else{
					var Mreply=docs[0]['Mreply'];
					db_msg.update({'_id':Mid},{$set:{'Mreply':Mreply++}},function(err,docs){
						console.log(docs);
						if(err){
							res.send('失败');
						}else{
							res.send('成功');
						}	
					})
				}
			})			
		}
	});
})
//获取评论
router.post('/get_reply',function(req, res ,next){
	var Mid=req.body.Mid;
	var db_reply=db.get('reply');
	var db_user=db.get('user');
	db_reply.find({'Mid':Mid},function(err,docs){
		if(err){
			res.send({relt:'falie',data:null});
		}else{
			var N=0
			for(var i in docs){
				var uid=docs[i]['Uid'];
				(function(uid,i){
					db_user.find({'_id':uid},function(err,doc){
						if(err){
							res.send({relt:'falie',data:null});
						}else{
							docs[i]['Ualais']=doc[0]['Ualais'];
						}
						N++;
					})

				})(uid,i);
				
			}
			setTimeout(act,100);
			function act(){
				if(N==docs.length){
						res.send({relt:'succ',data:docs});	
				}else{
					setTimeout(act,100);
				}
			}
			
		}
	})
})
//转发
router.post('/copy',function(req, res, next){
	var db_copy=db.get('copy');
	var db_msg=db.get('message');	
	var Mid=null;
	var CMid=null;
	var CUid=null;
	console.log('copy',1);
	var Uid = req.session.user._id
	var Mcontent = req.body.Mcontent;
	var CMid = req.body.CMid;

	var Mdatetime = new Date();
	var Mreply = 0;
	var Mcopy = 0;
	var Mlike =0;
	var Mhttp = req.session.user.Ualais+'_'+Mdatetime;
	var message = db.get('message');
	var obj={
		"Uid":Uid,
		"Mcontent":Mcontent,
		"Mhttp":Mhttp,
		"Mreply":Mreply,
		"Mcopy":Mcopy,
		"Mlike":Mlike,
		"Mdatetime":Mdatetime
	};
	console.log('copy',2);
	db_msg.insert(obj,function(err,docs){
		if(err){
			res.send('失败');
		}else{
			console.log(docs);
			Mid=docs['_id'].valueOf().toString();
			var query={
				'Mid':Mid,
				'CMid':CMid
			}
			console.log('copy',3);
			db_copy.insert(query,function(err,doc){
				if(err){
					res.send('失败');
				}else{
					db_msg.find({'_id':CMid},function(err,docs_msg){
						if(err){
							res.send('失败');
						}else{
							console.log('copy',4);
							var Mcopy=docs_msg[0]['Mcopy'];
							Mcopy++;
							console.log(Mcopy,CMid);
							db_msg.update({'_id':CMid},{$set:{'Mcopy':Mcopy}},function(err,rels){
								console.log(err,rels);
								if(err){
									res.send('失败');
								}else{
									res.send('成功');
								}
			
							})
						}
					})
				}
			})
		}
	})
	
	
})

module.exports = router;
