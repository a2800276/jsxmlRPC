req.open("GET", url,false)
req.send("")
//print (req.responseText)
printError (req.responseText)
xmlDom = req.responseXML

function printNode (node, indent) {
	str = ""
	str += indent
	str += node.tagName
	for (var i = 0; i!= node.attributes.length; ++i) {
		str += " "
		str += node.attributes[i].name
		str += " "
		str += node.attributes[i].value
	}
	
	print (str)
}

function dumpChildNodes (node, indent) {
	printNode(node, indent)
		
	node = node.childNodes
	
	//dumpProperties(node[0])
	for (var i=0; i!=node.length; ++i) {
		
		
		if (node[i].nodeType == node[i].ELEMENT_NODE) {
			curr = node[i]
			printNode(curr, indent+" ")
			dumpChildNodes(node[i], indent+" ")
		}
		
	}
}


types = xmlDom.getElementsByTagName("portType")

for (var i =0 ; i!=types.length; ++i) {
	dumpChildNodes(types[i], "")
}



/*


for (i=0; i!=req.responseXML.documentElement.childNodes.length; ++i) {
	node = req.responseXML.documentElement.childNodes[i]
	print (node)
}
 
*/
