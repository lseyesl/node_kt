var express = require('express');
var async = require('async');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	return;
	var db_msg=db.get('message');	
	var CMid='5509353c8e60223c1afa91f3';
	var Mcopy=0;
	Mcopy++;
	db_msg.update({'_id':CMid},{$set:{'Mcopy':Mcopy}},function(err,rels){
		console.log(err,rels);
		if(err){
			res.send('失败');
		}else{
			res.send('成功');
		}

	})

})
module.exports = router;
