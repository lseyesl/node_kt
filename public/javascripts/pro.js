$(function(){
	//个人信息修改&&修改密码
	$('.js_save').on('click',function(){
		var $btn = $(this).button('loading');
		var $form=$btn.parents('form');
		/*
		var params={
			"Ualais":$('[name=Ualais]').val(),
			"Ulogn":$('[name=Ulogn]').val(),
			"Usex":$('[name=Usex]').val(),
			"Uinfo":$('[name=Uinfo]').val()	
		}
		*/
		$.ajax({
			url:$form.attr('action'),
			type:"POST",
			data:$form.serialize(),
			dataType:"text",
			success:function(data){
				if(data=="成功"){
					$btn.button('reset');
					$.jnotify("保存成功",1500);
				}else{
					$btn.button('reset');
					$.jnotify(data,1500);
				}
			}
		})
		return false;
	})
	//上传头像
	$('.js_save2').on('click',function(){
		var $btn=$(this).button('loading');
		var $form=$btn.parents('form');
		$form.find('input[type=file]').fileupload({
			url: $form.attr('action'),
			dataType: 'json',
			done: function (e, data) {
			    console.log(data.result,data.result.txt);
			    $btn.button('reset');
			    $.jnotify(data.result.txt,1500);
			    console.log(data.result.txt=="成功",data.result.U_url);
			    if(data.result.txt=="成功"){
				$('#Uimg').attr('src',data.result.U_url);
          		    }
			}
		    }).trigger('change');
	})

	//nav js
	$('.js_tit li').on('click',function(){
		var $that=$(this);
		var $content=$('.js_content');
		var index =$that.index();
		$that.addClass('active').siblings().removeClass('active');
		$content.find('li:eq('+index+')').show().siblings().hide();
	})
/*
	$('.js_img').fileupload({
		url:'/pro/editUpic',
		dataType:'json',
		done:function(){
			alert('wa');
		}
	})

*/

})
