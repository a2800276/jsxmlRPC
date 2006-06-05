##Synopsis

`jsxmlRPC` provides a Javascript class library that enables easy interaction
with `XML-RPC` based webservices. These classes allow webdevelopers to
access webservices as though these were native Javascript functions.


###Example

This example assumes a only rough understanding of `XML-RPC`. The
mechanisms provided by `XML-RPC` are explained in more detail below. Let's
start with a "hello world" example. We'll assume that the hello world
webservice is located at the url <code>/webservice.cgi</code> and it's
`XML-RPC` methodname is <code>hello</code> and the function returns the
expected string. The Javascript code to use the webservice would look as
follows:


<div class="code">

	retValue = helloWorld.hello() // returns "helloworld"

</div>


The variable <code>retValue</code> will contain the string returned by
the webservice.

Let's assume <code>/webservice.cgi</code> script also provides a
function called <code>hello2</code>, a far more advanced webservice that
takes a string (probably containing your name) as a parameter and
returns an `XML-RPC` struct containing the members
<code>helloworld</code>, the archetypical "hello, $name",
<code>length</code>, an integer value containing the length of the
string that was passed in as a parameter, and finally <code>date</code>
an `XML-RPC` `dateTime.iso8601` type that returns the current
date. Below is the necessary code:

<div class="code">

	retValue = helloWorld.hello() // returns "helloworld"
	retValue2 = helloWorld.hello2("your name here")
	helloWorldString = retValue2.helloworld // "hello, your name here"
	helloWorldLength = retValue2.length // 14
	helloWorldDate = retValue2.date // the current date	
</div>

So where did the `helloWorld` object come from all of the sudden? There
are two prerequisites for transparently using `XML-RPC` in Javascript.
First, you need to include the library providing the `XML-RPC`
functionality:

<div class="code">

	<script src="all_scripts.js" type="text/javascript"></script>

</div>


Second, you'll need to create a stub object for the webservice you need
to access. Don't worry, it's only one line of code:


<div class="code">

	helloWorld = XmlRpc.getObject("webservice.cgi")

</div>
	
The parameter passed to `XmlRpc.getObject` is the URL of the webservice. The
function automatically creates a stub object with Javascript functions for
every `XML-RPC` method provided by the webservice. `jsxmlRPC` determines what
methods are available at the url using the `system.listMethods` introspection
extension to the `XML-RPC` standard. In case your webservice doesn't provide
introspection capabilities, you need to find out the methodnames through other
means and pass them in an array as a second parameter, like this:

<div class="code">
	
	helloWorld = XmlRpc.getObject("webservice.cgi", ["hello", "hello2"])

</div>



