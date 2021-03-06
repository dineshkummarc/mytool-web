function click_menu(obj){
	var tmp = $(obj);
	var o = {"id":tmp.attr('mid'), "name":tmp.attr('title')}
	g['tag'] = o;
	render_tags(g['tag']);
}

function click_btn(obj){
	var tmp = $(obj);
	switch(tmp.attr('action')){
	case 'add_website':
		render_add1();
		break;
	case 'add_catalog':
		render_add3();
		break;
	}
}

function click_word(q){
	var url = "http://www.google.com/dictionary/json?q="+q+"&sl=en&tl=zh-cn&client=suggest";
	$.ajax({
	    url: url,
	    type:"get",
	    dataType:"jsonp",
        jsonp:"callback",
        jsonpCallback: "render_mean"
	});
}

function click_dict_add(tag){
	$('#form_dict_'+tag).show();
}

function click_dict_cancel(tag){
	$('#form_dict_'+tag).hide();
}

function submit_dict_add(tag){
	var form = {};
	$('#form_dict_'+tag+' :input').each(function(k,v){
	 	form[v.name]=v.value;
	});
	$.ajax({
	    url: "/dict/addTagWord",
	    type:"post",
	    data:form,
	    success: function(a,b,c){
	    	render_tags(g['tag']);
	    },
	    error: function(a,b,c){
	    	alert('服务器出錯了。');
	    }
	});
}

function submit_dict_del(tag){
	var form = {};
	$('#form_dict_'+tag+' :input').each(function(k,v){
	 	form[v.name]=v.value;
	});
	$.ajax({
	    url: "/dict/delTagWord",
	    type:"post",
	    data:form,
	    success: function(a,b,c){
	    	render_tags(g['tag']);
	    },
	    error: function(a,b,c){
	    	alert('服务器出錯了。');
	    }
	});
}
