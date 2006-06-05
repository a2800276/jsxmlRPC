/** Tries to provide a generic interface for instantiating an XmlHttpRequest
 *  Object regardless of the browser being used
 *  @returns a XmlHttpRequest object or false if we failed.
 */

function getXMLHttpRequest () {
	var xmlhttp = false;
	var arr = [
		function(){return new XMLHttpRequest();},
		function(){return new ActiveXObject("Microsoft.XMLHTTP");},
		function(){return new ActiveXObject("Msxml2.XMLHTTP");}
	]
	//for (var func in arr) {
	for (var i=0; i!=arr.length; ++i) {
		try {		
			xmlhttp = arr[i]()
			break
		} catch (e){}	
	}
	return xmlhttp;
}


function checkRequestStatus (request) {
	// status 0 for offline testing/developing
	if (request.status != 200 && request.status != 0) {
		exception = request.status.toString() + " : "
		exception += request.statusText ? request.statusText : "Network error"
		exception.errCode = request.status
		throw exception
	}
}

function readyStateChangeFunc (request, lambda) {
	return function () {
		if (request.readyState != Request.COMPLETED) return
		try {
			checkRequestStatus(request)
			lambda(request)	
		} catch (e) { request.onnetworkerror(e) }
	}
}

function getOnreadystatechangeCallback (req){
	return function () {
		arr = ["readyState", "responseBody", "responseStream", "responseText", "responseXML", "status", "statusText"]
		for (var i=0; i!= arr.length; ++i) {
			try {
				req[arr[i]]=req._request[arr[i]]				
			} catch (e){}	
		}
		if (req.onreadystatechange){
			req.onreadystatechange()
		}
	}
}



/** Hopefully provides an easier interface to the various different
 * XMLHttpRequest bastard children out there.
 * @param url the url to call
 * @param content the optional (xml)content to send to the url
 * @param callback the optional callback function to call, when the result is
 * returned from the server.
 *
 * @function process called without parameters to start the processing, in case
 * a callback function was provided, process returns immediately, because the
 * call is handled asynchroniously. If no callback function was provided,
 * process blocks until the reply is received.
 * In blocking mode, this function will throw an exception in case of network
 * problems.
 * 
 * @function onnetworkerror function to execute when this Request is handled in
 * asynchronious mode. The callback function doesn't really have a context to
 * throw exceptions to in case of, e.g. network problems. In case an exception
 * occurs executing the callback function asynchroniously, this function of
 * Request will be executed with the exception as a parameter. Default is to
 * alert() the user of the exception.  
 */
