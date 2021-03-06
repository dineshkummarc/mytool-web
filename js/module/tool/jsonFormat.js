window.onload = jsonHandler();
$('#jsonFormat').hide();

$("#click_json").toggle(function(){
	$('#jsonFormat').fadeIn();
},function(){
	$('#jsonFormat').fadeOut();
});

function jsonHandler(){
	var url = "http://p.tianji.com/profile/jsonp/getContactCardByUserId/26978509?L=zh_CN&_=1324363354371";
	var json = '[{"distance": "k121m","distance2": {"km":"anb","km2":"anb"},"pressure": "mb", "speed": "km/h", "temperature": "C"},{"distance": "k121m"}]';
	var html = '<input type="text" name="urljson" class="w500" value="'+url+'"/>'; 
		html+= '<input type="button" value="JSONP" onclick="json_http()" />';
		html+= '<textarea class="rawjson">'+json+'</textarea>';
		html+= '<input type="button" value="格式化" onclick="json_format()"/>';
		html+= '<div class="canvas"></div>'
	$('#jsonFormat').html(html);
}

function json_http(){
	var url = $('#jsonFormat input[name=urljson]').val();
	$.ajax({
	    url: url,
	    type:"get",
	    dataType:"jsonp",
        jsonp:"callback",
        jsonpCallback: "jsonp_http_callback",
	    success: function(a,b,c){},
	    error: function(a,b,c){}
	});
}

function jsonp_http_callback(obj){
	var html = json_obj_string(obj);
	$('#jsonFormat .rawjson').val(html);
}

function json_format(){
	var json = $('#jsonFormat .rawjson').val();
	try{
		if(json == "") json = "\"\"";
 		var obj = eval("("+json+")");
 		var html = json_obj(obj);
 		$("#jsonFormat .canvas").html(html);
 	}catch(e){
 		alert("JSON is not well formated:\n"+e.message);
 		$("#jsonFormat .canvas").html("");
 	} 
}

//纯转换
function json_obj_string(obj){
	var txt = json2String(obj);
	var comma = txt.lastIndexOf(',');
 	return txt.substring(0,comma)+txt.substring(comma+1);
}

function json2String(obj){
	var type = json_type(obj);
	var output=style_bracket_start(type);
	$.each(obj,function(k,v){
		if(typeof(v) == 'object' && v!=null){
			output += ((type!='array')?'\"'+k+'\":':'')+json2String(v);
		} else {
			output += ((type!='array')?'\"'+k+'\":':'')+((typeof(v)=='string')?'\"'+v+'\"':v)+",";
		}
 	});
 	
 	var comma = output.lastIndexOf(',');
 	output = output.substring(0,comma)+output.substring(comma+1);
 	output += style_bracket_end(type)+",";
 	return output;
}

//增加标签
function json_obj(obj){
	var txt = json_loop(obj,1);
	var comma = txt.lastIndexOf(',');
 	return txt.substring(0,comma)+txt.substring(comma+1);
}

function json_loop(obj,idx){
	var type = json_type(obj);
	var output=style_bracket_start(type)+"<br/>";
	$.each(obj,function(k,v){
		if(typeof(v) == 'object' && v!=null){
			output += json_deep(idx) + ((type!='array')?(style_prop(k)+":"):"");
			output += json_loop(v,++idx);
			--idx;
		} else {
			output += json_deep(idx) + ((type!='array')?(style_prop(k)+":"):"");
			output += style_val(v)+",<br/>";
		}
 	});
 	
 	var comma = output.lastIndexOf(',');
 	output = output.substring(0,comma)+output.substring(comma+1);
 	output += json_deep(idx-1)+style_bracket_end(type)+",<br/>";
 	return output;
}

function json_deep(idx){
	var space = "";
	for(var i=0;i<idx;i++){
		space += "&nbsp;&nbsp;&nbsp;&nbsp;";
	}
	return space;
}

function json_type(obj){
	var type="object";
	if(obj instanceof Array){
		type="array";
	} else if(obj instanceof Object){
		type="object";
	}
	return type;
}

function style_bracket_start(type){
	var val="";
	if(type == 'array'){
		val = '[';
	} else if(type == 'object'){
		val = '{';
	}
	return val;
}

function style_bracket_end(type){
	var val="";
	if(type == 'array'){
		val = ']';
	} else if(type == 'object'){
		val = '}';
	}
	return val;
}



function style_prop(k){
	return '<span class="prop">\"'+k+'\"</span>';
}

function style_val(v){
	var val= "";
	if(typeof(v) == 'string'){
		val='<span class="str">\"'+HTMLEnCode(v)+'\"</span>';
	} else if (typeof(v) == 'number'){
		val='<span class="num">'+v+'</span>';
	} else if (typeof(v) == 'boolean'){
		val='<span class="bool">'+v+'</span>';
	} 
	
	if (v == null){
		val='<span class="null">null</span>';
	}
	return val;
}

function HTMLEnCode(str){   
      var s ="";   
      if(str.length == 0) return "";   
      s=str.replace(/&/g,"&gt;");   
      s=s.replace(/</g,"&lt;");   
      s=s.replace(/>/g,"&gt;");   
      s=s.replace(/ /g,"&nbsp;");   
      s=s.replace(/\'/g,"'");   
      s=s.replace(/\"/g,"&quot;");   
      //s=s.replace(/\n/g,"&lt;br&nbsp;/&gt;");   
      return    s;   
}   
function HTMLDeCode(str){   
      var s="";   
      if(str.length == 0) return "";   
      s=str.replace(/&gt;/g,"&");   
      s=s.replace(/&lt;/g,"<");   
      s=s.replace(/&gt;/g,">");   
      s=s.replace(/&nbsp;/g," ");   
      s=s.replace(/'/g,"\'");   
      s=s.replace(/&quot;/g,"\"");   
      s=s.replace(/<br>/g,"\n");   
      return s;   
}   
