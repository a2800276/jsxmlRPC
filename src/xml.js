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
