/*
  Copyright (c) 2006, Tim Becker All rights reserved.
  
  Redistribution and use in source and binary forms, with or without
  modification, are permitted provided that the following conditions are
  met:
  
      * Redistributions of source code must retain the above copyright
        notice, this list of conditions and the following disclaimer.
      * Redistributions in binary form must reproduce the above copyright
        notice, this list of conditions and the following disclaimer in
        the documentation and/or other materials provided with the
        distribution.
  
  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS
  IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED
  TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A
  PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER
  OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
  PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
  PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
  SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/




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
