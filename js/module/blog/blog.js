//初始化对话框
window.onload=blogHandler;
function blogHandler(){
	$("#blog_dialog").hide();
	$.ajax({
	    url: "/blog/JSONBlogs",
	    type:"get",
	    dataType:"jsonp",
        jsonp:"callback",
        jsonpCallback: "function_blog_feed",
	    success: function(a,b,c){},
	    error: function(a,b,c){}
	});
}

function function_blog_add(){
	var html ='<form id="blog_form">';
	html += '<div id="blog_title"></div>';
	html += '<div id="blog_content"></div>';
	html += '<span id="blog_submit"></span>';
	html += '<span id="blog_cancel"></span>';
	html += '</form>';
	$('#blog_form').html(html);
	render_blog_form();
	$('#blog_dialog').fadeIn();
}

function function_blog_edit(id){
	var url = '/blog/JSONBlog/'+id;
	$.getJSON(url,function(data){
		var html ='<form id="blog_form">';
		html += '<div id="blog_title" value="'+data.title+'"></div>';
		html += '<div id="blog_content">'+data.content+'</div>';
		html += '<span id="blog_submit"></span>';
		html += '<span id="blog_cancel"></span>';
		html += '<input type="hidden" name="blog_id" value="'+id+'"/>';
		html += '</form>';
		$('#blog_form').html(html);
		render_blog_form();
		$('#blog_dialog').fadeIn();
		
		$("html,body").animate({scrollTop: $("#blog_form").offset().top}, 1000);
	});
}


function click_blog_close(){
	$('#blog_dialog').fadeOut();
}

var g={editor:[]};
function global_invoke(){//提交表单之前的检查
	g['editor'][0].sync();
}

function render_blog_form(){
	var form = {
		input:[{id:"blog_title",label:"标题",css:"w500 h20",layout:{row:2}}],
		editor:[{id:"blog_content",label:"内容",layout:{row:2}}],
		button:[{id:"blog_submit",label:"提交",css:"w80",onclick:"blog_submit()"},
				{id:"blog_cancel",label:"取消",css:"w80",onclick:"click_blog_close()"}]
	}
	render_form(form,g);
}

function blog_submit(){
	global_invoke();//提交表单之前的检查
	var form = {};
	$('#blog_form :input').each(function(k,v){
	 	form[v.name]=v.value;
	});
	$.ajax({
	    url: "/blog/addBlog",
	    type:"post",
	    data:form,
	    success: function(a,b,c){
	    	blogHandler();
			$('#blog_dialog').fadeOut();
	    },
	    error: function(a,b,c){
	    	alert(a);
	    }
	});
}

function submit_delete(id){
	if(confirm("确认删除?")){
		$.ajax({
		    url: "/blog/postDel",
		    data:{id:id},
		    type:"post",
		    success: function(a,b,c){
		    	blogHandler();
		    },
		    error: function(a,b,c){
		    	alert(a);
		    }
		});
	}
}

function function_blog_feed(obj){
	var html = '<div id="feed">';
	$.each(obj,function(k,v){
		html +='<div id="feed_'+v.id+'" class="view">';
		html +='<div class="feed-title">'+v.title+'</div>';
		html +='<div class="feed-title2">'+v.create_time+'</div>';
		html +='<div class="feed-content">'+v.content+'</div>';
		html +='<div class="feed-act">';
		html +='<a href="javascript:void(0);" onclick="click_blog_show('+v.id+')">阅读全文</a>&nbsp;&nbsp;';
		html +='<a href="javascript:void(0);" onclick="function_blog_edit('+v.id+')">编辑</a>&nbsp;&nbsp;';
		html +='<a href="javascript:void(0);" onclick="submit_delete('+v.id+')">删除</a>&nbsp;&nbsp;';
		html +='<a href="javascript:void(0);" onclick="">回复</a>&nbsp;&nbsp;';
		html +='<a href="javascript:void(0);" onclick="">评论</a>&nbsp;&nbsp;';
		html +='</div>';
		html +='</div>';
	});
	html += '</div>';
	$('#desktop').html(html);
	
	$('#feed .feed-content').each(function(){
		if($(this).height()>400){
			$(this).addClass('feed-small');
		}
	});
}

function click_blog_show(id){
	$('#feed_'+id+' .feed-content').removeClass('feed-small');
}

