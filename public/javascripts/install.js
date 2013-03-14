;
$(function(){
	var $content = $(".content"),
			$step    = $(".step");

	$("#next").click(function(){
		slide(0,1);
		
		/*
		$content.eq(0).slideUp(500,function(){
			$step.removeClass("cur");
			$step.eq(1).addClass("cur");
		});
		*/
		
		//$content.eq(1).slideDown();
	});

	$("#blogconfig").submit(function(){
		ajax($(this),1,2,"/config");
		/*
		$content.eq(1).slideUp(500,function(){
			$step.removeClass("cur");
			$step.eq(2).addClass("cur");
		});
		*/
		//$content.eq(1).slideDown();
		return false
	});

	$("#adminregister").submit(function(){
		ajax($(this),2,3,"/admin");
		/*
		$content.eq(2).slideUp(500,function(){
			$step.removeClass("cur");
			$step.eq(3).addClass("cur");
		});
		*/
		//$content.eq(1).slideDown();
		return false
	});

	$("#complete").click(function(){
		var host = window.location.protocol + '//' + window.location.host;
		window.location.href = host;
		//$content.eq(1).slideDown();
		return false
	});


	function slide(i,j){
		$content.eq(i).slideUp(500,function(){
			$step.removeClass("cur");
			$step.eq(j).addClass("cur");
		});
	}
	
	function ajax(obj,i,j,path){
		$.ajax({
			url:path,//"/config",
			data:obj.serialize(),
			type:"post",
			success:function(data){
				var json = $.parseJSON(data);
				if (json.code == 1) {
					slide(i,j);
					//alert(json.msg);
				}else{
					alert(json.msg);
				};
			}
		})
	}

});