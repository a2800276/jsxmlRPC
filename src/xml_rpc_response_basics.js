function getDateFromChild (dateNode) {
	var dateString = getTextValueOfChild(dateNode)
	//20051209T11:32:39
	var re = /(\d\d\d\d)(\d\d)(\d\d)T(\d\d):(\d\d):(\d\d)/
	var result = re.exec (dateString)
	month=new Number(result[2])
	return new Date(result[1],month-1,result[3],result[4],result[5],result[6])
}

function getArray (arrayNode) {
	var dataNode = getNamedChild(arrayNode, "data")	
	var valueNodes= getNamedChildren (dataNode, "value")
	var result=[]
	eachInNodeList(
		valueNodes,
		function(x){result.push(getResultFromValueNode(x))},
		Node.ELEMENT_NODE
	)
	return result
	
}
function getStruct (structNode) {
	var memberNodes=getNamedChildren(structNode, "member")
	
	var struct = new Object()
	var name
	
	
	getMemberAndValue = function (x) {
		if (x.nodeName == "name"){
			name = getTextValueOfChild(x) 	
		}
		if (x.nodeName == "value"){
			struct[name]=getResultFromValueNode(x)
		}
	}
	
	eachMember = function (node) {
		visitChildren (
			node,
			getMemberAndValue,
			Node.ELEMENT_NODE
		)		
	}

	
	eachInNodeList (
		memberNodes,
		eachMember,
		Node.ELEMENT_NODE
		)	
	return struct

}
function getResultFromValueNode (node) {
	var valueNode = node.firstChild
	var result
	switch (valueNode.nodeName) {
		case "string":
			result = new String(getTextValueOfChild(valueNode))
			break;
		case "i4":
		case "int":
		case "double":
			result= new Number(getTextValueOfChild(valueNode))
			break;
		case "boolean":
			tmp = getTextValueOfChild(valueNode)
			result= tmp=="1"?true:false
			break
		case "dateTime.iso8601":
			result = getDateFromChild(valueNode)
			break
		case "array":
			result = getArray(valueNode)
			break
		case "struct":
			result = getStruct(valueNode)
			break;
		default:
			throw "type not handled: "+valueNode.nodeName
		
	}
	return result
}


/*TESTS
* Tests/
*/

var req
var xml

xml_rpc_response_tests = [
	function () {
		// initializes
		req = new Request("data/test_rpc.xml")
		req.requestMethod="GET"
		req.process()
		xml = req.responseXML
		return xml!=null
	},
	function () {
		arrayNode = (xml.getElementsByTagName("array"))[0]
				
		arr = getArray(arrayNode)
		return (isA(arr, Array) && arr.length==4)
		
	}
]