function Request (url, content, callback) {
	this.url = url
	this.content = content
	this.callback = callback
	this.contentType = "text/xml"

	this.requestMethod = null
	/*
	
		The intial implementation used `.prototype` style inheritance.
		Unfrotunately, IE doesn't allow that, maybe because XMLHttpRequest
		is Active-X and not native JS, I'm not sure though, and I don't
		care.

		Therefore, I used prototype inheritance only for firefox,etc. For
		IE, I used composite inheritance, meaning I only pretended to use
		inheritance, while internally, the inherited functions are just
		wrapper calls to an XMLHttpRequest instance which is a member
		object of the inherited class. This made the IE part of the impl.
		look not pretty, but that's what people expect from IE anyway.

		Unfortunately, using the protoype inheritance style caused
		further problems when making several async calls in short session, even
		using different instances of Requests, i.e. req1.process();
		req2.process() caused strange exceptions to be thrown.

		My theory is that this has to do with the fact that the
		XMLHttpRequest has to be assigned to Request.protype outside the
		class definition, therefore, all instances of Request share the
		same XMLHttpRequest instance which causes weird race conditions.

		I really hate Javascript, and I won't debug this behaviour any
		further, even though I'm sure some clever Javascript nerd can find
		a way to fix this elegantly by reassignnig the
		prototype.contructor property or something. But I'll just use
		composite-style (aka pretend) inheritance for IE and all other
		browsers, as it solves the problems. If you find a better
		solution, let me know.
		

	*/
	
		this.readyState = 0
		this.responseBody = null
		this.responseStream = null
		this.responseText = null
		this.responseXML = null
		this.status = null
		this.statusText = null

		this._request = getXMLHttpRequest()
		this._request.onreadystatechange = getOnreadystatechangeCallback(this)
		this.abort = function () {
			return this._request.abort()
		}
		this.getAllResponseHeaders = function () {
			return this._request.getAllResponseHeaders()
		}
		this.getResponseHeader = function (str) {
			return this._request.getResponseHeader(str)	
		}
		this.open = function (method, url, async, user, password) {
			if (typeof(async)=="undefined") async = true
			if (typeof(user)=="undefined") user = null
			if (typeof(password)=="undefined") password = null
			return this._request.open(method, url, async, user, password)	
		}
		this.send = function (content) {
			if  (typeof(content)=="undefined") content = "" 
			var tmp = this._request.send(content)	
				
		}
		this.setRequestHeader = function (name, value) {
			return this._request.setRequestHeader(name, value)	
		}

		this.copyAttributes = function () {
			arr = ["readyState", "responseBody", "responseStream", "responseText", "responseXML", "status", "statusText"]
			for (var i=0; i!= arr.length; ++i) {
				try {
					this[arr[i]]=this._request[arr[i]]				
				} catch (e){}	
			}

		}
	/************************************************************************/		

	this.process = function () {
		if (callback){
			this._request.onnetworkerror = this.onnetworkerror
			this._request.onreadystatechange = readyStateChangeFunc (this._request, callback)
		}
		var async = callback ? true : false
		if (!this.requestMethod) {
			if (!this.content){
				this.requestMethod="GET"	
			} else {
				this.requestMethod="POST"	
			}
		}
		this.open (this.requestMethod, url, async)
		this.setRequestHeader("Content-Length", content!=null?content.length:0)
		if (content!=null)
			this.setRequestHeader("Content-Type",this.contentType);
		this.send (content)
		if (async) return

		this.copyAttributes()
		checkRequestStatus(this)		 
	}
	this.onnetworkerror = function (e) {
		alert(e)
	}
}
/**
 * adds missing readyState Constants to Request
 */
Request.UNINITIALIZED = 0
Request.LOADING = 1
Request.LOADED = 2
Request.INTERACTIVE = 3
Request.COMPLETED = 4

/**
 * Request extends XmlHttpRequest
 */
//if (window.XMLHttpRequest){
//	Request.prototype = getXMLHttpRequest()
//}


/*TESTS
  Tests not for production
*/
request_basics_tests = [
	// MSIE doesn't support getXMLHttpRequest != false
	function () {return !(!getXMLHttpRequest())},
	function () {	 
		req = new Request("data/test.xml")
		req.requestMethod="GET"
		req.process()
		return true;
	},
	function () {	
		try {
	nb="This test will come up failed, because it tests "
	nb="asynchronious behaviour. The actual result of the "
	nb="test is only known after it\'s evaluated and will be "
        nb="displayed in a little alert box..."
			
			req = new Request("index.html", null,
				function(){alert("async test passed")})
			req.requestMethod="GET"
			req.onnetworkerror = function () {
				alert("async test failed")
			}
			req.process()
		} catch (e) {
			return false
		}
	},

	function () {	
		try {
	nb="This test will come up failed, because it tests "
	nb="asynchronious behaviour. The actual result of the "
	nb="test is only known after it\'s evaluated and will be "
        nb="displayed in a little alert box..."
			
			req = new Request("non_existant_file", null,
				function(){alert("onnetworkerror test failed")})
			req.requestMethod="GET"
			req.onnetworkerror = function () {
				alert("onnetworkerror test passed")
			}
			req.process()
		} catch (e) {
			alert ("AM I HERE?")
			return false
		}
	}

]

