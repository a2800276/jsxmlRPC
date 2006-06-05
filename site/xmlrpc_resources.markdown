# _jsxmlRPC_ :: XML-RPC Resources

Sorry, I know this sucks, but it should be enough to get started.
XML-RPC is really easy.

* [www.xmlrpc.com][1], home of XML-RPC

* direct link to the [Specification][2]

* XML-RPC [howto][3] with lots of samples and links to other
 implementations.

* XML-RPC [tutorials][4]

## XML-RPC Extensions

There are a number of xml-rpc standard extensions that are widely
used.

* [Introspection][5] is supported through calling a `system.listMethods` 
  method that is supported by many server implementations. This is the
  mechanism _jsxmlRPC_ uses to determine which methods are available at a
  URL.


* [Multicall][6] is a way of packaging several xml-rpc method calls together to
  a single network request in order to reduce network latency and enhance
  performance.  Multicall is implemented by providing a method
  `system.multicall` on the server that takes an array of
  `methodName=>parameter` structs, meaning that the XML-RPC mechanisms aren't
  extended at all, the webservice only needs to generate a method that takes an
  array of calls and map those to the existant methods. Pretty neat, but I'm
  not sure yet how I'll map it to Javascript.
  
[1]:http://www.xmlrpc.com
[2]:http://www.xmlrpc.com/spec
[3]:http://www.faqs.org/docs/Linux-HOWTO/XML-RPC-HOWTO.html
[4]:http://www.google.com/search?q=xmlrpc+tutorial
[5]:http://scripts.incutio.com/xmlrpc/introspection.html
[6]:http://www.xmlrpc.com/discuss/msgReader$1208



