# _jsxmlRPC_ :: API Reference :: `xmlrpc.js`


## Class: `XmlRpc`

This is _the central_ central object of the implementation and most
likely you'll only need to use a single function (`getObject`) of this Object.


### Class method: `XmlRpc.getOject (url, functionNameArr)`
<div class="boxed">

This class function returns a proxy object which will provide a
Javascript function for every method provided by an XML-RPC webservice.

It tries to find out about the provided methods using the XML-RPC
`system.listMethods` Introspection facilities. If the webservice doesn't
provide introspection, it's necessary to manually provide the function
names.

In case the names of the XML-RPC methods contain a dot (.), for example
in order to call methods like `system.listMethods`, the dot will be
mapped to an underscore in the name of the Javascript method.

###Parameter `url`

The URL that the webservice is located at.

###Parameter `functionNameArr`

An optional list of method names that corresponds to the XML-RPC methods
provided at `url`. If this parameter is not provided, `getObject` tries
to determine the function names by calling `system.listMethods` at the
url. The returned Object will have functions named after the elements of
this array. Possible dots (.) in XML-RPC method names are mapped to
underscores (_) in Javascript. If your webservice has two functions with
identical names save the underscore (`one.method` and `one_method`),
you're out of luck, the last method name in the array will be the one
mapped.

To clarify: the function names that are passed to the method are the
XML-RPC names (the one's with the dots in them). The functions in the
returned object will have an underscore in their name.

###Returns

This function returns an instance of `XmlRpc` that responds to all
XML-RPC methods provided by the webservice.

The stub functions corresponding to the XML-RPC methods can be called
in a _synchronized_ fashion or _asynchronously_.

In _synchronized_ calls, the function doesn't return until the
response from the server is received. This is the normal and expected
behavior for a Javascript function.

_Asynchronous_ calls are necessary when implementing AJAX style
services. In order to call functions in an asynchronous manner, all
that's necessary is to provide a callback function as the last parameter
to the function call. The stub function returns immediately, and as soon
as an answer arrives from the webservice, the callback function is
invoked with the value returned by the webservice.


###Usage

The example below constructs a proxy object that connects to the
hypothetical `helloWorld` webservice locate at
`/webservices/helloWorld.cgi`. The `helloWorld` webservice provides the
methods `helloWorld` and `goodbye`, both of which require a `name`
parameter and return a `string`:

<div class="code">

	url = "/webservices/helloWorld.cgi"
	methNames =  ["helloWorld", "goodbye"]
	str1 = "tim"

	// in case the helloWorld.cgi provides
	// introspection, it's not necessary to
	// pass in the methNames array.
	
	hw = XmlRpc.getObject(url, methNames)
	
	/* synchronized call */
	
	str2 = hw.helloWorld(str1)
	
	// str2 will contain "hello, tim", which
	// is what the webservice returns, as soon
	// as the answer arrives.

	//asynchronous call
	
	hw.helloWorld(str1, function(x){
		alert(x)	
	})

	// this function call returns immediately,
	// as soon as the answer returns from the
	// webservice, an alert box will pop up.
	
	alert ("you'll see this before you see hello, world")
	
	
</div>

If you need namespaces separated by dots as method names:

<div class="code">

	url = "/webservices/helloWorld.cgi"
	methNames =  ["namespaced.method", "another_method"]
	hw = XmlRpc.getObject(url, methNames)

	hw.namespaced_method()
	hw.another_method()
	
</div>

### Constructor
<div class="boxed">
Typically, the constructor of `XmlRpc` is invoked by `getObject`, but
it can also be invoked manually.

### Parameter: url
The URL where the webservice this object is based on is located.

### Usage

<div class="code">
	
	hw = new XmlRpc("/webservices/helloWorld.cgi")
	
</div>

</div>


###Instance Method: `call (methodName[, parameter...][, callback]] )`

<div class="boxed">

This function calls the named method on the webservice with the
optionally provided parameters. If a callback function is passed as the
last parameter, the webservice is called in an asynchronous manner, the
callback function being invoked when the request to the webservice
returns. The callback is passed a single parameter that corresponds to
to the value returned by the webservice.

Internally, all that `getObject` does is add functions to an instance of
`XmlRpc` which invoke the method `call` with their name as the first
parameter, followed by the parameters to pass to the webservice,
followed by an optional callback function.

### Parameter `methodName`

The name of the webservice method to call.

### Parameter `parameter` (optional)

A variable number of parameters to pass to the webservice.

### Parameter `callback` (optional)

If provided, the webservice will be invoked in an asynchronous fashion.

### Usage

The following code is functionally identical the code using the
generated stub methods above.

<div class="code">

	url = "/webservices/helloWorld.cgi"
	str1 = "tim"
	
	hw = new XmlRpc(url)
	
	/* synchronized call */
	
	str2 = hw.call("helloWorld",str1)
	
	//asynchronous call
	
	hw.call("helloWorld", str1, function(x){
		alert(x)	
	})
</div>


</div>
###Instance Method: `onerror (e)`
<div class = "boxed">
Hmmm... is it a method or a property? Hard to tell sometimes with
Javascript. 

The callback function to invoke when webservice methods are being called in
an asynchronous fashion. You see, "normal" well-behaved function calls return
when they're done and if anything strange happens before they're done,
they'll throw an exception.

But in asynchronous operations, when you're providing a callback
function, the Javascript function call returns long before the
webservice call is finished and there's no place where potential
exceptions can get thrown, let alone caught. 

Unless of course, you provided a nice function to handle the error and
assigned it to `onerror`. It should go without saying that you shouldn't
invoke this method yourself.

###Default

If you don't provide an `onerror` function, one of two things can
happen. First, in case you make all your calls synchronized, nothing
happens, because you catch the exception yourself. If you choose to make
asynchronous calls though, and an exception gets thrown, that exception
will be passed to the underlying `Request`'s default error handler,
which will pass the exception to `alert()`, which is annoying. 

### Usage

<div class="code">
	
	...
	hw = XmlRpc.getObject(url, methNames)
	hw.onerror = function (e) {
		//What's more annoying than alert()?
		alert(e)
		alert(e)
		// Two alerts !
	} 
	// only need to assign this once, unless you'd
	// prefer different error handlers for each call.
	
	
	...
	
	hw.helloWorld("your_name_here", function (s) {
		// do whatever
		// running out of helloWorld examples
	})
	
</div>


</div> <!-- onerror-->






