
#_jsxmlRPC_ Live Examples

I'll provide more examples in this space as I get them ready. Here's an
example of connecting to a service that provides IP address information:


<script src="/js/all_scripts.js" type="text/javascript"></script>
<script language="JavaScript" type="text/javascript">
	var rpc = XmlRpc.getObject("/ip/ip_ws.rb", ["getIPInfo", "getIPAddress"])
	function alertIPInfo1 () {
		var info = rpc.getIPInfo()
		var ip = rpc.getIPAddress()
		var str = "Your address is: "+ip+"\n"
		str += info.status + " by '" + info.registry + "' in " + info.country
		alert (str)
	}

</script>

<input type="button" value = "look up my IP" onclick="alertIPInfo1()">

Adding the button to the page is the easy part. Take note of the
`onclick` event.

<div class = "code">

	<input type="button" value = "look up my IP" onclick="alertIPInfo1()">
	
</div>

The function connected to the button in the `onclick` event is just
plain old Javascript:

<div class="code">

	// create an "onclick" function for the button
	function alertIPInfo1 () {

		// call to the webservice
		var info = rpc.getIPInfo()
		
		// call to another method of the webservice
		var ip = rpc.getIPAddress()

		//assemble results and alert()
		var str = "Your address is: "+ip+"\n"
		str += info.status + " by '" + info.registry + "' in " + info.country
		alert (str)
	}
</div>

The `rpc` object in the function does all the magic. The button accesses
a webservice located on this server at `/ip/ip_ws.rb` which provides the
methods `getIPAddress` to determine the IP address of the caller and
`getIPInfo` retrieve information about the address. 

First, the library is included: 

<div class="code">
	
	<script src="/js/all_scripts.js" type="text/javascript"></script>

</div>

The only other contact you have with the library is a call to
`XmlRpc.getObject()` which instantiates a proxy object named `rpc` which
is used in the function hooked up to `onclick`:

<div class="code">
	
	var rpc = XmlRpc.getObject("/ip/ip_ws.rb", ["getIPInfo", "getIPAddress"])

</div>

## I know where I am! Where's 213.168.12.12?

Just checking out your own IP gets boring after a while.

<script language="JavaScript" type="text/javascript">
function alertIPInfo2 () {
	var ip = document.getElementById("ip_field").value
	var str = "Please enter a valid IP"
	try {
		var info = rpc.getIPInfo(ip) //reuse the rpc object here
		str = "Information for: "+ip+"\n"
		str += info.status + " by '" + info.registry + "' in " + info.country
	} catch (e) {
		// worry about this some other time :(	
	}
	alert (str)
}
</script>

<input type=text id="ip_field" value="213.168.12.12"> <input type=button value = "look up IP" onclick="alertIPInfo2()">


Just hook up a box and a button with an `onclick` event.

<div class="code">

	<input type=text id="ip_field"> 
	<input type=button value = "look up IP" onclick="alertIPInfo2()">

</div>

The code is similar to the code above. We reuse the `rpc` proxy
object from above and added a shoddy bit of exception handling.


<div class="code">
	
	function alertIPInfo2 () {
		var ip = document.getElementById("ip_field").value
		var str = "Please enter a valid IP"
		try {
			var info = rpc.getIPInfo(ip) //reuse the rpc object here
			str = "Information for: "+ip+"\n"
			str += info.status + " by '" + info.registry + "' in " + info.country
		} catch (e) {
			// worry about this some other time :(	
		}
		alert (str)
	}

</div>


So now you know. 213.168.12.12 is in Estonia.



The IP address webservice is described in greater detail in the
[tutorial][ip] I wrote which covers XML-RPC, Ruby, IP Addresses and lots of
other stuff.



[ip]:/ip/ip_service.html
