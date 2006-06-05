# _jsxmlRPC_ Introduction

_jsxmlRPC_ consists of Javascript classes that enable easy interaction with
XML-RPC based webservices. These classes allow webdevelopers to access
webservices just like he or she would access native Javascript functions.

The following pages describe the library in more detail:

* Reference of [functions][1] in the library
* Reference of XML-RPC to Javascript [mappings][2]
* Have a look at the [download][4] page.
* There's also a page with real, [live examples][examples]


<a name="intro">
##Quick Introduction
</a>

This example assumes only a rough understanding of XML-RPC. The mechanisms
provided by XML-RPC are explained in more detail [elsewhere][3].  

Starting with a "hello world" example, we'll assume the very useful "hello world"
webservice is located at <code>/webservice.cgi</code> on your server. It provides XML-RPC
a service with the methodname  <code>hello</code> and the function returns the much loved 
"hello, world" string. The Javascript code to use the webservice would look as follows:


<div class="code">

	retValue = helloWorld.hello() // returns "hello, world"

</div>


That's it! The variable <code>retValue</code> will contain the string
returned by the webservice. That's a bit easier than having to
deal with the following XML being passed around:

<div class="code">
	
	<!-- Request -->
	<?xml version="1.0"?>
	<methodCall>
		<methodName>hello</methodName>
	</methodCall>

	<!-- Response -->

	<?xml version="1.0" ?>
	<methodResponse>
		<params>
			<param><value><string>hello, world</string></value></param>
		</params>
	</methodResponse>.

	
</div>


Next we'll assume <code>/webservice.cgi</code> script also provides a
function called <code>hello2</code>, a far more advanced webservice that
takes a string (probably containing your name) as a parameter and
returns an XML-RPC `struct` containing the members
<code>helloworld</code>, the archetypical "hello, $name",
<code>length</code>, an integer value containing the length of the
string that was passed in as a parameter, and finally <code>date</code>
an XML-RPC `dateTime.iso8601` type that returns the current
date. Below is the necessary code:

<div class="code">

	retValue = helloWorld.hello() // returns "helloworld"
	retValue2 = helloWorld.hello2("your name here")
	helloWorldString = retValue2.helloworld // "hello, your name here"
	helloWorldLength = retValue2.length // 14
	helloWorldDate = retValue2.date // the current date	
</div>

###So where did this `helloWorld` object come from all of the sudden, and who taught it to speak XML-RPC? 


There are two things you need to do before transparently using XML-RPC in
Javascript.  First, you need to include the library providing the XML-RPC
functionality:

<div class="code">

	<script src="all_scripts.js" type="text/javascript"></script>

</div>


Second, you'll need to create a stub object for the webservice you need
to access. Don't worry, it's only one line of code:


<div class="code">

	helloWorld = XmlRpc.getObject("webservice.cgi")

</div>

The parameter passed to <code>XmlRpc.getObject</code> is the URL of the
webservice.  The function automatically creates a stub object with
Javascript functions for every XML-RPC method provided by the
webservice. _jsxmlRPC_ determines what methods are available at the url
using the `system.listMethods` introspection extension to the XML-RPC
standard. In case your webservice doesn't provide introspection
capabilities, you need to find out the methodnames through other means
and pass them in an array as a second parameter, like this:


<div class="code">

	helloWorld = XmlRpc.getObject("webservice.cgi", ["hello", "hello2"])

</div>


All marshaling between
Javascript and XML-RPC data types is handled transparently. See the
[reference][2] for more information about how  datatypes are mapped to one
another.



###"Don't you know what AJAX is, idiot? I want to everything to be asynchronous?"

Nothing would be easier. If you'd like your calls to the webservice methods to
be asynchronous, all you have to do is to add a callback function after the
last parameter when calling the method. When the answer is received
from the webservice, it gets converted to Javascript as before and is passed to
the callback function you provided:

<div class="code">
	
	f = function (x) {
		// do something spectacular here
		// and become richer than Google.
		alert (x.helloworld)
		alert (x.length)
		alert (x.date)
	}

	retValue2 = helloWorld.hello2("your name here", f)

	alert ("You'll see this before you see the response from the server")
	

</div>

That's right, no `if (req.readyState == 4)` or `if (req.status == 200)`
or any other of that tedium.

       






[1]: function_reference.html
[2]: mapping_reference.html
[3]: xmlrpc_resources.html
[4]: download.html
[examples]: /javascript/examples.html

