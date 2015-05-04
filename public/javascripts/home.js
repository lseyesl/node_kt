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


	$('.js_add_z').on('click',function(){
		var li=$(this).parents('li');
		var id=li.attr('id');
		var cuid=li.attr('Uid');
		$.ajax({
			url:"/home/addz",
			type:"POST",
			data:{"Mid":id,"CUid":cuid},
			dataType:"text",
			success:function(data){
				$.jnotify(data,1500);
				if(data=='成功'){
					li.find('.glyphicon-heart-empty').addClass('glyphicon-heart').removeClass('glyphicon-heart-empty');
					$(this).addClass('js_rm_z').removeClass('js_add_z');
				}
			}
		})
		return false;
	})

	$('.js_rm_z').on('click',function(){
		var li=$(this).parents('li');
		var id=li.attr('id');
		var cuid=li.attr('Uid');
		$.ajax({
			url:"/home/rmz",
			type:"POST",
			data:{"Mid":id,"CUid":cuid},
			dataType:"text",
			success:function(data){
				$.jnotify(data,1500);
				if(data=='成功'){
					li.find('.glyphicon-heart').removeClass('glyphicon-heart').addClass('glyphicon-heart-empty');
					$(this).removeClass('js_rm_z').addClass('js_add_z');
				}
			}
		})
		return false;
	})

	$('.js_reply_opt').on('click',function(){
		var that=$(this);
		var li=that.parents('li');
		var reply=li.find('.reply');
		if(reply.css('display')=='none'){
			reply.show();
			$.ajax({
				url:'/home/get_reply',
				data:{'Mid':li.attr('id')},
				dataType:'json',
				type:'POST',
				success:function(data){
					var dat=data.data;
					var html='';
					for(var i in dat){
						html+='<li><em class="blue">'+dat[i]["Ualais"]+':</em>'+dat[i]["Rcontent"]+'</li>';
					}
					li.find('ul').append(html);
				}
			})
		}else{
			reply.hide();
		}
		return false;
	})

	$('.js_reply').on('click',function(){
		var that=$(this);
		var li = that.parents('li');
		var Mid=li.attr('id');
		var msgtxt=li.find('.js_reply_txt').val();
		//console.log(msgId,muid,msgtxt);
		$.ajax({
			url:'/home/reply',
			type:'POST',
			dataType:'text',
			data:{'Mid':Mid,'msgtxt':msgtxt},
			success:function(data){
				if(data=='成功'){
					$.jnotify('成功',1500);
					li.find('.js_reply_txt').val('');
				}else{
					$.jnotify('失败',1500);
				}
			}
		})
	})
	$('.js_copy').on('click',function(){
		var li=$(this).parents('li');
		var TxT='';
		var TxT2='';
		if(li.find('.js_copy_txt2').length>0){
			TxT=li.find('.js_copy_txt2').text();
			TxT2=li.find('.js_copy_txt').text();
		}else{
			TxT=li.find('.js_copy_txt').text();
		}
		
		var html='<div class="js_copy_cont"><p>'+TxT+'</p><textarea>'+TxT2+'</textarea></div>';
		dialog({
				title: "转发",
				content:html,
				button: [
					{
						value: '转发',
						callback: function () {
							$.ajax({
								url:'/home/copy',
								type:'POST',
								dataType:'text',
								data:{'Mcontent':$('.js_copy_cont textarea').val(),'CMid':li.attr('id')},
								success:function(data){
									$.jnotify(data,1500);
								}
							})
							this.close();
							
							//$('.js_data2').html(this.content());
						}
					},
					{
						value: '取消',
						callback: function () {
							this.close();
							//$.jnotify('失败',1500);
							//$('.js_data2').html(this.content());
						}
					}
				]
			}).show();
			return false;
	})
	

})
