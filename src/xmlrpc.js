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




function getHandler (rpc, lambda) {
	if (lambda == null) return null
	return function (request) {
		lambda(rpc.handleAnswer(request.responseXML))	
	}	
}

function XmlRpc (url) {
	this.url=url
	

	this.addArgument=function(arg) {	
		return makeTag ("param", makeTag("value",encodeXmlRpc(arg)))
	}

	this.onerror = null;
	
	this.handleFault=function(fault) {
		value = getNamedChild(fault, "value")
		struct = getNamedChild(value, "struct")
		throw getStruct(struct) // todo make string with attr.
		 
		
	}
	
	this.handleAnswer=function(xml) {
		if (xml == null) throw "ERROR: no xml returned"
		var node = xml.getElementsByTagName("fault")
		if (node.length!=0){this.handleFault(node[0])}
	
		var nodeList = xml.getElementsByTagName("param")
		var valueArr = []
		func = function (node){
			visitChildren(
				node,
				function (y){if (y.nodeName=="value") valueArr.push(y)},
				Node.ELEMENT_NODE
			)		
		}
		eachInNodeList (nodeList,
				func,
				Node.ELEMENT_NODE
				);
		var result = []

		eachInNodeList (valueArr,
				function (a) {
					result.push(getResultFromValueNode(a))
				},
				Node.ELEMENT_NODE
				)
		return result.length==1 ? result[0] : result

		
	}


	this.call=function () {
		if (arguments.length == 0)
			return null; // at least the method name needs to be provided
			
		var request = '<?xml version="1.0"?>'
		request += "<methodCall>" 
		request += makeTag("methodName", arguments[0])
		var params=""
		var callback = null	
		for (var i=1; i!=arguments.length; ++i){

			if (isA(arguments[i],Function)) {
				callback = arguments[i]
				break
			}
			params+=this.addArgument (arguments[i])	
		}
		if (params != "")
			request += makeTag("params", params)
		request += "</methodCall>"

		var req = new Request(this.url, request, getHandler(this, callback))
		if (callback && this.onerror) {
			req.onnetworkerror = this.onerror
		}

		req.process()
		
		if (callback==null) {
			return this.handleAnswer(req.responseXML)
		}
		
		
		
	}

}

/**
	@param `name` the name of the XLM-RPC method
	
	@param `javascriptName` is name that the javascript function will 
	have, while `name` is the name of the XML-RPC methods

	This is necessart in the case of the xmlrpc
	system.listMethods ... methods that have a dot (.) in their 
	message name.

	XmlRpc.getObject handles this transparently. Dots (.) in
	functionNames are automatically changed to underscores (_), so
	a call to `system.listMethods` would map to
	`system_listMethods` in Javascript.
*/
function addFunction (obj, name, javascriptName) {
	obj[javascriptName]=function () {
		retVal = ""
		str = "retVal = this.call(\""+name+"\""
		for (var i=0; i!=arguments.length; ++i){
			str += ", arguments["+i+"]"	
		}
		str+=")"
		eval(str)
		return retVal
	}
}
XmlRpc.getObject = function (url, functionNameArr) {
	obj = new XmlRpc(url)
	functionNameArr = functionNameArr ? functionNameArr : obj.call("system.listMethods")
	for (var i=0; i!= functionNameArr.length; ++i) {
		functionName = functionNameArr[i]
		addFunction(obj, functionName, functionName.replace(/\./,"_"))
	}
	return obj
}

/*TESTS
*/

xml_rpc_tests = [
	function(){
		obj = XmlRpc.getObject("ws/helloWorld.rb", ["helloWorld"])
		str = obj.helloWorld()	
		return str == "hello, world"
	},
	function(){
		obj = XmlRpc.getObject("ws/helloWorld.rb", ["hello.World"])
		str = obj.hello_World()
		return str == "hello, world"
	},
	function() {
		return true	
	}
	
]
