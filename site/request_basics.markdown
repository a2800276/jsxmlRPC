# _jsxmlRPC_ :: API Reference :: `xmlrpc.js`


## Class: `Request`

The `Request` class is derived from the native XMLHttpRequest class of
whatever platform the API is running on. As such, it supports all
functionality of the native XMLHttpRequest object. Additionally, it
offers the following mechanisms to simplify dealing with XMLHttpRequest:

* `Request` has a simple constructor that works on all supported
  platforms.

* unlike XMLHttpRequest's `open`, the preferred `process` method doesn't take any
  parameters, instead making guesses at what you'd like to do.	

* If a callback function is provided to the constructor, the request will
  automatically be handled in asynchronous fashion.

* No need to check for proper `readyState` in the callback function.
  The callback only gets invoked when `readyState` equals completed.
  HTTP error conditions are also checked.

* If the HTTP request method isn't explicitly specified, it defaults to
  `GET` or `POST` depending on whether any content is specified to be
  sent to the URL.

* `Content-Length` HTTP headers are automatically calculated and set.

* `Content-Type` HTTP headers default to `text/xml` in case content is
  being sent.


### Constructor
<div class="boxed">

The `Request` object can be instantiated with three parameters, two of
which are optional:

###Parameter `url` 

The URL this request connects to.

###Parameter `content` (optional) 

Optional data the the XMLHttpRequest will send to the
URL. If you wish to pass a callback function, but do not want to send
any content, set this parameter to `null`.

###Parameter `callback` (optional) 

If provided, this request is executed in an _asynchronous_ fashion, the
callback gets invoked when the response from the server returns. In
contrast to what you may be used to, it's not necessary to check the
`readyState` parameter of `Request` in the callback function.

###Usage

<div class="code">
	
	//prepare a synchronized call to "webservice.cgi"
	req = new Request ("webservice.cgi")

	// prepare an asynchronous call to "ajax.cgi" 
	// sending some xml and alerting
	// the returned string to the user.
	
	xml = '<?xml version="1.0"?><xml></xml>'
	f = function (x) {alert (x.resultText)}
	req = new Request ("ajax.cgi", xml, f)

</div>

</div>  <!-- Constructor -->

###Instance Method: `process()`
<div class="boxed">

Called to start the processing of the request. In case a callback
function was provided to the constructor, `process` returns immediately,
because the call is handled asynchronously. If no callback function was
provided, `process` blocks until the reply is received.  In blocking mode,
this function will throw an exception in case of network problems.

###Return value

`process` doesn't return any value. In case the `Request` is being
handled in synchronous mode, `process` returns when the response is
received, else it returns immediately.

###Throws

`process` throws an exception in case a network error occurs and the
`Request` is being handled in synchronous mode. See `onnetworkerror`
below for how to handle network errors in asynchronous calls.
</div>

###Instance Method: `onnetworkerror`

<div class="boxed">

This is the default error handler method `Request` will invoke on
network error in asynchronous fashion. Because `process` returns
immediately, the application has no context to catch any exceptions and
consequentially they would be lost. As such, this function shouldn't be
called explicitly, but treated as a property of `Request` that should be
assigned a new value in case you require specific error handling. The
default action upon encountering exceptions is to use `alert` to display
the user the exception in a popup.

###Usage

<div class="code">

	f = function (r) {
		xml = r.responseXML
		// perform fancy stuff with result.
	}
	req = new Request("stuff_to_retrieve.xml", null, f)
	
	req.onnetworkerror=function (e) {
		FancyLogger.log(e)
	}

	req.process()
</div>

The code above first defines a function to perform fancy stuff with the
XML that `Request` will retrieve from the server. A new `Request` object is instantiated
with parameters indicating the URL (`stuff_to_retrieve.xml`) on the
server, the second parameter specifies the content to send to the
server. Since we only want to receive an XML file, this parameter isn't
necessary and can be set to `null`. The final parameter passed to the
constructor of `Request` is the function defined previously, indicating
that the request will be asynchronous. 


Finally, a function is defined that handles the fancy logging instead of
just banging an exception into an `alert` box.


</div><!-- onnetworkerror-->

##Example 
<div class="boxed">
The following example explains how one would go about sending a HTML
page to a CGI script located at `validate.cgi`, a hypothetical script that
provides HTML validation services. The script returns either `yes` or
`no` depending on whether valid HTML was returned.

First, we'll need to gather together the required data for the request. 

<div class="code">
	
	url = "/cgi-bin/validate.cgi"
	html = '<html><head></head>'+
		'<body><h1>Hello, World!</h1>'+
		'</body></html>'

</div>

Next, we need to instantiate a `Request` object with the necessary
parameters.

<div class="code">
	
	req = new Request (url,html)	
	req.contentType = "test/html"

</div>

Since we expect to usually send XML data, the `Content-Type` header set
by `Request` defaults to `text/xml`. We're overriding that default in
the example above.

Finally, we call `process`, wait for it to return, and then display the
result to the user.

<div class="code">
	
	req.process()			
	txt = req.responseText
	alert("The response was: "+txt)
	
</div>

Since `Request` is, for all intents and purposes, _derived_ from
XMLHttpRequest, you can use all the functions and properties you know
and love, like `responseText` in the example above. 

The astute reader
may note that the above is not really suitable for production. At the
very minimum, we should handle the possibility of `process()`
encountering a network error and throwing an exception: 


<div class="code">
	
	try {
		req.process()	
		var txt = req.responseText
		var msg = "The HTML was "
		msg += txt == "yes" ? "" + "not "
		msg += valid
		alert (msg)
	} catch (e) {
		alert ("We're sorry, we encounterd:"+e)	
	}

</div>






</div> <!-- Example -->
##Limitations

<div class="boxed">

As stated, `Request` is derived from XMLHttpRequest, so all of
XMLHttpRequest's methods and properties are available. Unfortunately,
you currently aren't able to use the `setRequestHeader` function,
because it needs to be called after calling `open` and before calling
`send`. But, for ease of use, `Request` calls `open` and `send` for you
in the `process` function, and it's currently not possible to slip
additional headers in.

Of course, that doesn't prevent you from accessing the header in the
reply, e.g. to make sure the server is still sending out your favorite
[HTTP
headers](http://www.nextthing.org/archives/2005/08/07/fun-with-http-headers).
</div> <!-- Limitations-->



## Function `getXMLHttpRequest`

Returns an instance of XMLHttpRequest object for the current platform.
The returned object is a plain vanilla XMLHttpRequest and not the
derived class provided by the library which supports additional
functionality. As such, this method is for internal use only, and it's
also just a normal global function and not an instance method of
`Request`

### Parameters

`getXMLHttpRequest` takes no parameters

### Return value


See the documentation for [Request](#Request) above for documentation
about how to instantiate the derived `Request` object which provides the
same functionality as XMLHttpRequest, but is easier to work with.

Returns `false` in case the XMLHttpRequest object couldn't be
instantiated.