All marshalling between Javascript and `XML-RPC`
datatypes is handled transparently. See the [reference][http://www.kuriositaet.de/javascript/mapping_reference.html] for more information about how datatypes are mapped to one another. 

##JavaScript Prerequisites

This section is meant to explain some Javascript techniques used in the
implementation of the library that may not be common knowledge among
programmers whose primary exposure to Javascript has been webdesign. In
case you've used the functional programming and object oriented features of
Javascript you may want to skip this section. If not, you might want to
gloss over this section to better understand how the libary is
implemented.


###Functional Programming

Javascript has features that enable <em>functional</em> programming
techniques. This basically means that in Javascript it's possible to
assign functions to variables or pass them as parameters to other
functions. This happends in the same way as assigning string values to
variables or passing integer values as parameters to functions. The
following example defines a function that takes two parameters, the
first parameter is an integer, the second a function. The integer
parameter determines how often the second function is called.

<pre>
	function call (times, func) {
		for (var i=o; i!=times; ++i) {
			func()	
		}	
	}

	call (3, function(){
		alert ("hello")	
	})
</pre>

####Further Reading
- [Higher Order Programming in
  JavaScript](http://w3future.com/html/stories/hop.xml)
- [Pure Functional Programming in
  Javascript](http://blog.codingforums.com/index.php/main/blogentry/pure_functional_programming_in_javascript/)


###Object-Oriented Programming

In this section I'll describe how object orientation is implemented in
Javascript. I assume you know what object orientation is, i.e. object
oriented datatypes contain both data and functionality and support
inheritance. In case you don't understand what that means, I recommend
you brush up on objected oriented terminology. Depending on your
definition of object orientation, the term should probably denote more
than just encapsulsation and inheritance, but these are the features
we'll cover for now.

Object-Orientation in JavaScript uses terminology that is slightly
different than what most people are used to, so please excuse my use of
terms such as _class_ (no such concept in JavaScript) or
interchanging terms like _attribute_, _method_ and property
(JavaScript objects only have properties, which may contain data
primitives or functions). My aim is to provide a rough overview and not
to be technically correct. Check [the spec][ecma] for that.


####Object Syntax

Objects in Javascript can be defined in several ways. The most common
way to define objects is as a function, as in the following example:

<pre>
	var MyNameObject = function (first, last) {
		this.first = first
		this.last = last
		this.sayHello = function () {
			alert ("Hello "+first+" "+last)	
		}
	}

	name = new MyNameObject ("John", "Doe")
	name.sayHello()
	alert (name.first)
</pre>

The first part of the example defines the class of object by declaring a
new constructor function. The name of the variable that the function is
assigned to is also the name of the new class. When this function is
called using the <code>new</code> keyword, it acts as a constructor and
returns an instance of the class.

Data and Method members of the class are defined within the constructor
function using <code>this</code> as above, the members are public and
thus globally accessible.  It's also possible to declare private
members, as in the following example, rewritten from the example above
to provide some performance benefits... :

<pre>
	var MyNameObject = function (first, last) {
		this.first = first
		this.last = last
		
		var cache // private
		
		var getValue = function () { //private
			if (!cache)
				cache = first+" "+last
			return cache
		}
		
		this.sayHello = function () {
			alert (getValue())	
		}
	}
	
	name = new MyNameObject ("John", "Doe")
	name.sayHello()
	// don't work
	alert (name.getValue())
</pre>

So, basically members declared within the constructor using the
<code>this.membername = value</code> are public whether value is a data
member or a function. Members declared using <code>var member =
value</code> are private. As a special bonus, Javascript also provides
various shorthand notations, allowing, for example, the following:

<pre>
	var MyNameObject = function (first, last) {
		...
		function getValue(){
		 ...	
		}
		...
	}
</pre>

In the example above, the <code>getValue</code> function is private.

####Hash-style definition

There exists an alternative object definition hack that depends on the
fact that Javascript objects behave like hashes. Hashes can be
defined using the following shorthand:

<pre>
	myHash = {key1 : "value1", key2 : "value2"}
</pre>

This style of class definition would define the
<code>MyNameObject</code> class as follows:

<pre>
	var MyNameObject = {
		initialize : function (first, last) {
			this.first = first
			this.last = last
		},
		sayHello : function () {
			alert ("Hello "+first+" "+last)	
		}
	}
</pre>

This method was popularized by the excellent 
[Prototype][prototype] library. It's got a
number of advantages and disadvantages I won't go into here, except to
mention that when using this hash-style definition scheme you can't use
straightward inheritance and <code>new</code> instantiation, but have to
use the facilities provided in the library. 

Even if you won't use Protoype, it's important to remember though, that
all objects behave like associative arrays or hashes and that their
members can be accessed just like properties of a hash. This fact can be
used to eliminate quite a few unecessary and expensive <code>eval</code>
statements that are typically used.

<pre>
	...
	functionToCall = "sayHello"
	obj = new MyNameObject ("John", "Doe")
	obj[functionToCall]()
</pre>



####Inheritance

Javascripts inheritance model might not be what you're used to. It works
by providing every object with a <code>prototype</code> property. If you
access a member of an object that doens't exist, the runtime checks the
<code>prototype</code> of the object to see whether the nonexistant
member exists in the protoype. If not it checks the prototype's
prototype and so on.

Sounds complicated, but it's really quiet straighforward:

<pre>
	Parent = function () {
		this.parent () {
			alert("parent")
		}	
	}

	Child = function () {
		this.child () {
			alert("child")
		}	
	}

	Child.prototype = new Parent ()
	child = new Child()
	child.parent()
</pre>

By assigning an instance of <code>Parent</code> to the
<code>Child</code>'s prototype property, <code>Child</code>
automatically inherits all of <code>Parent</code>'s members.


###Runtime modification of types

The <code>prototype</code> property can also be used to add new
functions to existing classes.

<pre>
	child.newFunction() // doesn't work
	Child.prototype.newFunction = function () {
		alert ("newFunction")	
	}
	child.newFunction() // works
</pre>

The trick of extending classes after their creation isn't restricted to
classes that you've defined. It's also possible with built-in classes:

<pre>
	Array.prototype.each = function ( func ) {
		for (var i=0; i!=this.length; ++i) {
			func(this[i])
		}	
	}

	arr = ["one", "two", "three"]
	arr.each (function (x) { alert (x) })
</pre>

I hope this section provides you with a rough review of the necessary
Javascript techniques. For more details, you may want to consult the
following resources:

- [Prototype Ajax Library][prototype]
[prototype]:[http://prototype.conio.net/]
- [Official ECMA JavaScript Spec][ecma]
[ecma]: http://www.ecma-international.org/publications/standards/Ecma-262.htm
- [Mozilla JavaScript Reference](http://www.mozilla.org/js/language/)
- [Object Orientation
  Chapter](http://www.webreference.com/programming/javascript/professional/chap3/)
  from _Professional JavaScript_
- [Object-Oriented Programming with JavaScript](http://www.webreference.com/js/column79/)



###<code>XMLHttpRequest</code> et al.

Utilization of webservices is made possible by the <code>XMLHttpRequest</code> object
created by Microsoft as an Active-X object for Internet Explorer 5 and
soon cloned in other browsers (Netscape 7, Mozilla 1, Safari 1.2, Opera
7.6, Firefox, Konqueror). Please don't take the previous as an
authoritative list. Most modern browsers in common usage provide
<code>XMLHttpRequest</code> facilities, but as you'd expect they all do in slightly
different ways requiring lots of compatibility code and testing.


###Basic usage

Typically, that is using the standard mechanisms provided by modern
browsers, a <code>XMLHttpRequest</code> request is implemented like this:

- first, because nearly every browser has a different method of
  _instantiating_ an <code>XMLHttpRequest</code> object (not true, actually: Microsoft
  actually has two different ways of creating <code>XMLHttpRequest</code>s), you'll
  need a big convoluted chunk of code that handle browser
  incompatibilities.  Usually something like this:

<pre>
	xmlReq = null;
	try {
		xmlReq = new XMLHttpRequest();	
	} catch (e){}
	if (!xmlReq) {
		try {
		  //... and so on	
		} catch (e){
			
		}	
	}
</pre>

- This leaves you with a newly instantiated <code>XMLHttpRequest</code> in <code>
xmlReq</code>. The <code>XMLHttpRequest</code> object now needs to know where and how
it's supposed to send stuff. This _initialization_ is done with the
<code>open</code> method:

<pre>
	xmlReq.open ("GET", "someUrl", trueOrFalse)
</pre>

- The first parameter specifies the http _method_ to use in
  the request. The second parameter names the url to call and the final
  paramter specifies whether the call should be _asynchronious_ or not.
  More about that later. The <code>open</code> function can optionally
  take further parameters that handle user authentication. See the
  references below for details. 

- Finally, you'll need to call the <code>send</code> method:

<pre>
	xmlReq.send ("hello")
</pre>

- <code>send</code> takes one parameter, namely the content to send to
  the url.

- If the request was not specified to be _asynchronious_,
  <code>send</code> doesn't return until the request is completed. Once
  <code>send</code> returns, you can do some error checking and then
  access the returned values:

<pre>
	if (xmlReq.status == 200) {
		// everything was ok
		alert (xmlReq.responseText)
	}
</pre>

- the <code>XMLHttpRequest</code> object will contain the returned text in it's
  <code>responseText</code> property. If the request returned XML, a
  preparsed Javascript DOM object representing that XML is returned in
  the <code>responseXML</code> property. It's also possible to access
  headers in the http response using the
  <code>getResponseHeader()</code> function.

- In case you specified the request to be _asynchronious_ (because if
  you don't, it's not proper AJAX damnit, and the web 2.0 police will
  send you to jail), you'll need to provide a _callback_ function to the
  <code>XMLHttpRequest</code> object that will get called whenever something
  interesting happens. Unfortunately, most "interesting" events don't
  really interest us, so the callback function needs some
  boilerplate code to check that we're not invoked to inform us
  that the request was sent:

<pre>
	xmlReq.onreadystatechange = function (){
		if (xmlReq.readyState == 4 && xmlReq.status == 200) {
			// do whatever is necessary.	
		}	
	}
	
</pre>

- This method will get called at the following for state changes:
	
	- <code>0 = uninitialized</code>
	- <code>1 = loading</code>
	- <code>2 = loaded</code>
	- <code>3 = interactive</code>
	- <code>4 = complete </code>
	

To be honest, I only see one state that would interest me, but, better
safe than sorry.

Please remember this is only a rudimentary overview of the features
provided by <code>XMLHttpRequest</code>. Please consult the references
below for a full specification of the <code>XMLHttpRequest</code> and
more and better usage examples.


####Further Reading

- [XULPlant
  Documentation](http://www.xulplanet.com/references/objref/XMLHttpRequest.html)
- [Official
  Spec](http://msdn.microsoft.com/library/default.asp?url=/library/en-us/xmlsdk/html/63409298-0516-437d-b5af-68368157eae3.asp)
  straight from the horse's mouth.
- [Documentation from Mozilla's developer
  site](http://developer.mozilla.org/en/docs/Migrate_apps_from_Internet_Explorer_to_Mozilla#XML_HTTP_request)
- [Doc's from Apple's developer site](http://developer.apple.com/internet/webcontent/xmlhttpreq.html)
- [Good Introduction to XMLHttpRequest
  usage](http://jibbering.com/2002/4/httprequest.html)



### An Easier Alternative

I've provided a <code>Request</code> (TODO LINK) object that extends
<code>XMLHttpRequest</code> and makes it easier to use. The
<code>Request</code> object is instantiated with a url, optional content
to send to the url and an optional callback function. Instead of having
to call <code>open</code> and <code>send</code> it's only necessary to
call <code>Request</code>'s <code>process</code> function. This function
will call <code>open</code> with the proper asynchronious flags
according to whether a callback function is provided. Then it calls
<code>send</code> with the proper content if content to send was
provided to the constructor. It's also not necessary to specify the
request method in case it's <code>POST</code>, if you require another
method, it can be set using the <code>requestMethod</code> paramter. The
extended object also handles error handling and checking the proper
request state. And since it extends the <code>XMLHttpRequest</code>, all
it's methods and attributes that you've come to love are still
available.

The callback function is called only when the <code>XMLHttpRequest</code>'s
<code>readyState</code> changes to COMPLETED (4) and the call was successful, so no
code is necessary to check for the proper state.

<pre>
	xmlReq = new Request(someUrl)
	xmlReq.process()
	alert(xmlReq.responseText)
</pre>

Another example, this time demonstrating an asynchronious request:

<pre>
	xmlReq = new Request(someUrl, '', function (req){
		alert (req.responseText)
	})
	xmlReq.process()
</pre>


####Further Reading
- [Another alternative XMLHttpRequest
  object](http://adamv.com/dev/javascript/http_request)
 

XMLRPC
 Intro
 Toolkits

http://www.xmlrpc.com/
http://www.faqs.org/docs/Linux-HOWTO/XML-RPC-HOWTO.html
http://www.xml-rpc.net/
 


