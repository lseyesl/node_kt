var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	if(req.session.user!=null||req.session.user){
		res.redirect('home');
		console.log('home');
	}else{
		res.redirect('login');
		console.log('login');
	}
  
});


router.get('/logout',function(req, res, next){
	req.session.user=null;
	//res.location('login');
	res.redirect("/");
})



module.exports = router;
