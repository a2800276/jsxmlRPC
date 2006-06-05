/** toplevel routing for xml-rpc encoding. Handles all the scalar types itself
 * and hands off all composite types to other functions below
 */
function encodeXmlRpc(arg) {

	if (isA(arg,String)){
		arg = arg.replace(/&/g, "&amp;")
		arg = arg.replace(/</g, "&lt;")
		arg = arg.replace(/>/g, "&gt;")
		return makeTag("string", arg)
	}else if (isA(arg,Boolean)){
		return makeTag("boolean", (arg?"1":"0"))
	}else if (isA(arg,Date)){
		return makeTag("dateTime.iso8601", getIso8601Str(arg))	
	}else if (isA(arg,Array)){
		return makeTag("array", makeTag("data", makeArrayValues(arg)))
	}else if (isA(arg,Number)){
		if (isInt(arg)){
			return makeTag("int",arg)	
		}	
		return makeTag("double", arg)
	}else{
		//encode as struct
		return makeTag("struct", makeStructMembers(arg))
	}
}

/**
 *  encodes JavaScript Array to xmlRpc Array
 */
function makeArrayValues (arg) {
	str = "";
	for (var i=0; i!=arg.length; ++i){
		str += makeTag("value", encodeXmlRpc(arg[i]))
	}
	return str
}

/**
	encodes properties of all otherwise unhandled type into an XmlRpc Struct
*/
function makeStructMembers (arg) {
	str = ""
	for (var p in arg){
		if (isA(arg[p],Function)) continue;
		str += makeTag("member", makeTag("name",p)+makeTag("value", encodeXmlRpc(arg[p])))	
	}
	return str
}

/**	
	encodes Date String.
*/
function getIso8601Str(date){
	str = date.getFullYear().toString()
	month = date.getMonth()+1
	if (month<10) str += "0"
	str += month
	day = date.getDate()
	if (day<10) str += "0"
	str += day
	str += "T"+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
	// one day sort getTimezoneOffset() (returns minutes)
	return str
}

/*TESTS
* Tests
*/


xml_rpc_basics_tests = [
	function () {
		return ( encodeXmlRpc ("test")=="<string>test</string>"
			  &&
			encodeXmlRpc (true)=="<boolean>1</boolean>"
			  &&
			encodeXmlRpc (100) == "<int>100</int>"
			  &&
			encodeXmlRpc (3.14) == "<double>3.14</double>"
		)
	},
	function () {
		return encodeXmlRpc ([1,2,3])=="<array><data><value><int>1</int></value><value><int>2</int></value><value><int>3</int></value></data></array>"
	},
	function () {
		test2 = new Object ()
		test2.one="hallo"
		test2.two=2
		return encodeXmlRpc (test2) == "<struct><member><name>one</name><value><string>hallo</string></value></member><member><name>two</name><value><int>2</int></value></member></struct>"
	}
	
]
