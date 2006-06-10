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
