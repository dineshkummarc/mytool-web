window.onload = navigatorHandler;
function navigatorHandler(){
	$.ajax({
	    url: "/website/JSONNavigator",
	    type:"get",
	    dataType:"jsonp",
        jsonp:"callback",
        jsonpCallback: "jsonpCallback",
	    success: function(a,b,c){},
	    error: function(a,b,c){}
	});
}

function jsonpCallback(obj){
	var navs=[];
	$.each(obj,function(k,v){
		var html = '<div class="nav" id="nav'+v.id+'">';
		html +='<h1>'+v.name+'</h1>';
		html +='<ul>';
		$.each(v.pages,function(k1,v1){
			html +='<li>';
			html +='<a href="'+http_url(v1.url)+'" target="_blank">';
			html +='<img src="'+v1.image+'" class="preview"/>';
			html +='</a>';
			html +='<div class="info">';
			if(v1.icon != null){
				html +='<img src="'+v1.icon+'" class="icon"/>';
			}
			html +='<a href="'+http_url(v1.url)+'" target="_blank">';
			html +='<span class="title">'+v1.title+'</span>';
			html +='</a>';
			html +='<br/>';
			html +='<a href="'+http_url(v1.url)+'" target="_blank">';
			html +='<span class="url">'+v1.url+'</span>';
			html +='</a>';
			html +='</div>';
			html +='</li>';
		});
		
		html +='</ul>';
		html +='<div class="c"></div>';
		html +='</div>';
		navs[v.seq-1] = html;
	});
	
	$('.nav').remove();
	$.each(navs,function(k,v){
		$('#navigator').append(v);
	});
	
	click_fade();
}

function getCatalogList(){
	$.ajax({
	    url: "/website/JSONCatalog",
	    data:{},
	    type:"get",
	    dataType:"jsonp",
        jsonp:"callback",
        jsonpCallback: "render_add2_catalog",
	    success: function(a,b,c){},
	    error: function(a,b,c){}
	});	
}

/*=============功能按键====================*/
function function_catalog(){
	navigatorHandler();
}

function function_add(){
	$('#dialogClassroom').dialog('open');
	render_add1();
}
/*=================================*/

function render_add1(url){
	url=(url!=null?url:'');
	var html = '<p>输入URL：<input type="text" name="url" class="i_text" value="http://'+url+'"/></p>';
		html += '<p><input type="button" value="提交" class="i_button" onclick="submit_add1(this)"/></p>';
	$('#navigator_add_1').html(html);
	
	$('#navigator_add_1').show();
	$('#navigator_add_2').hide();
}

function submit_add1(){
	var url = $('#navigator_add_1 input[name="url"]').val();
	$.ajax({
	    url: "/website/JSONWebsite",
	    data:{"url":url},
	    type:"get",
	    dataType:"jsonp",
        jsonp:"callback",
        jsonpCallback: "render_add2",
	    success: function(a,b,c){},
	    error: function(a,b,c){}
	});	
}

function render_add2(obj){
	var html = '<p>网址：'+obj.url+'&nbsp;&nbsp;<img src="'+obj.icon+'" class="icon"/></p>';
		html += '<p id="navigator_add_2_catalog"></p>';
		html +='<p>标题：<input type="text" name="title_2" class="i_text" value="'+obj.title+'"/></p>';
		html +='<p>截图：<br/>';
		html +='<img src="'+obj.image+'" width="480px"/>';
		html +='</p>';
		html +='<hr/><p>';
		html +='<input type="button" value="返回" class="i_button" onclick="click_back()"/>';
		html +='<input type="button" value="提交" class="i_button" onclick="submit_add2()"/>';
		html +='</p>';
	$('#navigator_add_2').html(html);
	getCatalogList();
	$('#navigator_add_1').hide();
	$('#navigator_add_2').show();
}

function render_add2_catalog(obj){
	var	txt= '分类：';
		txt+='<select name="catalog" class="i_select">';
		$.each(obj, function(key, val) {
	    	txt+='<option value="'+val.id+'" >'+val.name+'</option>';
	  	});
		txt+='</select>';
	
	$('#navigator_add_2_catalog').html(txt);
}

function click_back(){
	$('#navigator_add_1').show();
	$('#navigator_add_2').hide();
}

function submit_add2(){
	navigatorHandler();
	$('#dialogClassroom').dialog('close');
}

function click_fade(){
	$('#navigator h1').each(function(idx){
		$(this).toggle(function(){
			$(this).next().fadeOut();
		},function(){
			$(this).next().fadeIn();
		});
	});
}

/*================工具=======================*/
function http_url(url,https){
	var protocol = "http";
	if(https!='undefined' && https=='https'){
		protocol = "https";
	}
	return protocol+"://"+url;
}
/*=====================================*/