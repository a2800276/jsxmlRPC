
function dumpProperties (obj) {
	var result = ""
	print(obj)
	for (var p in obj){
		print(""+p+" = "+obj[p]+"")
	}			
//	print ("<dl>")
//	for (var p in obj){
//		print("<dt>"+p+"</dt><dd><pre>"+obj[p]+"</pre></dd>")
//	}			
//	print ("<dl>")
}

function print (obj) {
	document.writeln(obj+"<br>")
	
}
function write (obj) {
	document.writeln(obj);
}
function toggle(elId) {
	var e = document.getElementById(elId);
	if (e.style.display == "block") 
		e.style.display = "none";
	else 
		e.style.display = "block";
	return false;
}



function debugInfo () {
	print ("Browser Infos (<a href=\"#\" onclick=\"toggle(\'debugInfo\')\">+</a>)")
	print("<small><div id=\"debugInfo\" style=\"display:none\" class=\"source\">")
	dumpProperties (navigator)
	print("")
	print("</div></small>")
	
	
}

function escapeHTML (str) {
	str= str.replace(/</g, "&lt;")
	str= str.replace(/>/g, "&gt;")
	str= str.replace(/&/g, "&amp;")
	return str
}

function runTests (testArr) {
	write ("<h1>"+document.title+"</h1>")
	numFailed = 0
	numException = 0
	for (var i=0; i!=testArr.length; ++i) {
		var result
		try {
			result = testArr[i]()
			if (!result) ++numFailed
		}catch (e) {
			print("<hr><h3>Exception executing: "+i+"</h3>")
			dumpProperties (e)
			
			++numException
			++numFailed
		}
		//print("<hr>")
		print ("Test #"+i+" passed: "+result+"")
		write ("<small>Show test(<a href=\"#\" onclick=\"toggle(\'test"+i+"\')\">+</small></a>) <div id=\"test"+i+"\" style=\"display:none\" class=\"source\"><pre>")
		write (""+escapeHTML(testArr[i].toString())+"")
		print("</pre></div>")
		
	}
	write("<hr>")
	print ("numFailed ="+numFailed+" with Exception: "+numException)
	if (parent.frames.menu) {
		try {
			parent.frames.menu.addResult (document.title, testArr.length, numFailed, numException, this.location)	
		} catch (e) {
			alert(e)	
		}
	}

	debugInfo()
}
