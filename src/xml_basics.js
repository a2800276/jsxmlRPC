if (!window.Node) {
// This is necessary because MSIE knows no Nodes.
   window.Node = {      
    	ELEMENT_NODE: 1,
	ATTRIBUTE_NODE: 2,
	TEXT_NODE: 3,
	CDATA_SECTION_NODE: 4,
	ENTITY_REFERENCE_NODE: 5,
	ENTITY_NODE: 6,
	PROCESSING_INSTRUCTION_NODE: 7,
	COMMENT_NODE: 8,
	DOCUMENT_NODE: 9,
	DOCUMENT_TYPE_NODE: 10,
	DOCUMENT_FRAGMENT_NODE: 11,
	NOTATION_NODE: 12
    }
} 
/**
	creates an xml tag with the provided name and value.
*/
function makeTag (tagName, strValue) {
	return "<"+tagName+">"+strValue+"</"+tagName+">"
}

/** Calls the provided function once for each of nodes child elements in case
 * the parameter optionalNodeTypeRestriction is set, the function gets called
 * only for children of the specified type.
 */


function visitChildren (node, lamdba, optionalNodeTypeRestriction) {
	nodeList = node.childNodes
	eachInNodeList(nodeList, lamdba, optionalNodeTypeRestriction)
}

/** Calls the function lamdba once for each node in nodeList, passing it the
 * value of the node as its parameter. nodeList doesn't necessarily have to be
 * of the DOM type nodeList, but needs to respond to .length and []. If the
 * optionalNodeTypeRestriction is set, lambda will be called only on node of
 * that type.*/
function eachInNodeList (nodeList, lambda, optionalNodeTypeRestriction) {
	for (var i=0; i!=nodeList.length; ++i) {
		if (	optionalNodeTypeRestriction && 
			nodeList[i].nodeType!=optionalNodeTypeRestriction) 
		{
			continue
		}
		lambda (nodeList[i])
	}

}

/** This function provides easy access to the test value of a node. I.e. if the
 * node represents the following xml:
 *        <name>value<name>
 * getTextValueOfChild(node) would return "value"
 *
*/
function getTextValueOfChild (node) {
	var str
	visitChildren (	
			node,
			function (x){str=x.nodeValue},
			Node.TEXT_NODE
			)
	if (!str){
		str = ""	
	}
	str = str.replace(/^\s+/,"")			
	return str.replace(/\s+$/, "")
}

/** Retrieves an element-childnode of node that has the provided name. This
 * function assumes that only one child will be named thus. In case more than
 * one children of node have the same name, we'll return a random child,
 * probably the last one.
 * E.g. given a node representing:
 * <parent><child>bla</child><child_b>blub</child_b></parent>
 * node.getNamedChild() 
*/
function getNamedChild (node, name) {
	var ret
	visitChildren (
		node,
		function(x){if(x.nodeName == name) ret = x},
		Node.ELEMENT_NODE
	)
	return ret
}


/** Retrieves a list of children from the node that are named like the parameter
 * name. This list is compatible with the eachInNodeList function above
 */

function getNamedChildren (node, name){
	var ret=[]
	visitChildren (
		node,
		function(x){if(x.nodeName == name) ret.push(x)},
		Node.ELEMENT_NODE
	)
	return ret
}


/*TESTS
 * Tests, not for production
 */

// requires request_basics.js
var req
var xml
var myParent

xml_basics_tests = [
	function () {
		// initializes
		req = new Request("data/test.xml")
		req.requestMethod="GET" // static file
		req.process()
		xml = req.responseXML
		return xml!=null
	},
	function () { return makeTag("name","value")=="<name>value</name>"},
	function () {
		myParent = getNamedChild(xml, "parent")
		count = 0
		visitChildren(myParent, function (){++count}, Node.ELEMENT_NODE)
		return count==3
	},
	function () {
		
		child = getNamedChild(myParent, "child")
		child_a = getNamedChild(child, "child_a")
		return child_a.nodeName == "child_a"
	},
	function () {
		children = getNamedChildren(myParent, "child_two")
		return children.length==2
	},
	function () {
		child = getNamedChild(myParent, "child")
		child_a = getNamedChild(child, "child_a")
		return "Child A Text"==getTextValueOfChild(child_a)
		//print (getTextValueOfChild(child_a))
		//return true;
	}

]
