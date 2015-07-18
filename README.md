date_format_js
==============




##日 
----
+  d  月份中的第几天，有前导零的 2 位数字 01 到 31  
+  D  星期中的第几天，文本表示，3 个字母 Mon 到 Sun  
+  j  月份中的第几天，没有前导零 1 到 31  
+  w  星期中的第几天，数字表示 0（表示星期天）到 6（表示星期六）
+  z  年份中的第几天 0 到 365  

##月
----
+  F  月份，完整的文本格式，例如 January 或者 March January 到 December  $c是是中文
+  m  数字表示的月份，有前导零 01 到 12
+  n  数字表示的月份，没有前导零 1 到 12  
+  t  给定月份所应有的天数 28 到 31  

##年
----
+  L  是否为闰年 如果是闰年为 1，否则为 0
+  Y  4 位数字完整表示的年份 例如：1999 或 2003  
+  y  2 位数字表示的年份 例如：99 或 03  

##时间
------
+  g  小时，12 小时格式，没有前导零 1 到 12  
+  G  小时，24 小时格式，没有前导零 0 到 23  
+  h  小时，12 小时格式，有前导零 01 到 12  
+  H  小时，24 小时格式，有前导零 00 到 23  
+  i  有前导零的分钟数 00 到 59
+  s  秒数，有前导零 00 到 59

##其他
------
+  $e   英文
+  $c   中文

----

ltpl
==============
## 新鲜出炉的模板引擎
------
###例子
 	function callback(){console.log('end!')}
	ltpl(html).renderDom({name:'tsotsi',info:'<h1>phper</	h1>',msg:{a:1,b:'<h3>sb</h3>'}},callback)
	var html='<div>{{d.name}}</div>';     
	html : 	<div>tsotsi</div>
####支持管道
	var html='<div>{{d.name| entityencode}}</div>';     	html : &lt;div&gt;tsotsi&lt;/div&gt;
####支持循环
	var html='<div>{{for d.msg as k v}}<h1>{{k}}:{{v}}</h1>{{/for}}';
	html :<div><h1>a:1</h1><h1>b:<h3>sb</h3></h1></div>;</code>
------
####支持自定义helper函数
	ltpl.helper('myhelper',function(v){return 'hello '+v;});
	ltpl(html).renderDom({name:'tsotsi',info:'<h1>phper</h1>',msg:{a:1,b:'<h3>sb</h3>'}});
	var html='<div>{{d.name| myhelper}}</div>';  
	html : <div>hello tsotsi</div>
------
####支持重定义开闭标签
	ltpl.config({openTag:'<%',closeTag:'%>'});
	ltpl(html).renderDom({name:'tsotsi',info:'<h1>phper</h1>',msg:{a:1,b:'<h3>sb</h3>'}})
	var html='<div><%d.name%></div>';    
	html : <div>tsotsi</div>


>made by [Tsotsi](http://mail.tsotsi.cn)
>
>My Site Is www.maimayun.com
