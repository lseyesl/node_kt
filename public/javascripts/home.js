$(function(){
	$('.js_publish').on('click',function(){
		var $btn = $(this).button('loading');
		var $form=$btn.parent();
		$.ajax({
			url:"/home/publish",
			type:"POST",
			data:"Mcontent="+$form.find("textarea").val(),
			dataType:"json",
			success:function(data){
				console.log(data)
				if(data.type=="成功"){
					$btn.button('reset');
					$form[0].reset();
					$.jnotify("发表成功！",1500);
					var $ctxt=$('.listCtxt');
					var html= '<li Uid="'+data.value.Uid+'">'+
											'<img src="img/'+data.value.Uimages+'" alt="头像" class="pull-left listUimg">'+
											'<div class="detailCtxt pl60">'+
												'<h3>'+data.value.Ualais+'</h3>'+
												'<p>'+data.value.Mcontent+'</p>'+
												'<div class="date-publish">'+data.value.Mdatetime+'</div>'+
											'</div>'+
										'</li>';
					$ctxt.prepend(html);
				}else{
					$btn.button('reset');
					$.jnotify("发表失败！请重试",1500);
				}
			}
		})
	})




})
