
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
		node = xml.getElementsByTagName("fault")
		if (node.length!=0){this.handleFault(node[0])}
	
		nodeList = xml.getElementsByTagName("param")
		valueArr = []
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
		result = []

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
		params=""
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
		req = new Request(this.url, request, getHandler(this, callback))
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
