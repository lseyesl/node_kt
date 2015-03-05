$(function(){
	$(document).on('click','.js_ad_att',function(){
		console.log(1);
		var $that=$(this);
		console.log($that.attr('url'));
		$.ajax({
			url:$that.attr('url'),
			type:"POST",
			data:"attUid="+$that.attr('uid'),
			dataType:'text',
			success:function(data){
				if(data=="成功"){
					$that.replaceWith($('<a class="js_rm_att" url="/userlist/removeAtt" uid="'+$that.attr('uid')+'">取消关注</a>'))					
				}else{
					$.jnotify("添加失败！请重试",1500);
				}
			}
		})
	})

	$(document).on('click','.js_rm_att',function(){
		var $that=$(this);
		$.ajax({
			url:$that.attr('url'),
			type:"POST",
			data:"attUid="+$that.attr('uid'),
			dataType:'text',
			success:function(data){
				if(data=="成功"){
					$that.replaceWith($('<a class="js_ad_att" url="/userlist/addAtt" uid="'+$that.attr('uid')+'">加关注</a>'))
				}else{
					$.jnotify("取消失败！请重试",1500);
				}
			}
		})		
	})
})
